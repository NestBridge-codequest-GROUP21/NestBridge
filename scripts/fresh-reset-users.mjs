/**
 * Fresh-start reset on Railway Postgres.
 * Keeps Group 21 staff + seeded *@nestbridge.app demo users.
 *
 * Usage (Railway linked):
 *   node scripts/fresh-reset-users.mjs
 */
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pg = require(path.join(scriptDir, 'node_modules', 'pg'));

const STAFF = [
  'bsbhackman@gmail.com',
  'abigailadusei17@gmail.com',
  'angelonwe54@gmail.com',
  'sirinaabbas2@gmail.com',
  'abdulsamedtaslima@gmail.com',
];

function railwayJson(service) {
  const raw = execSync(`railway variables --service ${service} --json`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(raw);
}

async function main() {
  const vars = railwayJson('Postgres');
  const url = vars.DATABASE_PUBLIC_URL || vars.DATABASE_URL;
  if (!url) {
    throw new Error('No DATABASE_PUBLIC_URL / DATABASE_URL on Postgres service');
  }

  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const before = await client.query('SELECT count(*)::int AS c FROM users');
    console.log('users_before=', before.rows[0].c);

    const del = await client.query(
      `DELETE FROM users
       WHERE lower(email) <> ALL($1::text[])
         AND email NOT ILIKE '%@nestbridge.app'`,
      [STAFF],
    );
    console.log('deleted_consumer_accounts=', del.rowCount);

    await client.query(
      `UPDATE users
       SET is_staff = TRUE,
           email_verified = TRUE,
           email_verified_at = COALESCE(email_verified_at, NOW()),
           is_suspended = FALSE
       WHERE lower(email) = ANY($1::text[])`,
      [STAFF],
    );

    const staff = await client.query(
      `SELECT email, is_staff, email_verified
       FROM users
       WHERE lower(email) = ANY($1::text[])
       ORDER BY email`,
      [STAFF],
    );
    console.log('staff_rows=', JSON.stringify(staff.rows));

    const after = await client.query('SELECT count(*)::int AS c FROM users');
    console.log('users_after=', after.rows[0].c);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
