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

1. Configure `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `SINGLE_USER_EMAIL`, `SINGLE_USER_PASSWORD_HASH`, and `CORS_ALLOWED_ORIGINS`. Store database credentials and auth secrets in Secret Manager rather than source control.
2. Set `CORS_ALLOWED_ORIGINS` to the exact deployed Vercel origin(s), comma-separated. Add `https://www.techblog.com` when it is live; do not include localhost in production.
3. Configure `TRUST_PROXY` for the Cloud Run ingress path so Express can use the forwarded client IP for rate limiting. Use `1` for direct Cloud Run ingress; adjust for any additional load balancer/proxy hops. Avoid `true` unless all forwarded headers are controlled. Cloud Run supplies `PORT`; the server listens on that value.
4. Rotate secrets before first deploy and after any exposure.
5. Deploy build, then run `npm run db:migrate` once per release.
6. Start app and verify `GET /api/health` returns 200.
7. Verify `GET /api/ready` returns 200 before routing traffic.
8. If deploy fails after migration, roll forward with a fix migration; avoid manual table edits.