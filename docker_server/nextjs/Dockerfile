FROM node:alpine

ENV NODE_ENV=production

WORKDIR /var/www

COPY wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it
RUN apk --update --no-cache --virtual build-dependencies add yarn python g++ make bash

CMD wait-for-it php-fpm:9000 -- yarn next build; yarn next start

EXPOSE 3000
