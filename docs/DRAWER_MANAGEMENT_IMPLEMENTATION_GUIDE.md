# Drawer Management & Device Registration — Implementation Guide

> **Purpose:** This document describes the design and implementation requirements for the cash drawer management system in the Restaurant POS. It is intended for developers who will implement this feature.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Business Requirements](#2-business-requirements)
3. [Architecture](#3-architecture)
4. [Data Models](#4-data-models)
5. [Device Registration & Pairing](#5-device-registration--pairing)
6. [Drawer Sessions](#6-drawer-sessions)
7. [API Specification](#7-api-specification)
8. [Frontend Implementation](#8-frontend-implementation)
9. [Backend Implementation](#9-backend-implementation)
10. [Edge Cases & Error Handling](#10-edge-cases--error-handling)
11. [Security Considerations](#11-security-considerations)

---

## 1. Overview

The POS system operates across **multiple branches**, each with **multiple cashier points** (e.g., 3 branches × 3+ terminals each). Each terminal has a physical cash drawer. Cashiers must:

- **Start a drawer session** when they begin their shift (enter opening amount)
- **Close the drawer session** before logging out (enter closing amount)
- Only process payments when they have an active drawer session

The system must uniquely identify each drawer and prevent conflicts when multiple cashiers work simultaneously across different machines and branches.

---

## 2. Business Requirements

| Requirement | Description |
|-------------|-------------|
| **One open session per drawer** | Only one cashier can have an active session per physical drawer at any time |
| **One open session per cashier** | A cashier cannot have two open sessions (e.g., at two different machines) simultaneously |
| **Session accountability** | Every cash payment is tied to a drawer session for reconciliation |
| **Multi-branch support** | Terminals and sessions are scoped by branch; no cross-branch conflicts |
| **Reliable terminal identity** | Each drawer/terminal is uniquely identified; clients cannot spoof which terminal they are |

---

## 3. Architecture

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Device** | Physical machine (browser/tablet/PC) running the POS. Has a unique ID and optional token. |
| **Terminal** | Logical drawer/station. Belongs to a branch. One physical drawer per terminal. |
| **Pairing** | One-time link: Device → Terminal. Performed by a manager. |
| **Drawer Session** | Time-bounded period when a cashier is responsible for a drawer. Has opening and closing amounts. |

### Design Principles

1. **Backend is source of truth** — All session and device state lives on the server.
2. **Device registration** — Devices are first-class entities; they are registered and paired, not configured per machine.
3. **Explicit pairing** — A manager pairs a device to a terminal. The client never chooses its own terminal.
4. **No client trust** — The terminal ID is never taken from the request body; it is resolved from the device mapping on the backend.

---

## 4. Data Models

### Terminal

Represents a logical cash drawer/station at a branch.

```
Terminal
├── id              (PK, auto-increment or UUID)
├── branchId        (FK → Branch)
├── name            (e.g. "Station 1", "Front Counter", "Drive-thru")
├── code            (optional, e.g. "BR1-ST1" for display/pairing)
└── isActive        (boolean)
```

### Device

Represents a physical machine. Paired to exactly one terminal.

```
Device
├── id              (PK, UUID)
├── terminalId      (FK → Terminal, nullable until paired)
├── deviceToken     (opaque token for device auth, optional)
├── lastSeenAt      (timestamp, for monitoring)
├── metadata        (optional: userAgent, etc.)
└── pairedAt        (timestamp, when pairing was completed)
```

### DrawerSession

Represents a cashier's shift on a specific drawer.

```
DrawerSession
├── id              (PK)
├── terminalId      (FK → Terminal)
├── userId          (FK → User, the cashier)
├── branchId        (FK → Branch, denormalized for queries)
├── openingAmount   (decimal)
├── closingAmount   (nullable until closed)
├── openedAt        (timestamp)
├── closedAt        (nullable)
├── status          ("open" | "closed")
└── notes           (optional)
```

### Payment / Order (existing)

Add a foreign key to link cash payments to the drawer session:

```
Payment (or Order, depending on your schema)
├── ... existing fields
└── drawerSessionId  (FK → DrawerSession, for cash payments)
```

---

## 5. Device Registration & Pairing

### 5.1 Device Registration (One-Time)

When a new device first opens the POS:

1. Client has no `deviceId` or `deviceToken` in storage.
2. Client calls `POST /api/devices/register` (no user auth required).
3. Backend creates a `Device` record:
   - `id` = new UUID
   - `terminalId` = NULL (unpaired)
   - `deviceToken` = signed JWT or opaque token (long-lived, e.g. 1 year)
4. Response: `{ deviceId, deviceToken }`
5. Client stores both in `localStorage` (or IndexedDB for durability).

### 5.2 Pairing (Manager Only)

An unpaired device cannot be used for POS operations. Pairing is done by a manager:

1. Unpaired device shows: *"This device is not activated. Ask your manager to pair this device."*
2. Device displays a **pairing code** (6 digits) or **QR code** encoding `deviceId`.
3. Manager uses admin app (or another device) → "Pair device" → scans QR or enters code.
4. Manager selects **Terminal** (and thus **Branch**) from a list.
5. Backend: `PATCH /api/devices/{deviceId}/pair` with `{ terminalId }` (manager auth required).
6. Backend sets `Device.terminalId = terminalId`, `pairedAt = now`.
7. Paired device polls or refreshes and proceeds.

**Pairing UX options:**

| Method | Description |
|--------|-------------|
| QR code | Device shows QR; manager scans with phone/admin app |
| 6-digit code | Device shows code; manager enters in admin panel |
| Admin-initiated | Manager creates pairing in admin; device shows code; manager enters same code to confirm |

### 5.3 Request Flow

Every API request from a POS device must include:

- `Authorization: Bearer {userToken}` — identifies the cashier
- `X-Device-Id: {deviceId}` — identifies the device (or send `deviceToken` in header/cookie)

Backend resolves:

1. Validate user token → get `userId`, `branchId`
2. Load `Device` by `deviceId` → get `terminalId`
3. Ensure `Device.terminalId` is not NULL (device is paired)
4. Ensure `Terminal.branchId === User.branchId` (user belongs to same branch as terminal)
5. Use `terminalId` for drawer session and payment operations

---

## 6. Drawer Sessions

### 6.1 Session Lifecycle

```
[Login] → [Start Session] → [Process Payments] → [Close Session] → [Logout]
                ↑                                      ↓
                └────────────── (block POS until closed) ──────────┘
```

### 6.2 Start Session (After Login)

1. Cashier logs in (existing auth flow).
2. Redirect to dashboard.
3. Before allowing POS actions:
   - Call `GET /api/drawer-sessions/current` (with `X-Device-Id`).
   - If no open session for this user and this terminal:
     - Show **"Start Drawer Session"** modal.
     - Cashier enters **opening amount** (counted from drawer).
     - Call `POST /api/drawer-sessions/open` with `{ openingAmount }`.
   - If user has open session on *another* terminal: block and show message.
   - If terminal has open session with *another* cashier: block and show message.

### 6.3 During Shift

- All cash payments include `drawerSessionId` (from current session).
- Backend validates that the session is open and belongs to the requesting user/terminal.

### 6.4 Close Session (Before Logout)

1. Cashier clicks Logout.
2. Check: does user have an open drawer session?
   - **Yes** → Show **"Close Drawer Session"** modal. Cashier enters **closing amount**.
   - Call `POST /api/drawer-sessions/{id}/close` with `{ closingAmount }`.
   - Then proceed with `signOut()`.
   - **No** → Proceed with `signOut()` directly.

---

## 7. API Specification

### Device APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/devices/register` | None | Register a new device. Returns `deviceId`, `deviceToken`. |
| PATCH | `/api/devices/:id/pair` | Manager | Pair device to terminal. Body: `{ terminalId }`. |
| GET | `/api/devices/:id` | Manager | Get device info (for admin). |
| PATCH | `/api/devices/:id/unpair` | Manager | Unpair device (set `terminalId` to NULL). |

### Terminal APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/terminals` | User | List terminals. Query: `?branchId=X`. Returns terminals for user's branch. |
| GET | `/api/terminals/:id` | User | Get terminal by ID. |
| POST | `/api/terminals` | Manager/Admin | Create terminal. Body: `{ branchId, name, code? }`. |
| PATCH | `/api/terminals/:id` | Manager/Admin | Update terminal. |

### Drawer Session APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/drawer-sessions/current` | Cashier | Get current open session for this user. Requires `X-Device-Id`. Backend resolves terminal from device. |
| POST | `/api/drawer-sessions/open` | Cashier | Start session. Body: `{ openingAmount }`. Terminal from device. |
| POST | `/api/drawer-sessions/:id/close` | Cashier | Close session. Body: `{ closingAmount }`. Only session owner can close. |
| GET | `/api/drawer-sessions` | Manager | List sessions (filter by branch, date, status). |

### Request Headers

All POS requests (except device registration) should include:

```
Authorization: Bearer {userJwt}
X-Device-Id: {deviceId}
```

---

## 8. Frontend Implementation

### 8.1 Device Storage

```typescript
// lib/drawer/deviceStorage.ts

const DEVICE_ID_KEY = 'pos_device_id';
const DEVICE_TOKEN_KEY = 'pos_device_token';

export function getStoredDevice(): { deviceId: string; deviceToken: string } | null {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem(DEVICE_ID_KEY);
  const token = localStorage.getItem(DEVICE_TOKEN_KEY);
  if (!id || !token) return null;
  return { deviceId: id, deviceToken: token };
}

export function setStoredDevice(deviceId: string, deviceToken: string): void {
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  localStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);
}

export function clearStoredDevice(): void {
  localStorage.removeItem(DEVICE_ID_KEY);
  localStorage.removeItem(DEVICE_TOKEN_KEY);
}
```

### 8.2 Axios Interceptor

Add `X-Device-Id` to all requests:

```typescript
// In axiosInstance.ts or similar
axiosInstance.interceptors.request.use((config) => {
  const device = getStoredDevice();
  if (device) {
    config.headers['X-Device-Id'] = device.deviceId;
  }
  // ... existing auth logic
  return config;
});
```

### 8.3 Device Registration Flow

On app load (or before first POS action):

1. Check `getStoredDevice()`.
2. If null, call `POST /api/devices/register`.
3. Store `deviceId` and `deviceToken`.
4. Check if device is paired: e.g. `GET /api/devices/me` or infer from drawer-session API response.

### 8.4 Pairing Screen

When device is unpaired:

- Block all POS routes.
- Show full-screen "Pair Device" view with:
  - 6-digit pairing code (or QR)
  - Message: "Ask your manager to pair this device"
- Poll `GET /api/devices/me` or similar to detect when paired.

### 8.5 Drawer Session Context

Create a context that:

- Fetches `GET /api/drawer-sessions/current` when cashier is logged in.
- Exposes: `currentSession`, `startSession(amount)`, `closeSession(sessionId, amount)`, `isLoading`, `error`.
- Triggers "Start Session" modal when no session and user is cashier.
- Integrates with logout flow to show "Close Session" modal when session is open.

### 8.6 Modals

| Modal | When | Actions |
|-------|------|---------|
| Start Drawer Session | After login, no open session | Input: opening amount. Submit → `POST /api/drawer-sessions/open`. |
| Close Drawer Session | User clicks Logout with open session | Input: closing amount. Submit → `POST /api/drawer-sessions/:id/close` → then `signOut()`. |

---

## 9. Backend Implementation

### 9.1 Middleware: Resolve Terminal from Device

```text
1. Extract X-Device-Id from request headers.
2. If missing and route requires device → 400 "Device not registered".
3. Load Device by deviceId.
4. If not found → 400 "Invalid device".
5. If Device.terminalId is NULL → 403 "Device not paired".
6. Load Terminal by Device.terminalId.
7. Attach terminalId (and terminal) to request (e.g. req.terminalId).
8. For drawer/payment routes: ensure User.branchId === Terminal.branchId.
```

### 9.2 Validation Rules

| Rule | Implementation |
|------|----------------|
| One open session per terminal | Before creating session: `SELECT * FROM DrawerSession WHERE terminalId = ? AND status = 'open'`. If exists, 409 Conflict. |
| One open session per user | Before creating session: `SELECT * FROM DrawerSession WHERE userId = ? AND status = 'open'`. If exists, 409 Conflict. |
| User at correct branch | `User.branchId === Terminal.branchId`. If not, 403. |
| Only session owner can close | `DrawerSession.userId === req.user.id`. |

---

## 10. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Cashier forgets to close session | Manager can close via admin UI. Or implement auto-close after X hours of inactivity. |
| Browser crash / tab closed | Session remains open on backend. Next login: "You have an open session" — prompt to close or continue. |
| Same cashier logs in on two machines | Block opening second session. Message: "Close your session at [Terminal X] first." |
| Different cashier sits at machine with open session | Block. Message: "Drawer has an open session by [Cashier A]. Ask them to close it first." |
| Device storage cleared | Device must re-register. Becomes unpaired. Show pairing screen. |
| Device moved to different branch | Pairing is terminal-specific. If terminal is at Branch A, device at Branch B location would need re-pairing to a Branch B terminal. |

---

## 11. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Client spoofing terminal | Terminal is never taken from request body. Always resolved from Device → Terminal on backend. |
| Stolen device | Device token can be revoked. Manager can unpair device. |
| Unauthorized pairing | Pairing requires manager/admin role. |
| Session hijacking | Use HTTPS. JWT for user auth. Device token for device identity. |

---

## Appendix: Quick Reference

### Entities

- **Branch** — Location (existing).
- **Terminal** — Logical drawer at a branch.
- **Device** — Physical machine; paired to one terminal.
- **DrawerSession** — Cashier's shift on a drawer (opening/closing amounts).

### Key Flows

1. **Device**: Register → Pair (by manager) → Use.
2. **Cashier**: Login → Start session (opening amount) → Work → Close session (closing amount) → Logout.
3. **Payment**: Include `drawerSessionId` for cash payments.

### Files to Create/Modify (Frontend)

- `src/lib/drawer/deviceStorage.ts` — Device ID/token storage.
- `src/contexts/DrawerSessionContext.tsx` — Session state and modals.
- `src/components/drawer/StartSessionModal.tsx` — Start session modal.
- `src/components/drawer/CloseSessionModal.tsx` — Close session modal.
- `src/components/drawer/PairDeviceScreen.tsx` — Unpaired device UI.
- `src/lib/api/axiosInstance.ts` — Add `X-Device-Id` header.
- `src/app/dashboard/cashier/*` — Integrate session check before POS actions.
- `src/components/dashboard/DashboardSidebar.tsx` — Intercept logout for close-session flow.

---

*Document version: 1.0 — Created for Restaurant POS drawer management implementation.*
