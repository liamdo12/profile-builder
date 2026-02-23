variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "ecs_security_group_id" {
  type = string
}

variable "frontend_repo_url" {
  type = string
}

variable "backend_repo_url" {
  type = string
}

variable "frontend_target_group_arn" {
  type = string
}

variable "backend_target_group_arn" {
  type = string
}

variable "ssm_parameter_arns" {
  description = "ARNs of all SSM parameters for IAM policy"
  type        = list(string)
}

variable "kms_key_arn" {
  description = "KMS key ARN for decrypting SecureString parameters"
  type        = string
}

variable "ssm_prefix" {
  description = "SSM parameter path prefix"
  type        = string
}

variable "s3_bucket_arn" {
  description = "S3 bucket ARN for file uploads"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository (org/repo format)"
  type        = string
}
