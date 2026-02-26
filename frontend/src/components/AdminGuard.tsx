import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/admin-login' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
