FROM php:8.2-apache

RUN apt-get update \
    && apt-get install -y libpq-dev libzip-dev unzip git \
    && docker-php-ext-install pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

WORKDIR /var/www/html/

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar TODO el proyecto
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]

