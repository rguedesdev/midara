# syntax=docker/dockerfile:1.7

###########
# 1) Base #
###########
FROM node:20-bookworm-slim AS base

ENV NODE_ENV=production
WORKDIR /app

################
# 2) Dependências (com dev) para compilar
################
FROM base AS deps

RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./

# Instala todas as dependências (incluindo dev)
RUN --mount=type=cache,target=/root/.npm npm ci

################
# 3) Build (gera dist e pruna dependências)
################
FROM deps AS builder

COPY . .

# Compila TypeScript explicitamente usando o tsc dentro do node_modules
RUN if [ -f tsconfig.json ]; then ./node_modules/.bin/tsc; fi

# Remove devDependencies e prepara node_modules de produção
RUN npm prune --production \
    && mv node_modules /prod_node_modules

################
# 4) Runner (imagem final enxuta)
################
FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init \
  && rm -rf /var/lib/apt/lists/*

ENV PORT=5000
ENV HOST=0.0.0.0

COPY --from=builder /prod_node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER node
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||5000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["dumb-init", "node", "dist/server.js"]
