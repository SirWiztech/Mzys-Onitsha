import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

export async function readData<T>(filename: string): Promise<T[]> {
  const filePath = join(DATA_DIR, filename);
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  const filePath = join(DATA_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function findById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<T | null> {
  const items = await readData<T>(filename);
  return items.find((item) => item.id === id) ?? null;
}

export async function create<T extends { id: string }>(
  filename: string,
  item: T
): Promise<T> {
  const items = await readData<T>(filename);
  items.push(item);
  await writeData(filename, items);
  return item;
}

export async function update<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const items = await readData<T>(filename);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  await writeData(filename, items);
  return items[index];
}

export async function remove<T extends { id: string }>(
  filename: string,
  id: string
): Promise<boolean> {
  const items = await readData<T>(filename);
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  await writeData(filename, filtered);
  return true;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
