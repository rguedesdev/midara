FROM nginx:stable-alpine

# Remove configs default
RUN rm -f /etc/nginx/conf.d/default.conf

# Copia configs customizadas
COPY conf.d/ /etc/nginx/conf.d/

# Copia certificados SSL
COPY certs/ /etc/nginx/certs/

# Ajusta permissões (Nginx precisa ler os arquivos)
RUN chmod 600 /etc/nginx/certs/*

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
