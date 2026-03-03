/** Returns the first name from a full name string. */
export function getFirstName(fullName: string | null | undefined): string {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0] ?? "";
}
