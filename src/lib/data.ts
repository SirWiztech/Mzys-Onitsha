import { query, queryOne } from './db';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function tableName(filename: string): string {
  return filename.replace(/\.json$/i, '');
}

function parseData<T>(value: unknown): T {
  if (value == null) return {} as T;
  if (typeof value === 'string') return JSON.parse(value) as T;
  return value as T;
}

export async function readData<T>(filename: string): Promise<T[]> {
  const table = tableName(filename);
  const rows = await query<{ data: string | object }>(
    `SELECT \`data\` FROM \`${table}\` ORDER BY \`row_id\` ASC`
  );
  return rows.map((r) => parseData<T>(r.data));
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  const table = tableName(filename);
  const rows = data.map((item) => ({
    id: (item as { id?: string }).id || generateId(),
    data: JSON.stringify(item),
  }));
  await query('START TRANSACTION');
  try {
    await query(`DELETE FROM \`${table}\``);
    if (rows.length > 0) {
      const values = rows.map(() => '(?, ?)').join(', ');
      const params: unknown[] = [];
      for (const r of rows) params.push(r.id, r.data);
      await query(
        `INSERT INTO \`${table}\` (\`id\`, \`data\`) VALUES ${values}`,
        params
      );
    }
    await query('COMMIT');
  } catch (err) {
    await query('ROLLBACK');
    throw err;
  }
}

export async function findById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<T | null> {
  const table = tableName(filename);
  const row = await queryOne<{ data: string | object }>(
    `SELECT \`data\` FROM \`${table}\` WHERE \`id\` = ? LIMIT 1`,
    [id]
  );
  return row ? parseData<T>(row.data) : null;
}

export async function create<T extends { id: string }>(
  filename: string,
  item: T
): Promise<T> {
  const table = tableName(filename);
  await query(
    `INSERT INTO \`${table}\` (\`id\`, \`data\`) VALUES (?, ?)`,
    [item.id, JSON.stringify(item)]
  );
  return item;
}

export async function update<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const table = tableName(filename);
  const existing = await findById<T>(filename, id);
  if (!existing) return null;
  const merged = { ...existing, ...updates };
  await query(
    `UPDATE \`${table}\` SET \`data\` = ? WHERE \`id\` = ?`,
    [JSON.stringify(merged), id]
  );
  return merged;
}

export async function remove<T extends { id: string }>(
  filename: string,
  id: string
): Promise<boolean> {
  const table = tableName(filename);
  const result = await query<{ affectedRows: number }>(
    `DELETE FROM \`${table}\` WHERE \`id\` = ?`,
    [id]
  );
  return (result as unknown as { affectedRows: number }).affectedRows > 0;
}
