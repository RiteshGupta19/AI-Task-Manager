# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY services/ServiceAccountKey.json ./services/ServiceAccountKey.json

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port
EXPOSE 5000

# Run the app
CMD ["node", "index.js"]
