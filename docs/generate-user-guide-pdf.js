/**
 * NestBridge Complete User & Technical Guide PDF generator
 * Run: node docs/generate-user-guide-pdf.js
 */
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'NestBridge_Complete_User_and_Technical_Guide.pdf');

const doc = new PDFDocument({
  size: 'A4',
  bufferPages: true,
  margins: { top: 56, bottom: 64, left: 56, right: 56 },
  info: {
    Title: 'NestBridge — Complete User & Technical Guide',
    Author: 'Group 21 — CodeQuest 2026',
    Subject: 'User guide, tech stack, run commands, and judge Q&A',
  },
});

const stream = fs.createWriteStream(OUT);
doc.pipe(stream);

const MARGIN = 56;
const CONTENT_W = doc.page.width - MARGIN * 2;
const BOTTOM = () => doc.page.height - 64;

function ensureSpace(needed) {
  if (doc.y + needed > BOTTOM()) {
    doc.addPage();
  }
}

function h1(text) {
  ensureSpace(50);
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(16).fillColor('#0f3d4c').text(text, { width: CONTENT_W });
  const y = doc.y + 2;
  doc.strokeColor('#14b8a6').lineWidth(1.5).moveTo(MARGIN, y).lineTo(MARGIN + 72, y).stroke();
  doc.moveDown(0.6);
}

function h2(text) {
  ensureSpace(36);
  doc.moveDown(0.35);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f766e').text(text, { width: CONTENT_W });
  doc.moveDown(0.2);
}

function h3(text) {
  ensureSpace(28);
  doc.moveDown(0.2);
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#134e4a').text(text, { width: CONTENT_W });
  doc.moveDown(0.12);
}

function p(text) {
  ensureSpace(32);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1e293b').text(text, {
    width: CONTENT_W,
    align: 'justify',
    lineGap: 1.5,
  });
  doc.moveDown(0.3);
}

function bullet(text) {
  ensureSpace(22);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1e293b').text(`•  ${text}`, {
    width: CONTENT_W,
    indent: 6,
    lineGap: 1,
  });
  doc.moveDown(0.12);
}

function codeBlock(lines) {
  const text = Array.isArray(lines) ? lines.join('\n') : String(lines);
  const fontSize = 8;
  doc.font('Courier').fontSize(fontSize);
  const textH = doc.heightOfString(text, { width: CONTENT_W - 16, lineGap: 1 });
  const boxH = Math.min(textH + 12, BOTTOM() - doc.y - 8);
  ensureSpace(Math.min(boxH + 4, 120));
  const startY = doc.y;
  const h = doc.heightOfString(text, { width: CONTENT_W - 16, lineGap: 1 }) + 12;
  if (startY + h > BOTTOM()) {
    doc.addPage();
  }
  const y0 = doc.y;
  const finalH = doc.heightOfString(text, { width: CONTENT_W - 16, lineGap: 1 }) + 12;
  doc.save();
  doc.roundedRect(MARGIN, y0, CONTENT_W, finalH, 3).fill('#0f172a');
  doc.fillColor('#e2e8f0').font('Courier').fontSize(fontSize)
    .text(text, MARGIN + 8, y0 + 6, { width: CONTENT_W - 16, lineGap: 1 });
  doc.restore();
  doc.y = y0 + finalH + 6;
}

