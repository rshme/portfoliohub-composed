#!/bin/bash

# Deploy script for low-resource environments (1-core droplets)
# This script builds Docker images sequentially to minimize CPU usage

set -e  # Exit on error

echo "======================================"
echo "PortfolioHub Sequential Build Script"
echo "Optimized for 1-core CPU droplets"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if docker compose is available
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Error: Docker is not installed${NC}"
    exit 1
fi

# Function to display progress
show_progress() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to show success
show_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Stop any running containers
show_progress "Stopping existing containers..."
docker compose down || true
show_success "Containers stopped"
echo ""

# Build backend first
show_progress "Building backend service (Step 1/2)..."
show_progress "This may take several minutes on a 1-core droplet..."
DOCKER_BUILDKIT=1 docker compose build backend
show_success "Backend build completed"
echo ""

# Build frontend second
show_progress "Building frontend service (Step 2/2)..."
show_progress "This may take several minutes on a 1-core droplet..."
DOCKER_BUILDKIT=1 docker compose build frontend
show_success "Frontend build completed"
echo ""

# Start all services
show_progress "Starting all services..."
docker compose up -d
show_success "All services started"
echo ""

# Show status
show_progress "Current container status:"
docker compose ps
echo ""

# Show resource usage
show_progress "Current resource usage:"
docker stats --no-stream
echo ""

echo "======================================"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo "======================================"
echo ""
echo "Access the application at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo ""
echo "To view logs, run:"
echo "  docker compose logs -f"
echo ""
echo "To stop all services, run:"
echo "  docker compose down"
echo ""
