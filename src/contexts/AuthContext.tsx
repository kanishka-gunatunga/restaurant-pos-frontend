"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSession, signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { ROUTES } from "@/lib/constants";

export type UserRole = "cashier" | "manager" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
  employeeId?: string;
  email?: string | null;
  branchId?: number | null;
};

const ALLOWED_ROLES: UserRole[] = ["admin", "manager", "cashier"];

function sessionUserToAuthUser(sessionUser: { id?: string; name?: string | null; role?: string } | null): AuthUser | null {
  if (!sessionUser?.id || !sessionUser?.name || !sessionUser?.role) return null;
  const rawRole = sessionUser.role;
  const roleLower = typeof rawRole === "string" ? rawRole.trim().toLowerCase() : "";
  const role = ALLOWED_ROLES.includes(roleLower as UserRole) ? (roleLower as UserRole) : null;
  if (!role) return null;
  return {
    id: sessionUser.id,
    name: sessionUser.name,
    role,
    employeeId: (sessionUser as { employeeId?: string }).employeeId,
    email: (sessionUser as { email?: string | null }).email ?? null,
    branchId: (sessionUser as { branchId?: number | null }).branchId ?? null,
  };
}

type AuthContextType = {
  user: AuthUser | null;
  role: UserRole | null;
  isReady: boolean;
  isCashier: boolean;
  isManagerOrAdmin: boolean;
  token: string | null;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isReady = status !== "loading";
  const user = sessionUserToAuthUser(session?.user ?? null);
  const token = (session?.user as { token?: string } | undefined)?.token ?? null;

  // Sync token to cookie for axiosInstance and other consumers
  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 1 }); // 1 day
    } else if (status === "unauthenticated") {
      Cookies.remove("token");
    }
  }, [token, status]);

  const logout = useCallback(() => {
    signOut({ callbackUrl: ROUTES.HOME });
  }, []);

  const login = useCallback((_role: UserRole, _name?: string) => {
    // No-op: actual login is done via NextAuth signIn in LoginForm
  }, []);

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    isReady,
    isCashier: user?.role === "cashier",
    isManagerOrAdmin: user?.role === "manager" || user?.role === "admin",
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
