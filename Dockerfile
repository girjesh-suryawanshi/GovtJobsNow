# Multi-stage build for production deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev

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

# Prune devDependencies to keep only production packages in node_modules
RUN npm prune --production

# ─── Production stage ────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Install dumb-init and system fonts for image generation
RUN apk add --no-cache dumb-init curl font-roboto

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory — owned by root initially
WORKDIR /app

# Give the nodejs user ownership of /app
RUN chown nodejs:nodejs /app

# Switch to non-root user for all subsequent operations
USER nodejs

# Copy package files and pruned node_modules from builder stage (no 2nd npm ci!)
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules

# Copy built artifacts from builder stage
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/drizzle.config.ts ./
COPY --chown=nodejs:nodejs --from=builder /app/shared ./shared
COPY --chown=nodejs:nodejs --from=builder /app/server/scripts ./server/scripts

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/stats', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]