/**
 * Backend auth API types
 */

export type BackendUserRole = "cashier" | "manager" | "admin";

export type BackendUser = {
  id: number;
  employeeId: string;
  role: BackendUserRole;
  status: string;
  name: string;
  email: string | null;
  branchId: number | null;
};

export type LoginResponse = {
  token: string;
  user: BackendUser;
};

export type MeResponse = {
  user: BackendUser;
};
