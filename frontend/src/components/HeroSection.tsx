import React from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '85vh', minHeight: '560px' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.png')" }}
      />

      {/* Subtle black overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(11,11,11,0.85) 40%, rgba(11,11,11,0.2) 100%)' }}
      />

      {/* Animated red radial glow */}
      <div
        className="absolute red-glow-pulse pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(209,0,0,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <p
              className="font-heading font-semibold text-sm uppercase tracking-widest mb-4"
              style={{ color: '#D10000', letterSpacing: '0.25em' }}
            >
              Performance Redefined
            </p>

            {/* Heading */}
            <h1
              className="font-heading font-black uppercase leading-none mb-6"
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                background: 'linear-gradient(180deg, #ffffff 0%, #bfbfbf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 0.9,
              }}
            >
              RIDE THE<br />BEAST
            </h1>

            {/* Subtext */}
            <p
              className="font-body text-lg mb-10 leading-relaxed"
              style={{ color: 'rgba(201,201,201,0.8)', maxWidth: '380px' }}
            >
              Performance Accessories Built for Power.
            </p>

            {/* CTA Button */}
            <button
              className="beast-btn beast-btn-sweep"
              onClick={() => navigate({ to: '/shop' })}
              style={{ fontSize: '0.9rem', padding: '1rem 2.5rem' }}
            >
              SHOP PERFORMANCE
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0B0B0B)' }}
      />
    </section>
  );
}