function simpleTable(headers, rows, widths) {
  const rowH = 16;
  const totalW = widths.reduce((a, b) => a + b, 0);
  ensureSpace(rowH * 2);

  const drawHeader = () => {
    let x = MARGIN;
    const y = doc.y;
    doc.rect(x, y, totalW, rowH).fill('#0f766e');
    headers.forEach((h, i) => {
      doc.fillColor('#fff').font('Helvetica-Bold').fontSize(7.5)
        .text(h, x + 3, y + 4, { width: widths[i] - 6, ellipsis: true });
      x += widths[i];
    });
    doc.y = y + rowH;
  };

  drawHeader();

  rows.forEach((row, ri) => {
    if (doc.y + rowH > BOTTOM()) {
      doc.addPage();
      drawHeader();
    }
    let x = MARGIN;
    const y = doc.y;
    doc.rect(x, y, totalW, rowH).fill(ri % 2 === 0 ? '#f1f5f9' : '#ffffff');
    row.forEach((cell, i) => {
      doc.fillColor('#1e293b').font('Helvetica').fontSize(7.5)
        .text(String(cell), x + 3, y + 4, { width: widths[i] - 6, ellipsis: true });
      x += widths[i];
    });
    doc.y = y + rowH;
  });
  doc.moveDown(0.4);
}

function qa(q, a) {
  ensureSpace(55);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f3d4c').text(`Q: ${q}`, { width: CONTENT_W });
  doc.moveDown(0.1);
  doc.font('Helvetica').fontSize(9).fillColor('#334155').text(`A: ${a}`, { width: CONTENT_W, lineGap: 1.5 });
  doc.moveDown(0.35);
}

// ─── COVER ───
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f3d4c');
doc.fillColor('#14b8a6').font('Helvetica-Bold').fontSize(11)
  .text('GROUP 21  ·  CODEQUEST 2026', MARGIN, 180, { width: CONTENT_W, align: 'center' });
doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(30)
  .text('NestBridge', MARGIN, 210, { width: CONTENT_W, align: 'center' });
doc.fillColor('#99f6e4').font('Helvetica').fontSize(13)
  .text('Complete User & Technical Guide', MARGIN, 255, { width: CONTENT_W, align: 'center' });
doc.fillColor('#cbd5e1').font('Helvetica').fontSize(10)
  .text('How to use the app  ·  How it was built  ·  Tech stack\nRun commands  ·  Architecture  ·  Judge Q&A', MARGIN, 290, {
    width: CONTENT_W,
    align: 'center',
    lineGap: 3,
  });
doc.fillColor('#94a3b8').font('Helvetica').fontSize(9)
  .text('Culturally intelligent pairing for students, hosts, guides & tourists\nPrototype: mellow-blini-a42359.netlify.app  ·  July 2026', MARGIN, 380, {
    width: CONTENT_W,
    align: 'center',
    lineGap: 3,
  });

// ─── TOC ───
doc.addPage();
h1('Table of Contents');
[
  '1. What NestBridge Is',
  '2. End-User Guide (How to Use the App)',
  '3. Demo Accounts for Judges',
  '4. How the App Was Created',
  '5. Prescribed Tech Stack & Why Each Piece',
  '6. Architecture — How Front, Back & DB Connect',
  '7. Exact Build & Run Commands',
  '8. Matching Algorithm (Deep Dive)',
  '9. Auth, Booking, Payments, SOS, Chat',
  '10. Database & Migrations',
  '11. Key API Endpoints',
  '12. Project Folder Map',
  '13. Design System & UX Rules',
  '14. Judge Q&A — Prove You Built This',
  '15. Troubleshooting',
  'Appendix A–C',
].forEach(bullet);

// ─── 1 ───
doc.addPage();
h1('1. What NestBridge Is');
p('NestBridge is a culturally intelligent pairing platform that connects international students with host families, and tourists with local guides and lodging — in one shared account model.');
p('Built by Group 21 for CodeQuest 2026. Finding a stay or guide should feel like cultural fit, not just a hotel search. Matching considers language, diet, lifestyle, budget, proximity, cultural affinity, and trust.');
h2('Who it is for');
simpleTable(
  ['Primary intent', 'Home focus', 'Also can'],
  [
    ['STUDENT', 'Book host families', 'Book guides; browse lodging'],
    ['TOURIST', 'Guides + lodging explore', 'Book homestays'],
    ['HOST', 'Incoming stay requests', 'Travel: book guides/stays'],
    ['GUIDE', 'Incoming session requests', 'Travel: book stays/guides'],
    ['Staff / Admin', 'Moderation tools', 'Suspend, KYC flags, audits'],
  ],
  [90, 150, 200],
);
p('One person = one account. Primary intent only personalizes the home screen. Students cannot enable host listing (hard exclusion). Other services are additive via Account Setup tracks (travel / host / guide).');

