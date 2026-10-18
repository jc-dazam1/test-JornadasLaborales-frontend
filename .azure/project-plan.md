# Project Plan

**Status**: Awaiting Integration
**Created**: 2026-10-17
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Build a modern Angular frontend for managing and visualizing labor schedules and staff assignments. The project is designed so that every module is independently testable.

**App Type**: Static + API

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | Angular |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| PostgreSQL | Primary data store for labor schedules and employee records | DATABASE_URL | postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/jornadaslab | Essential |

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | Frontend | ❓ | Unknown |
| npm | Frontend | ❓ | Unknown |
| Angular CLI | Frontend | ❓ | Unknown |
| PostgreSQL client tooling | PostgreSQL | ❓ | Unknown |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Docker | Frontend | ❓ | Unknown |
| Docker Compose | Frontend | ❓ | Unknown |
| VS Code extension: Angular.ng-template | Frontend | ❓ | Unknown |
| VS Code extension: ms-vscode.vscode-typescript-next | Frontend | ❓ | Unknown |

> The required tools are derived from the Angular frontend stack and the PostgreSQL dependency. The environment scan confirms Node.js, npm, Azure CLI, and Docker are not presently available in this sandbox, so all runtime and debug prerequisites should be verified before proceeding.

---

## 5. Design System & UI

**Component Library**: Angular Material
**Style Direction**: A crisp operational dashboard with strong hierarchy, rounded cards, and scannable staff and schedule views optimized for daily planning decisions.
**Typography**: Segoe UI Variable

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1E3A8A` | Primary actions, active navigation, and selection states for working-day planning |
| `accent` | `#0cbb81` | Positive status highlights and schedule completions |
| `surface` | `#F8FAFC` | Page and card backgrounds for the dashboard and roster screens |
| `text` | `#0F172A` | Body text and labels throughout the application |
| `muted` | `#64748B` | Secondary text, timestamps, and caption details |
| `border` | `#E2E8F0` | Divider lines, table borders, and form fields |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Dashboard | `/` | Monitor workforce availability, shift coverage, and pending obligations | `header + nav + hero + card-list + table` |
| Calendar | `/calendar` | Review labor schedules by day and week with attendance cues | `header + nav + split(main|sidebar) + table` |
| Employees | `/employees` | Maintain roster details and availability restrictions | `header + nav + card-list + table` |

### Sample Content

```
Dashboard — Jornadas:
| Employee | Shift | Hours | Team | Status |
| Ana García | 08:00–16:00 | 8 | Operaciones | Confirmed |
| Luis Pérez | 09:00–17:00 | 8 | Logística | Confirmed |
| Camila Rojas | 10:00–18:00 | 8 | Atención | Pending |

Calendar — Day view: 17 Oct 2026 · Department: Operaciones
Employees — Employee: Ana García · Position: Supervisor · Availability: Available
```

---

## 6. Project Structure

```
project-root/
├── .azure/
│   ├── project-plan.md
│   └── .preview-temp/
│       ├── theme.css
│       └── manifest.json
├── .editorconfig
├── .gitignore
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── calendar/
│   │   │   └── employees/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── calendar/
│   │   │   └── employees/
│   │   ├── services/
│   │   │   ├── schedule.service.ts
│   │   │   └── employee.service.ts
│   │   └── shared/
│   │       ├── models/
│   │       └── pipes/
│   ├── assets/
│   ├── styles.css
│   └── index.html
├── public/
└── README.md
```

---

## 7. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/` | Dashboard overview with labor coverage and shift status | — | HTML dashboard view | 200 |
| 2 | GET | `/calendar` | Weekly or daily labor calendar view | — | HTML calendar view | 200 |
| 3 | GET | `/employees` | Employee roster and work-status listing | — | HTML employee list | 200 |
| 4 | GET | `/api/health` | Backend health endpoint for future service integration | — | `{ status, services }` | 200, 503 |

---

## 8. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification
