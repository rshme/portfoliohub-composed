# Deployment dengan Pre-Built Images (Pull Strategy)

Strategi deployment ini **sangat direkomendasikan** untuk server dengan resource terbatas (RAM < 4GB). Build dilakukan di local machine atau CI/CD, lalu server tinggal pull image yang sudah jadi.

## 🎯 Keuntungan Strategi Ini

✅ **Tidak perlu build di server** - Server hanya pull dan run  
✅ **Hemat RAM** - Build bisa pakai 4-8GB di local, server cukup 1-2GB untuk run  
✅ **Deployment lebih cepat** - Pull image ~1-2 menit vs build ~30-60 menit  
✅ **Rollback mudah** - Tinggal ganti version tag  
✅ **Konsisten** - Image yang di-deploy sama persis dengan yang di-test local  

---

## 📋 Requirement

### Di Local Machine (Untuk Build):
- Docker Desktop installed
- RAM minimal 4GB (recommended 8GB)
- Internet connection untuk push ke registry

### Di Server (Untuk Deploy):
- Docker & Docker Compose installed
- RAM minimal 1GB (recommended 2GB)
- Internet connection untuk pull images
- Port 3000 (frontend) dan 8000 (backend) available

---

## 🚀 Step 1: Setup di Local Machine

### 1.1 Setup Docker Registry

Anda perlu akun di salah satu registry:

#### Option A: Docker Hub (Gratis)
1. Daftar di https://hub.docker.com
2. Login: `docker login docker.io`

#### Option B: GitHub Container Registry (Gratis)
1. Generate Personal Access Token di GitHub dengan scope `write:packages`
2. Login: `docker login ghcr.io -u YOUR_GITHUB_USERNAME`

### 1.2 Edit Build Script

Edit file `build-and-push.sh`:

```bash
# Untuk Docker Hub
REGISTRY="docker.io"
USERNAME="your-dockerhub-username"  # Ganti dengan username Anda

# Atau untuk GitHub Container Registry
REGISTRY="ghcr.io"
USERNAME="your-github-username"     # Ganti dengan username GitHub Anda
```

### 1.3 Make Script Executable

```bash
chmod +x build-and-push.sh
```

### 1.4 Build dan Push Images

```bash
./build-and-push.sh
```

Script ini akan:
1. Login ke registry
2. Build backend image
3. Build frontend image  
4. Push backend image ke registry
5. Push frontend image ke registry

**Build time:** ~20-30 menit tergantung spesifikasi komputer dan koneksi internet.

**Output yang diharapkan:**
```
✅ Backend build successful
✅ Frontend build successful
✅ Backend pushed successfully
✅ Frontend pushed successfully
```

---

## 📦 Step 2: Setup di Server

### 2.1 Upload Files ke Server

Copy 3 files ini ke server:
```bash
scp docker-compose.prod.yml user@server:/path/to/app/
scp deploy-pull.sh user@server:/path/to/app/
scp .env.prod.example user@server:/path/to/app/
```

Atau clone repository:
```bash
git clone YOUR_REPO_URL
cd portfoliohub
```

### 2.2 Setup Environment Variables

```bash
# Copy example file
cp .env.prod.example .env

# Edit dengan text editor favorit
nano .env
# atau
vim .env
```

**Konfigurasi yang WAJIB diganti:**

```bash
# Registry Configuration
USERNAME=your-dockerhub-username  # WAJIB sama dengan yang di build script

# Security
POSTGRES_PASSWORD=ganti-dengan-password-kuat
JWT_SECRET=ganti-dengan-random-string-panjang-minimal-32-karakter

# Cloudinary (untuk upload gambar)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# API URL - ganti dengan domain/IP server Anda
NUXT_PUBLIC_API_BASE_URL=http://YOUR_SERVER_IP:8000/api/v1
# Contoh: http://103.xxx.xxx.xxx:8000/api/v1
# Atau: http://api.yourdomain.com/api/v1
```

### 2.3 Make Deploy Script Executable

```bash
chmod +x deploy-pull.sh
```

### 2.4 Deploy!

```bash
./deploy-pull.sh
```

Script ini akan:
1. Load konfigurasi dari `.env`
2. Stop containers yang sedang running
3. Pull latest images dari registry
4. Start semua services (postgres, redis, backend, frontend)

**Deploy time:** ~2-5 menit tergantung koneksi internet.

**Output yang diharapkan:**
```
✅ Backend pulled successfully
✅ Frontend pulled successfully
✅ Deployment berhasil!
```

---

## 🔄 Update Aplikasi (Re-deployment)

Ketika ada update code:

### Di Local:
```bash
# Rebuild dan push images baru
./build-and-push.sh
```

