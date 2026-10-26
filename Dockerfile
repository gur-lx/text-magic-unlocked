# syntax=docker/dockerfile:1

# ---- Build stage ----
# TanStack Start app built with Bun + Vite.
FROM oven/bun:1 AS build
WORKDIR /app

# Install dependencies first to leverage Docker layer caching.
# Note: bunfig.toml's minimumReleaseAge guard can shift resolution vs. the
# committed lockfile, so we don't use --frozen-lockfile here.
COPY package.json bun.lock bunfig.toml ./
RUN bun install --no-frozen-lockfile

# Copy the rest of the source and build the SSR bundle (dist/client + dist/server).
COPY . .
RUN bun run build

# ---- Runtime stage ----
FROM oven/bun:1-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# srvx binds to this port; override with -e PORT=... at runtime if needed.
ENV PORT=3000

# srvx reads the start script from package.json.
COPY package.json ./

# Reuse the dependencies already resolved in the build stage. (Bun's
# --production flag re-enables frozen-lockfile, which conflicts with the
# minimumReleaseAge guard, so we copy node_modules instead of reinstalling.)
COPY --from=build /app/node_modules ./node_modules

# Copy the compiled output from the build stage.
COPY --from=build /app/dist ./dist

# Run as the non-root user that the base image provides.
USER bun

EXPOSE 3000

# The "start" script runs srvx against the built server + static client.
CMD ["bun", "run", "start"]
