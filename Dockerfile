# Multi-stage Dockerfile for React application
# Uses Alpine Linux for minimal size and implements rootless security

# Base stage with pnpm and user setup
FROM node:22-alpine AS base

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactuser -u 1001

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Change ownership of the app directory to the non-root user
RUN chown -R reactuser:nodejs /app

# Stage 1: Dependencies installation
FROM base AS deps

# Switch to non-root user
USER reactuser

# Copy package files for dependency caching
COPY --chown=reactuser:nodejs package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build stage
FROM base AS builder

# Copy node_modules from deps stage
COPY --from=deps --chown=reactuser:nodejs /app/node_modules ./node_modules

# Copy source code
COPY --chown=reactuser:nodejs . .

# Switch to non-root user
USER reactuser

# Build the application
RUN pnpm run build

# Stage 3: Production stage
FROM nginxinc/nginx-unprivileged:1.29.2-alpine AS production

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (non-privileged port)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
