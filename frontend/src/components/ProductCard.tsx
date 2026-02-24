import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../backend';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div
      className="product-card group cursor-pointer"
      onClick={() => navigate({ to: `/product/${product.id.toString()}` })}
    >
      {/* Image */}
      <div className="overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img
          src={product.image}
          alt={product.name}
          className="product-img w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <p
          className="font-heading text-xs uppercase tracking-widest mb-1"
          style={{ color: 'rgba(209,0,0,0.7)' }}
        >
          {product.category}
        </p>
        <h3
          className="font-heading font-bold text-base uppercase mb-2 leading-tight"
          style={{ color: '#ffffff' }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span
            className="font-heading font-black text-lg"
            style={{ color: '#C9C9C9' }}
          >
            ${product.price.toFixed(2)}
          </span>
          <button
            className="p-2 transition-all duration-200 hover:text-beast-red"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(201,201,201,0.6)',
              backgroundColor: 'transparent',
            }}
            onClick={e => {
              e.stopPropagation();
              addToCart(product);
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#D10000';
              (e.currentTarget as HTMLButtonElement).style.color = '#D10000';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(209,0,0,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,201,201,0.6)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
