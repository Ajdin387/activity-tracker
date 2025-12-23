# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- run stage ---
FROM nginx:alpine
# SPA + proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# React build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
