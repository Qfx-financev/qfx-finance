FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY apps/client/package*.json ./apps/client/

RUN npm install --workspace=apps/client --legacy-peer-deps

COPY apps/client ./apps/client
WORKDIR /app/apps/client

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://api.qfx-finance.com
ENV NEXT_PUBLIC_WS_URL=wss://api.qfx-finance.com
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
RUN mkdir -p ./apps/client/public

EXPOSE 3000
CMD ["node", "apps/client/server.js"]
