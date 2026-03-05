"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type SessionData = { initialAmount: number; startedAt: string } | null;

type DrawerSessionContextType = {
  hasDrawerStarted: boolean;
  hasActiveSession: boolean;
  sessionData: SessionData;
  setHasDrawerStarted: (v: boolean) => void;
  setHasActiveSession: (v: boolean) => void;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
  hasSession: boolean;
};

const DrawerSessionContext = createContext<DrawerSessionContextType | null>(null);

export function DrawerSessionProvider({ children }: { children: ReactNode }) {
  const [hasDrawerStarted, setHasDrawerStarted] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionData, setSessionData] = useState<{
    initialAmount: number;
    startedAt: string;
  } | null>(null);

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
