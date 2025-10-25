# Deployment Guide

## Docker Deployment (Recommended)

### Production Deployment

```bash
# 1. Clone and configure
git clone <repository-url>
cd webcam-pulse-detector
cp .env.example .env

# 2. Edit .env file with your settings
nano .env

# 3. Build and start services
docker-compose up -d --build

# 4. Check status
docker-compose ps
docker-compose logs -f
```

### Development Deployment

```bash
# Use development configuration with hot-reload
docker-compose -f docker-compose.dev.yml up
```

### With Nginx Reverse Proxy

```bash
# Start all services including nginx
docker-compose --profile production up -d
```

## Manual Deployment

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run preview  # or use nginx to serve dist/
```

## Cloud Deployment

### AWS

1. **EC2 Instance**
   - Launch Ubuntu 22.04 instance
   - Install Docker and Docker Compose
   - Configure security groups (ports 80, 443)
   - Follow Docker deployment steps

2. **Elastic Beanstalk**
   - Use `docker-compose.yml` for deployment
   - Configure environment variables
   - Set up load balancer

### Google Cloud Platform

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/pulse-detector

# Deploy to Cloud Run
gcloud run deploy pulse-detector \
  --image gcr.io/PROJECT-ID/pulse-detector \
  --platform managed
```

### DigitalOcean

```bash
# Use Docker Compose on Droplet
# Or deploy to App Platform with Dockerfile
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Update nginx configuration

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    # ... rest of config
}
```

## Monitoring

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks

```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend health
curl http://localhost:3000/health
```

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
```

### Load Balancing

Use nginx or external load balancer to distribute traffic across multiple backend instances.

## Backup

### Data Backup

```bash
# Backup data directory
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Restore
tar -xzf backup-20240101.tar.gz
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 PID
```

### Permission Denied for Camera

```bash
# Add user to video group
sudo usermod -a -G video $USER

# Or change permissions
sudo chmod 666 /dev/video0
```

### Docker Out of Disk Space

```bash
# Clean up
docker system prune -a --volumes
```
