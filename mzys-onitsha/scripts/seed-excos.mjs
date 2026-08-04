import { createHash, randomBytes } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

const read = (f) => JSON.parse(readFileSync(join(DATA_DIR, f), 'utf-8'));
const write = (f, d) => writeFileSync(join(DATA_DIR, f), JSON.stringify(d, null, 2), 'utf-8');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(salt + password).digest('hex');
  return `${salt}:${hash}`;
}

const branches = read('branches.json');
const members = read('members.json');
const users = read('users.json');

const branchByName = {};
branches.forEach((b) => (branchByName[b.name] = b.id));

function ensureBranch(name, location) {
  if (branchByName[name]) return branchByName[name];
  const branch = { id: generateId(), name, location, leaderName: '', leaderPhone: '', createdAt: new Date().toISOString() };
  branches.push(branch);
  branchByName[name] = branch.id;
  return branch.id;
}

const EXCOS = [
  { firstName: 'Ebere', lastName: 'Godspower', email: 'eberegodspower@gmail.com', role: 'superadmin', branch: 'Inland Town District', gender: 'male', phone: '+2347035829596' },
  { firstName: 'Okorie', lastName: 'Confidence', email: 'okorieconfidence@mzys.com', role: 'exco', branch: 'Ogbeumuonitsha', gender: 'male', phone: '+2347017939152' },
  { firstName: 'Chukwuma', lastName: 'Nduka', email: 'ndukachukwuma13@gmail.com', role: 'exco', branch: 'ESOCS Mount of Miracle Obosi', gender: 'male', phone: '08063728105' },
  { firstName: 'Ogbonna', lastName: 'Agbai', email: 'ogbonnaagbaielijah@gmail.com', role: 'exco', branch: 'Onitsha Main', gender: 'male', phone: '08130953710' },
  { firstName: 'Precious', lastName: 'Nzube Agbo', email: 'preciousagbo1999@gmail.com', role: 'exco', branch: 'Obosi Branch', gender: 'female', phone: '09018994181' },
  { firstName: 'Chibuogwu', lastName: 'Emmanuel', email: 'emmagod40099@gmail.com', role: 'exco', branch: 'ESOCS Mount of Miracle Obosi', gender: 'male', phone: '08079466257' },
  { firstName: 'Achonu', lastName: 'Chidera', email: 'achonuchidera@gmail.com', role: 'exco', branch: 'Inland Town District', gender: 'male', phone: '07081644348' },
  { firstName: 'Samuel', lastName: 'Anyanwu', email: 'anyanwupro@gmail.com', role: 'exco', branch: 'Fegge Provincial HQ', gender: 'male', phone: '08165714745' },
  { firstName: 'Ruth', lastName: 'Udechukwu', email: 'udechukwuruth84@gmail.com', role: 'exco', branch: 'Obosi Branch', gender: 'female', phone: '07041367179' },
  { firstName: 'Oluchukwu', lastName: 'Friday', email: 'mamaoluchukwu100@gmail.com', role: 'exco', branch: 'Nkpor 3', gender: 'female', phone: '09060499070' },
  { firstName: 'Ugochukwu', lastName: 'Ogaraku', email: 'ogarakuugochukwu@mzys.com', role: 'exco', branch: 'Fegge Branch', gender: 'male', phone: '08108787625' },
];

const result = [];

for (const ex of EXCOS) {
  const branchId = ensureBranch(ex.branch, ex.branch);
  const password = `Mzys@${ex.lastName.split(' ')[0]}2026`;
  const passwordHash = hashPassword(password);

  const member = {
    id: generateId(),
    firstName: ex.firstName,
    lastName: ex.lastName,
    email: ex.email,
    phone: ex.phone,
    dateOfBirth: '',
    gender: ex.gender,
    branchId,
    cherubSeraph: null,
    occupation: '',
    address: ex.branch,
    status: 'active',
    registrationDate: new Date().toISOString(),
    profileImage: null,
  };

  const user = {
    id: generateId(),
    email: ex.email,
    passwordHash,
    role: ex.role,
    memberId: member.id,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  if (!users.find((u) => u.email === ex.email)) users.push(user);
  if (!members.find((m) => m.email === ex.email)) members.push(member);

  result.push({ role: ex.role, name: `${ex.firstName} ${ex.lastName}`, email: ex.email, password });
}

write('branches.json', branches);
write('members.json', members);
write('users.json', users);

console.log('=== MZYS LOGIN CREDENTIALS ===');
console.log('');
result.forEach((r) => {
  console.log(`${r.role.toUpperCase()} | ${r.name} | ${r.email} | ${r.password}`);
});
console.log('');
console.log('--- Existing accounts ---');
console.log('ADMIN | Admin User | admin@mzysonitsha.com | (existing, password unchanged)');
