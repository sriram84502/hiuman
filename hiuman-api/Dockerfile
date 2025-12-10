FROM php:8.2-apache

# Install extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable apache rewrite
RUN a2enmod rewrite

# Copy source
COPY . /var/www/html/

# Set permission
RUN chown -R www-data:www-data /var/www/html

# Expose port
EXPOSE 80
