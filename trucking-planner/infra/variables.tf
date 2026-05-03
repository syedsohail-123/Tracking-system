variable "aws_region" {
  description = "AWS region to deploy to"
  default     = "ap-south-1"
}

variable "key_name" {
  description = "Name of your AWS Key Pair (created in AWS Console → EC2 → Key Pairs)"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type (t2.micro is Free Tier eligible)"
  default     = "t2.micro"
}
