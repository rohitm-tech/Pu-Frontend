# ── Stage 1: Build the React app ──
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default build-time arg; override at build with --build-arg
ARG VITE_BACKEND_API_URL=https://pu-backend-965239735739.europe-west1.run.app
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:stable-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
