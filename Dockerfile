# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=26.4
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
# Node 26 images no longer bundle corepack, so install it before enabling.
RUN npm install -g corepack@latest && corepack enable


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends python-is-python3 pkg-config build-essential

# Copy application code and install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy remaining application code
COPY . .

# Sentry is disabled at runtime when this is empty, so the DSN has to reach the
# build that Vite inlines it into — not just the deploy command.
ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Download nginx-prometheus-exporter
FROM alpine:3.23 as exporter-download
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

ARG EXPORTER_VERSION=1.5.1
RUN wget -qO- https://github.com/nginxinc/nginx-prometheus-exporter/releases/download/v${EXPORTER_VERSION}/nginx-prometheus-exporter_${EXPORTER_VERSION}_linux_amd64.tar.gz \
    | tar xzf - -C /tmp \
    && chmod +x /tmp/nginx-prometheus-exporter


# Final stage for app image
FROM nginx:1.30-alpine

# Copy exporter binary
COPY --from=exporter-download /tmp/nginx-prometheus-exporter /usr/local/bin/

# Copy nginx configuration
COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/.docker/default.conf /etc/nginx/conf.d/default.conf
COPY .docker/origin-lock.conf.template /etc/nginx/conf.d/origin-lock.conf.template

# Copy startup script
COPY .docker/start.sh /start.sh
RUN chmod +x /start.sh

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080 9113
CMD [ "/start.sh" ]
