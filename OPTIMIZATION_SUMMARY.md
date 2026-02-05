# CPU Optimization Summary

**Note:** This document is in Indonesian as it addresses an issue originally reported in Indonesian. For English documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md) and [BEFORE_AFTER.md](./BEFORE_AFTER.md).

---

## Problem
CPU droplet dengan 1 core selalu lebih dari 100% saat menjalankan `docker compose up -d` untuk build frontend dan backend.

## Root Causes Identified
1. Frontend dan backend di-build secara bersamaan (concurrent)
2. Tidak ada batasan resource untuk build process
3. npm ci menggunakan full concurrency
4. Node.js build process menggunakan unlimited memory
5. Tidak ada strategy untuk low-resource environment

## Solutions Implemented

### 1. Resource Limits di Docker Compose (docker-compose.yml)

**Important Note:** These resource limits apply to **running containers**, not during the build phase. During builds, the sequential build script ensures only one service builds at a time. Once running, both services share resources but are capped individually.

**Sebelum:**
```yaml
backend:
  build: ./backend
  ports:
    - "8000:8000"
```

**Sesudah:**
```yaml
backend:
  build: ./backend
  ports:
    - "8000:8000"
  deploy:
    resources:
      limits:
        cpus: '0.8'          # Maksimal 80% dari 1 core
        memory: 1024M        # Maksimal 1GB RAM
      reservations:
        cpus: '0.3'          # Minimal reserved 30%
        memory: 256M         # Minimal reserved 256MB
```

**Benefit:** Mencegah single container menggunakan 100% CPU, memberi ruang untuk services lain.

### 2. Optimized npm Installation (Dockerfiles)
**Sebelum:**
```dockerfile
RUN npm ci
```

**Sesudah:**
```dockerfile
RUN npm ci --prefer-offline --no-audit --no-fund \
    && npm cache clean --force
```

**Benefit:**
- `--prefer-offline`: Mengurangi network overhead
- `--no-audit`: Skip security audit saat install (lebih cepat)
- `--no-fund`: Skip funding messages
- `npm cache clean --force`: Bersihkan cache untuk hemat disk space

### 3. Memory-Limited Builds (Dockerfiles)
**Ditambahkan:**
```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm run build
```

**Benefit:** Membatasi Node.js heap size ke 512MB, mencegah memory spike yang bisa trigger OOM killer.

### 4. Sequential Build Script (deploy-low-resource.sh)
**Dibuat script baru:**
```bash
#!/bin/bash
# Build backend dulu
docker compose build backend

# Kemudian build frontend
docker compose build frontend

# Baru start semua services
docker compose up -d
```

**Benefit:** Build satu per satu mencegah CPU overload dari concurrent builds.

### 5. Comprehensive Documentation
- **DEPLOYMENT.md**: Detailed deployment strategies untuk berbagai scenarios
- **README.md**: Quick start guide dengan link ke documentation
- Troubleshooting guides untuk common issues

## How to Use

### Option 1: Sequential Build (Paling Mudah)
```bash
./deploy-low-resource.sh
```

### Option 2: Manual Sequential Build
```bash
docker compose build backend
docker compose build frontend
docker compose up -d
```

### Option 3: Lower CPU Priority
```bash
nice -n 19 docker compose up -d --build
```

## Expected Results

### Sebelum Optimizations:
- CPU usage: 100%+ (sering spike ke 150-200%)
- Build time: Cepat tapi tidak stabil
- Risk: Out of memory errors, system freezes
- Concurrent builds: Ya (backend + frontend bersamaan)

### Sesudah Optimizations:
- CPU usage: 60-80% per service (max 80% karena limit)
- Build time: Sedikit lebih lama tapi stabil
- Risk: Minimal, builds tidak akan crash
- Sequential builds: Opsional tapi recommended
- Memory: Terbatas ke 512MB per build process

## Additional Recommendations

### 1. Enable Swap Memory
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Use Docker BuildKit
```bash
DOCKER_BUILDKIT=1 docker compose build
```
Lebih efisien dengan caching.

### 3. Pre-build Images
Build di mesin yang lebih powerful, push ke registry, pull di droplet:
```bash
# Di development machine:
docker compose build
docker push your-registry/portfoliohub-backend:latest
docker push your-registry/portfoliohub-frontend:latest

# Di 1-core droplet:
docker compose pull
docker compose up -d
```

### 4. Monitor Resources
```bash
watch -n 1 'docker stats --no-stream'
```

## Minimum System Requirements

### With Optimizations:
- CPU: 1 vCPU (works but sequential build recommended)
- RAM: 2GB minimum (4GB recommended)
- Storage: 50GB SSD
- Swap: 2GB recommended

### Ideal Setup:
- CPU: 2 vCPU
- RAM: 4GB
- Storage: 80GB SSD
- Swap: 2GB

## Troubleshooting

### Jika masih high CPU:
1. Pastikan tidak ada background processes
2. Stop services yang tidak perlu saat build
3. Gunakan sequential build script
4. Enable swap memory

### Jika Out of Memory:
1. Enable swap memory (lihat instructions di atas)
2. Pastikan minimal 2GB RAM tersedia
3. Check dengan `free -h`

### Jika Build Timeout:
```bash
COMPOSE_HTTP_TIMEOUT=600 docker compose up -d --build
```

## Testing Recommendations

Untuk test optimizations:
1. Mulai dari clean state: `docker compose down -v`
2. Monitor CPU: `watch -n 1 'docker stats --no-stream'`
3. Run sequential build: `./deploy-low-resource.sh`
4. Verify services: `docker compose ps`
5. Check logs: `docker compose logs`

## Conclusion

Optimizations ini secara signifikan mengurangi CPU pressure pada 1-core droplets dengan:
- Resource limits mencegah CPU overload
- Optimized npm installs lebih efisien
- Memory limits mencegah OOM errors
- Sequential builds mencegah concurrent resource contention
- Comprehensive documentation untuk troubleshooting

**Result:** Build process yang lebih stabil dan predictable pada low-resource environments.
