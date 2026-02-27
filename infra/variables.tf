variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile"
  type        = string
  default     = "profile-builder"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "pb"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "profilebuilder"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "pbadmin"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Admin user password"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}

variable "tavily_api_key" {
  description = "Tavily API key"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Custom domain name (e.g., app.example.com). Leave empty to skip HTTPS/ACM setup."
  type        = string
  default     = ""
}

variable "github_repo" {
  description = "GitHub repository (org/repo format)"
  type        = string
  default     = "YOUR_GITHUB_USER/profile-builder"
}
