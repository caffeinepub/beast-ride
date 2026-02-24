import React from 'react';
import { ClipboardList, Package, Tag, LogOut, LayoutDashboard } from 'lucide-react';
import type { AdminSection } from '../pages/Admin';

interface Props {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
  identity: { getPrincipal: () => { toString: () => string } } | null;
}

const navItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
  { id: 'orders', label: 'Orders', icon: <ClipboardList size={18} /> },
  { id: 'products', label: 'Products', icon: <Package size={18} /> },
  { id: 'categories', label: 'Categories & Collections', icon: <Tag size={18} /> },
];

export default function AdminSidebar({ activeSection, onSectionChange, onLogout, identity }: Props) {
  const principal = identity?.getPrincipal().toString() ?? '';
  const shortPrincipal = principal.length > 12
    ? `${principal.slice(0, 6)}...${principal.slice(-4)}`
    : principal;

  return (
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: '240px',
        backgroundColor: '#080808',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo / Header */}
      <div
        className="px-5 py-5 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center"
          style={{
            backgroundColor: '#D10000',
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
          }}
        >
          <LayoutDashboard size={14} color="#fff" />
        </div>
        <div>
          <p
            className="font-heading text-xs uppercase tracking-widest"
            style={{ color: '#D10000', lineHeight: 1 }}
          >
            Beast Ride
          </p>
          <p
            className="font-heading text-xs uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}
          >
            Admin
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'rgba(209,0,0,0.12)' : 'transparent',
                borderLeft: isActive ? '2px solid #D10000' : '2px solid transparent',
                color: isActive ? '#ffffff' : '#C9C9C9',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
              }}
            >
              <span
                style={{ color: isActive ? '#D10000' : '#C9C9C9', flexShrink: 0 }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  borderLeft: isActive ? '2px solid #D10000' : '2px solid transparent',
                  paddingLeft: '0.5rem',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {shortPrincipal && (
          <p
            className="text-xs mb-3 truncate"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
          >
            {shortPrincipal}
          </p>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 transition-colors duration-200"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#C9C9C9',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#D10000';
            (e.currentTarget as HTMLButtonElement).style.color = '#D10000';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLButtonElement).style.color = '#C9C9C9';
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
