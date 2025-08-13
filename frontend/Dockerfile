# Stage 1: Build the React app
FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json pnpm* ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80