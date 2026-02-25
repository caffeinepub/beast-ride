import React from 'react';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';

interface GoogleLoginScreenProps {
  onLogin: () => void;
  isLoggingIn: boolean;
  loginError?: Error;
}

export default function GoogleLoginScreen({ onLogin, isLoggingIn, loginError }: GoogleLoginScreenProps) {
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
          background: 'radial-gradient(circle, rgba(209,0,0,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Card */}
        <div
          style={{
            backgroundColor: '#0F0F0F',
            border: '1px solid rgba(255,255,255,0.08)',
            clipPath:
              'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}
        >
          {/* Top red accent bar */}
          <div style={{ height: '3px', backgroundColor: '#D10000' }} />

          <div className="px-8 py-10">
            {/* Icon */}
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
                <ShieldCheck size={28} style={{ color: '#D10000' }} />
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-center text-2xl font-heading uppercase tracking-widest mb-1"
              style={{ color: '#ffffff' }}
            >
              Admin Access
            </h1>
            <p
              className="text-center text-xs uppercase tracking-widest mb-2"
              style={{
                color: '#D10000',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
              }}
            >
              Beast Ride Dashboard
            </p>

            {/* Divider */}
            <div
              className="my-6"
              style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }}
            />

            {/* Description */}
            <p
              className="text-center text-sm mb-8 leading-relaxed"
              style={{ color: 'rgba(201,201,201,0.7)' }}
            >
              Admin access is restricted to authorized users only. Sign in with your{' '}
              <span style={{ color: '#C9C9C9', fontWeight: 600 }}>Google account</span> via
              Internet Identity to continue.
            </p>

            {/* Google Sign In Button */}
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 transition-all duration-200"
              style={{
                backgroundColor: isLoggingIn ? 'rgba(255,255,255,0.05)' : '#ffffff',
                color: isLoggingIn ? 'rgba(255,255,255,0.4)' : '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '0.875rem 1.5rem',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                clipPath:
                  'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ color: '#D10000' }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Authenticating...</span>
                </>
              ) : (
                <>
                  <SiGoogle size={18} style={{ color: '#4285F4' }} />
                  Sign in with Google
                </>
              )}
            </button>

            {/* Error message */}
            {loginError && (
              <div
                className="mt-4 flex items-start gap-2 px-3 py-3"
                style={{
                  backgroundColor: 'rgba(209,0,0,0.1)',
                  border: '1px solid rgba(209,0,0,0.3)',
                }}
              >
                <AlertCircle size={14} style={{ color: '#D10000', flexShrink: 0, marginTop: '1px' }} />
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {loginError.message === 'User is already authenticated'
                    ? 'Session conflict detected. Please try again.'
                    : loginError.message || 'Authentication failed. Please try again.'}
                </p>
              </div>
            )}

            {/* Info note */}
            <p
              className="text-center text-xs mt-6"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>

        {/* Beast Ride branding below card */}
        <div className="flex items-center justify-center mt-6 gap-2">
          <div
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#D10000',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />
          <span
            className="text-xs uppercase tracking-widest"
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
            }}
          >
            Beast Ride · Secure Admin Portal
          </span>
          <div
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#D10000',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
