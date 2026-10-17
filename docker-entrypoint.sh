#!/bin/bash
set -e

# Configure Apache port based on Render's $PORT env (defaults to 80 if not set)
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Ensure storage directories exist
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache
mkdir -p /var/www/html/public/uploads/hero

# Ensure database exists and is writable
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
    php artisan migrate --force || true
fi

# Set proper ownership and permissions
chmod 1777 /tmp
mkdir -p /var/www/html/storage/framework/cache/tmp
chmod -R 777 /var/www/html/storage/framework/cache/tmp
export TMPDIR=/tmp

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public/uploads
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public/uploads
chmod 664 /var/www/html/database/database.sqlite 2>/dev/null || true

# Run Laravel optimizations
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force || true
fi
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true
php artisan storage:link || true

echo "Starting Apache on port ${PORT}..."
exec apache2-foreground
