# Jornadas Laborales

Angular Material workspace for planning labor schedules, reviewing weekly coverage, and maintaining the employee roster. The frontend starts with realistic mock data behind a typed API seam; the Azure Functions API currently provides the PostgreSQL health check.

## Prerequisites

- Node.js 20.19+ or 22.12+, npm, and Azure Functions Core Tools v4
- Docker Compose for local PostgreSQL

## Local setup

1. Copy `.env.example` to `.env` and adjust the local PostgreSQL values if needed.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Install frontend dependencies with `npm --prefix services/web install`.
4. Install API dependencies with `npm --prefix services/functions install`.
5. Start the frontend with `npm --prefix services/web start` and open `http://localhost:4200`.
6. Start the API in a separate terminal with `npm --prefix services/functions start`; its health endpoint is `http://localhost:7071/api/health`.

## Checks

- Frontend production build: `npm --prefix services/web run build`
- Frontend tests: `npm --prefix services/web test`
- API TypeScript build: `npm --prefix services/functions run build`

Local API settings are in `services/functions/local.settings.json` and are ignored by Git. Production PostgreSQL connections use a managed identity token; local development uses `DATABASE_URL`.