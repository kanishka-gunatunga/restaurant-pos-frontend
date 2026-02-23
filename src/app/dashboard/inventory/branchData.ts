export const BRANCHES = [
  { id: "maharagama", name: "Maharagama Branch", address: "18, Main Road, Maharagama" },
  { id: "nugegoda", name: "Nugegoda Branch", address: "21, Main Road, Nugegoda" },
] as const;

export function getBranchById(id: string) {
  return BRANCHES.find((b) => b.id === id) ?? null;
}
