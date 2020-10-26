#Dockerfile
FROM php:fpm-alpine

ENV APP_ENV=prod

WORKDIR /var/www

COPY wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it
RUN apk --update --no-cache add git bash
RUN docker-php-ext-install pdo_mysql
CMD wait-for-it database:3306 -- php bin/console doctrine:migrations:migrate --no-interaction; php-fpm

EXPOSE 9000
