import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar';
import OrdersSection from '../components/admin/OrdersSection';
import ProductsSection from '../components/admin/ProductsSection';
import CategoriesCollectionsSection from '../components/admin/CategoriesCollectionsSection';
import GoogleLoginScreen from '../components/admin/GoogleLoginScreen';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useClaimAdminAccess } from '../hooks/useMutations';
import { Loader2, ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from 'sonner';

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
    refetch: refetchAdminStatus,
  } = useIsCallerAdmin();

  // Mutation to claim admin access (bootstrap first admin)
  const claimAdminMutation = useClaimAdminAccess();

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

  const handleClaimAdmin = async () => {
    try {
      await claimAdminMutation.mutateAsync();
      await refetchAdminStatus();
      toast.success('Admin access claimed! Welcome to the dashboard.');
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Failed to claim admin access.';
      toast.error(msg);
    }
  };

  // ── Loading: initializing stored identity ──────────────────────────────────
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B0B0B' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={36} style={{ color: '#D10000' }} />
          <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  // ── Not logged in: show login screen ──────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <GoogleLoginScreen
        onLogin={handleLogin}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
      />
    );
  }

  // ── Checking admin status ──────────────────────────────────────────────────
  if (isAdminLoading || !isAdminFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B0B0B' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={36} style={{ color: '#D10000' }} />
          <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  // ── Not admin: show claim screen ───────────────────────────────────────────
  if (!isAdmin) {
    const isClaiming = claimAdminMutation.isPending;
    const claimError = claimAdminMutation.error;

    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: '#0B0B0B' }}
      >
        {/* Background red glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(209,0,0,0.07) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 w-full max-w-sm mx-4 text-center">
          <div
            style={{
              backgroundColor: '#0F0F0F',
              border: '1px solid rgba(209,0,0,0.2)',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            }}
          >
            {/* Top red bar */}
            <div style={{ height: '3px', backgroundColor: '#D10000' }} />

            <div className="px-8 py-10">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(209,0,0,0.1)',
                    border: '1px solid rgba(209,0,0,0.4)',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  }}
                >
                  <ShieldCheck size={28} style={{ color: '#D10000' }} />
                </div>
              </div>

              <h1
                className="text-2xl font-heading uppercase tracking-widest mb-2"
                style={{ color: '#ffffff' }}
              >
                Claim Admin Access
              </h1>
              <p
                className="text-xs uppercase tracking-widest mb-6"
                style={{ color: '#D10000', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
              >
                Beast Ride Dashboard
              </p>

              <div className="my-5" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(201,201,201,0.7)' }}>
                No admin is currently set. Click the button below to claim admin access with your current identity.
              </p>

              {/* Principal display */}
              {identity && (
                <p className="text-xs mb-6 font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {(() => {
                    const p = identity.getPrincipal().toString();
                    return p.length > 24 ? `${p.slice(0, 12)}...${p.slice(-8)}` : p;
                  })()}
                </p>
              )}

              {/* Claim button */}
              <button
                onClick={handleClaimAdmin}
                disabled={isClaiming}
                className="w-full py-4 text-sm font-heading uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isClaiming ? 'rgba(209,0,0,0.4)' : '#D10000',
                  border: '1px solid #D10000',
                  color: '#ffffff',
                  cursor: isClaiming ? 'not-allowed' : 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
                onMouseEnter={(e) => {
                  if (!isClaiming) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(209,0,0,0.8)';
                }}
                onMouseLeave={(e) => {
                  if (!isClaiming) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D10000';
                }}
              >
                {isClaiming ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Claiming Access...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Claim Admin Access
                  </>
                )}
              </button>

              {/* Error message */}
              {claimError && (
                <div
                  className="mt-4 px-3 py-3 text-left"
                  style={{ backgroundColor: 'rgba(209,0,0,0.08)', border: '1px solid rgba(209,0,0,0.25)' }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: '#ff9999' }}>
                    {claimError instanceof Error ? claimError.message : 'Failed to claim admin access. Please try again.'}
                  </p>
                  <button
                    onClick={() => claimAdminMutation.reset()}
                    className="mt-2 text-xs underline"
                    style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Sign out */}
              <button
                onClick={handleLogout}
                className="mt-4 w-full py-2.5 text-xs font-heading uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(201,201,201,0.5)',
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
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,201,201,0.5)';
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Branding */}
          <div className="flex items-center justify-center mt-6 gap-2">
            <div style={{ width: '6px', height: '6px', backgroundColor: '#D10000', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
              Beast Ride · Secure Admin Portal
            </span>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#D10000', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ────────────────────────────────────────────────────────
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
