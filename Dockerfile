# ============================================================================
# DataFusion AI — Unified Multi-Stage Dockerfile
# Builds individual NestJS microservices using build-args
# ============================================================================

# Stage 1: Build Workspace
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package configurations
COPY package*.json tsconfig*.json ./

# Install workspace dependencies
RUN npm ci

# Copy codebase packages and services
COPY packages/ ./packages/
COPY services/ ./services/

# Build targeted service (e.g. auth-service, user-service)
ARG SERVICE_PATH
RUN npx tsc -p services/${SERVICE_PATH}

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy dependencies and build assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/services/${SERVICE_PATH}/dist/ ./dist/

# Port configurations are injected via env variables at runtime
EXPOSE 3000

ARG START_COMMAND="node dist/services/target/src/main.js"
ENV RUN_CMD=${START_COMMAND}

CMD sh -c "${RUN_CMD}"
