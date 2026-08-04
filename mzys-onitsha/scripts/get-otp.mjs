import mysql from 'mysql2/promise';

const email = process.argv[2];
const purpose = process.argv[3];

if (!email || !purpose) {
  console.error('Usage: node scripts/get-otp.mjs <email> <purpose|latest>');
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'mzys_onitsha',
});

const where = purpose === 'latest'
  ? 'TRUE'
  : `JSON_UNQUOTE(JSON_EXTRACT(\`data\`, "$.purpose")) = ?`;

const params = purpose === 'latest' ? [email] : [email, purpose];
const [rows] = await conn.query(
  `SELECT \`id\`, \`data\` FROM \`otps\` WHERE JSON_UNQUOTE(JSON_EXTRACT(\`data\`, "$.email")) = ? AND ${where} ORDER BY \`row_id\` DESC LIMIT 1`,
  params
);

if (!rows.length) {
  console.log('NO_OTP');
} else {
  const data = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
  console.log(JSON.stringify({ code: data.code, email: data.email, purpose: data.purpose, expiresAt: data.expiresAt }));
}
await conn.end();
