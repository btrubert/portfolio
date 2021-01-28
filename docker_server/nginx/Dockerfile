FROM nginx:alpine

WORKDIR /var/www

RUN apk add certbot certbot-nginx
COPY crontabs_root /etc/crontabs/root
RUN cp -R benjamintrubert.fr /etc/letsencrypt/live/benjamintrubert.fr

CMD ["nginx"]

EXPOSE 80 443
