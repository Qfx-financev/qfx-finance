# QFX Finance Monorepo

QFX Finance is a workspace-based monorepo containing:

- **Client app** (`apps/client`) – end-user finance experience.
- **Admin app** (`apps/admin`) – internal operations and moderation tools.
- **API app** (`apps/api`) – NestJS backend for auth, wallets, investments, crypto, transactions, and admin workflows.
- **Shared packages** (`packages/*`) – shared UI components, types, and utility helpers.

## Tech Stack

- Node.js + npm workspaces
- Next.js (client + admin)
- NestJS (API)
- Prisma (database schema and seeding)
- TypeScript throughout

## Repository Layout

```text
apps/
  api/
  admin/
  client/
packages/
  ui/
  types/
  utils/
prisma/
  schema.prisma
  seed.ts
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment files

Copy each example env file and fill in values:

- `apps/api/apps_api_env.example`
- `apps/admin/apps_admin_env.example`
- `apps/client/apps_client_env.example`

### 3) Validate workspace manifests

Run a quick JSON validation check before local development or CI builds:

```bash
npm run check:manifests
```

### 4) Run apps in development

```bash
npm run dev:api
npm run dev:admin
npm run dev:client
```

## Build

Root build now validates workspace manifests first, then builds all workspaces:

```bash
npm run build
```


## Continuous Integration

A GitHub Actions workflow is included at `.github/workflows/ci.yml` and runs on pushes and pull requests to validate workspace manifests:

```bash
npm install
npm run check:manifests
```

## Notes

- Workspace scripts are defined in the root `package.json`.
- Prisma artifacts are in `/prisma`.
- Nginx configuration is available in `nginx/qfx-finance.conf` for deployment setups.


## Deployment

For VPS production deployment instructions, see `DEPLOYMENT.md`.
