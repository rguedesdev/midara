# syntax=docker/dockerfile:1.7

###########
# 1) Base #
###########
FROM node:20-bookworm-slim AS base

# Ambiente padrão
ENV NODE_ENV=production
WORKDIR /app

################
# 2) Dependências (com dev) para compilar
################
FROM base AS deps

# Dependências para compilar módulos nativos (node-gyp)
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Copiamos só package.json e lock para maximizar cache
COPY package.json package-lock.json* ./

# Instala todas as dependências (incluindo dev, pois precisamos compilar)
RUN --mount=type=cache,target=/root/.npm npm ci

################
# 3) Build (gera dist e pruna dependências)
################
FROM deps AS builder

# Copiamos node_modules do stage deps (incluindo devDependencies)
COPY --from=deps /app/node_modules ./node_modules

# Copiamos o resto do código
COPY . .

# Se tiver TypeScript, compila. Caso não tenha, ignora.
RUN if [ -f tsconfig.json ]; then npx tsc; fi

# Agora removemos devDependencies, mas **mantemos scripts de pós-install** para compilar binários nativos
RUN npm prune --production \
    && mv node_modules /prod_node_modules

################
# 4) Runner (imagem final enxuta)
################
FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Instala dumb-init para lidar bem com sinais no PID 1
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init \
  && rm -rf /var/lib/apt/lists/*

# Variáveis padrão
ENV PORT=5000
ENV HOST=0.0.0.0

# Copiamos apenas o necessário
COPY --from=builder /prod_node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Segurança: roda como usuário não-root
USER node

# Expõe a porta do serviço
EXPOSE 5000

# Healthcheck simples (ajuste /health se precisar)
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||5000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Importante: sua app deve escutar em 0.0.0.0
CMD ["dumb-init", "node", "dist/server.js"]
