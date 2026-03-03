export const BRANCHES = [
  { id: "maharagama", name: "Maharagama Branch", address: "18, Main Road, Maharagama" },
  { id: "nugegoda", name: "Nugegoda Branch", address: "21, Main Road, Nugegoda" },
] as const;

export function getBranchById(id: string) {
  return BRANCHES.find((b) => b.id === id) ?? null;
}

/** Map numeric branchId (from API) to branch. 1-based index. */
export function getBranchByNumericId(id: number): (typeof BRANCHES)[number] | null {
  const index = id - 1;
  return index >= 0 && index < BRANCHES.length ? BRANCHES[index] : null;
}
