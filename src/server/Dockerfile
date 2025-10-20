# TaTTTy backend API container
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first to leverage layer caching
COPY package*.json ./
RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY . .
RUN npm run build

# Remove dev dependencies for lean runtime
RUN npm prune --omit=dev

EXPOSE 3001

CMD ["node", "dist/api.js"]
