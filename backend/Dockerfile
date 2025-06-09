# Stage 1: Build Stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
#COPY services/ServiceAccountKey.json ./services/ServiceAccountKey.json

RUN npm install --production

COPY . .

# Stage 2: Run Stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

# Security best practices
RUN addgroup app && adduser -S -G app app
USER app

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "index.js"]


# # Use official Node.js LTS image
# FROM node:18

# # Set working directory
# WORKDIR /app

# # Copy package files first
# COPY package*.json ./
# COPY services/ServiceAccountKey.json ./services/ServiceAccountKey.json

# # Install dependencies
# RUN npm install

# # Copy source code
# COPY . .

# # Expose the port
# EXPOSE 5000

# # Run the app
# CMD ["node", "index.js"]
