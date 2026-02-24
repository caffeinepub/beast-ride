import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Menu } from 'lucide-react';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useCart } from '../context/CartContext';
import MobileNav from './MobileNav';

export default function Header() {
  const scrollY = useScrollPosition();
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const isScrolled = scrollY > 60;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isScrolled ? '#0B0B0B' : 'transparent',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
          boxShadow: isScrolled ? '0 4px 24px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/assets/generated/beast-ride-logo.dim_400x120.png"
              alt="BEAST RIDE"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <button
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => navigate({ to: '/shop', search: { category: 'Bike Accessories' } })}
            >
              Bikes
            </button>
            <button
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => navigate({ to: '/shop', search: { category: 'Car Performance' } })}
            >
              Cars
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-white hover:text-beast-red transition-colors duration-200"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: '#D10000', fontSize: '0.65rem' }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Hamburger - mobile only */}
            <button
              className="md:hidden p-2 text-white hover:text-beast-red transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