// ─── 2 ───
h1('2. End-User Guide (How to Use the App)');
h2('2.1 First launch & account');
bullet('Open NestBridge (Expo Go or built APK).');
bullet('Welcome → Create account (name, email, password only — no role at signup) or Log in.');
bullet('Verify email if required (local/dev often auto-skips when SendGrid is off).');
bullet('Choose primary intent: Student / Tourist / Host / Guide.');
bullet('Complete short onboarding (destination, quiz, profile). Soft skips exist for KYC and photos.');

h2('2.2 Student flow (homestay)');
bullet('Home → Search hosts (destination/dates may be pre-filled from onboarding).');
bullet('Match Results show: compatibility %, trust badge, and ≥2 plain-English reasons.');
bullet('Open Host Profile → Message (optional) → Request to book.');
bullet('Booking screen shows nightly rate + platform fee + total + cancellation policy before pay.');
bullet('Host accepts → Pay (Paystack live, or mock confirm in demo) → Confirmed.');

h2('2.3 Tourist flow');
bullet('Explore home → find guides or lodging directory.');
bullet('Book guide sessions: PENDING → ACCEPT → PAY → CONFIRMED.');
bullet('External lodging partners: call / email / website — no NestBridge payment for those listings.');

h2('2.4 Host flow');
bullet('Complete host listing (property, amenities, photos, availability, optional KYC).');
bullet('Dashboard shows incoming requests — accept or decline.');
bullet('Max 2 overlapping guest stays at once.');

h2('2.5 Guide flow');
bullet('Set services, bio, weekly schedule, optional social verify + KYC.');
bullet('Review incoming session requests; max 2 overlapping time blocks.');

h2('2.6 Shared tabs (after login)');
simpleTable(
  ['Tab', 'Purpose'],
  [
    ['Home', 'Intent-specific dashboard'],
    ['Search', 'Unified search: homestays, guides, lodging'],
    ['Bookings', 'Outgoing + provider review queue'],
    ['Messages', 'Firebase (or API) chat'],
    ['Profile', 'Account setup, settings, sign out'],
  ],
  [100, 340],
);

h2('2.7 SOS & welfare (non-negotiable)');
bullet('Floating SOS button is always visible on authenticated screens — never hide it.');
bullet('SOS screen: emergency contacts, call actions, logs event to backend with optional location.');
bullet('Welfare check-ins can be logged against a booking.');

h2('2.8 Ghana content library');
p('Phrases, transport tips, tourist sites, checklist, videos, map landmarks — loaded from backend content APIs (with demo merge if sparse for judges).');

// ─── 3 ───
h1('3. Demo Accounts for Judges');
p('Demo mode is ON when EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=true (development/preview). Welcome/Login/Register show quick-login tiles.');
simpleTable(
  ['Role', 'Email', 'Password'],
  [
    ['Student', 'akosua.demo@nestbridge.app', 'password'],
    ['Tourist', 'zara.tourist@nestbridge.app', 'password'],
    ['Host', 'abena.host@nestbridge.app', 'password'],
    ['Guide', 'kofi.guide@nestbridge.app', 'password'],
  ],
  [80, 240, 120],
);
p('All @nestbridge.app accounts are email-pre-verified in Flyway seeds. Live API is tried first; Ghana mock content merges only to fill sparse responses for demos.');
h3('Judge 3-minute path');
bullet('Start Postgres+Redis → backend → Expo.');
bullet('Welcome → Student quick-login → Search → Match → Book.');
bullet('Logout → Host quick-login → Accept request.');
bullet('Tap SOS floating button → show emergency contacts.');

