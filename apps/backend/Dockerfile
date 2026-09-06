# --- Build stage --------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /repo

# Install workspace dependencies (root + backend + shared packages)
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend
RUN npm ci

RUN npx prisma generate --schema apps/backend/prisma/schema.prisma
RUN npm run build --workspace @brandcraft/types \
 && npm run build --workspace @brandcraft/validation \
 && npm run build --workspace @brandcraft/backend

# --- Runtime stage -----------------------------------------------------------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages ./packages
COPY --from=builder /repo/apps/backend/dist ./dist
COPY --from=builder /repo/apps/backend/package.json ./package.json
COPY --from=builder /repo/apps/backend/prisma ./prisma

EXPOSE 4000
CMD ["node", "dist/main.js"]
