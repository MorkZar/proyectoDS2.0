FROM php:8.2-apache

RUN apt-get update \
    && apt-get install -y libpq-dev libzip-dev unzip git \
    && docker-php-ext-install pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

WORKDIR /var/www/html

# Copiar Composer desde imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar dependencias primero (cache)
COPY composer.json composer.lock ./

RUN composer install --no-dev --optimize-autoloader

# Copiar resto del proyecto
COPY . .

# Permisos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]

