# Specification

## Summary
**Goal:** Reset admin access so that every fresh deployment starts with an unclaimed admin slot, and the first authenticated user to visit the Admin page can claim admin with a single click.

**Planned changes:**
- Remove any hardcoded or persisted admin principal from backend stable storage initialization so the actor starts with no admin set after deployment
- Add a migration in the backend that clears any previously stored admin principal on canister upgrade
- Update the Admin page to detect when no admin is claimed and show a prominent "Claim Admin Access" button to the authenticated Internet Identity user
- Clicking the button calls `claimAdmin` and immediately grants admin privileges, then redirects to the admin dashboard
- Hide the claim button and show the normal admin dashboard when admin is already claimed

**User-visible outcome:** After publishing, the first user to open the Admin page sees a "Claim Admin Access" button and instantly becomes the admin with no errors. Subsequent visits show the normal admin dashboard.
