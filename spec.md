# Specification

## Summary
**Goal:** Add admin principal reset functionality so a new principal can reclaim admin access when the previous one is no longer valid.

**Planned changes:**
- Add a `resetAdminPrincipal` backend function in `backend/main.mo` that clears the stored admin principal, protected so only the current admin (or a safe fallback mechanism) can call it
- Add a "Reset Admin Access" button on the Admin dashboard (`frontend/src/pages/Admin.tsx`) that shows a confirmation dialog before calling the reset function, then allows the current principal to re-claim admin access, with toast notifications for success/error states
- Update the "already claimed" error state on the Admin page to show a user-friendly explanation and an inline option to reset admin access instead of a dead-end error

**User-visible outcome:** Admins can reset the stored admin principal from the dashboard and immediately re-claim access, and users who encounter the "already claimed" error are given a clear recovery path instead of being stuck.
