FROM node:20.2-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

COPY tsconfig.json ./
COPY ./src ./src

COPY scripts ./scripts
RUN npm install --no-save --save-dev \
      typescript \
      @types/node \
      @types/uuid && \
    npx tsc

FROM node:20.2-alpine AS runner
WORKDIR /usr/src/app

RUN apk add --no-cache netcat-openbsd

COPY --from=builder /usr/src/app/dist        ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000

ENTRYPOINT ["sh","-c", "\
  echo \"Waiting for MySQL at $DB_HOST:$DB_PORT...\"; \
  until nc -z $DB_HOST $DB_PORT; do sleep 1; done; \
  echo \"MySQL is up — launching API\"; \
  exec node dist/src/main.js \
"]
