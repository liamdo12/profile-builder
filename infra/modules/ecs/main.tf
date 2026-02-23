data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
  name       = "${var.project_name}-${var.environment}"
}

# ── CloudWatch Log Groups ───────────────────────────────
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${local.name}-frontend"
  retention_in_days = 7
  tags = { Name = "${local.name}-frontend-logs" }
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${local.name}-backend"
  retention_in_days = 7
  tags = { Name = "${local.name}-backend-logs" }
}

# ── ECS Cluster ─────────────────────────────────────────
resource "aws_ecs_cluster" "main" {
  name = local.name

  setting {
    name  = "containerInsights"
    value = "disabled"
  }

  tags = { Name = local.name }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE_SPOT", "FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
    base              = 0
  }
}

# ── IAM: Task Execution Role ────────────────────────────
resource "aws_iam_role" "ecs_task_execution" {
  name = "${local.name}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })

  tags = { Name = "${local.name}-ecs-task-execution" }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_ssm" {
  name = "${local.name}-ecs-ssm-access"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ssm:GetParameters", "ssm:GetParameter"]
        Resource = var.ssm_parameter_arns
      },
      {
        Effect   = "Allow"
        Action   = ["kms:Decrypt"]
        Resource = [var.kms_key_arn]
      }
    ]
  })
}

# ── IAM: Task Role ──────────────────────────────────────
resource "aws_iam_role" "ecs_task" {
  name = "${local.name}-ecs-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })

  tags = { Name = "${local.name}-ecs-task" }
}

resource "aws_iam_role_policy" "ecs_exec" {
  name = "${local.name}-ecs-exec"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel"
      ]
      Resource = "*"
    }]
  })
}

resource "aws_iam_role_policy" "ecs_s3_access" {
  name = "${local.name}-ecs-s3-access"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ]
      Resource = [
        var.s3_bucket_arn,
        "${var.s3_bucket_arn}/*"
      ]
    }]
  })
}

# ── Task Definition: Frontend ───────────────────────────
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${local.name}-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "frontend"
    image     = "${var.frontend_repo_url}:latest"
    essential = true

    portMappings = [{
      containerPort = 80
      protocol      = "tcp"
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "frontend"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "wget -qO- http://localhost/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 10
    }
  }])

  tags = { Name = "${local.name}-frontend-task" }
}

# ── Task Definition: Backend ────────────────────────────
resource "aws_ecs_task_definition" "backend" {
  family                   = "${local.name}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "backend"
    image     = "${var.backend_repo_url}:latest"
    essential = true

    portMappings = [{
      containerPort = 8080
      protocol      = "tcp"
    }]

    secrets = [
      { name = "DB_HOST",              valueFrom = "${var.ssm_prefix}/DB_HOST" },
      { name = "DB_PORT",              valueFrom = "${var.ssm_prefix}/DB_PORT" },
      { name = "DB_NAME",              valueFrom = "${var.ssm_prefix}/DB_NAME" },
      { name = "DB_USERNAME",          valueFrom = "${var.ssm_prefix}/DB_USERNAME" },
      { name = "DB_PASSWORD",          valueFrom = "${var.ssm_prefix}/DB_PASSWORD" },
      { name = "JPA_DDL_AUTO",         valueFrom = "${var.ssm_prefix}/JPA_DDL_AUTO" },
      { name = "SERVER_PORT",          valueFrom = "${var.ssm_prefix}/SERVER_PORT" },
      { name = "JWT_SECRET",           valueFrom = "${var.ssm_prefix}/JWT_SECRET" },
      { name = "ADMIN_PASSWORD",       valueFrom = "${var.ssm_prefix}/ADMIN_PASSWORD" },
      { name = "OPENAI_API_KEY",       valueFrom = "${var.ssm_prefix}/OPENAI_API_KEY" },
      { name = "OPENAI_MODEL",         valueFrom = "${var.ssm_prefix}/OPENAI_MODEL" },
      { name = "OPENAI_MINI_MODEL",    valueFrom = "${var.ssm_prefix}/OPENAI_MINI_MODEL" },
      { name = "TAVILY_API_KEY",       valueFrom = "${var.ssm_prefix}/TAVILY_API_KEY" },
      { name = "CORS_ALLOWED_ORIGINS", valueFrom = "${var.ssm_prefix}/CORS_ALLOWED_ORIGINS" },
      { name = "UPLOAD_DIR",           valueFrom = "${var.ssm_prefix}/UPLOAD_DIR" },
      { name = "S3_BUCKET_NAME",       valueFrom = "${var.ssm_prefix}/S3_BUCKET_NAME" },
    ]

    environment = [
      { name = "AWS_REGION", value = var.aws_region }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.backend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "backend"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "wget -qO- http://localhost:8080/actuator/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 90
    }
  }])

  tags = { Name = "${local.name}-backend-task" }
}

# ── ECS Service: Frontend ───────────────────────────────
resource "aws_ecs_service" "frontend" {
  name            = "${local.name}-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
  }

  network_configuration {
    subnets          = var.public_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend"
    container_port   = 80
  }

  health_check_grace_period_seconds = 30

  enable_execute_command = true

  lifecycle {
    ignore_changes = [task_definition]
  }

  tags = { Name = "${local.name}-frontend-service" }
}

# ── ECS Service: Backend ────────────────────────────────
resource "aws_ecs_service" "backend" {
  name            = "${local.name}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
  }

  network_configuration {
    subnets          = var.public_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "backend"
    container_port   = 8080
  }

  health_check_grace_period_seconds = 120

  enable_execute_command = true

  lifecycle {
    ignore_changes = [task_definition]
  }

  tags = { Name = "${local.name}-backend-service" }
}

# ── GitHub OIDC Provider ────────────────────────────────
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = { Name = "${local.name}-github-oidc" }
}

# ── IAM Role for GitHub Actions ─────────────────────────
resource "aws_iam_role" "github_actions" {
  name = "${local.name}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:ref:refs/heads/main"
        }
      }
    }]
  })

  tags = { Name = "${local.name}-github-actions" }
}

resource "aws_iam_role_policy" "github_actions" {
  name = "${local.name}-github-actions-policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecs:DescribeServices",
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition",
          "ecs:UpdateService"
        ]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["iam:PassRole"]
        Resource = [
          aws_iam_role.ecs_task_execution.arn,
          aws_iam_role.ecs_task.arn
        ]
      }
    ]
  })
}
