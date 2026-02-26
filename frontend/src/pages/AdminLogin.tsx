import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

const ADMIN_ID = 'BeastRide@bhagirath';
const ADMIN_PASSWORD = 'Jay@mahakal@3450';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate brief processing
    setTimeout(() => {
      if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        navigate({ to: '/admin' });
      } else {
        setError('Invalid ID or Password');
        setIsSubmitting(false);
      }
    }, 300);
  };

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

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Card */}
        <div
          style={{
            backgroundColor: '#0F0F0F',
            border: '1px solid rgba(209,0,0,0.2)',
            clipPath:
              'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}
        >
          {/* Red top bar */}
          <div style={{ height: '3px', backgroundColor: '#D10000' }} />

          <div className="px-8 py-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="/assets/generated/beast-ride-logo.dim_400x120.png"
                alt="Beast Ride"
                className="h-10 object-contain mb-4"
                style={{ filter: 'brightness(1.1)' }}
              />
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{
                    backgroundColor: '#D10000',
                    clipPath:
                      'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                  }}
                >
                  <ShieldCheck size={12} color="#fff" />
                </div>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Divider */}
            <div
              className="mb-7"
              style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }}
            />

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Admin ID */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="adminId"
                  className="text-xs uppercase tracking-widest"
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Admin ID
                </label>
                <input
                  id="adminId"
                  type="text"
                  value={adminId}
                  onChange={(e) => {
                    setAdminId(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter Admin ID"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontFamily: "'Barlow', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(209,0,0,0.5)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                  }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs uppercase tracking-widest"
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-11 text-sm outline-none transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontFamily: "'Barlow', sans-serif",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(209,0,0,0.5)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#D10000';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)';
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="flex items-center gap-2 px-3 py-2.5"
                  style={{
                    backgroundColor: 'rgba(209,0,0,0.1)',
                    border: '1px solid rgba(209,0,0,0.3)',
                  }}
                >
                  <AlertCircle size={14} style={{ color: '#D10000', flexShrink: 0 }} />
                  <p
                    className="text-xs"
                    style={{
                      color: '#ff6b6b',
                      fontFamily: "'Barlow', sans-serif",
                    }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-xs font-heading uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 mt-1"
                style={{
                  backgroundColor: isSubmitting ? 'rgba(209,0,0,0.5)' : '#D10000',
                  border: '1px solid #D10000',
                  color: '#ffffff',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  clipPath:
                    'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      'rgba(209,0,0,0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D10000';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    Login to Dashboard
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back to site link */}
        <div className="text-center mt-5">
          <a
            href="/"
            className="text-xs uppercase tracking-widest transition-colors duration-200"
            style={{
              color: 'rgba(255,255,255,0.25)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#D10000';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)';
            }}
          >
            ← Back to Beast Ride
          </a>
        </div>
      </div>
    </div>
  );
}
