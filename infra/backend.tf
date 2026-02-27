terraform {
  backend "s3" {
    bucket         = "profile-builder-terraform"
    key            = "profile-builder/staging/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "pb-terraform-locks"
    encrypt        = true
  }
}
