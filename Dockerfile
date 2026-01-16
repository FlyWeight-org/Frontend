# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=25
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
RUN npm install -g --force corepack && corepack enable yarn


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential

# Copy application code and install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable

# Copy remaining application code
COPY . .

# Build application
RUN yarn run build

# Remove development dependencies
RUN yarn workspaces focus --production


# Download nginx-prometheus-exporter
FROM alpine:3.19 as exporter-download

ARG EXPORTER_VERSION=1.5.1
RUN wget -qO- https://github.com/nginxinc/nginx-prometheus-exporter/releases/download/v${EXPORTER_VERSION}/nginx-prometheus-exporter_${EXPORTER_VERSION}_linux_amd64.tar.gz \
    | tar xzf - -C /tmp \
    && chmod +x /tmp/nginx-prometheus-exporter


# Final stage for app image
FROM nginx:1.28-alpine

# Copy exporter binary
COPY --from=exporter-download /tmp/nginx-prometheus-exporter /usr/local/bin/

# Copy nginx configuration
COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/default.conf /etc/nginx/conf.d/default.conf

# Copy startup script
COPY .docker/start.sh /start.sh
RUN chmod +x /start.sh

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080 9113
CMD [ "/start.sh" ]
