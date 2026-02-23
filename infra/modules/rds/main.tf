resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet"
  subnet_ids = var.private_subnet_ids

  tags = { Name = "${var.project_name}-${var.environment}-db-subnet-group" }
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-${var.environment}-postgres"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t4g.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]

  publicly_accessible    = false
  multi_az               = false
  skip_final_snapshot    = true
  deletion_protection    = false

  backup_retention_period = 1
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  storage_encrypted = true

  tags = { Name = "${var.project_name}-${var.environment}-postgres" }
}
