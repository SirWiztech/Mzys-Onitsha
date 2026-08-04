const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const DATA_DIR = join(__dirname, '..', 'data');

function readJSON(path) {
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const BRANCHES_FILE = join(DATA_DIR, 'branches.json');
const branches = readJSON(BRANCHES_FILE);

if (branches.length > 0) {
  console.log(`${branches.length} branches already exist. Skipping seed.`);
  process.exit(0);
}

const sampleBranches = [
  { name: 'Onitsha Main', location: 'Onitsha, Anambra State', leaderName: '', leaderPhone: '' },
  { name: 'GRA Branch', location: 'GRA, Onitsha', leaderName: '', leaderPhone: '' },
  { name: 'Fegge Branch', location: 'Fegge, Onitsha', leaderName: '', leaderPhone: '' },
  { name: 'Works Layout', location: 'Works Layout, Onitsha', leaderName: '', leaderPhone: '' },
].map((b) => ({
  id: generateId(),
  ...b,
  createdAt: new Date().toISOString(),
}));

writeJSON(BRANCHES_FILE, sampleBranches);

console.log(`\n${sampleBranches.length} sample branches created:`);
sampleBranches.forEach((b) => console.log(`  - ${b.name} (${b.location})`));
