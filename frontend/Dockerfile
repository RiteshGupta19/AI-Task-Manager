# Stage 1: Build
FROM node:18-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install --production && npm cache clean --force

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




# # Build Stage
# FROM node:18 as build

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# # Production Stage (using NGINX)
# FROM nginx:alpine

# # Copy built assets from previous stage
# COPY --from=build /app/dist /usr/share/nginx/html

# # Optional: custom nginx config for history mode routing (SPA)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
