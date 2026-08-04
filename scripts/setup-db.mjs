import mysql from 'mysql2/promise';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const HOST = process.env.DB_HOST || '127.0.0.1';
const PORT = Number(process.env.DB_PORT || 3306);
const USER = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || '';
const DB = process.env.DB_NAME || 'mzys_onitsha';

const TABLES = [
  'users',
  'members',
  'branches',
  'events',
  'finances',
  'complaints',
  'leadership',
  'products',
  'comments',
  'likes',
  'notifications',
  'otps',
];

async function main() {
  const conn = await mysql.createConnection({ host: HOST, port: PORT, user: USER, password: PASSWORD });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${DB}\``);

  for (const table of TABLES) {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`${table}\` (
        \`row_id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`id\` VARCHAR(64) NOT NULL,
        \`data\` JSON NOT NULL,
        PRIMARY KEY (\`row_id\`),
        UNIQUE KEY \`uk_${table}_id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  console.log(`Database \`${DB}\` ready. Tables: ${TABLES.join(', ')}`);

  // Migrate existing JSON data files into MySQL
  const dataDir = join(process.cwd(), 'data');
  for (const file of readdirSync(dataDir).filter((f) => f.endsWith('.json'))) {
    const table = file.replace(/\.json$/i, '');
    if (!TABLES.includes(table)) continue;
    const raw = readFileSync(join(dataDir, file), 'utf-8').trim();
    if (!raw) continue;
    let rows;
    try {
      rows = JSON.parse(raw);
    } catch {
      console.warn(`Skipping ${file}: invalid JSON`);
      continue;
    }
    if (!Array.isArray(rows) || rows.length === 0) continue;

    await conn.query(`DELETE FROM \`${table}\``);
    const values = rows.map(() => '(?, ?)').join(', ');
    const params = [];
    for (const r of rows) params.push(r.id || '', JSON.stringify(r));
    await conn.query(`INSERT INTO \`${table}\` (\`id\`, \`data\`) VALUES ${values}`, params);
    console.log(`  Migrated ${rows.length} rows -> ${table}`);
  }

  await conn.end();
  console.log('Migration complete.');
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
