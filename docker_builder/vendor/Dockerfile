#Dockerfile
FROM php:7.4.13-fpm-alpine

ENV APP_ENV=prod

WORKDIR /var/www

RUN apk --update --no-cache add git bash
COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN docker-php-ext-install pdo_mysql
CMD mkdir -p public/uploads/original; mkdir -p public/protected/original; composer install --optimize-autoloader --no-dev --no-progress --no-interaction; APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear
