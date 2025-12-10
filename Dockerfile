FROM php:8.2-apache

# 1. Install System Deps & Node.js
RUN apt-get update && apt-get install -y \
    supervisor \
    gnupg \
    git \
    unzip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-install pdo pdo_mysql

# 2. Enable Apache Modules (Rewrite & Proxy for WebSockets)
RUN a2enmod rewrite proxy proxy_http proxy_wstunnel

# 3. Setup Working Directory
WORKDIR /var/www

# 4. Copy & Build Frontend (Hiuman Web)
COPY hiuman-web ./hiuman-web
RUN cd hiuman-web && npm install && npm run build

# 5. Setup Backend (Hiuman API)
COPY hiuman-api ./hiuman-api
# Move API to /var/www/html/api
RUN mkdir -p /var/www/html/api && cp -r hiuman-api/api/. /var/www/html/api/
COPY hiuman-api/api/config /var/www/html/api/config
COPY hiuman-api/api/controllers /var/www/html/api/controllers
# Setup root setup scripts if needed, but mainly API inside /api

# 6. Setup Signal Server
COPY hiuman-signal ./hiuman-signal
RUN cd hiuman-signal && npm install

# 7. Move Frontend Build to Web Root
# We want React at root /, API at /api
RUN cp -r hiuman-web/dist/* /var/www/html/

# 8. Configure Apache Site (Reverse Proxy + Rewrite Rules)
# 8. Configure Apache Site (Copy from local file)
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# 9. Fix Permissions (Ensure Apache can read built files)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# 10. Copy Supervisor Config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 11. Start
CMD ["/usr/bin/supervisord"]
