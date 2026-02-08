# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with limited concurrency for low-resource environments
# --prefer-offline reduces network overhead
RUN npm ci --prefer-offline --no-audit --no-fund \
    && npm cache clean --force

# Copy source code
COPY . .

# Build the application with optimized Node.js memory settings
# Increase to 2GB for build process (can handle larger builds)
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
# Use same optimizations as build stage
RUN npm ci --only=production --prefer-offline --no-audit --no-fund \
    && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", ".output/server/index.mjs"]