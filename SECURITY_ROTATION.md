# Security Rotation Runbook

This project uses a single-user authentication model with env-based secrets.

## Current Required Secrets

- `JWT_SECRET`
- `SINGLE_USER_EMAIL`
- `SINGLE_USER_PASSWORD_HASH`

## Rotation Cadence

- Rotate `JWT_SECRET` every 30 days or immediately after suspected exposure.
- Rotate account password every 30 to 90 days.
- Rotate both immediately after team/offboarding changes.

## How to Rotate Password Hash

1. Generate a new hash from the project root:

```powershell
Push-Location "c:\Users\akinl\TechBlog-BE\TechBlog"
node -e "import('bcryptjs').then((m)=>console.log(m.default.hashSync('NEW_PASSWORD_HERE', 12)))"
Pop-Location
```

2. Set the output as `SINGLE_USER_PASSWORD_HASH` in your deployment environment.
3. Restart the application.
4. Validate login with the new password and ensure old password fails.

## How to Rotate JWT Secret

1. Generate a long random secret (at least 32 bytes entropy).
2. Replace `JWT_SECRET` in your deployment environment.
3. Restart the application.
4. All existing JWTs become invalid; users must log in again.

## Deployment Checklist

- Never commit `.env` with real secrets.
- Keep `.env.example` as placeholders only.
- Ensure logs do not print env values or raw credentials.
- Keep auth rate limit enabled (`AUTH_RATE_LIMIT_WINDOW_MS`, `AUTH_RATE_LIMIT_MAX`).
