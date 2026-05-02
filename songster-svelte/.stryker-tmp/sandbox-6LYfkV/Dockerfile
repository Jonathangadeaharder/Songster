FROM node:22-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:22-slim
RUN groupadd -r app && useradd -r -g app app
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
RUN chown -R app:app /app
USER app
EXPOSE 3000
CMD ["node", "build"]