// ─── 4 ───
doc.addPage();
h1('4. How the App Was Created');
h2('Two-phase build strategy');
bullet('Phase 1 — Presentational screens: each screen is a pure TypeScript component; data arrives via typed props. Teammates built screens in parallel against the Netlify prototype (~29 screens). Mock data lived outside screen files.');
bullet('Phase 2 — Integration (Bless wiring pass): navigation, Axios API client, matching endpoint, Firebase chat, booking/payment, SOS, real backend. No fake API in production navigation paths.');
h2('Assignment constraints we followed');
bullet('Expo / React Native + TypeScript only for new source.');
bullet('StyleSheet.create only — no NativeBase, Paper, Tamagui, NativeWind.');
bullet('All colors/spacing/radii from src/constants/theme.ts.');
bullet('SOS always visible; match % + trust + ≥2 reasons; booking price breakdown.');
bullet('KYC/photo soft skip (“Verify later” / “Skip for now”).');
h2('Prototype → product');
p('UI structure was matched to the prototype (mellow-blini-a42359.netlify.app). Brand tokens stayed in theme.ts — we never sampled hex codes from screenshots. The codebase grew beyond 29 screens (auth extras, admin/staff, lodging, content, settings) while keeping the prototype flows intact.');
h2('Team model');
bullet('Screens could be built by anyone first; ownership lists are “who builds first,” not scope walls.');
bullet('Matching algorithm, backend endpoints, Firebase wiring, and final navigation integration were Bless’s responsibility for the demo-critical path.');

// ─── 5 ───
h1('5. Prescribed Tech Stack & Why Each Piece');
h2('Frontend (mobile)');
simpleTable(
  ['Technology', 'Version / note', 'Why'],
  [
    ['Expo', '~54', 'Fast RN builds, Expo Go demos'],
    ['React Native', '0.81', 'iOS + Android one codebase'],
    ['React', '19.1', 'UI layer'],
    ['TypeScript', '5.x', 'Typed props & safer APIs'],
    ['React Navigation', 'native-stack', 'Auth + app stacks'],
    ['Axios', 'api.ts', 'Single HTTP client + JWT'],
    ['Expo SecureStore', 'tokens', 'Safer than AsyncStorage'],
    ['Firebase JS SDK', 'RTDB chat', 'Realtime messaging only'],
    ['AsyncStorage', 'cache', 'Offline content cache'],
    ['Poppins fonts', 'Expo Google Fonts', 'Brand typography'],
  ],
  [120, 130, 190],
);
h2('Backend (API)');
simpleTable(
  ['Technology', 'Version / note', 'Why'],
  [
    ['Java', '17', 'Assigned LTS runtime'],
    ['Spring Boot', '3.3.5', 'REST, Security, JPA'],
    ['Spring Security + JWT', 'jjwt 0.12.6', 'Stateless auth'],
    ['Spring Data JPA', 'Hibernate', 'ORM; ddl-auto=validate'],
    ['Flyway', 'migrations', 'Schema versioning'],
    ['PostgreSQL', '15', 'Primary relational store'],
    ['Redis', '7', 'Token blacklist + match cache'],
    ['Firebase Admin', 'optional', 'Provision chat nodes'],
    ['Paystack / Smile / S3', 'feature flags', 'Pay, KYC, photos'],
    ['Maven Wrapper', 'mvnw', 'Reproducible builds'],
  ],
  [130, 120, 190],
);
p('Local infra: Docker Compose in backend/docker-compose.yml (Postgres :5432, Redis :6379). API on port 8080. Health: GET /actuator/health.');

