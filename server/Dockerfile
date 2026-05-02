FROM node:20-alpine AS deps

WORKDIR /app

# Copy manifests first for layer-cache efficiency
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

FROM node:20-alpine AS runner

# Set NODE_ENV so no dev tooling sneaks in
ENV NODE_ENV=production

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src ./src
COPY package.json ./

# Switch to non-root user
USER appuser

EXPOSE 5000

# Use the "start" script (node src/index.js) — not nodemon — in production
CMD ["node", "src/index.js"]
