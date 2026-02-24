import React, { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import AnimatedSection from '../components/AnimatedSection';
import { Skeleton } from '@/components/ui/skeleton';

export default function Collection() {
  const search = useSearch({ strict: false }) as { category?: string };
  const initialCategory = search.category || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { data: allProducts = [], isLoading } = useAllProducts();

  useEffect(() => {
    if (search.category) setActiveCategory(search.category);
    else setActiveCategory('All');
  }, [search.category]);

  const filtered = activeCategory === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div style={{ backgroundColor: '#0B0B0B', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Page header */}
      <div
        className="py-16 px-6 text-center"
        style={{ backgroundColor: '#111111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="font-heading text-sm uppercase tracking-widest mb-2" style={{ color: '#D10000' }}>
          Beast Ride
        </p>
        <h1 className="font-heading font-black text-5xl md:text-6xl uppercase metal-text">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h1>
        <p className="font-body text-sm mt-3" style={{ color: 'rgba(201,201,201,0.4)' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar activeCategory={activeCategory} onChange={setActiveCategory} />

          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-none" style={{ backgroundColor: '#1A1A1A' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p className="font-heading font-bold text-2xl uppercase" style={{ color: 'rgba(201,201,201,0.3)' }}>
                  No Products Found
                </p>
                <button
                  className="beast-btn"
                  style={{ fontSize: '0.8rem', padding: '0.6rem 1.5rem' }}
                  onClick={() => setActiveCategory('All')}
                >
                  View All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((product, i) => (
                  <AnimatedSection key={product.id.toString()} delay={i * 60}>
                    <ProductCard product={product} />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
