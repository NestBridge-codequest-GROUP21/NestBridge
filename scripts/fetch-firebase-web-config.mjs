/**
 * Reads Railway NestBridge Firebase Admin credentials and prints Expo client
 * env lines (apiKey is a public web key — safe for EXPO_PUBLIC_*).
 *
 * Usage (from repo root, Railway linked):
 *   node scripts/fetch-firebase-web-config.mjs
 */
import { createSign } from 'node:crypto';
import { execSync } from 'node:child_process';

function railwayJson(service) {
  const raw = execSync(`railway variables --service ${service} --json`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(raw);
}

function b64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer
    .sign(credentials.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const assertion = `${unsigned}.${signature}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.access_token;
}

async function main() {
  const vars = railwayJson('NestBridge');
  const databaseUrl = String(vars.FIREBASE_DATABASE_URL || '').trim();
  const credRaw = vars.FIREBASE_CREDENTIALS_JSON;
  if (!databaseUrl || !credRaw) {
    throw new Error('FIREBASE_DATABASE_URL / FIREBASE_CREDENTIALS_JSON missing on Railway NestBridge');
  }
  const credentials = typeof credRaw === 'string' ? JSON.parse(credRaw) : credRaw;
  const projectId = credentials.project_id;
  const token = await getAccessToken(credentials);

  const listRes = await fetch(
    `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!listRes.ok) {
    throw new Error(`List webApps failed: ${listRes.status} ${await listRes.text()}`);
  }
  const list = await listRes.json();
  const apps = list.apps || [];
  if (apps.length === 0) {
    // Create a web app if none exists.
    const createRes = await fetch(
      `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: 'NestBridge Mobile' }),
      },
    );
    if (!createRes.ok) {
      throw new Error(`Create webApp failed: ${createRes.status} ${await createRes.text()}`);
    }
    apps.push(await createRes.json());
  }

  const app = apps[0];
  const appId = app.appId;
  const configRes = await fetch(
    `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/${appId}/config`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!configRes.ok) {
    throw new Error(`Get webApp config failed: ${configRes.status} ${await configRes.text()}`);
  }
  const config = await configRes.json();
  const apiKey = config.apiKey || config.api_key;
  const authDomain = config.authDomain || `${projectId}.firebaseapp.com`;
  const project = config.projectId || projectId;
  const dbUrl = config.databaseURL || databaseUrl;

  if (!apiKey) {
    throw new Error('Web app config did not include apiKey');
  }

  console.log('OK Firebase web config loaded');
  console.log(`EXPO_PUBLIC_FIREBASE_API_KEY=${apiKey}`);
  console.log(`EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}`);
  console.log(`EXPO_PUBLIC_FIREBASE_DATABASE_URL=${dbUrl}`);
  console.log(`EXPO_PUBLIC_FIREBASE_PROJECT_ID=${project}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
