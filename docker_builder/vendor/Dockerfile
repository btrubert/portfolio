#Dockerfile
FROM php:fpm-alpine

ENV APP_ENV=prod

WORKDIR /var/www

RUN apk --update --no-cache add git bash
COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN docker-php-ext-install pdo_mysql
RUN mkdir -p public/uploads/original
RUN mkdir -p public/protected/original
CMD composer install --optimize-autoloader --no-dev --no-progress --no-interaction; APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear
