import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useProduct } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import ProductTabs from '../components/ProductTabs';
import RelatedProducts from '../components/RelatedProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const productId = id ? BigInt(id) : null;
  const { data: product, isLoading, error } = useProduct(productId);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#0B0B0B', minHeight: '100vh', paddingTop: '80px' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-none" style={{ backgroundColor: '#1A1A1A' }} />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 rounded-none" style={{ backgroundColor: '#1A1A1A' }} />
              <Skeleton className="h-8 w-1/4 rounded-none" style={{ backgroundColor: '#1A1A1A' }} />
              <Skeleton className="h-24 w-full rounded-none" style={{ backgroundColor: '#1A1A1A' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{ backgroundColor: '#0B0B0B', minHeight: '100vh', paddingTop: '80px' }}
        className="flex flex-col items-center justify-center gap-6"
      >
        <p className="font-heading font-bold text-2xl uppercase" style={{ color: 'rgba(201,201,201,0.4)' }}>
          Product Not Found
        </p>
        <button className="beast-btn" onClick={() => navigate({ to: '/shop' })}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0B0B0B', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate({ to: '/shop' })}
          className="flex items-center gap-2 mb-10 font-heading text-sm uppercase tracking-wider transition-colors hover:text-white"
          style={{ color: 'rgba(201,201,201,0.4)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} />
          Back to Shop
        </button>

        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div
            className="overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)', aspectRatio: '1/1' }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            <p
              className="font-heading text-sm uppercase tracking-widest mb-3"
              style={{ color: '#D10000' }}
            >
              {product.category}
            </p>

            {/* Title */}
            <h1
              className="font-heading font-black text-3xl md:text-4xl uppercase leading-tight mb-4"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #bfbfbf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              className="font-heading font-black text-4xl mb-6"
              style={{ color: '#D10000' }}
            >
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p
              className="font-body text-sm leading-relaxed mb-8"
              style={{ color: 'rgba(201,201,201,0.7)' }}
            >
              {product.description}
            </p>

            {/* Divider */}
            <div className="w-full h-px mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Quantity selector */}
              <div className="qty-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to cart */}
              <button
                className="beast-btn flex items-center gap-2 flex-1 sm:flex-none"
                style={{ fontSize: '0.9rem', padding: '0.9rem 2rem' }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={16} />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 mt-8">
              {['Free Shipping $150+', '2-Year Warranty', 'Easy Returns'].map(badge => (
                <div key={badge} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D10000' }} />
                  <span className="font-body text-xs" style={{ color: 'rgba(201,201,201,0.5)' }}>
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="mb-16"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}
        >
          <ProductTabs product={product} />
        </div>

        {/* Related products */}
        <div>
          <h2
            className="font-heading font-black text-2xl uppercase mb-6"
            style={{ color: '#ffffff' }}
          >
            You May Also Like
          </h2>
          <RelatedProducts currentProductId={product.id} category={product.category} />
        </div>
      </div>
    </div>
  );
}
