import React from 'react';
import { Link } from '@tanstack/react-router';
import { SiInstagram, SiFacebook, SiX, SiYoutube } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'beast-ride');

  return (
    <footer
      className="relative pt-16 pb-8 px-6"
      style={{
        backgroundColor: '#0B0B0B',
        borderTop: '1px solid #D10000',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img
            src="/assets/generated/beast-ride-logo.dim_400x120.png"
            alt="BEAST RIDE"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Shop */}
          <div>
            <h4
              className="font-heading font-bold text-sm uppercase tracking-widest mb-5"
              style={{ color: '#D10000' }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'All Products', to: '/shop' },
                { label: 'Bike Accessories', to: '/shop?category=Bike+Accessories' },
                { label: 'Car Performance', to: '/shop?category=Car+Performance' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(201,201,201,0.5)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="font-heading font-bold text-sm uppercase tracking-widest mb-5"
              style={{ color: '#D10000' }}
            >
              Support
            </h4>
            <ul className="space-y-3">
              {['Contact Us', 'FAQ', 'Shipping Policy', 'Returns'].map(item => (
                <li key={item}>
                  <span
                    className="font-body text-sm cursor-pointer transition-colors hover:text-white"
                    style={{ color: 'rgba(201,201,201,0.5)' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className="font-heading font-bold text-sm uppercase tracking-widest mb-5"
              style={{ color: '#D10000' }}
            >
              Follow Us
            </h4>
            <div className="flex gap-4">
              {[
                { Icon: SiInstagram, label: 'Instagram' },
                { Icon: SiFacebook, label: 'Facebook' },
                { Icon: SiX, label: 'X' },
                { Icon: SiYoutube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:text-beast-red"
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(201,201,201,0.6)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#D10000';
                    (e.currentTarget as HTMLButtonElement).style.color = '#D10000';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,201,201,0.6)';
                  }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs" style={{ color: 'rgba(201,201,201,0.3)' }}>
            © {year} BEAST RIDE. All rights reserved.
          </p>
          <p className="font-body text-xs flex items-center gap-1" style={{ color: 'rgba(201,201,201,0.3)' }}>
            Built with <Heart size={12} fill="#D10000" stroke="#D10000" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: 'rgba(201,201,201,0.5)' }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
