# TechBlog-BE

Express + PostgreSQL backend for TechBlog.

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Local Setup

1. Copy `.env.example` to `.env` and set values.
2. Install dependencies:
   - `npm ci`
3. Run database migrations:
   - `npm run db:migrate`
4. Seed local data (optional):
   - `npm run db:seed`
5. Start the API:
   - `npm start`

## Health Endpoints

- Liveness: `GET /api/health`
- Readiness (checks DB): `GET /api/ready`

## Admin Article Endpoints

- `GET /api/admin/articles`
- `POST /api/admin/articles`
- `GET /api/admin/articles/:articleId`
- `PATCH /api/admin/articles/:articleId`
- `DELETE /api/admin/articles/:articleId` (soft delete: archives the post)

## Production Runbook (Short)

1. Configure required env vars: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `SINGLE_USER_EMAIL`, `SINGLE_USER_PASSWORD_HASH`, `CORS_ALLOWED_ORIGINS`.
2. Rotate secrets before first deploy and after any exposure.
3. Deploy build, then run `npm run db:migrate` once per release.
4. Start app and verify `GET /api/health` returns 200.
5. Verify `GET /api/ready` returns 200 before routing traffic.
6. If deploy fails after migration, roll forward with a fix migration; avoid manual table edits.