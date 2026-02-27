output "alb_dns_name" {
  description = "Application URL (paste in browser)"
  value       = "http://${module.alb.alb_dns_name}"
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_endpoint
}

output "frontend_ecr_repo" {
  value = module.ecr.frontend_repo_url
}

output "backend_ecr_repo" {
  value = module.ecr.backend_repo_url
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC"
  value       = module.ecs.github_actions_role_arn
}

output "acm_validation_records" {
  description = "Add these DNS records at your registrar to validate the ACM certificate"
  value       = module.alb.acm_certificate_validation_records
}
