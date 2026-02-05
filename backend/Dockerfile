# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with limited concurrency for low-resource environments
# --prefer-offline reduces network overhead
# Setting max-old-space-size to prevent memory issues
RUN npm ci --prefer-offline --no-audit --no-fund \
    && npm cache clean --force

# Copy source code
COPY . .

# Build the application with optimized Node.js memory settings
# Limit max old space size to 512MB to prevent memory spikes
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for CLI commands)
# Use same optimizations as build stage
RUN npm ci --prefer-offline --no-audit --no-fund \
    && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/nest-cli.json ./

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/src/main.js"]