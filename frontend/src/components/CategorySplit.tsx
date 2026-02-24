import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import AnimatedSection from './AnimatedSection';

const categories = [
  {
    label: 'BIKE ACCESSORIES',
    image: '/assets/generated/category-bike.dim_900x600.png',
    category: 'Bike Accessories',
  },
  {
    label: 'CAR PERFORMANCE',
    image: '/assets/generated/category-car.dim_900x600.png',
    category: 'Car Performance',
  },
];

export default function CategorySplit() {
  const navigate = useNavigate();

  return (
    <section style={{ backgroundColor: '#0B0B0B', padding: '0' }}>
      <div className="flex flex-col md:flex-row" style={{ minHeight: '480px' }}>
        {categories.map((cat, i) => (
          <AnimatedSection key={cat.category} className="flex-1" delay={i * 150}>
            <div
              className="category-card relative h-80 md:h-full cursor-pointer"
              style={{ minHeight: '380px' }}
              onClick={() => navigate({ to: `/shop?category=${encodeURIComponent(cat.category)}` })}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.label}
                className="cat-img absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(11,11,11,0.85) 0%, rgba(11,11,11,0.2) 60%, transparent 100%)' }}
              />

              {/* Animated border */}
              <div className="cat-border" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2
                  className="cat-title font-heading font-black text-3xl md:text-4xl uppercase text-white mb-3"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {cat.label}
                </h2>
                <div className="flex items-center gap-2" style={{ color: '#D10000' }}>
                  <span className="font-heading font-semibold text-sm uppercase tracking-widest">
                    Shop Now
                  </span>
                  <span className="text-lg">→</span>
                </div>
              </div>

              {/* Divider line between cards */}
              {i === 0 && (
                <div
                  className="hidden md:block absolute top-0 right-0 w-px h-full"
                  style={{ backgroundColor: 'rgba(209,0,0,0.3)' }}
                />
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
