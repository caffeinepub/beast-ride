# Specification

## Summary
**Goal:** Fix the "Access denied. Your account does not have admin privileges." error that prevents legitimate admins from accessing the admin panel.

**Planned changes:**
- Review and fix the admin principal comparison logic in the `AccessControl` mixin in `backend/main.mo` so the stored admin principal matches the authenticated caller's principal exactly.
- Ensure the frontend admin dashboard (`Admin.tsx`) and `OrdersSection.tsx` use the authenticated actor (not anonymous) for all admin-only backend calls.
- Update `useQueries.ts` and `useMutations.ts` so admin queries and mutations are only enabled when a valid authenticated identity is present.

**User-visible outcome:** An authenticated admin user can log in and access the admin panel without receiving an access denied error, while non-admin users remain correctly restricted.
