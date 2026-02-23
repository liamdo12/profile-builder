output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  value = aws_lb.main.arn
}

output "alb_zone_id" {
  description = "ALB hosted zone ID (for Route53 alias records)"
  value       = aws_lb.main.zone_id
}

output "frontend_target_group_arn" {
  value = aws_lb_target_group.frontend.arn
}

output "backend_target_group_arn" {
  value = aws_lb_target_group.backend.arn
}

output "http_listener_arn" {
  value = aws_lb_listener.http.arn
}
