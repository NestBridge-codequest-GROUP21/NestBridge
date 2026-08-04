/**
 * Full NestBridge fresh start: delete EVERY user (including staff/admins).
 *
 * Usage: node scripts/wipe-all-users.mjs
 * Then: node scripts/reseed-demo-actors.mjs
 */
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pg = require(path.join(scriptDir, 'node_modules', 'pg'));

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
    const before = await client.query('SELECT email FROM users ORDER BY email');
    console.log('users_before=', before.rowCount);
    console.log(JSON.stringify(before.rows.map((r) => r.email)));

    // CASCADE clears dependent rows (bookings, profiles, tokens, etc.).
    await client.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

    const after = await client.query('SELECT count(*)::int AS c FROM users');
    console.log('users_after=', after.rows[0].c);
    if (after.rows[0].c !== 0) {
      throw new Error('Wipe failed — users still present');
    }
    console.log('All accounts removed. Run reseed-demo-actors.mjs for demo actors only.');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
