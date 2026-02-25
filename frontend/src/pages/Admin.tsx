import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar';
import OrdersSection from '../components/admin/OrdersSection';
import ProductsSection from '../components/admin/ProductsSection';
import CategoriesCollectionsSection from '../components/admin/CategoriesCollectionsSection';
import GoogleLoginScreen from '../components/admin/GoogleLoginScreen';
import { Loader2 } from 'lucide-react';

export type AdminSection = 'orders' | 'products' | 'categories';

export default function Admin() {
  const { login, clear, loginStatus, identity, isInitializing, loginError } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<AdminSection>('orders');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  // Show spinner while initializing stored identity
  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0B0B0B' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={36} style={{ color: '#D10000' }} />
          <p
            className="text-xs uppercase tracking-widest"
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
            }}
          >
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  // Show Google-only login screen for unauthenticated users
  if (!isAuthenticated) {
    return (
      <GoogleLoginScreen
        onLogin={handleLogin}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
      />
    );
  }

  // Authenticated admin dashboard
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0B0B0B' }}>
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        identity={identity}
      />
      <main className="flex-1 overflow-auto" style={{ minWidth: 0 }}>
        {activeSection === 'orders' && <OrdersSection />}
        {activeSection === 'products' && <ProductsSection />}
        {activeSection === 'categories' && <CategoriesCollectionsSection />}
      </main>
    </div>
  );
}
