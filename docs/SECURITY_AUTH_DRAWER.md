# Security: Authentication & Drawer Session

## Overview

This document describes authentication, session timeout, drawer handling, and related security measures for the POS system.

---

## Idle Timeout

- **Default:** 15 minutes of inactivity (PCI DSS recommendation for admin sessions)
- **Configurable:** Set `NEXT_PUBLIC_AUTH_IDLE_TIMEOUT_MINUTES` in `.env` to override
- **Behavior:** After the idle period, the user is signed out. The drawer session is **not** closed.
- **Activity resets timer:** Mouse, keyboard, scroll, touch, and API requests

## Session Limits

- **Absolute max:** 12 hours (session expires regardless of activity)
- **Rolling extension:** Session extends on activity every 15 minutes (`updateAge`)

## Drawer Session on Timeout

When the user is signed out due to idle timeout:

1. **Auth is invalidated** – user is redirected to login
2. **Drawer stays open** – backend keeps the drawer session open
3. **On re-login** – user sees their open drawer and can close it with the actual count

This avoids closing the drawer with a fake/unknown value, which would corrupt the audit trail.

## Forced Close (Future)

Managers may need to close abandoned drawers. A future enhancement could add a "Force close" action that:
- Uses expected balance (or manager-entered amount)
- Records `closedBy: manager` and `closureType: forced` in the audit trail

---

## Implemented Security Measures

| Measure | Description |
|--------|-------------|
| **Cookie security** | `secure` and `sameSite: "strict"` in production (HTTPS) |
| **Security headers** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **401 handling** | Global axios interceptor signs out on 401 and redirects to login |
| **Session expiry toast** | User sees "Your session expired" when redirected due to 401 |
| **Debug logs** | Removed debug `console.log` of order/product data; error logging limited to development |

---

## Additional Recommendations

### Backend (if applicable)

- **JWT expiry:** Align backend JWT expiry with frontend session (e.g. 12h max)
- **Rate limiting:** Throttle login attempts and sensitive API endpoints
- **Audit logging:** Log auth events, drawer open/close, refunds, and role changes
- **Input validation:** Validate all inputs server-side; never trust client data

### Deployment

- **HTTPS only:** Use HTTPS in production; cookies with `secure` require it
- **NEXTAUTH_SECRET:** Use a strong, random secret; never commit to source
- **Environment variables:** Keep API keys and secrets in env; use `.env.example` for documentation

### Operational

- **Regular logouts:** Encourage staff to log out at shift end
- **Shared terminals:** Idle timeout reduces risk on shared devices
- **Manager force-close:** Implement for abandoned drawers left by staff who forgot to close
