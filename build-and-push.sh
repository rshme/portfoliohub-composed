#!/bin/bash

# Script untuk build dan push Docker images ke registry
# Build dilakukan di local, lalu push ke Docker Hub atau GitHub Container Registry

set -e  # Exit on error

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGISTRY="docker.io"  # Ganti dengan registry pilihan: docker.io, ghcr.io, dll
USERNAME="your-username"  # Ganti dengan username Docker Hub atau GitHub
APP_NAME="portfoliohub"
VERSION="latest"  # Bisa diganti dengan semantic version seperti v1.0.0

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  PortfolioHub - Build and Push Docker Images${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""

# Validasi bahwa username sudah diganti
if [ "$USERNAME" = "your-username" ]; then
    echo -e "${RED}❌ Error: Harap ganti USERNAME di script ini dengan username Docker Hub Anda${NC}"
    echo -e "${YELLOW}   Edit file build-and-push.sh, line 15${NC}"
    exit 1
fi

# Login ke registry (optional, bisa login manual sebelumnya)
echo -e "${YELLOW}📝 Login ke $REGISTRY...${NC}"
echo -e "${YELLOW}   (Jika sudah login, bisa skip dengan Ctrl+C dan jalankan dengan --skip-login)${NC}"
if [ "$1" != "--skip-login" ]; then
    docker login $REGISTRY
    echo ""
fi

# Build Backend
echo -e "${BLUE}🏗️  Building Backend Image...${NC}"
echo -e "${YELLOW}   Registry: $REGISTRY/$USERNAME/$APP_NAME-backend:$VERSION${NC}"
docker build \
    --platform linux/amd64 \
    -t $REGISTRY/$USERNAME/$APP_NAME-backend:$VERSION \
    -f backend/Dockerfile \
    ./backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
echo ""

# Build Frontend
echo -e "${BLUE}🏗️  Building Frontend Image...${NC}"
echo -e "${YELLOW}   Registry: $REGISTRY/$USERNAME/$APP_NAME-frontend:$VERSION${NC}"
docker build \
    --platform linux/amd64 \
    -t $REGISTRY/$USERNAME/$APP_NAME-frontend:$VERSION \
    -f frontend/Dockerfile \
    ./frontend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
echo ""

# Push Backend
echo -e "${BLUE}📤 Pushing Backend Image...${NC}"
docker push $REGISTRY/$USERNAME/$APP_NAME-backend:$VERSION
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend pushed successfully${NC}"
else
    echo -e "${RED}❌ Backend push failed${NC}"
    exit 1
fi
echo ""

# Push Frontend
echo -e "${BLUE}📤 Pushing Frontend Image...${NC}"
docker push $REGISTRY/$USERNAME/$APP_NAME-frontend:$VERSION
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend pushed successfully${NC}"
else
    echo -e "${RED}❌ Frontend push failed${NC}"
    exit 1
fi
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Images berhasil di-build dan di-push!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📦 Images yang tersedia:${NC}"
echo -e "   Backend:  ${YELLOW}$REGISTRY/$USERNAME/$APP_NAME-backend:$VERSION${NC}"
echo -e "   Frontend: ${YELLOW}$REGISTRY/$USERNAME/$APP_NAME-frontend:$VERSION${NC}"
echo ""
echo -e "${BLUE}📝 Langkah selanjutnya:${NC}"
echo -e "   1. Copy file ${YELLOW}docker-compose.prod.yml${NC} dan ${YELLOW}deploy-pull.sh${NC} ke server"
echo -e "   2. Copy file ${YELLOW}.env.prod.example${NC} ke ${YELLOW}.env${NC} dan sesuaikan konfigurasi"
echo -e "   3. Jalankan: ${YELLOW}./deploy-pull.sh${NC}"
echo ""
