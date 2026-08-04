/**
 * Set Realtime Database rules so mobile clients can *read* live chat
 * while only the backend Admin SDK can write (client .write = false).
 *
 * Usage: node scripts/set-firebase-rtdb-rules.mjs
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
      scope: 'https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database',
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
  return (await res.json()).access_token;
}

async function main() {
  const vars = railwayJson('NestBridge');
  const databaseUrl = String(vars.FIREBASE_DATABASE_URL || '').replace(/\/$/, '');
  const credentials = JSON.parse(vars.FIREBASE_CREDENTIALS_JSON);
  const token = await getAccessToken(credentials);

  const rules = {
    rules: {
      '.read': false,
      '.write': false,
      conversations: {
        $conversationId: {
          messages: {
            // Clients subscribe for live chat; Admin SDK bypasses rules for writes.
            '.read': true,
            '.write': false,
          },
        },
      },
    },
  };

  const res = await fetch(`${databaseUrl}/.settings/rules.json?access_token=${encodeURIComponent(token)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rules),
  });
  if (!res.ok) {
    throw new Error(`Set rules failed: ${res.status} ${await res.text()}`);
  }
  console.log('OK RTDB rules updated: conversations/*/messages readable by clients, writes admin-only');

  const probe = await fetch(`${databaseUrl}/conversations.json`);
  console.log('probe_conversations_status=', probe.status);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
