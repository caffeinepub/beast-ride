import React from 'react';
import AnimatedSection from './AnimatedSection';

const highlights = [
  {
    title: 'Engineered for Speed',
    desc: 'Every component precision-engineered to maximize performance and reduce drag.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="20" stroke="#D10000" strokeWidth="1.5" fill="none" />
        <path d="M28 14 L28 28 L38 22" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M14 28 L20 28" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 28 L42 28" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 14 L28 8" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 42 L28 48" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Built to Last',
    desc: 'Military-grade materials tested under extreme conditions for unmatched durability.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 8 L44 16 L44 30 C44 39 36 46 28 48 C20 46 12 39 12 30 L12 16 Z" stroke="#D10000" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M22 28 L26 32 L34 22" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    title: 'Rider Approved',
    desc: 'Tested and trusted by professional riders and performance enthusiasts worldwide.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="18" r="8" stroke="#D10000" strokeWidth="1.5" fill="none" />
        <path d="M12 46 C12 36 18 30 28 30 C38 30 44 36 44 46" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M34 22 L38 18 L42 22" stroke="#D10000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
];

export default function PerformanceHighlight() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p className="font-heading text-sm uppercase tracking-widest mb-2" style={{ color: '#D10000' }}>
            Why Beast Ride
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase metal-text">
            Built Different
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 150}>
              <div
                className="perf-col flex flex-col items-center text-center p-8 group cursor-default"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(11,11,11,0.5)',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(209,0,0,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div className="perf-icon-wrap mb-6">
                  {item.icon}
                </div>
                <h3
                  className="font-heading font-bold text-xl uppercase mb-3"
                  style={{ color: '#ffffff', letterSpacing: '0.05em' }}
                >
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(201,201,201,0.6)' }}>
                  {item.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
