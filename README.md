# TaTTTy

This repository contains the TaTTTy Vite frontend and an Express-based backend API.

## Running the frontend

1. Install dependencies: `npm install`
2. Start the Vite dev server: `npm run dev`

## Running the backend API

The backend lives in `src/server` and can be operated independently from the frontend.

### Local Node runtime

```bash
# Install backend dependencies
npm install --prefix src/server

# Compile TypeScript to dist/
npm run build --prefix src/server

# Start the production build
npm run start --prefix src/server
```

Environment variables are loaded via [`dotenv`](https://github.com/motdotla/dotenv). Create a `src/server/.env` file or export variables before launching the server. At a minimum configure:

- `PORT` (defaults to `3001`)
- `DATABASE_URL` (Neon/PostgreSQL connection string)
- `STACK_PROJECT_ID` and `STACK_SECRET_SERVER_KEY`
- SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, etc.)

Health checks are available at `GET /health` and report API and database availability.

### Docker container

A production-ready container definition is provided in `src/server/Dockerfile`.

```bash
# Build the image from the repository root
docker build -f src/server/Dockerfile -t tattty-api ./src/server

# Run the container with an .env file mounted
docker run --env-file src/server/.env -p 3001:3001 tattty-api
```

The container image compiles the backend to `dist/` and starts it with `node dist/api.js`.

## Automated tests and CI

Smoke tests for OTP flows and database connectivity are implemented with Node's built-in test runner (`src/server/tests`) via `tsx`. Run them locally with:

```bash
npm run test --prefix src/server
```

GitHub Actions (`.github/workflows/ci.yml`) builds the frontend, compiles the backend, and executes the backend test suite on every push and pull request.
