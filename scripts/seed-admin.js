const { createHash, randomBytes } = require('crypto');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const DATA_DIR = join(__dirname, '..', 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const MEMBERS_FILE = join(DATA_DIR, 'members.json');

function readJSON(path) {
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  return `${salt}:${hash}`;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const email = process.argv[2] || 'admin@mzysonitsha.com';
const password = process.argv[3] || 'admin123';

const users = readJSON(USERS_FILE);
const members = readJSON(MEMBERS_FILE);

if (users.find((u) => u.email === email)) {
  console.log(`User with email ${email} already exists.`);
  process.exit(0);
}

const memberId = generateId();
const userId = generateId();

const member = {
  id: memberId,
  firstName: 'Admin',
  lastName: 'User',
  email,
  phone: '',
  dateOfBirth: '',
  gender: 'male',
  branchId: '',
  cherubSeraph: null,
  occupation: 'Administrator',
  address: '',
  status: 'active',
  registrationDate: new Date().toISOString(),
  profileImage: null,
};

const user = {
  id: userId,
  email,
  passwordHash: hashPassword(password),
  role: 'member',
  memberId,
  createdAt: new Date().toISOString(),
};

members.push(member);
users.push(user);

writeJSON(MEMBERS_FILE, members);
writeJSON(USERS_FILE, users);

console.log(`\nAdmin account created successfully!`);
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
console.log(`\nRun "npm run seed" to create more admin accounts.`);
