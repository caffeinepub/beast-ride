# Specification

## Summary
**Goal:** Restrict the admin panel to only allow login via Internet Identity using Google as the authentication method, and enforce principal-based authorization on all backend admin operations.

**Planned changes:**
- Replace the admin login screen with a single "Sign in with Google" button that triggers the Internet Identity Google login flow; remove any other login options.
- Unauthenticated users are shown only the login screen and cannot access any admin content.
- After successful Google-based Internet Identity login, the user is granted access to the admin dashboard.
- In the backend Motoko actor, add caller principal validation to all admin-only functions (product CRUD, order management, category/collection management).
- Automatically grant admin access to the initial deployer principal.
- Add a mechanism to whitelist additional admin principals.
- Unauthorized or anonymous callers receive a clear authorization error.

**User-visible outcome:** Admin users can only access the admin panel by signing in with Google via Internet Identity; all other login options are hidden, and unauthorized callers are blocked from admin backend functions.
