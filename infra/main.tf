module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}

module "rds" {
  source                = "./modules/rds"
  project_name          = var.project_name
  environment           = var.environment
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  private_subnet_ids    = module.vpc.private_subnet_ids
  rds_security_group_id = module.vpc.rds_security_group_id
}

data "aws_caller_identity" "current" {}

module "s3" {
  source         = "./modules/s3"
  project_name   = var.project_name
  environment    = var.environment
  aws_account_id = data.aws_caller_identity.current.account_id
}

module "secrets" {
  source         = "./modules/secrets"
  project_name   = var.project_name
  environment    = var.environment
  db_host        = module.rds.db_endpoint
  db_port        = "5432"
  db_name        = var.db_name
  db_username    = var.db_username
  db_password    = var.db_password
  jwt_secret     = var.jwt_secret
  admin_password = var.admin_password
  openai_api_key = var.openai_api_key
  tavily_api_key = var.tavily_api_key
  s3_bucket_name = module.s3.bucket_name
}

module "alb" {
  source                = "./modules/alb"
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  alb_security_group_id = module.vpc.alb_security_group_id
}

module "ecs" {
  source                    = "./modules/ecs"
  project_name              = var.project_name
  environment               = var.environment
  aws_region                = var.aws_region
  vpc_id                    = module.vpc.vpc_id
  public_subnet_ids         = module.vpc.public_subnet_ids
  ecs_security_group_id     = module.vpc.ecs_security_group_id
  frontend_repo_url         = module.ecr.frontend_repo_url
  backend_repo_url          = module.ecr.backend_repo_url
  frontend_target_group_arn = module.alb.frontend_target_group_arn
  backend_target_group_arn  = module.alb.backend_target_group_arn
  ssm_parameter_arns        = module.secrets.parameter_arns
  kms_key_arn               = module.secrets.kms_key_arn
  ssm_prefix                = module.secrets.ssm_prefix
  s3_bucket_arn             = module.s3.bucket_arn
  github_repo               = var.github_repo
}
