# Build layer
FROM node:25 AS build

RUN npm install -g pnpm@10

COPY . /build
WORKDIR /build

ARG DATA_ENV="production"
ENV DATA_ENV=$DATA_ENV

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

ARG NODE_ENV="production"
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone

RUN pnpm run generate && pnpm run build

# Package layer
FROM node:25-alpine AS package

RUN apk --no-cache add curl

WORKDIR /server

COPY --from=build /build/.next/standalone .
COPY --from=build /build/.next/static .next/static
COPY --from=build /build/generated generated
COPY --from=build /build/public public
COPY --from=build /build/content content
COPY --from=build /build/src/images.js src/images.js

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