// ─── 6 ───
h1('6. Architecture — How Front, Back & DB Connect');
h2('Request path (say this in one breath)');
p('The Expo app calls Axios (api.ts) → Spring Boot controllers on :8080 → services → JPA repositories → PostgreSQL. Redis caches match results and blacklists refresh tokens. Firebase Realtime Database carries live chat; Postgres can still store messages for audit.');
h2('Layer diagram');
codeBlock([
  '[ Expo / React Native screens ]',
  '        |  props + AuthContext / SecureStore JWT',
  '        v',
  '[ src/services/api.ts  (Axios + Bearer token) ]',
  '        |  HTTP JSON  ApiResponse<T>',
  '        v',
  '[ Spring Boot Controllers  /api/... ]',
  '        |',
  '        +--> Auth (JWT filter) / Matching / Booking / Welfare / Admin',
  '        +--> PostgreSQL (Flyway V1..V32)',
  '        +--> Redis (match cache, refresh blacklist)',
  '        +--> Firebase RTDB (chat)  [optional]',
  '        +--> Paystack / Smile / S3 / SendGrid  [flags]',
]);
h2('Unified account model');
p('Register creates a user with no role. IntentSelect sets primary_intent. Seeker profile enables booking. Host/guide provider setups enable accepting requests. Browse is always allowed; book/pay/accept gate on COMPLETE setup tracks.');

// ─── 7 ───
doc.addPage();
h1('7. Exact Build & Run Commands');
h2('Prerequisites');
bullet('Node.js 18+ and npm');
bullet('Java 17 JDK');
bullet('Docker Desktop (for Postgres + Redis)');
bullet('Expo Go on a phone, or Android emulator / iOS simulator');

h2('7.1 Start database + Redis');
codeBlock([
  'cd backend',
  'docker compose up -d',
  '',
  '# Postgres :5432  Redis :6379',
  '# DB nestbridge / user postgres / password postgres',
]);

h2('7.2 Start Spring Boot backend');
codeBlock([
  'cd backend',
  '',
  '# Windows PowerShell:',
  '.\\mvnw.cmd spring-boot:run',
  '',
  '# macOS / Linux:',
  './mvnw spring-boot:run',
  '',
  '# Health check → http://localhost:8080/actuator/health',
]);
p('If Flyway checksum errors appear after editing migrations:');
codeBlock([
  './mvnw flyway:repair',
  './mvnw spring-boot:run',
]);

h2('7.3 Start Expo frontend');
codeBlock([
  'cd frontend',
  'npm install',
  'npm start',
  '# same as: npx expo start',
  '',
  '# scan QR with Expo Go (same Wi-Fi)',
  '# press a → Android   press i → iOS',
  '# npm run android / ios / web',
]);
p('API base URL defaults toward localhost:8080. On a physical device, env.ts uses the Metro LAN IP so the phone can reach your PC. Override with EXPO_PUBLIC_API_BASE_URL if needed.');

h2('7.4 Useful Expo commands');
codeBlock([
  'cd frontend',
  'npx expo install',
  'npx expo doctor',
  'eas build --profile production --platform android',
]);

h2('7.5 Full local stack order (memorize)');
codeBlock([
  '1) cd backend && docker compose up -d',
  '2) cd backend && .\\mvnw.cmd spring-boot:run',
  '3) cd frontend && npm start',
  '4) Expo Go → demo quick-login',
]);

// ─── 8 ───
h1('8. Matching Algorithm (Deep Dive)');
p('Source: backend/.../matching/MatchingAlgorithm.java. Endpoint: POST /api/matches/find. Cached in Redis as match:{userId}:{searchHash} for ~15 minutes.');
h2('Host matching');
bullet('Hard filters first: active listing, city, max budget, hard dietary (halal/kosher/allergy).');
bullet('Weighted score (0–100): language 20% + diet 20% + lifestyle 15% + budget 15% + proximity 15% + cultural 10% + trust 5%.');
h2('Guide matching');
bullet('language 30% + budget 20% + proximity 20% + trust 15% + service 15%.');
h2('UI must show');
bullet('Compatibility percentage + trust badge + at least two plain-English matchReasons.');

