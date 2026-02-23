"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { ROUTES } from "@/lib/constants";

export type UserRole = "cashier" | "manager" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};

const AUTH_STORAGE_KEY = "pos_auth_user";

function loadStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed?.id && parsed?.name && parsed?.role) return parsed;
  } catch {
    return null;
  }
  return null;
}

function saveStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    return;
  }
}

type AuthContextType = {
  user: AuthUser | null;
  role: UserRole | null;
  isReady: boolean;
  isCashier: boolean;
  isManagerOrAdmin: boolean;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(loadStoredUser());
    setHydrated(true);
  }, []);

  const login = useCallback((role: UserRole, name?: string) => {
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: name?.trim() || (role === "cashier" ? "Cashier" : role === "manager" ? "Manager" : "Admin"),
      role,
    };
    setUser(newUser);
    saveStoredUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveStoredUser(null);
    if (typeof window !== "undefined") window.location.href = ROUTES.HOME;
  }, []);

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    isReady: hydrated,
    isCashier: user?.role === "cashier",
    isManagerOrAdmin: user?.role === "manager" || user?.role === "admin",
    login,
    logout,
  };

  if (!hydrated) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
