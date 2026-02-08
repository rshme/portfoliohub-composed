#!/bin/bash

# Script untuk pull dan deploy aplikasi di server production
# Script ini hanya pull pre-built images, tidak build di server

set -e  # Exit on error

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  PortfolioHub - Pull and Deploy (Production)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: File .env tidak ditemukan${NC}"
    echo -e "${YELLOW}   Silakan copy .env.prod.example ke .env dan sesuaikan konfigurasi${NC}"
    echo -e "${YELLOW}   Command: cp .env.prod.example .env${NC}"
    exit 1
fi

# Load environment variables
source .env

# Validasi environment variables
if [ "$USERNAME" = "your-username" ]; then
    echo -e "${RED}❌ Error: USERNAME di file .env masih default${NC}"
    echo -e "${YELLOW}   Silakan edit file .env dan ganti USERNAME dengan username Docker Hub Anda${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Configuration:${NC}"
echo -e "   Registry: ${YELLOW}$REGISTRY${NC}"
echo -e "   Username: ${YELLOW}$USERNAME${NC}"
echo -e "   Version:  ${YELLOW}$VERSION${NC}"
echo ""

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down || true
echo ""

# Pull latest images
echo -e "${BLUE}📥 Pulling latest images...${NC}"
echo ""

echo -e "${YELLOW}   Pulling Backend...${NC}"
docker pull $REGISTRY/$USERNAME/portfoliohub-backend:$VERSION
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Backend pulled successfully${NC}"
else
    echo -e "${RED}   ❌ Backend pull failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}   Pulling Frontend...${NC}"
docker pull $REGISTRY/$USERNAME/portfoliohub-frontend:$VERSION
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Frontend pulled successfully${NC}"
else
    echo -e "${RED}   ❌ Frontend pull failed${NC}"
    exit 1
fi
echo ""

# Pull database and cache images
echo -e "${YELLOW}   Pulling PostgreSQL and Redis...${NC}"
docker-compose -f docker-compose.prod.yml pull postgres redis
echo ""

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ Deployment berhasil!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}📊 Status Containers:${NC}"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo -e "${BLUE}📝 Useful Commands:${NC}"
    echo -e "   Logs:    ${YELLOW}docker-compose -f docker-compose.prod.yml logs -f${NC}"
    echo -e "   Stop:    ${YELLOW}docker-compose -f docker-compose.prod.yml down${NC}"
    echo -e "   Restart: ${YELLOW}docker-compose -f docker-compose.prod.yml restart${NC}"
    echo ""
    echo -e "${BLUE}🌐 Access:${NC}"
    echo -e "   Frontend: ${YELLOW}http://localhost:${FRONTEND_PORT:-3000}${NC}"
    echo -e "   Backend:  ${YELLOW}http://localhost:${BACKEND_PORT:-8000}/api/v1${NC}"
    echo ""
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
