export interface Branch {
  id: string;
  numericId: number;
  name: string;
}

export const BRANCHES: Branch[] = [
  { id: "main", numericId: 1, name: "Main Branch" },
  { id: "city_center", numericId: 2, name: "City Center Branch" },
  { id: "suburbs", numericId: 3, name: "Suburbs Branch" },
];

export function getBranchByNumericId(numericId: number): Branch | undefined {
  return BRANCHES.find((b) => b.numericId === numericId);
}
