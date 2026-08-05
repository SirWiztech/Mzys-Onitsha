import mysql from 'mysql2/promise';

const base = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

async function attempt(label, opts) {
  try {
    const conn = await mysql.createConnection({ ...base, ...opts });
    const [dbs] = await conn.query('SHOW DATABASES');
    console.log(`OK ${label}: databases = ${dbs.map((d) => Object.values(d)[0]).join(', ')}`);
    await conn.end();
    return true;
  } catch (e) {
    console.log(`FAIL ${label}: ${e.message}`);
    return false;
  }
}

// Try TLS + specific DB
await attempt('TLS+DB', { database: process.env.DB_NAME, ssl: { rejectUnauthorized: false } });
// Try TLS, no DB
await attempt('TLS noDB', { ssl: { rejectUnauthorized: false } });
// Try plain no DB
await attempt('plain noDB', {});
