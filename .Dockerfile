## Multi-stage build for Nuxt (Nitro) output

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (incl. dev deps for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build Nuxt to `.output/`
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/.output ./.output

# Run as non-root
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nuxtjs
USER nuxtjs

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

