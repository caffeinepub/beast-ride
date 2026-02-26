import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar';
import OrdersSection from '../components/admin/OrdersSection';
import ProductsSection from '../components/admin/ProductsSection';
import CategoriesCollectionsSection from '../components/admin/CategoriesCollectionsSection';
import GoogleLoginScreen from '../components/admin/GoogleLoginScreen';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Loader2, ShieldX } from 'lucide-react';

export type AdminSection = 'orders' | 'products' | 'categories';

export default function Admin() {
  const { login, clear, loginStatus, identity, isInitializing, loginError } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<AdminSection>('orders');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Check admin status only after authentication
  const {
    data: isAdmin,
    isLoading: isAdminLoading,
    isFetched: isAdminFetched,
  } = useIsCallerAdmin();

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

  // Show login screen for unauthenticated users
  if (!isAuthenticated) {
    return (
      <GoogleLoginScreen
        onLogin={handleLogin}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
      />
    );
  }

  // Show spinner while checking admin status
  if (isAdminLoading || !isAdminFetched) {
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
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  // Show access denied screen if authenticated but not admin
  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: '#0B0B0B' }}
      >
        {/* Background red glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(209,0,0,0.06) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <div className="relative z-10 w-full max-w-sm mx-4 text-center">
          <div
            style={{
              backgroundColor: '#0F0F0F',
              border: '1px solid rgba(209,0,0,0.2)',
              clipPath:
                'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            }}
          >
            <div style={{ height: '3px', backgroundColor: '#D10000' }} />
            <div className="px-8 py-10">
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(209,0,0,0.1)',
                    border: '1px solid rgba(209,0,0,0.4)',
                    clipPath:
                      'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  }}
                >
                  <ShieldX size={28} style={{ color: '#D10000' }} />
                </div>
              </div>

              <h1
                className="text-2xl font-heading uppercase tracking-widest mb-2"
                style={{ color: '#ffffff' }}
              >
                Access Denied
              </h1>
              <p
                className="text-xs uppercase tracking-widest mb-6"
                style={{
                  color: '#D10000',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                }}
              >
                Insufficient Privileges
              </p>

              <div
                className="my-5"
                style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }}
              />

              <p
                className="text-sm mb-2 leading-relaxed"
                style={{ color: 'rgba(201,201,201,0.7)' }}
              >
                Your account does not have admin privileges. Contact the system administrator to
                request access.
              </p>

              {identity && (
                <p
                  className="text-xs mt-4 font-mono"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  Principal:{' '}
                  {(() => {
                    const p = identity.getPrincipal().toString();
                    return p.length > 20 ? `${p.slice(0, 10)}...${p.slice(-6)}` : p;
                  })()}
                </p>
              )}

              <button
                onClick={handleLogout}
                className="mt-6 w-full py-2.5 text-xs font-heading uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#C9C9C9',
                  cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#D10000';
                  (e.currentTarget as HTMLButtonElement).style.color = '#D10000';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#C9C9C9';
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
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
