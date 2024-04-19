# Stage 1: Building the app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Stage 2: Run the app
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]