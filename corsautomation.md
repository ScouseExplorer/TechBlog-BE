I want to prepare this Express + PostgreSQL backend for deployment to Google Cloud Run.

Our intended architecture is:
- Local frontend: http://localhost:5173
- Local backend: http://localhost:3000
- Production frontend: Vercel.
- Production backend: Google Cloud Run.
- Future frontend domain: https://www.techblog.com
- Future backend domain: https://api.techblog.com.

Please inspect the existing backend before making changes.

Inspect:
- `src/app.js`
- `src/config/env.js`
- `src/server.js`
- Existing CORS configuration.
- Authentication and cookie configuration.
- Existing environment variable validation.
- `.env.example`
- Relevant tests.

Implementation requirements:

1. CORS
- Preserve the existing CORS allowlist approach.
- Ensure local development supports http://localhost:5173.
- Make it possible to configure the Vercel frontend origin through environment variables.
- Prepare for https://www.techblog.com as the future production origin.
- Do not use unrestricted wildcard origins.
- Check whether credentialed requests are needed based on the existing authentication implementation.

2. Cloud Run readiness
- Inspect the existing TRUST_PROXY implementation.
- Determine whether it needs configuration for Cloud Run.
- Ensure the application listens on the configured PORT.
- Preserve graceful shutdown behaviour.
- Do not make unnecessary changes to server startup.

3. Authentication and cookies
- Inspect how authentication currently works.
- Check cookie Secure, SameSite, HttpOnly and domain settings where applicable.
- Determine whether the future frontend/backend domain arrangement requires changes.
- Preserve existing authentication behaviour unless a change is necessary.
- Explain any recommended changes before implementing them.

4. Environment configuration
- Update `.env.example` only where necessary.
- Keep production secrets outside source control.
- Ensure production configuration can be supplied through Cloud Run environment variables and Secret Manager.
- Never print or expose `.env` values.

5. Testing
- Add or update tests only where necessary to verify the configuration.
- Preserve existing application functionality.

Restrictions:
- Do not rewrite routes, controllers, services or database logic.
- Do not change the PostgreSQL schema.
- Do not introduce Kubernetes or Docker configuration yet.
- Do not modify real secrets or production credentials.
- Do not commit or push anything.

After implementation:
- Run `npm test`.
- Report all files changed.
- Explain the CORS configuration.
- Explain the Cloud Run configuration.
- Explain any authentication or cookie changes.
- Identify anything that still requires manual configuration in Google Cloud.
- Report any issues or recommendations that need my approval.