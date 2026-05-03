#!/bin/bash
set -e
exec > /var/log/user_data.log 2>&1

echo "===== Starting setup ====="

# Update and install dependencies
dnf update -y
dnf install -y python3 python3-pip git nginx

# Clone your GitHub repository
cd /home/ec2-user
git clone https://github.com/syedsohail-123/Tracking-system.git
cd Tracking-system/trucking-planner/backend

# Install Python dependencies + gunicorn
pip3 install -r requirements.txt
pip3 install gunicorn

# Write the .env file with your real secrets
cat > /home/ec2-user/Tracking-system/trucking-planner/backend/.env << 'EOF'
DEBUG=False
SECRET_KEY=django-insecure-your-secret-key-here
DATABASE_URL=postgresql://neondb_owner:npg_8kvtIfX6UFVd@ep-bold-resonance-amls8ufh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
OPENROUTESERVICE_API_KEY=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFmMzQ4NDIwMjIyNDQzODQ5N2M0NWZiMWFiNzJmODhmIiwiaCI6Im11cm11cjY0In0=
EOF

# Create systemd service for Gunicorn so it auto-restarts on reboot
cat > /etc/systemd/system/gunicorn.service << 'EOF'
[Unit]
Description=Gunicorn daemon for Trucking Planner Django Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/Tracking-system/trucking-planner/backend
ExecStart=/usr/local/bin/gunicorn core.wsgi:application --bind 127.0.0.1:8000 --workers 3
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Configure Nginx to reverse-proxy port 80 → Gunicorn on 8000
cat > /etc/nginx/conf.d/trucking_planner.conf << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 120s;
    }
}
EOF

# Run Django migrations
cd /home/ec2-user/Tracking-system/trucking-planner/backend
python3 manage.py migrate --noinput

# Start and enable services
systemctl daemon-reload
systemctl enable gunicorn
systemctl start gunicorn
systemctl enable nginx
systemctl start nginx

echo "===== Setup complete! Django is running on port 80 via Nginx ====="
