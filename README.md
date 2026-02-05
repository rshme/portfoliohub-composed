# PortfolioHub Composed

A full-stack portfolio management application built with NestJS (Backend) and Nuxt.js (Frontend), deployed using Docker Compose.

## Architecture

- **Backend**: NestJS with TypeORM, PostgreSQL, and Redis
- **Frontend**: Nuxt.js with Vue 3 and TailwindCSS
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Containerization**: Docker & Docker Compose

## Quick Start

### Standard Deployment (Multi-core systems)

```bash
# Clone the repository
git clone <repository-url>
cd portfoliohub-composed

# Start all services
docker compose up -d
```

### Low-Resource Deployment (1-core droplets)

For servers with limited resources, use the sequential build script:

```bash
# Use the optimized deployment script
./deploy-low-resource.sh
```

Or build manually in sequence:

```bash
# Build services one at a time
docker compose build backend
docker compose build frontend

# Start all services
docker compose up -d
```

**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment strategies and optimization guides for low-resource environments.**

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Nuxt.js web application |
| Backend | 8000 | NestJS API server |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache server |

## Environment Configuration

### Backend Environment Variables

The backend service requires the following environment variables (configured in `docker-compose.yml`):

- `DATABASE_HOST`: PostgreSQL host (default: postgres)
- `DATABASE_PORT`: PostgreSQL port (default: 5432)
- `DATABASE_USERNAME`: Database user (default: root)
- `DATABASE_PASSWORD`: Database password (default: root)
- `DATABASE_NAME`: Database name (default: portfoliohub)
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `REDIS_HOST`: Redis host (default: redis)
- `REDIS_PORT`: Redis port (default: 6379)
- `CLOUDINARY_*`: Cloudinary configuration for file uploads

### Frontend Environment Variables

- `NUXT_PUBLIC_API_BASE_URL`: Backend API URL (default: http://localhost:8000/api/v1)

## Management Commands

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop Services
```bash
docker compose down
```

### Rebuild Services
```bash
# Rebuild all
docker compose up -d --build

# Rebuild specific service
docker compose up -d --build backend
```

### View Resource Usage
```bash
docker stats
```

## Resource Requirements

### Minimum Requirements (with optimizations)
- CPU: 1 vCPU
- RAM: 2GB
- Storage: 50GB SSD
- Swap: 2GB recommended

### Recommended Requirements
- CPU: 2 vCPU
- RAM: 4GB
- Storage: 80GB SSD

## Development

### Backend Development

```bash
cd backend
npm install
npm run start:dev
```

See [backend/README.md](./backend/README.md) for more details.

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

See [frontend/README.md](./frontend/README.md) for more details.

## Performance Optimizations

This repository includes several optimizations for low-resource environments:

1. **Resource Limits**: CPU and memory limits prevent resource exhaustion
2. **Optimized npm**: Reduced concurrency and network overhead
3. **Memory-Constrained Builds**: Limited Node.js heap size during builds
4. **Sequential Building**: Build script to prevent concurrent resource usage
5. **Docker BuildKit**: Enhanced caching and build performance

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive optimization strategies.

## Troubleshooting

### High CPU Usage During Build
- Use the `deploy-low-resource.sh` script for sequential builds
- Enable swap memory on your server
- Consider building on a more powerful machine and pushing to a registry

### Out of Memory Errors
- Ensure at least 2GB RAM is available
- Enable swap memory
- Build services sequentially

### Slow Performance
- Check resource limits in `docker-compose.yml`
- Monitor with `docker stats`
- Review logs with `docker compose logs`

For detailed troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
