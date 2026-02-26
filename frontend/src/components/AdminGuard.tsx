import React from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

// AdminGuard is now a pass-through — all authentication and authorization
// is handled by Internet Identity inside the Admin page itself.
export default function AdminGuard({ children }: AdminGuardProps) {
  return <>{children}</>;
}
