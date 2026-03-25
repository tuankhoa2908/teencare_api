# Stage 1: Build Application
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/app ./app
COPY --from=builder /app/script ./script
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 8080

CMD ["npm", "start"]
