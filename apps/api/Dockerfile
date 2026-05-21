# ─── Stage 1: Builder ────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY prisma ./prisma/
RUN npm install --workspace=apps/api

COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN npx prisma generate --schema=../../prisma/schema.prisma
RUN npm run build

# ─── Stage 2: Runner ─────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

RUN npm install --only=production
RUN mkdir -p uploads && chown nestjs:nodejs uploads

USER nestjs
EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main"]
