# NestBridge — Production deployment

This guide covers Phase 1 (hosted backend + security) and Phase 2 (email verification) implemented in the codebase.

## Architecture

- **Backend:** Spring Boot JAR in Docker (`backend/Dockerfile`)
- **Database:** PostgreSQL 15 (managed)
- **Cache:** Redis 7 (JWT refresh tokens, match cache)
- **Email:** SendGrid (verification links)
- **Mobile:** Expo app → `expo.extra.apiBaseUrl` in production

## 1. Local development

```bash
cd backend
docker compose up -d
./mvnw spring-boot:run
```

```bash
cd frontend
npx expo start
```

**Email verification without SendGrid:** When `SENDGRID_API_KEY` is empty, the backend logs the verification URL:

```
WARN ... verification link for user@example.com: http://localhost:8080/api/auth/verify-email?token=...
```

Open that URL in a browser, then sign in from the app.

**Demo accounts** (`*@nestbridge.app`, password `password`) are pre-verified via Flyway `V14`.

## 2. Deploy backend (Railway / Render)

### Build

From `backend/`:

```bash
docker build -t nestbridge-api .
```

### Required environment variables

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | JDBC URL to managed Postgres |
| `DB_USER` / `DB_PASSWORD` | Database credentials |
| `REDIS_HOST` / `REDIS_PORT` | Managed Redis |
| `JWT_SECRET` | Random 256-bit+ secret |
| `APP_PUBLIC_URL` | Public HTTPS API URL (used in verification emails) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |
| `SENDGRID_API_KEY` | SendGrid API key |
| `EMAIL_FROM` | Verified sender address |
| `EMAIL_VERIFICATION_ENABLED` | `true` in production |
| `ADMIN_EMAIL_ALLOWLIST` | Comma-separated emails that get `is_staff=true` at registration (defaults to the three group emails if unset) |

Flyway runs automatically on startup.

### Render example

1. New **Web Service** → Docker, root `backend/`
2. Add **PostgreSQL** and **Redis** add-ons (or external URLs)
3. Set env vars above
4. Health check path: `/actuator/health`

### Railway example

1. New project → deploy from `backend/Dockerfile`
2. Add Postgres + Redis plugins
3. Map plugin env vars to `DB_*` and `REDIS_*`
4. Generate domain → set `APP_PUBLIC_URL`

## 3. SendGrid setup

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify sender domain or single sender (`EMAIL_FROM`)
3. Create API key with **Mail Send** permission
4. Set `SENDGRID_API_KEY` on the backend

Verification link format:

```
{APP_PUBLIC_URL}/api/auth/verify-email?token={token}
```

## 4. Mobile production build (EAS)

1. Install EAS CLI: `npm i -g eas-cli`
2. In `frontend/`, run `eas build:configure`
3. Set production API URL in `app.json` → `extra.apiBaseUrl` or EAS env
4. Build: `eas build --platform all --profile production`

## 5. Security features enabled

- **CORS:** Restricted via `CORS_ALLOWED_ORIGINS` in production
- **Rate limits:** Auth endpoints (`/login`, `/register`, `/resend-verification`) — per IP
- **Public profiles:** Email removed from `GET /api/users/{id}`
- **Booking gates:** Server enforces email verified + profile completion
- **Email verification:** Required before login (demo seeds exempt)

## 6. API changes

| Endpoint | Change |
|----------|--------|
| `POST /api/auth/register` | Returns `{ email, displayName, requiresEmailVerification }` — no JWT until verified |
| `POST /api/auth/login` | 403 if email not verified |
| `GET /api/auth/verify-email?token=` | HTML confirmation page |
| `POST /api/auth/resend-verification` | Resend link `{ email }` |

## 6. Paystack (production payments)

1. Create a [Paystack](https://paystack.com) account (Ghana)
2. Set `PAYSTACK_ENABLED=true` and `PAYSTACK_SECRET_KEY` on the backend
3. Configure webhook URL: `{APP_PUBLIC_URL}/api/webhooks/paystack`
4. Without Paystack, **Pay now** keeps using mock confirm (unchanged dev UX)

## 7. Push notifications

- Backend stores Expo push tokens and sends on booking events
- App registers silently after sign-in (no new screens)
- Tab badges use `GET /api/notifications/unread-count` with mock fallback
- Production requires **EAS Build** (`frontend/eas.json`) — not Expo Go

## 8. S3 profile photos (optional)

Set `AWS_S3_ENABLED=true` and bucket credentials. Without S3, profile photos stay local (same as before).

## Next phases (not yet implemented)

- Real KYC provider
- Firebase production config
- Dedicated notifications inbox screen (would need your approval — new UI)
