#Dockerfile
FROM node:alpine as builder

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock webpack.config.js ./
COPY assets ./assets

RUN apk --update --no-cache --virtual build-dependencies add yarn python g++ make 

RUN mkdir -p public
RUN NODE_ENV=development yarn install
RUN yarn run build

FROM php:alpine as composer 

ENV APP_ENV=prod

WORKDIR /app

RUN apk --update --no-cache --virtual build-dependencies add git gnupg unzip zip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY composer.lock composer.json ./

RUN composer require symfony/dotenv
RUN composer install --optimize-autoloader --no-dev --no-progress --no-interaction

FROM php:apache

ENV APP_ENV=prod

WORKDIR /app

COPY . /app
COPY --from=builder /app/public/build /app/public/build
COPY --from=composer /app/vendor /app/vendor

RUN curl -sS https://get.symfony.com/cli/installer | bash 
RUN mv /root/.symfony/bin/symfony /usr/local/bin/symfony
RUN mkdir -p var
RUN APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear

CMD ["symfony", "server:start"]
