/** Normalized material used item for display. */
export interface NormalizedMaterialUsed {
  materialId: number;
  materialName?: string;
  qtyValue: number;
  qtyUnit: string;
}

function parseMaterialsUsed(row: {
  materialsUsed?: unknown;
  materials_used?: unknown;
}): NormalizedMaterialUsed[] {
  const raw = row.materialsUsed ?? row.materials_used;
  if (Array.isArray(raw)) {
    return raw.map((m: Record<string, unknown>) => ({
      materialId: Number(m.materialId ?? m.material_id ?? 0),
      materialName: (m.materialName ?? m.material_name) as string | undefined,
      qtyValue: Number(m.qtyValue ?? m.qty_value ?? 0),
      qtyUnit: String(m.qtyUnit ?? m.qty_unit ?? ""),
    }));
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      const arr = Array.isArray(parsed) ? parsed : [];
      return arr.map((m: Record<string, unknown>) => ({
        materialId: Number(m.materialId ?? m.material_id ?? 0),
        materialName: (m.materialName ?? m.material_name) as string | undefined,
        qtyValue: Number(m.qtyValue ?? m.qty_value ?? 0),
        qtyUnit: String(m.qtyUnit ?? m.qty_unit ?? ""),
      }));
    } catch {
      return [];
    }
  }
  return [];
}

export function getAssignmentMaterialsUsed(
  row: { materialsUsed?: unknown; materials_used?: unknown },
  materialsLookup?: { id: number; name: string }[]
): NormalizedMaterialUsed[] {
  const items = parseMaterialsUsed(row);
  if (!materialsLookup?.length) return items;
  const byId = new Map(materialsLookup.map((m) => [m.id, m.name]));
  return items.map((m) => ({
    ...m,
    materialName: m.materialName ?? byId.get(m.materialId) ?? undefined,
  }));
}
