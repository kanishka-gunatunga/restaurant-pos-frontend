import type { UserRole } from "./UserTable";

export type UserFormPayload = {
  id?: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  employeeId: string;
  branchId: number;
  passcode: string;
};
