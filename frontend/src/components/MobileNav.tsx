import React from 'react';
import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: Props) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <nav
        className={`mobile-nav fixed top-0 left-0 h-full w-72 z-50 flex flex-col ${isOpen ? 'open' : ''}`}
        style={{ backgroundColor: '#0B0B0B', borderRight: '1px solid rgba(209,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <img
            src="/assets/generated/beast-ride-logo.dim_400x120.png"
            alt="BEAST RIDE"
            className="h-8 w-auto object-contain"
          />
          <button onClick={onClose} className="text-white hover:text-beast-red transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-1">
          {[
            { label: 'Home', to: '/' },
            { label: 'Shop All', to: '/shop' },
            { label: 'Bike Accessories', to: '/shop?category=Bike+Accessories' },
            { label: 'Car Performance', to: '/shop?category=Car+Performance' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="block py-4 font-heading font-bold text-xl uppercase tracking-widest text-white hover:text-beast-red transition-colors border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto p-6">
          <div className="w-full h-px mb-6" style={{ backgroundColor: 'rgba(209,0,0,0.3)' }} />
          <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(201,201,201,0.4)' }}>
            Performance Accessories
          </p>
        </div>
      </nav>
    </>
  );
}
