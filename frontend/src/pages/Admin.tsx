import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar';
import OrdersSection from '../components/admin/OrdersSection';
import ProductsSection from '../components/admin/ProductsSection';
import CategoriesCollectionsSection from '../components/admin/CategoriesCollectionsSection';
import { LogIn, Loader2 } from 'lucide-react';

export type AdminSection = 'orders' | 'products' | 'categories';

export default function Admin() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
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

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0B0B0B' }}
      >
        <Loader2 className="animate-spin text-beast-red" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0B0B0B' }}
      >
        <div
          className="text-center p-10 max-w-md w-full mx-4"
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(209,0,0,0.15)', border: '1px solid #D10000' }}
          >
            <LogIn size={28} style={{ color: '#D10000' }} />
          </div>
          <h1
            className="text-3xl font-heading uppercase tracking-widest mb-3"
            style={{ color: '#ffffff' }}
          >
            Admin Access
          </h1>
          <p className="text-sm mb-8" style={{ color: '#C9C9C9' }}>
            Sign in with your Internet Identity to access the Beast Ride admin dashboard.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="beast-btn beast-btn-sweep w-full flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>
    );
  }

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
