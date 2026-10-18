# Jornadas Laborales

Angular Material workspace for planning labor schedules, reviewing weekly coverage, and maintaining the employee roster. The frontend starts with realistic mock data behind a typed API seam; the Azure Functions API currently provides the PostgreSQL health check.

## Prerequisites

- Node.js 20.19+ or 22.12+, npm, and Azure Functions Core Tools v4
- Docker Compose for local PostgreSQL

## Local setup

1. Copy `.env.example` to `.env`; set `API_BASE_URL` to the backend base URL (for example, `http://localhost:5000/api`) and adjust PostgreSQL values if needed.
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

## Frontend architecture

The Angular source is organized by responsibility under `services/web/src/app/`:

- `domain/` contains framework-independent business models and types.
- `application/ports/` defines contracts; `application/use-cases/` coordinates app actions without depending on Angular or infrastructure.
- `infrastructure/` contains API adapters, Angular DI tokens/providers, and browser-backed preview state.
- `features/` contains each route's page and feature-specific UI.
- `presentation/` contains the app shell, routes, theme, and developer preview controls.
- `shared/ui/` contains reusable UI components shared across features.

Dependencies point inward: features and presentation call application use cases; infrastructure implements application ports and wires dependencies in `app.providers.ts`. Replacing the mock API with a real HTTP adapter should only require changing that provider configuration and implementing the existing `ApiClient` port.

The frontend reads `API_BASE_URL` from the workspace `.env` when starting or building. In development, Angular proxies `/api` to the configured backend to avoid browser CORS restrictions. Production builds use the configured backend URL directly, so that deployment must allow the frontend origin or provide a reverse proxy.