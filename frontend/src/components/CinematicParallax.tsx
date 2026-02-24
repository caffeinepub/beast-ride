import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function CinematicParallax() {
  const [ref, isInView] = useIntersectionObserver<HTMLElement>({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="parallax-section relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/assets/generated/night-road.dim_1920x800.png')",
        height: '500px',
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(11,11,11,0.65)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h2
          className="font-heading font-black uppercase leading-none"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            background: 'linear-gradient(180deg, #ffffff 0%, #bfbfbf 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.05em',
          }}
        >
          <span className={`red-underline ${isInView ? 'animate' : ''}`}>
            DOMINATE THE ROAD
          </span>
        </h2>
        <p
          className="font-body text-lg mt-8"
          style={{ color: 'rgba(201,201,201,0.7)' }}
        >
          Every ride. Every road. Every time.
        </p>
      </div>
    </section>
  );
}
