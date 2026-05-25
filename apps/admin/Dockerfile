FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/

RUN npm install --workspace=apps/admin --legacy-peer-deps

COPY apps/admin ./apps/admin
WORKDIR /app/apps/admin

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/admin/.next/standalone ./
RUN mkdir -p ./apps/admin/.next/static

EXPOSE 3002
CMD ["node", "apps/admin/server.js"]
