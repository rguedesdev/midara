# syntax=docker/dockerfile:1.7

###########
# 1) Base #
###########
FROM node:20-bookworm-slim AS base

# Ambiente padrão
ENV NODE_ENV=production
WORKDIR /app

################
# 2) Dependências (com dev para build)
################
FROM base AS deps

# Instala ferramentas básicas para compilar pacotes nativos
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copia apenas os arquivos de dependências para cache
COPY package.json package-lock.json* ./

# Instala todas as dependências (dev incluído para build)
RUN --mount=type=cache,target=/root/.npm npm ci

################
# 3) Build
################
FROM deps AS builder

# Copia o restante do código
COPY . .

# Executa build do Next.js
RUN npm run build

################
# 4) Runner (imagem final enxuta)
################
FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Instala dumb-init para lidar com PID 1 corretamente
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Copia node_modules já prunados da build
COPY --from=builder /app/node_modules ./node_modules

# Copia o build do Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Expõe porta padrão do Next.js
EXPOSE 3000

# Segurança: rodar como usuário não-root
USER node

# Comando para iniciar o Next.js
CMD ["dumb-init", "npm", "start"]
