import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from '@tanstack/react-router';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, freeShippingProgress, freeShippingThreshold } = useCart();
  const navigate = useNavigate();

  const remaining = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`cart-drawer fixed top-0 right-0 h-full z-50 flex flex-col w-full max-w-sm ${isOpen ? 'open' : ''}`}
        style={{ backgroundColor: '#111111', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} style={{ color: '#D10000' }} />
            <h2 className="font-heading font-bold text-lg uppercase tracking-wider text-white">
              Your Cart
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-white hover:text-beast-red transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping bar */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {freeShippingProgress >= 100 ? (
            <p className="font-body text-xs text-center mb-2" style={{ color: '#D10000' }}>
              🎉 You've unlocked FREE shipping!
            </p>
          ) : (
            <p className="font-body text-xs text-center mb-2" style={{ color: 'rgba(201,201,201,0.5)' }}>
              Add <span style={{ color: '#C9C9C9' }}>${remaining.toFixed(2)}</span> more for free shipping
            </p>
          )}
          <div className="shipping-bar">
            <div className="shipping-bar-fill" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingBag size={48} style={{ color: 'rgba(201,201,201,0.2)' }} />
              <p className="font-body text-sm" style={{ color: 'rgba(201,201,201,0.4)' }}>
                Your cart is empty
              </p>
              <button
                className="beast-btn"
                style={{ fontSize: '0.8rem', padding: '0.6rem 1.5rem' }}
                onClick={() => { closeCart(); navigate({ to: '/shop' }); }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li
                  key={item.product.id.toString()}
                  className="flex gap-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}
                >
                  {/* Image */}
                  <div className="w-16 h-16 shrink-0 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-sm uppercase text-white truncate">
                      {item.product.name}
                    </p>
                    <p className="font-heading font-black text-sm mt-0.5" style={{ color: '#D10000' }}>
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-white hover:text-beast-red transition-colors"
                        style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-heading font-bold text-sm text-white w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-white hover:text-beast-red transition-colors"
                        style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto p-1 hover:text-beast-red transition-colors"
                        style={{ color: 'rgba(201,201,201,0.4)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading font-semibold text-sm uppercase tracking-wider" style={{ color: 'rgba(201,201,201,0.6)' }}>
                Subtotal
              </span>
              <span className="font-heading font-black text-xl" style={{ color: '#C9C9C9' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              className="beast-btn w-full"
              style={{ fontSize: '0.9rem', padding: '1rem', clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
