#Dockerfile
FROM php:fpm-alpine

ENV APP_ENV=prod

WORKDIR /var/www

RUN apk --update --no-cache add git bash
COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN docker-php-ext-install pdo_mysql
RUN composer require symfony/framework-bundle && composer require symfony/dotenv;
CMD composer install --optimize-autoloader --no-dev --no-progress --no-interaction; APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear;
