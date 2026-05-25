FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl openssl-dev libc6-compat

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY prisma ./prisma/

RUN npm install --workspace=apps/api --legacy-peer-deps

COPY apps/api ./apps/api
WORKDIR /app/apps/api

RUN npx prisma generate --schema=../../prisma/schema.prisma
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p uploads

EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main"]
