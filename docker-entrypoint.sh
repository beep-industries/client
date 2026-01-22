#!/bin/sh
set -e

# Use NGINX_PORT environment variable or default to 5173
PORT=${NGINX_PORT:-5173}

echo "Starting nginx on port $PORT"

# Replace the port in nginx configuration
sed -i "s/listen [0-9]\+;/listen $PORT;/g" /etc/nginx/conf.d/default.conf

# Execute the original nginx command
exec nginx -g "daemon off;"