// ─── 9 ───
doc.addPage();
h1('9. Auth, Booking, Payments, SOS, Chat');
h2('9.1 Authentication');
bullet('POST /api/auth/register → create user (BCrypt password).');
bullet('Email verify token (SendGrid) or auto-skip when EMAIL_VERIFICATION_ENABLED=false.');
bullet('POST /api/auth/login → access JWT (~15 min) + refresh (~30 days).');
bullet('Access token in Authorization: Bearer … from SecureStore.');
bullet('POST /api/auth/refresh-token; logout blacklists refresh in Redis.');
bullet('Staff emails on ADMIN_EMAIL_ALLOWLIST get is_staff for admin screens.');

h2('9.2 Booking lifecycle');
codeBlock([
  'Discover → Profile → (optional) POST /api/conversations',
  'POST /api/bookings              → PENDING_HOST',
  'Provider GET /api/bookings/incoming → accept | decline',
  'Accept → ACCEPTED → guest Pay now',
  'Paystack ON:  /payment/initialize → checkout → /payment/verify',
  'Paystack OFF: PUT /api/bookings/{id}/confirm → CONFIRMED',
]);

h2('9.3 SOS');
bullet('UI: shared SOSScreen + floating button in AppNavigator wrapper.');
bullet('Contacts: GET /api/content/emergency-contacts');
bullet('Log: POST /api/welfare/sos (lat/lng, contacted flags)');
bullet('Optional email alert via SUPPORT_ALERT_EMAIL + SendGrid.');

h2('9.4 Chat');
bullet('Firebase is for messaging only — not auth, not bookings, not profiles.');
bullet('Backend can provision conversation nodes; client listens on /conversations/{id}/messages.');
bullet('Fallback: Postgres-backed GET/POST /api/conversations/:id/messages if Firebase is off.');

// ─── 10 ───
h1('10. Database & Migrations');
p('PostgreSQL is the system of record. Hibernate validates against the schema; Flyway owns changes (V1 through V32+). Never rely on ddl-auto=update in production.');
h3('Core tables (conceptual)');
bullet('users — identity, primary_intent, staff flags, email verified');
bullet('seeker_profiles / provider_setup — travel vs listing readiness');
bullet('host_profiles / guide_profiles — provider listings');
bullet('matches / bookings — pairing + lifecycle status');
bullet('welfare_check_ins / sos_events — safety');
bullet('Later: chat audit, content, events, payments, KYC, reviews, notifications, staff audit');
h3('Local connection');
codeBlock([
  'jdbc:postgresql://localhost:5432/nestbridge',
  'username: postgres',
  'password: postgres',
]);

// ─── 11 ───
h1('11. Key API Endpoints');
p('Base URL local: http://localhost:8080. Responses wrap as ApiResponse<T>.');
simpleTable(
  ['Area', 'Examples'],
  [
    ['Auth', '/api/auth/register, /login, /refresh-token, /logout'],
    ['Users', '/api/users/me/profile, device-tokens'],
    ['Matches', 'POST /api/matches/find'],
    ['Bookings', 'POST /api/bookings, /incoming, /accept, /confirm'],
    ['Hosts/Guides', '/api/hosts|guides/{id}, /profile'],
    ['Chat', '/api/conversations, /{id}/messages'],
    ['Welfare', '/api/welfare/sos, /checkins/{bookingId}'],
    ['Content', '/api/content/phrases|transport|sites|...'],
    ['Admin', '/api/admin/overview, users/search, suspend'],
    ['Health', '/actuator/health'],
  ],
  [100, 340],
);

