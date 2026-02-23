terraform {
  backend "s3" {
    bucket         = "pb-terraform-state"
    key            = "profile-builder/staging/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "pb-terraform-locks"
    encrypt        = true
  }
}
