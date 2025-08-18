# syntax=docker/dockerfile:1.7

FROM certbot/certbot:v2.9.2

# Pasta para armazenar certificados
VOLUME ["/etc/letsencrypt"]

# Expose não é necessário, pois certbot é CLI
# CMD padrão apenas mostra ajuda
CMD ["certbot", "--help"]