// ─── 12 ───
doc.addPage();
h1('12. Project Folder Map');
codeBlock([
  'nestbridge/',
  '├── .cursorrules              # assignment + design rules',
  '├── .env.example              # full env catalog',
  '├── docs/                     # AGENTS, Backend, Demo, Production',
  '├── backend/',
  '│   ├── docker-compose.yml    # Postgres 15 + Redis 7',
  '│   ├── pom.xml               # Spring Boot 3.3.5 / Java 17',
  '│   ├── mvnw / mvnw.cmd',
  '│   └── src/main/',
  '│       ├── java/com/nestbridge/{auth,matching,booking,...}',
  '│       └── resources/db/migration/   # Flyway',
  '└── frontend/',
  '    ├── package.json          # npm start → expo start',
  '    ├── app.config.ts',
  '    └── src/',
  '        ├── screens/{auth,onboarding,student,host,guide,tourist,shared}',
  '        ├── services/{api.ts,firebase.ts}',
  '        ├── navigation/, context/, constants/theme.ts',
  '        └── config/{env.ts,demoMode.ts}',
]);

// ─── 13 ───
h1('13. Design System & UX Rules');
bullet('Tokens only from frontend/src/constants/theme.ts (colors, fonts, spacing, radii, gradients).');
bullet('Header/splash → gradients.header; CTAs → teal; backgrounds → background / warmCream.');
bullet('Danger/SOS → colors.danger; success → colors.success; warnings → colors.warning.');
bullet('Minimum touch target 44×44pt.');
bullet('Loading: ActivityIndicator — never blank screens; unreachable API → clear error (except explicit demo merge).');

// ─── 14 ───
h1('14. Judge Q&A — Prove You Built This');
p('Use these answers in your own words. They map to real files in this repo.');

qa(
  'What problem does NestBridge solve?',
  'International students and tourists struggle to find culturally compatible stays and guides. We match on language, diet, lifestyle, budget, proximity, culture, and trust — not just price and photos.',
);
qa(
  'What is your tech stack?',
  'Mobile: Expo 54 + React Native + TypeScript + React Navigation + Axios + SecureStore + Firebase RTDB for chat. Backend: Java 17, Spring Boot 3.3.5, Spring Security JWT, JPA, Flyway, PostgreSQL 15, Redis 7. Payments Paystack; KYC Smile; photos S3 — all feature-flagged.',
);
qa(
  'Why Redis if you already have Postgres?',
  'Postgres holds durable domain data. Redis is for short-lived concerns: blacklisting refresh tokens on logout and caching expensive match results for ~15 minutes.',
);
qa(
  'Why Firebase and also Spring?',
  'Spring is the source of truth for users, bookings, matching, welfare. Firebase Realtime Database is only for low-latency chat. If Firebase is off, chat falls back to Postgres message endpoints.',
);
qa(
  'Walk me through a booking.',
  'Seeker creates POST /api/bookings (PENDING_HOST). Provider accepts → ACCEPTED. Guest pays via Paystack initialize/verify or mock confirm. Status becomes CONFIRMED. Hosts/guides limited to 2 overlapping bookings.',
);
qa(
  'How does matching work?',
  'Hard filters (city, budget, dietary) then weighted soft scores. Hosts: language/diet/lifestyle/budget/proximity/cultural/trust. Guides: language/budget/proximity/trust/service. API returns percent, breakdown, and plain-English reasons.',
);
qa(
  'Where is the JWT stored and why?',
  'Expo SecureStore on device — encrypted keychain/keystore style storage. Not AsyncStorage. Axios attaches Bearer token; refresh rotates; logout blacklists refresh in Redis.',
);
qa(
  'How do I run your demo right now?',
  'docker compose up -d in backend, mvnw spring-boot:run, then npm start in frontend. Use Welcome quick-login tiles with password “password” for the four @nestbridge.app demo users.',
);
qa(
  'What did YOU personally build / own?',
  'Be honest to your real work. Strong talking points if they apply: MatchingAlgorithm.java, api.ts wiring, AppNavigator + SOS wrapper, booking/payment flow, Flyway seeds, demo mode flag, staff admin API. Point at file paths.',
);
qa(
  'Why no UI component library?',
  'Assignment rule: raw StyleSheet + theme.ts tokens for consistency and to prove we control the design system.',
);
qa(
  'How is schema evolved?',
  'Flyway migrations under backend/src/main/resources/db/migration. Hibernate set to validate — the DB schema must already match entities.',
);
qa(
  'What happens if the backend is down?',
  'Screens show a clear error / failed login — we do not silently invent bookings. Demo mode may merge content for sparse successful responses, but auth and writes still need the API.',
);
qa(
  'Security highlights?',
  'BCrypt passwords, short-lived access JWT, refresh rotation + Redis blacklist, staff allowlist, Spring Security filter chain, optional email verification, webhook endpoints for Paystack/Smile.',
);
qa(
  'What is still env-dependent for production?',
  'SendGrid email verify, Paystack live keys + webhook, Smile KYC, S3 photos, Firebase credentials, JWT_SECRET, hosted Postgres/Redis, EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false for production builds.',
);

