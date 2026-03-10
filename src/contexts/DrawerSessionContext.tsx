"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as sessionService from "@/services/sessionService";

type SessionData = { initialAmount: number; startedAt: string } | null;

type DrawerSessionContextType = {
  hasDrawerStarted: boolean;
  hasActiveSession: boolean;
  sessionData: SessionData;
  setHasDrawerStarted: (v: boolean) => void;
  setHasActiveSession: (v: boolean) => void;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
  hasSession: boolean;
  isSessionLoading: boolean;
};

const DrawerSessionContext = createContext<DrawerSessionContextType | null>(null);

export function DrawerSessionProvider({ children }: { children: ReactNode }) {
  const [hasDrawerStarted, setHasDrawerStarted] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    sessionService
      .getCurrentSession()
      .then((current) => {
        if (cancelled) return;
        if (current) {
          const { initialAmount, startedAt } = sessionService.parseActiveSessionForUI(current);
          if (initialAmount > 0 || (startedAt && startedAt !== "—")) {
            setSessionData({ initialAmount, startedAt });
            setHasActiveSession(true);
            setHasDrawerStarted(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsSessionLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasSession = hasDrawerStarted && hasActiveSession;

  return (
    <DrawerSessionContext.Provider
      value={{
        hasDrawerStarted,
        hasActiveSession,
        sessionData,
        setHasDrawerStarted,
        setHasActiveSession,
        setSessionData,
        hasSession,
        isSessionLoading,
      }}
    >
      {children}
    </DrawerSessionContext.Provider>
  );
}

export function useDrawerSession() {
  const ctx = useContext(DrawerSessionContext);
  return ctx;
}
