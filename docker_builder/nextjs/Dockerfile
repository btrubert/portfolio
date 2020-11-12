FROM node:alpine

ENV NODE_ENV=production

WORKDIR /var/www

RUN apk --update --no-cache --virtual build-dependencies add yarn python g++ make
RUN mkdir -p public

CMD NODE_ENV=development yarn install

