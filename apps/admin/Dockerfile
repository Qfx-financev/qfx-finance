FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/
RUN npm install --workspace=apps/admin

COPY apps/admin ./apps/admin
WORKDIR /app/apps/admin

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./.next/static

USER nextjs
EXPOSE 3002
CMD ["node", "server.js"]