// ─── 15 ───
h1('15. Troubleshooting');
simpleTable(
  ['Symptom', 'Fix'],
  [
    ['Phone cannot hit API', 'Use LAN IP in EXPO_PUBLIC_API_BASE_URL; same Wi-Fi'],
    ['Docker not running', 'Start Docker Desktop; docker compose up -d'],
    ['Port 8080 in use', 'Stop other Java apps or change server.port'],
    ['Flyway checksum fail', 'mvnw flyway:repair then restart'],
    ['Demo login fails', 'Backend must be up; seeds applied; demo flag true'],
    ['Blank Expo', 'npm install; npx expo start -c'],
    ['JWT 401 loops', 'Re-login; check Redis is up'],
  ],
  [150, 290],
);

// ─── Appendix ───
doc.addPage();
h1('Appendix A — Memorize These Commands');
codeBlock([
  'cd backend',
  'docker compose up -d',
  '.\\mvnw.cmd spring-boot:run',
  '',
  'cd frontend',
  'npm install',
  'npm start                 # expo start',
  '',
  '# Health',
  'curl http://localhost:8080/actuator/health',
]);

h1('Appendix B — Primary Docs in Repo');
bullet('docs/AGENTS.md — product, screens, UX, navigation');
bullet('docs/Backend.MD — schema, matching, API, JWT');
bullet('docs/DEMO_AND_PRODUCTION.md — judge demo mode');
bullet('docs/PRODUCTION_SETUP.md — production env checklist');
bullet('docs/DEPLOYMENT.md — deploy notes');
bullet('backend/README.md — local backend run');
bullet('.cursorrules — CodeQuest constraints');
bullet('.env.example — environment variable catalog');

h1('Appendix C — Elevator Pitch');
p('NestBridge is Group 21’s CodeQuest 2026 culturally intelligent pairing app: Expo/React Native on the phone, Spring Boot on the server, PostgreSQL for truth, Redis for cache and token safety, and Firebase only for live chat. Students and tourists discover hosts and guides with explainable match scores; hosts and guides manage incoming requests; everyone keeps SOS one tap away. We built screens to the prototype, then wired real auth, matching, bookings, and welfare so judges can run the full stack locally with Docker, Maven, and Expo.');

doc.moveDown(1.5);
doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#64748b')
  .text('Generated for NestBridge Group 21 — use this guide to demo, defend, and operate the stack.', {
    width: CONTENT_W,
    align: 'center',
  });

// Footers on all pages
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(range.start + i);
  const isCover = i === 0;
  if (isCover) continue;
  doc.font('Helvetica').fontSize(8).fillColor('#64748b')
    .text('NestBridge · Group 21 · CodeQuest 2026', MARGIN, doc.page.height - 36, {
      width: CONTENT_W / 2,
      align: 'left',
      lineBreak: false,
    })
    .text(`${i + 1}`, MARGIN, doc.page.height - 36, {
      width: CONTENT_W,
      align: 'right',
      lineBreak: false,
    });
}

doc.end();

stream.on('finish', () => {
  const st = fs.statSync(OUT);
  console.log('Wrote:', OUT);
  console.log('Bytes:', st.size);
});

stream.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
