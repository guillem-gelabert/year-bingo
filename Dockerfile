# Pinned Node version so Nuxt 4.x + Vite 7.x engine requirements are satisfied.
# (Nuxt requires: ^20.19.0 || >=22.12.0)

FROM node:22.13.1-bookworm-slim AS build
WORKDIR /app

# Install deps first (better layer caching).
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build.
COPY . .
RUN npm run build

# Runtime image
FROM node:22.13.1-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Keep node_modules because runtime script runs `npm run db:migrate` (drizzle-kit).
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/server ./server
COPY --from=build /app/scripts ./scripts

EXPOSE 3000
CMD ["node", "scripts/railway-start.js"]


