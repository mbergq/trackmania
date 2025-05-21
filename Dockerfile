FROM oven/bun:1.2.5 AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/
COPY . /temp/
RUN cd /temp/ && bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /temp/node_modules node_modules
COPY . .
WORKDIR /usr/src/app/
RUN bun run build

FROM base AS release
COPY --from=prerelease /usr/src/app/.output .output

RUN mkdir -p /usr/src/app/data

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", ".output/server/index.mjs" ]
