# Deployment Guide for Low-Resource Environments

This guide provides instructions for deploying PortfolioHub on servers with limited resources, such as 1-core CPU droplets.

## Optimization Strategies Implemented

### 1. Resource Limits in Docker Compose
Each service has defined CPU and memory limits to prevent resource exhaustion:
- **CPU Limits**: 0.8 cores max per service (allows sharing the single core)
- **CPU Reservations**: 0.3 cores guaranteed per service
- **Memory Limits**: 1GB max per service
- **Memory Reservations**: 256MB guaranteed per service

### 2. Optimized npm Installation
Both frontend and backend Dockerfiles use optimized npm commands:
- `--prefer-offline`: Reduces network overhead
- `--no-audit`: Skips security audit during install (faster)
- `--no-fund`: Skips funding messages
- `npm cache clean --force`: Cleans up after installation

### 3. Memory-Constrained Builds
Node.js build processes are limited to 512MB heap size to prevent memory spikes:
```
ENV NODE_OPTIONS="--max-old-space-size=512"
```

## Deployment Strategies for 1-Core Droplets

### Option 1: Sequential Building (Recommended)
Build services one at a time to minimize CPU usage:

```bash
# Build backend first
docker compose build backend

# Then build frontend
docker compose build frontend

# Finally, start all services
docker compose up -d
```

### Option 2: Pre-built Images (Most Efficient)
For production deployments, consider building images on a more powerful machine and pushing them to a registry:

```bash
# On a development machine with more resources:
docker compose build
docker tag portfoliohub-backend:latest your-registry/portfoliohub-backend:latest
docker tag portfoliohub-frontend:latest your-registry/portfoliohub-frontend:latest
docker push your-registry/portfoliohub-backend:latest
docker push your-registry/portfoliohub-frontend:latest

# On the 1-core droplet:
docker compose pull
docker compose up -d
```

### Option 3: Build with Nice Priority
Run Docker Compose with lower CPU priority to allow other processes to run:

```bash
nice -n 19 docker compose up -d --build
```

## Monitoring During Deployment

Monitor CPU and memory usage during deployment:

```bash
# In a separate terminal
watch -n 1 'docker stats --no-stream'
```

## Troubleshooting

### Build Timeout Issues
If builds timeout, increase Docker build timeout:

```bash
COMPOSE_HTTP_TIMEOUT=600 docker compose up -d --build
```

### Out of Memory Errors
If you encounter OOM errors:
1. Ensure swap is enabled on your droplet
2. Consider upgrading to a 2GB RAM droplet minimum
3. Build services sequentially as shown in Option 1

### CPU Throttling
If services are slow to respond after deployment:
1. Check if CPU limits are too restrictive
2. Adjust `cpus` limits in docker-compose.yml
3. Consider using CPU shares instead of hard limits

## Recommended Droplet Specifications

For optimal performance:
- **Minimum**: 1 vCPU, 2GB RAM, 50GB SSD
- **Recommended**: 2 vCPU, 4GB RAM, 80GB SSD

## Additional Optimizations

### Enable Swap (if not already enabled)
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Adjust Docker Build Concurrency
Create or edit `/etc/docker/daemon.json`:

```json
{
  "max-concurrent-downloads": 2,
  "max-concurrent-uploads": 2
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
```

## Best Practices

1. **Always build sequentially** on 1-core droplets
2. **Monitor resources** during the first deployment
3. **Use Docker BuildKit** for better caching:
   ```bash
   DOCKER_BUILDKIT=1 docker compose build
   ```
4. **Clean up regularly** to free disk space:
   ```bash
   docker system prune -a --volumes
   ```
5. **Consider CI/CD pipelines** to build images elsewhere

## Support

If you continue to experience high CPU usage:
1. Check if background processes are consuming resources
2. Verify no other services are running during build
3. Consider temporarily stopping non-essential services during deployment
4. Review Docker logs for errors: `docker compose logs`
