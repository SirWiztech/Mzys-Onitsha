import mysql from 'mysql2/promise';

const HOST = process.env.DB_HOST || '127.0.0.1';
const PORT = Number(process.env.DB_PORT || 3306);
const USER = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || '';
const DB = process.env.DB_NAME || 'mzys_onitsha';

async function main() {
  const conn = await mysql.createConnection({ host: HOST, port: PORT, user: USER, password: PASSWORD });
  await conn.query(`USE \`${DB}\``);
  await conn.query(`CREATE TABLE IF NOT EXISTS \`otps\` (
    \`row_id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    \`id\` VARCHAR(64) NOT NULL,
    \`data\` JSON NOT NULL,
    PRIMARY KEY (\`row_id\`),
    UNIQUE KEY \`uk_otps_id\` (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  console.log('otps table ready');
  await conn.end();
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
