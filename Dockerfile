FROM node:lts-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://0.0.0.0:3000/health || exit 1

CMD ["node", "build/index.js"]

LABEL org.opencontainers.image.source=https://github.com/qimiko/lychee-tools
LABEL org.opencontainers.image.description="1.9 GDPS Frontend"
LABEL org.opencontainers.image.licenses=BSD-3-Clause
