provider "aws" {
  region = var.aws_region
}

# Get latest Amazon Linux 2023 AMI automatically
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# Security Group - opens ports 22 (SSH), 80 (HTTP), 8000 (Django fallback)
resource "aws_security_group" "trucking_planner_sg" {
  name        = "trucking-planner-sg"
  description = "Allow SSH, HTTP and Django port"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Django / Gunicorn"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "trucking-planner-sg"
  }
}

# EC2 Instance
resource "aws_instance" "trucking_planner" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.trucking_planner_sg.id]
  user_data              = file("${path.module}/user_data.sh")

  tags = {
    Name = "trucking-planner-backend"
  }
}

# Elastic IP - gives a fixed public IP address
resource "aws_eip" "trucking_planner_eip" {
  instance = aws_instance.trucking_planner.id
  domain   = "vpc"

  tags = {
    Name = "trucking-planner-eip"
  }
}
