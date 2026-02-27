variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_account_id" {
  description = "AWS account ID for globally unique bucket naming"
  type        = string
}
