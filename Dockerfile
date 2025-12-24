##
# Production Dockerfile for Nuxt 4 (Node server preset)
##

FROM node:20-alpine AS build
WORKDIR /app

# Install deps (incl. devDeps for build)
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install prod dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy build output
COPY --from=build /app/.output ./.output

# Ensure Nitro binds to container interface
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

