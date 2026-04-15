FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN rm -f tsconfig.tsbuildinfo && rm -rf dist && \
    echo "=== src contents ===" && ls -la src && \
    echo "=== running tsc directly ===" && npx tsc -p tsconfig.json && \
    echo "=== dist contents ===" && ls -la dist && \
    test -f dist/main.js

RUN npm prune --omit=dev

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
