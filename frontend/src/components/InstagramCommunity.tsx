import React from 'react';
import { Instagram } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const images = [
  '/assets/generated/community-1.dim_600x600.png',
  '/assets/generated/community-2.dim_600x600.png',
  '/assets/generated/community-3.dim_600x600.png',
  '/assets/generated/community-4.dim_600x600.png',
];

export default function InstagramCommunity() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="font-heading text-sm uppercase tracking-widest mb-2" style={{ color: '#D10000' }}>
            Community
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase metal-text mb-3">
            Join the Pack
          </h2>
          <p className="font-body text-sm" style={{ color: 'rgba(201,201,201,0.5)' }}>
            @beastride — Tag us in your ride
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <AnimatedSection key={src} delay={i * 80}>
              <div className="community-item aspect-square">
                <img src={src} alt={`Community ${i + 1}`} />
                <div className="overlay">
                  <Instagram size={32} color="#ffffff" />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
