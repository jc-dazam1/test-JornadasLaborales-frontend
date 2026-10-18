# Integration Handoff

## Backend
- Folder: `services/functions/`
- Run: `npm --prefix services/functions start` (Azure Functions Core Tools v4; port 7071)
- Build: `npm --prefix services/functions run build`
- Health: `GET /api/health`
- OpenAPI JSON: `GET /api/openapi.json`; source contract: `services/functions/openapi.yaml`

## Frontend
- Folder: `services/web/`
- Install: `npm --prefix services/web install`
- Build: `npm --prefix services/web run build`
- Dev: `npm --prefix services/web start` (port 4200, host enabled)
- API seam to swap: `services/web/src/app/core/api/index.ts`
- Mock implementation to replace/remove: `services/web/src/app/core/api/mock-api-client.ts`
- Dev state files to remove when wiring live data: `services/web/src/app/core/preview-state.service.ts`, `services/web/src/app/core/preview-state-switcher.component.ts`
- Mock records are currently defined in `mock-api-client.ts`; no separate mock datasets or local duplicate model files exist.
- API interface: `services/web/src/app/core/api/api-client.ts`; current methods: `getDashboard`, `getCalendar`, `getEmployees`, `getHealth`.

## API Inventory
- `GET /` — Angular dashboard SPA view
- `GET /calendar` — Angular calendar SPA view
- `GET /employees` — Angular employee roster SPA view
- `GET /api/health` — `{ status, services }`, HTTP 200 or 503
- `GET /api/openapi.json` — OpenAPI contract (scaffold support endpoint)

The approved plan defines no schedule or employee data API endpoints. Keep those screens mock-backed until the API route contract is expanded; do not invent persistence routes during wiring.

## Database
- Service: PostgreSQL, Essential
- Local: `docker compose up -d postgres`; `DATABASE_URL` in `services/functions/local.settings.json`
- Azure: `AZURE_POSTGRES_HOST`, `AZURE_POSTGRES_DATABASE`, `AZURE_POSTGRES_USER`, optional `AZURE_POSTGRES_PORT`; managed identity token authentication
- Migration tool/directory: choose during integration, under `services/functions/migrations/` or the selected database package convention
- Create migrations only for approved entities; **NO seed data**.

## Shared Types and Services
- Shared package: none created; API and frontend are separately typed because no data routes/contracts were approved.
- Essential service: PostgreSQL (`IDatabaseService`, `LocalPostgresDatabaseService`, `ManagedIdentityPostgresDatabaseService`)
- Enhancement services: none