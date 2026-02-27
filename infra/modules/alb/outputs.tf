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
  value = length(aws_lb_listener.http) > 0 ? aws_lb_listener.http[0].arn : aws_lb_listener.http_redirect[0].arn
}

output "acm_certificate_validation_records" {
  description = "DNS records to add at your domain registrar for ACM certificate validation"
  value = length(aws_acm_certificate.main) > 0 ? {
    for dvo in aws_acm_certificate.main[0].domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  } : {}
}
