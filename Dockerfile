# Multi-stage build for production deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build client (Vite) + server (esbuild)
RUN npx vite build && \
    npx esbuild server/index.ts \
      --platform=node \
      --bundle \
      --format=esm \
      --outdir=dist \
      --packages=external \
      --define:process.env.NODE_ENV='"production"' \
      --define:import.meta.dirname='"/app/dist"'

# ─── Production stage ────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Install dumb-init and system fonts for image generation
RUN apk add --no-cache dumb-init curl font-roboto

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory — owned by root initially
WORKDIR /app

# Give the nodejs user ownership of /app (ONLY this directory, not node_modules yet)
# This is a single fast operation — no recursive traversal of node_modules.
RUN chown nodejs:nodejs /app

# Switch to non-root user for all subsequent operations
USER nodejs

# Copy package files (nodejs user owns them)
COPY --chown=nodejs:nodejs package*.json ./

# npm ci runs as nodejs and writes into /app which it now owns — no EACCES error
RUN npm ci --omit=dev --cache /tmp/empty-cache && rm -rf /tmp/empty-cache

# Copy built artifacts from builder stage
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/drizzle.config.ts ./
COPY --chown=nodejs:nodejs --from=builder /app/shared ./shared

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/stats', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]