import axiosInstance from "@/lib/api/axiosInstance";

export type CashActionType = "add" | "remove";

export interface CashActionPayload {
  type: CashActionType;
  amount: number;
  description?: string;
  passcode: string;
}

export interface CloseSessionPayload {
  passcode: string;
  /** Closing/actual balance when closing the session. Backend may require this; send when user enters it (e.g. close-and-logout flow). */
  closingAmount?: number;
  actualBalance?: number;
}

/** Add or remove cash from the current drawer session (float increase / bank deposit). */
export async function cashAction(payload: CashActionPayload): Promise<void> {
  await axiosInstance.post("/sessions/cash-action", payload);
}

/**
 * Adjust session float to match a new "initial" amount (e.g. correction).
 * Uses cash-action under the hood: add if new > current, remove if new < current.
 */
export async function adjustInitialAmount(params: {
  currentAmount: number;
  newAmount: number;
  reason: string;
  passcode: string;
}): Promise<void> {
  const { currentAmount, newAmount, reason, passcode } = params;
  const diff = newAmount - currentAmount;
  if (Math.abs(diff) < 0.01) return;
  const description = reason.trim() ? `Initial amount correction: ${reason.trim()}` : "Initial amount correction";
  if (diff > 0) {
    await cashAction({ type: "add", amount: diff, description, passcode });
  } else {
    await cashAction({ type: "remove", amount: Math.abs(diff), description, passcode });
  }
}

/** Close the current drawer session. Requires passcode. Optionally send closingAmount/actualBalance if the backend expects it. */
export async function closeSession(payload: CloseSessionPayload): Promise<void> {
  const body: Record<string, unknown> = { passcode: payload.passcode };
  if (payload.closingAmount != null) body.closingAmount = payload.closingAmount;
  if (payload.actualBalance != null) body.actualBalance = payload.actualBalance;
  await axiosInstance.post("/sessions/close", body);
}

/**
 * Backend GET /sessions/active returns:
 * { id, userId, branchId, startBalance ("100.00"), currentBalance, status, startTime (ISO), endTime, closedBy, createdAt, updatedAt, transactions }
 */
export interface CurrentSession {
  id?: string | number;
  startBalance?: number | string;
  currentBalance?: number | string;
  status?: string;
  startTime?: string;
  startedAt?: string;
  openedAt?: string;
  endTime?: string | null;
  [key: string]: unknown;
}

function parseBalance(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value.replace(/,/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

/**
 * Get the active drawer session. GET /api/sessions/active.
 * Backend: 200 + session object, or 404 + { message } when no session.
 * Maps backend startTime → startedAt, parses startBalance string to number.
 */
export async function getCurrentSession(): Promise<CurrentSession | null> {
  try {
    const res = await axiosInstance.get<CurrentSession | { data?: CurrentSession; session?: CurrentSession }>("/sessions/active");
    let data = res.data;
    if (data && typeof data === "object" && "data" in data && (data as { data?: unknown }).data != null) {
      data = (data as { data: CurrentSession }).data;
    } else if (data && typeof data === "object" && "session" in data && (data as { session?: unknown }).session != null) {
      data = (data as { session: CurrentSession }).session;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const session = data as CurrentSession;
    const hasValid =
      session.status === "open" ||
      session.startBalance != null ||
      session.startTime != null ||
      session.startedAt != null ||
      session.openedAt != null;
    if (!hasValid) return null;
    return session;
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } })?.response?.status;
    if (status === 404 || status === 204) return null;
    throw e;
  }
}

/** Parsed active session for UI: opening amount as number, startedAt string for display. */
export function parseActiveSessionForUI(session: CurrentSession): { initialAmount: number; startedAt: string } {
  const amount = parseBalance(session.startBalance);
  const startTime =
    session.startTime ?? session.startedAt ?? session.openedAt ?? session.createdAt;
  let startedAt = "—";
  if (startTime != null && startTime !== "") {
    try {
      const t = typeof startTime === "string" || typeof startTime === "number" ? startTime : startTime instanceof Date ? startTime : String(startTime);
      startedAt = new Date(t).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      startedAt = String(startTime);
    }
  }
  return { initialAmount: amount, startedAt };
}

export interface StartSessionPayload {
  startBalance: number;
  passcode?: string;
}

/** Start a new drawer session. POST /api/sessions/start. */
export async function startSession(payload: StartSessionPayload): Promise<void> {
  await axiosInstance.post("/sessions/start", payload);
}

/**
 * Backend GET /sessions/history returns array of sessions with:
 * endTime (not closedAt), currentBalance (not closingAmount), closedBy (user id), closedByUser: { id, username?, role, employeeId? }
 * Frontend uses: closedAt (= endTime), closingAmount (= currentBalance), closedBy (display name from closedByUser).
 */
export interface SessionHistoryItem {
  id?: string | number;
  status?: string;
  endTime?: string | null;
  closedAt?: string | null;
  currentBalance?: number | string;
  closingAmount?: number | string;
  closedBy?: number | string;
  closedByUser?: { id?: number; username?: string; role?: string; employeeId?: string; name?: string };
  startTime?: string;
  startBalance?: number | string;
  [key: string]: unknown;
}

/** Get session history. GET /api/sessions/history. Filters to status === 'closed', maps endTime→closedAt, currentBalance→closingAmount, closedByUser→display name. */
export async function getSessionHistory(): Promise<SessionHistoryItem[]> {
  try {
    const res = await axiosInstance.get<SessionHistoryItem[] | { data?: SessionHistoryItem[]; sessions?: SessionHistoryItem[] }>("/sessions/history");
    const raw = res.data;
    let arr: SessionHistoryItem[] = [];
    if (Array.isArray(raw)) arr = raw;
    else if (raw && typeof raw === "object") {
      const data = (raw as { data?: SessionHistoryItem[] }).data ?? (raw as { sessions?: SessionHistoryItem[] }).sessions;
      arr = Array.isArray(data) ? data : [];
    }
    return arr.filter((s) => s.status === "closed").map((s) => ({
      ...s,
      closedAt: s.closedAt ?? s.endTime ?? "",
      closingAmount: s.closingAmount ?? s.currentBalance,
      closedBy: s.closedByUser
        ? (s.closedByUser.name ?? s.closedByUser.employeeId ?? s.closedByUser.username ?? s.closedByUser.role ?? `User ${s.closedByUser.id ?? s.closedBy ?? ""}`)
        : (s.closedBy != null ? `User ${s.closedBy}` : "—"),
    }));
  } catch {
    return [];
  }
}

/** Map history item to PreviousSessionSummary for UI. */
export function mapHistoryItemToSummary(item: SessionHistoryItem): { closedAt: string; closedBy: string; closingAmount: number } {
  const closedAtRaw = item.closedAt ?? item.endTime;
  const closedAt =
    closedAtRaw != null && closedAtRaw !== ""
      ? new Date(closedAtRaw).toLocaleString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).replace(",", " • ")
      : "";
  const closedBy =
    item.closedByUser != null
      ? (item.closedByUser.name ?? item.closedByUser.employeeId ?? item.closedByUser.username ?? item.closedByUser.role ?? `User ${item.closedByUser.id ?? ""}`)
      : (item.closedBy != null ? `User ${item.closedBy}` : "—");
  const closingAmount = parseBalance(item.closingAmount ?? item.currentBalance);
  return { closedAt, closedBy, closingAmount };
}
