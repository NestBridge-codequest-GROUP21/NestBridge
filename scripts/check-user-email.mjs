import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pg = require(path.join(scriptDir, 'node_modules', 'pg'));

const needle = (process.argv[2] || 'hackie').toLowerCase();

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
  `SELECT email, full_name, email_verified, is_staff, is_suspended, primary_intent, created_at
   FROM users
   WHERE email ILIKE $1
   ORDER BY created_at DESC NULLS LAST`,
  [`%${needle}%`],
);
console.log(JSON.stringify(rows, null, 2));
await client.end();
