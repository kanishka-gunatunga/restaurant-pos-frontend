import type { UserRole } from "@/types/user";

export type UserFormPayload = {
  id?: string | number;
  name: string;
  password?: string;
  role: UserRole;
  employeeId: string;
  branchId: number;
  passcode: string;
};
