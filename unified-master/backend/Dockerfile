# ==============================================================================
# Unified AWT Master Backend - Production Dockerfile (Practical 11)
# ==============================================================================
FROM node:20-alpine AS base

# Install curl/wget for healthcheck
RUN apk add --no-cache curl wget

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev --ignore-scripts

# Copy application source code
COPY . .

# Set container environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Security best practice: switch to non-root user
USER node

# Expose backend port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start production server
CMD ["node", "server.js"]

