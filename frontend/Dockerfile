# ── Stage 1: Build ────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_HOST=""
ARG VITE_API_BASE_PATH="/api"

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────
FROM nginx:alpine

ARG NGINX_CONF=nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
