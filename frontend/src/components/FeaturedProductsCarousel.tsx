import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAllProducts } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '../backend';

export default function FeaturedProductsCarousel() {
  const { data: products = [], isLoading } = useAllProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + products.length) % products.length);
  }, [products.length]);

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % products.length);
  }, [products.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
  };

  const getScale = (index: number) => {
    if (index === activeIndex) return 1.1;
    const dist = Math.abs(index - activeIndex);
    if (dist === 1) return 0.85;
    return 0.75;
  };

  const getOpacity = (index: number) => {
    const dist = Math.abs(index - activeIndex);
    if (dist === 0) return 1;
    if (dist === 1) return 0.6;
    return 0.3;
  };

  const activeProduct: Product | undefined = products[activeIndex];

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: '#0B0B0B' }}
    >
      {/* Moving gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #0B0B0B 0%, #111111 30%, #0B0B0B 60%, #111111 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
        }}
      />

      <div className="relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 px-6">
          <p className="font-heading text-sm uppercase tracking-widest mb-2" style={{ color: '#D10000' }}>
            Featured
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase metal-text">
            Top Performance Gear
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center gap-6 px-6">
            {[0, 1, 2].map(i => (
              <Skeleton key={i} className="w-64 h-80 rounded-none" style={{ backgroundColor: '#1A1A1A' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center" style={{ color: 'rgba(201,201,201,0.4)' }}>No products available</p>
        ) : (
          <>
            {/* Carousel */}
            <div
              className="relative flex items-center justify-center gap-4 md:gap-8 px-4"
              style={{ height: '380px' }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Prev button */}
              <button
                onClick={prev}
                className="absolute left-4 z-20 p-2 text-white hover:text-beast-red transition-colors"
                style={{ backgroundColor: 'rgba(11,11,11,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Products */}
              <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-4xl mx-auto">
                {products.map((product, index) => {
                  const scale = getScale(index);
                  const opacity = getOpacity(index);
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={product.id.toString()}
                      className="shrink-0 cursor-pointer"
                      style={{
                        transform: `scale(${scale})`,
                        opacity,
                        transition: 'transform 0.4s ease, opacity 0.4s ease',
                        width: isActive ? '240px' : '180px',
                        zIndex: isActive ? 10 : 1,
                      }}
                      onClick={() => {
                        if (isActive) {
                          navigate({ to: `/product/${product.id.toString()}` });
                        } else {
                          setActiveIndex(index);
                        }
                      }}
                    >
                      <div
                        className="product-card overflow-hidden"
                        style={{
                          border: isActive ? '1px solid rgba(209,0,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div className="overflow-hidden" style={{ height: isActive ? '260px' : '200px' }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-img w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                onClick={next}
                className="absolute right-4 z-20 p-2 text-white hover:text-beast-red transition-colors"
                style={{ backgroundColor: 'rgba(11,11,11,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Active product info */}
            {activeProduct && (
              <div className="text-center mt-8 px-6">
                <h3
                  className="font-heading font-bold text-xl uppercase mb-1"
                  style={{ color: '#C9C9C9' }}
                >
                  {activeProduct.name}
                </h3>
                <p
                  className="font-heading font-black text-2xl mb-4"
                  style={{ color: '#D10000' }}
                >
                  ${activeProduct.price.toFixed(2)}
                </p>
                <button
                  className="beast-btn"
                  style={{ fontSize: '0.8rem', padding: '0.6rem 1.8rem' }}
                  onClick={() => addToCart(activeProduct)}
                >
                  Add to Cart
                </button>
              </div>
            )}

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === activeIndex ? '24px' : '8px',
                    height: '4px',
                    backgroundColor: i === activeIndex ? '#D10000' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
