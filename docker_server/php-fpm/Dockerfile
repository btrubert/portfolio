#Dockerfile
FROM php:fpm-alpine

WORKDIR /var/www

COPY wait-for-it.sh /usr/bin/wait-for-it
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY php.ini "$PHP_INI_DIR/conf.d/uploads.ini"
RUN chmod +x /usr/bin/wait-for-it
RUN apk --update --no-cache add git bash 
RUN docker-php-ext-install pdo_mysql exif
RUN apk add --no-cache \
      freetype \
      libjpeg-turbo \
      libpng \
      libwebp \
      freetype-dev \
      libjpeg-turbo-dev \
      libpng-dev \
      libwebp-dev \
    && docker-php-ext-configure gd \
      --with-freetype=/usr/include/ \
      --with-jpeg=/usr/include/ \
      --with-webp=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-enable gd \
    && apk del --no-cache \
      freetype-dev \
      libjpeg-turbo-dev \
      libpng-dev \
      libwebp-dev \
    && rm -rf /tmp/* 
CMD wait-for-it database:3306 -- php bin/console doctrine:migrations:migrate --no-interaction; php bin/console cache:clear; php bin/console app:create-admin; php-fpm

EXPOSE 9000
