export interface GroupedBranches {
  district: string | null;
  branches: { value: string; label: string }[];
}

const UNTITLED = 'General';

/**
 * Groups a branch list by district for optgroup rendering. The provincial HQ
 * branch (district null) appears first under its own group; districts keep
 * the order in which they first appear in the source data.
 */
export function groupBranches<T extends { id: string; name: string; district?: string | null }>(
  branches: T[]
): GroupedBranches[] {
  const order: (string | null)[] = [];
  const byDistrict = new Map<string | null, { value: string; label: string }[]>();
  for (const b of branches) {
    const district = b.district ?? null;
    if (!byDistrict.has(district)) {
      byDistrict.set(district, []);
      order.push(district);
    }
    byDistrict.get(district)!.push({ value: b.id, label: b.name });
  }
  return order.map((district) => ({
    district,
    branches: byDistrict.get(district)!,
  }));
}

/** Display label for a district group heading. */
export function districtLabel(district: string | null): string {
  return district ?? UNTITLED;
}
