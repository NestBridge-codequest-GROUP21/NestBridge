# NestBridge — Production setup (plain English)

This guide is for **Group 21 / CodeQuest** and your first real deployment. You do **not** need to understand code — follow the checklist and paste keys where indicated.

## What “API keys” mean

Services like Paystack, SendGrid, and Smile Identity give you **secret passwords** (API keys) so your server can talk to them securely. You create free/paid accounts, copy the keys once, and paste them into **Railway** (your cloud host). Never commit keys to GitHub.

---

## Step 1 — Deploy backend on Railway (~30 min)

1. Create account at [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub** → select `nestbridge` repo
3. Set **Root Directory** to `backend`
4. Add services:
   - **PostgreSQL** (click Add → Database → PostgreSQL)
   - **Redis** (Add → Database → Redis)
5. Click your **backend service** → **Variables** → add:

| Variable | Where to get it |
|----------|-----------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | PostgreSQL service → Connect → JDBC URL |
| `DB_USER` | From Postgres credentials |
| `DB_PASSWORD` | From Postgres credentials |
| `REDIS_HOST` | Redis service → hostname |
| `REDIS_PORT` | `6379` |
| `JWT_SECRET` | Generate: random 40+ character string |
| `APP_PUBLIC_URL` | Railway → backend service → **Settings → Domains** (e.g. `https://nestbridge-api.up.railway.app`) |
| `CORS_ALLOWED_ORIGINS` | Same URL as above |

6. Deploy. Wait until **Deployments** shows success.
7. Open `https://YOUR-RAILWAY-URL/actuator/health` — should return `{"status":"UP"}`

**Save your Railway API URL** — you need it for the mobile app.

---

## Step 2 — Email verification (SendGrid)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. **Settings → Sender Authentication** → verify single sender or domain
3. **Settings → API Keys** → Create → Mail Send only
4. Add to Railway variables:
   - `SENDGRID_API_KEY` = your key
   - `EMAIL_FROM` = verified sender email (e.g. `noreply@yourdomain.com`)
   - `EMAIL_FROM_NAME` = `NestBridge`
   - `EMAIL_VERIFICATION_ENABLED` = `true`

New users receive a verification link. Demo accounts (`*@nestbridge.app`) are pre-verified.

---

## Step 3 — Payments (Paystack live — Ghana)

1. Sign up at [paystack.com](https://paystack.com) → complete business verification
2. **Settings → API Keys & Webhooks**
3. Copy **Live Secret Key**
4. Add to Railway:
   - `PAYSTACK_ENABLED` = `true`
   - `PAYSTACK_SECRET_KEY` = live secret key
5. Set webhook URL: `https://YOUR-RAILWAY-URL/api/webhooks/paystack`
6. Enable `charge.success` event

**Pay now** in the app opens Paystack checkout. Without keys, dev mode uses mock payment.

---

## Step 4 — Identity verification (Smile Identity sandbox)

1. Sign up at [usesmileid.com](https://usesmileid.com)
2. Dashboard → **API Keys** → copy Partner ID and API Key
3. Add to Railway:
   - `SMILE_ENABLED` = `true`
   - `SMILE_PARTNER_ID` = your partner ID
   - `SMILE_API_KEY` = your API key
   - `SMILE_CALLBACK_URL` = `https://YOUR-RAILWAY-URL/api/webhooks/smile`
   - `SMILE_ENVIRONMENT` = `sandbox` (switch to `production` when approved)

Hosts/guides tap **Verify now** on KYC screen → Smile opens in browser.

Without Smile keys, verify-now marks identity verified for local testing only.

---

## Step 5 — Profile photos (AWS S3)

1. AWS account → S3 → create bucket `nestbridge-uploads` (region e.g. `eu-west-1`)
2. IAM user with S3 PutObject permission → access key + secret
3. Add to Railway:
   - `AWS_S3_ENABLED` = `true`
   - `AWS_S3_BUCKET` = bucket name
   - `AWS_S3_REGION` = region
   - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_PUBLIC_BASE_URL` = `https://YOUR-BUCKET.s3.REGION.amazonaws.com` (or CloudFront URL)

Without S3, photos stay on device only (same as before).

---

## Step 6 — Firebase live chat (optional)

1. [Firebase Console](https://console.firebase.google.com) → new project
2. Enable **Realtime Database** (not Firestore)
3. Add Web app → copy config values
4. Railway:
   - `FIREBASE_ENABLED` = `true`
   - `FIREBASE_DATABASE_URL` = your RTDB URL
   - Upload service account JSON → set `FIREBASE_CREDENTIALS_PATH` or paste JSON as env (Railway secret)
5. EAS build env (Step 7):
   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_DATABASE_URL`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`

---

## Step 7 — Build mobile app (EAS — team/demo)

1. Install: `npm i -g eas-cli`
2. `cd frontend` → `eas login` → `eas build:configure`
3. In [expo.dev](https://expo.dev) → project → **Secrets**, set:
   - `API_BASE_URL` = your Railway URL (no trailing slash)
   - For **preview** (judges): `EXPO_PUBLIC_ENABLE_DEMO_FALLBACK` = `true`
   - For **production** (real users later): `EXPO_PUBLIC_ENABLE_DEMO_FALLBACK` = `false`
4. Build for judges:
   ```bash
   eas build --profile preview --platform android
   ```
   (iOS needs Apple Developer account)

Share the install link Expo provides with judges.

---

## Demo data vs real production

| Build profile | Demo fallback | Use case |
|---------------|---------------|----------|
| `preview` / `development` | ON | CodeQuest judges — screens stay full |
| `production` | OFF | Real users — empty states when no data |

Toggle without code changes: set `EXPO_PUBLIC_ENABLE_DEMO_FALLBACK` in EAS secrets.

---

## Quick test checklist

- [ ] Health URL returns UP
- [ ] Register new email → verification link (check SendGrid or server logs)
- [ ] Demo login `akosua.demo@nestbridge.app` / `password`
- [ ] Book → accept → Pay now (Paystack or mock)
- [ ] Notification bell → inbox list
- [ ] Host KYC → Smile link opens

---

## Who to ask for help

| Topic | Resource |
|-------|----------|
| Railway deploy | [docs.railway.app](https://docs.railway.app) |
| Paystack Ghana | [paystack.com/docs](https://paystack.com/docs) |
| Smile ID | [docs.usesmileid.com](https://docs.usesmileid.com) |
| EAS builds | [docs.expo.dev/build](https://docs.expo.dev/build/introduction/) |

Technical detail: see `docs/DEPLOYMENT.md`.
