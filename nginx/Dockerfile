# syntax=docker/dockerfile:1.7

FROM nginx:stable-alpine

# Remove configs default
RUN rm -f /etc/nginx/conf.d/default.conf

# Copia configs customizadas
COPY conf.d/ /etc/nginx/conf.d/

# Ajusta permissões para configs
RUN chmod -R 644 /etc/nginx/conf.d/*

# Expor portas HTTP e HTTPS
EXPOSE 80 443

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]