### Di Server:
```bash
# Pull dan deploy versi terbaru
./deploy-pull.sh
```

**Total waktu update:** ~2-5 menit (hanya di server)

---

## 🏷️ Versioning

Untuk environment production yang lebih proper, gunakan version tags:

### Di Local (`build-and-push.sh`):
```bash
VERSION="v1.0.0"  # Ganti dari "latest" ke version specific
```

### Di Server (`.env`):
```bash
VERSION=v1.0.0
```

**Keuntungan:**
- Bisa rollback ke version sebelumnya kapan saja
- Lebih mudah tracking versi mana yang sedang running
- Lebih aman untuk production

**Rollback ke version sebelumnya:**
```bash
# Edit .env
VERSION=v1.0.0  # Ganti ke version lama

# Deploy version lama
./deploy-pull.sh
```

---

## 📊 Monitoring & Maintenance

### Check Status Containers
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Check Resource Usage
```bash
docker stats
```

---

## 🔧 Troubleshooting

### Problem: Pull image failed
```
Error response from daemon: pull access denied
```

**Solution:**
1. Pastikan image sudah di-push dari local
2. Pastikan `USERNAME` di `.env` sama dengan di `build-and-push.sh`
3. Check di Docker Hub/GHCR apakah image sudah ada
4. Untuk private registry, pastikan sudah login di server

### Problem: Backend tidak connect ke database
```
Error: Connection refused to postgres
```

**Solution:**
1. Check postgres container running: `docker ps | grep postgres`
2. Check logs: `docker-compose -f docker-compose.prod.yml logs postgres`
3. Pastikan `POSTGRES_PASSWORD` di `.env` sudah benar

### Problem: Frontend tidak bisa hit backend API
```
Network error atau CORS error
```

**Solution:**
1. Check `NUXT_PUBLIC_API_BASE_URL` di `.env`
2. Pastikan menggunakan IP/domain yang bisa diakses dari browser
3. Jika pakai domain, pastikan DNS sudah pointing
4. Jika pakai IP, pastikan port 8000 terbuka di firewall

### Problem: Out of memory di server
```
Container keeps restarting
```

**Solution:**
Server resource tidak cukup. Check dengan:
```bash
free -h  # Check RAM usage
df -h    # Check disk usage
```

Resource limits sudah di-set di `docker-compose.prod.yml`:
- Backend: 1GB max
- Frontend: 1GB max

Jika masih OOM, kurangi limits atau upgrade server.

---

## 🌐 Setup Domain & SSL (Optional)

Untuk production yang proper, gunakan Nginx sebagai reverse proxy + SSL.

### 1. Install Nginx
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

### 2. Nginx Configuration
```nginx
# /etc/nginx/sites-available/portfoliohub

server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Enable & Get SSL
```bash
sudo ln -s /etc/nginx/sites-available/portfoliohub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com
```

### 4. Update Environment
Edit `.env`:
```bash
NUXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api/v1
```

Redeploy:
```bash
./deploy-pull.sh
```

---

## 📈 Perbandingan Strategi Deployment

| Aspect | Pull Strategy | Build di Server |
|--------|---------------|-----------------|
| **Build Time di Server** | ❌ Tidak perlu | ⏱️ 30-60 menit |
| **Deploy Time** | ⚡ 2-5 menit | ⏱️ 30-60 menit |
| **RAM Requirement** | ✅ 1-2GB | ❌ 4-8GB |
| **Konsistensi** | ✅ Identik dengan local | ⚠️ Bisa beda |
| **Rollback** | ✅ Instant (ganti tag) | ❌ Perlu rebuild |
| **Network Usage** | 📥 Pull only (~500MB) | 📦 npm install (~1GB) |
| **Best For** | ✅ Production | 🛠️ Development |

---

## 💡 Best Practices

1. **Gunakan version tags** untuk production (bukan `latest`)
2. **Backup database** secara berkala
3. **Monitor logs** untuk detect issues early
4. **Setup alerts** untuk container restarts
5. **Document** setiap perubahan konfigurasi
6. **Test di staging** sebelum deploy ke production
7. **Keep images small** - remove unused dependencies
8. **Use .env** jangan hardcode credentials di compose file

---

## 📚 File Reference

- `build-and-push.sh` - Build di local & push ke registry
- `docker-compose.prod.yml` - Compose file untuk production (pull strategy)
- `.env.prod.example` - Template environment variables
- `deploy-pull.sh` - Deploy script di server
- `DEPLOY_PULL.md` - Dokumentasi ini

---

## 🆘 Support

Jika ada masalah:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Check resource: `docker stats`
3. Refer ke troubleshooting section di atas

Happy deploying! 🚀
