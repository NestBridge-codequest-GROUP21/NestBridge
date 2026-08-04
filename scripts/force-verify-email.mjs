/**
 * Mark a user email_verified so they can sign in without the inbox link.
 * Usage: node scripts/force-verify-email.mjs someone@gmail.com
 */
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pg = require(path.join(scriptDir, 'node_modules', 'pg'));

const email = (process.argv[2] || '').trim().toLowerCase();
if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/force-verify-email.mjs email@example.com');
  process.exit(1);
}

const vars = JSON.parse(
  execSync('railway variables --service Postgres --json', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }),
);
const url = vars.DATABASE_PUBLIC_URL || vars.DATABASE_URL;
const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
const { rows } = await client.query(
  `UPDATE users
   SET email_verified = TRUE,
       email_verified_at = COALESCE(email_verified_at, NOW()),
       is_suspended = FALSE
   WHERE email ILIKE $1
   RETURNING email, full_name, email_verified, is_staff`,
  [email],
);
if (rows.length === 0) {
  console.error('No user found for', email);
  process.exit(1);
}
console.log(JSON.stringify(rows[0], null, 2));
await client.end();
