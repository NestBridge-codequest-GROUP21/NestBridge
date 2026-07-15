# NestBridge — Demo mode vs production

Use this guide for **CodeQuest judging** and for **turning demo off** before real users.

---

## Demo mode (current default)

Demo mode is **ON** when:

```env
EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=true
```

(`preview` and `development` EAS profiles set this automatically.)

### What demo mode does

1. **Quick-login tiles** on **Welcome**, **Login**, and **Register** — four roles in a 2×2 grid.
2. **One-tap sign-in** as seeded backend users (password: `password`).
3. **Auto profile setup** — intent, seeker profile, and home route are applied so you skip onboarding gates.
4. **Live API first** — bookings, payments, calendar edits, reviews, etc. hit the real backend when it is running.
5. **Demo data fills gaps** — if the API returns fewer rows than the prototype, Ghana mock content is **merged in** so screens stay full for judges.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `akosua.demo@nestbridge.app` | `password` |
| Tourist | `zara.tourist@nestbridge.app` | `password` |
| Host | `abena.host@nestbridge.app` | `password` |
| Guide | `kofi.guide@nestbridge.app` | `password` |

All `@nestbridge.app` accounts are **email-pre-verified** in the database.

### Requirements for “full” demo

- Backend running (`backend` → `.\mvnw.cmd spring-boot:run`)
- PostgreSQL + Redis with Flyway seeds applied
- Mobile app `API_BASE_URL` pointing at your machine IP or Railway URL

Without the backend, quick-login fails with a clear error.

---

## Turn demo OFF for production

### Mobile app (one switch)

In `frontend/eas.json`, **production** profile already has:

```json
"EXPO_PUBLIC_ENABLE_DEMO_FALLBACK": "false"
```

That single flag disables:

- Welcome / Login / Register quick-login tiles
- Mock data merge on empty API responses

Build with:

```bash
cd frontend
eas build --profile production --platform android
```

### Optional cleanup later

| Item | Location |
|------|----------|
| Demo quick-login component | `frontend/src/components/DemoActorQuickLogin.tsx` |
| Demo accounts list | `frontend/src/data/demoAccounts.ts` |
| Dev Testing screen | Profile → Dev Testing (internal QA only) |
| Demo fallback helper | `frontend/src/utils/demoLiveMerge.ts` |
| Backend seed users | `V4` / host / guide seed migrations |

You do **not** need to delete these for launch — setting the env flag to `false` is enough.

---

## Your production checklist (work only you can do)

These need **accounts, keys, and deployment** — not more app code.

### 1. Deploy backend (Railway) — required

- [ ] Create Railway project from GitHub (`backend` root)
- [ ] Add PostgreSQL + Redis
- [ ] Set env vars: `SPRING_PROFILES_ACTIVE=prod`, `DB_*`, `REDIS_*`, `JWT_SECRET`, `APP_PUBLIC_URL`, `CORS_ALLOWED_ORIGINS`
- [ ] Confirm `https://YOUR-URL/actuator/health` returns `UP`

See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) Step 1.

### 2. Email verification (SendGrid) — required for new signups

- [ ] SendGrid account + verified sender
- [ ] Railway: `SENDGRID_API_KEY`, `EMAIL_FROM`, `EMAIL_VERIFICATION_ENABLED=true`

### 3. Payments (Paystack live) — required for real money

- [ ] Paystack business verification
- [ ] Railway: `PAYSTACK_ENABLED=true`, `PAYSTACK_SECRET_KEY`
- [ ] Webhook: `https://YOUR-URL/api/webhooks/paystack` → `charge.success`

### 4. Identity verification (Smile Identity) — required for host/guide KYC

- [ ] Smile sandbox (then production) credentials
- [ ] Railway: `SMILE_ENABLED`, `SMILE_PARTNER_ID`, `SMILE_API_KEY`, `SMILE_CALLBACK_URL`

### 5. Profile photos (AWS S3) — recommended

- [ ] S3 bucket + IAM keys
- [ ] Railway: `AWS_S3_ENABLED=true`, bucket, region, keys, `AWS_S3_PUBLIC_BASE_URL`

### 6. Push notifications — recommended

- [ ] EAS project + `expo-notifications` (already in app)
- [ ] Physical device for push testing

### 7. Firebase live chat — optional

- [ ] Firebase RTDB project
- [ ] Railway: `FIREBASE_ENABLED=true`, `FIREBASE_CREDENTIALS_JSON`, `FIREBASE_DATABASE_URL`
- [ ] EAS secrets: `EXPO_PUBLIC_FIREBASE_*`

### 8. Safety alerts — optional

- [ ] Railway: `SUPPORT_ALERT_EMAIL` + SendGrid (SOS + flagged welfare emails)

### 9. Mobile builds (EAS)

- [ ] `eas login` + project linked
- [ ] EAS secret: `API_BASE_URL` = Railway URL (no trailing slash)
- [ ] **Judges:** `eas build --profile preview` (`EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=true`)
- [ ] **Real users:** `eas build --profile production` (`EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false`)

### 10. Before public launch

- [ ] Turn demo fallback **off** (production EAS profile)
- [ ] Remove or hide Dev Testing entry from Profile if desired
- [ ] Test full loop: register → verify email → book → pay → review
- [ ] Decide whether to keep or remove seeded `@nestbridge.app` users in production DB

---

## Quick test flow (team)

1. Start backend + `npx expo start` in `frontend`
2. Open app → **Welcome** → tap **Host** demo tile
3. Calendar → block a day → see “Calendar saved”
4. Sign out → tap **Student** → search hosts → book → pay (mock if Paystack off)
5. Sign in as **Host** → accept request

For the full checklist, see the testing section in the prior team handoff or run each role from the Welcome screen.
