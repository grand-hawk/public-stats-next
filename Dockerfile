# Build layer
FROM node:22 AS build

RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

COPY . /build
WORKDIR /build

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

ARG NODE_ENV_VAR="production"
ENV NODE_ENV=$NODE_ENV_VAR
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone

RUN pnpm run build

# Package layer
FROM node:22-alpine AS package

RUN apk --no-cache add curl

WORKDIR /server

COPY --from=build /build/.next/standalone .
COPY --from=build /build/.next/static .next/static
COPY --from=build /build/generated generated
COPY --from=build /build/public public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
