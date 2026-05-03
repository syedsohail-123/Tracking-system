output "public_ip" {
  description = "Public IP of the EC2 instance (update your frontend API base URL to this)"
  value       = aws_eip.trucking_planner_eip.public_ip
}

output "ssh_command" {
  description = "Command to SSH into your EC2 instance"
  value       = "ssh -i your-key.pem ec2-user@${aws_eip.trucking_planner_eip.public_ip}"
}

output "api_url" {
  description = "Your Django API base URL"
  value       = "http://${aws_eip.trucking_planner_eip.public_ip}/api/"
}
