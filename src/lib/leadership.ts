// Executive council hierarchy, ordered by protocol ranking.
// Email is the stable key — it links members (members.json) to users (users.json)
// and to their position on the executive council.
export const POSITION_ORDER: { email: string; position: string; order: number }[] = [
  { email: 'eberegodspower@gmail.com', position: 'President', order: 1 },
  { email: 'okorieconfidence@mzys.com', position: 'Vice President', order: 2 },
  { email: 'ndukachukwuma13@gmail.com', position: 'General Secretary', order: 3 },
  { email: 'ogbonnaagbaielijah@gmail.com', position: 'Assistant Secretary', order: 4 },
  { email: 'preciousagbo1999@gmail.com', position: 'Treasurer', order: 5 },
  { email: 'emmagod40099@gmail.com', position: 'Media & Publicity Director', order: 6 },
  { email: 'achonuchidera@gmail.com', position: 'Welfare Officer', order: 7 },
  { email: 'anyanwupro@gmail.com', position: 'Provost', order: 8 },
  { email: 'udechukwuruth84@gmail.com', position: 'Evangelism Department', order: 9 },
  { email: 'mamaoluchukwu100@gmail.com', position: 'Evangelical / Prayer Unit', order: 10 },
  { email: 'ogarakuugochukwu@mzys.com', position: 'Music & Drama Department', order: 11 },
];

export function positionByEmail(email: string): string | undefined {
  return POSITION_ORDER.find((p) => p.email === email)?.position;
}

// Static photo files shipped in public/images (named after each exco).
// profileImage in the DB is null for most excos, so the landing page and the
// dashboard leadership page both fall back to these. Update here when an exco
// sends a new photo — it applies everywhere at once.
export const STATIC_IMAGES: Record<string, string> = {
  'eberegodspower@gmail.com': '/images/Nnamdi Godspower.jpg',
  'okorieconfidence@mzys.com': '/images/Okorie Confidence.jpg',
  'ndukachukwuma13@gmail.com': '/images/Chukwuma  Nduka.jpg',
  'ogbonnaagbaielijah@gmail.com': '/images/Agbai.jpg',
  'preciousagbo1999@gmail.com': '/images/precious-nzube-agbo.png',
  'emmagod40099@gmail.com': '/images/Chibuogwu Emmanuel.jpg',
  'achonuchidera@gmail.com': '/images/Achonu Chidera.jpg',
  'anyanwupro@gmail.com': '/images/Anyanwu Samuel.jpg',
  'udechukwuruth84@gmail.com': '/images/Ruth Udechukwu.jpg',
  'mamaoluchukwu100@gmail.com': '/images/Mama Friday.jpg',
  'ogarakuugochukwu@mzys.com': '/images/ugochukwu ogaraku.jpg',
};
