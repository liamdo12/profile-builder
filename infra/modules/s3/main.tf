resource "aws_s3_bucket" "uploads" {
  bucket        = "${var.project_name}-${var.environment}-uploads"
  force_destroy = true

  tags = { Name = "${var.project_name}-${var.environment}-uploads" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    id     = "cleanup-staging"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}
