import React from 'react';
import { Star } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const reviews = [
  {
    name: 'Marcus T.',
    rating: 5,
    text: 'Absolutely insane quality. The exhaust kit transformed my bike completely. Beast Ride delivers on every promise.',
    product: 'Performance Exhaust Kit',
  },
  {
    name: 'Jordan K.',
    rating: 5,
    text: 'The carbon fiber spoiler is a work of art. Fitment was perfect and the finish is flawless. Worth every penny.',
    product: 'Carbon Fiber Spoiler',
  },
  {
    name: 'Alex R.',
    rating: 5,
    text: 'Ordered the handlebar grips and they arrived in 2 days. Premium feel, aggressive look. My ride feels brand new.',
    product: 'Pro Handlebar Grips',
  },
  {
    name: 'Sam D.',
    rating: 4,
    text: 'Great build quality on the brake pads. Stopping power is noticeably improved. Will definitely order again.',
    product: 'High-Performance Brake Pads',
  },
];

export default function Reviews() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#0B0B0B' }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p className="font-heading text-sm uppercase tracking-widest mb-2" style={{ color: '#D10000' }}>
            Testimonials
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase metal-text">
            Rider Reviews
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <AnimatedSection key={review.name} delay={i * 100}>
              <div className="review-card p-6 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      fill={j < review.rating ? '#D10000' : 'none'}
                      stroke={j < review.rating ? '#D10000' : 'rgba(201,201,201,0.3)'}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p
                  className="font-body text-sm leading-relaxed flex-1 mb-4"
                  style={{ color: 'rgba(201,201,201,0.7)' }}
                >
                  "{review.text}"
                </p>

                {/* Reviewer */}
                <div>
                  <p className="font-heading font-bold text-sm uppercase" style={{ color: '#ffffff' }}>
                    {review.name}
                  </p>
                  <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(209,0,0,0.7)' }}>
                    {review.product}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
