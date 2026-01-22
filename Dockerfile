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

# Build arguments for Vite environment variables
ARG VITE_KEYCLOAK_CLIENT_ID=frontend
ARG VITE_KEYCLOAK_AUTHORITY=http://localhost:8080/realms/myrealm
ARG VITE_USER_SERVICE_URL=http://localhost:3000
ARG VITE_COMMUNITY_SERVICE_URL=http://localhost:3003
ARG VITE_REAL_TIME_URL=http://localhost:4000
ARG VITE_WEBRTC_BASE=http://localhost:8080
ARG VITE_MESSAGE_SERVICE_URL=http://localhost:3002

# Convert ARG to ENV so they're available during build
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
ENV VITE_KEYCLOAK_AUTHORITY=$VITE_KEYCLOAK_AUTHORITY
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_COMMUNITY_SERVICE_URL=$VITE_COMMUNITY_SERVICE_URL
ENV VITE_REAL_TIME_URL=$VITE_REAL_TIME_URL
ENV VITE_WEBRTC_BASE=$VITE_WEBRTC_BASE
ENV VITE_MESSAGE_SERVICE_URL=$VITE_MESSAGE_SERVICE_URL

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

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
USER root
RUN chmod +x /docker-entrypoint.sh
USER nginx

# Expose port 5173 (can be overridden with NGINX_PORT env var)
EXPOSE 5173

# Set default port
ENV NGINX_PORT=5173

# Start nginx with entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
