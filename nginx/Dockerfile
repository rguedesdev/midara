# syntax=docker/dockerfile:1.7

FROM nginx:stable-alpine

# Remove configs default
RUN rm -f /etc/nginx/conf.d/default.conf

# Cria pasta de certificados e webroot para Certbot
RUN mkdir -p /etc/nginx/certs /var/www/certbot \
    && chown -R nginx:nginx /etc/nginx/certs /var/www/certbot \
    && chmod 755 /var/www/certbot \
    && chmod 700 /etc/nginx/certs

# Copia configs customizadas
COPY conf.d/ /etc/nginx/conf.d/

# Ajusta permissões para configs
RUN chmod -R 644 /etc/nginx/conf.d/*

# Expor portas HTTP e HTTPS
EXPOSE 80 443

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]