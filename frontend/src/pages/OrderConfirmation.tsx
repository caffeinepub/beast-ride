import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, ShoppingBag, MapPin, Phone, CreditCard, Package } from 'lucide-react';
import { PaymentMethod } from '../backend';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: 'Cash on Delivery',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.Card]: 'Card / Debit / Credit',
};

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderConfirmationData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('orderConfirmation');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as OrderConfirmationData;
        setOrderData(parsed);
        // Clear after reading so direct revisits show fallback
        sessionStorage.removeItem('orderConfirmation');
      } catch {
        setOrderData(null);
      }
    }
  }, []);

  if (!orderData || !orderData.orderId) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: '#0A0A0A' }}
      >
        <Package size={56} style={{ color: 'rgba(201,201,201,0.2)' }} className="mb-4" />
        <h1
          className="font-heading font-bold text-2xl uppercase tracking-widest mb-2"
          style={{ color: '#ffffff' }}
        >
          Order Not Found
        </h1>
        <p className="font-body text-sm mb-6" style={{ color: 'rgba(201,201,201,0.5)' }}>
          We couldn't find your order details. Please check your order history.
        </p>
        <button
          className="beast-btn"
          style={{ fontSize: '0.9rem', padding: '0.75rem 2rem' }}
          onClick={() => navigate({ to: '/' })}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const {
    orderId,
    customerName,
    mobileNumber,
    email,
    fullAddress,
    city,
    state,
    pincode,
    paymentMethod,
    items,
    totalAmount,
    shippingCost,
  } = orderData;

  const subtotal = totalAmount - shippingCost;

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-lg mx-auto">
        {/* Success header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: 'rgba(74,222,128,0.1)',
              border: '2px solid rgba(74,222,128,0.4)',
            }}
          >
            <CheckCircle size={32} style={{ color: '#4ADE80' }} />
          </div>
          <h1
            className="font-heading font-black text-3xl uppercase tracking-widest mb-2"
            style={{ color: '#ffffff' }}
          >
            Order Confirmed!
          </h1>
          <p className="font-body text-sm" style={{ color: 'rgba(201,201,201,0.6)' }}>
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order ID */}
        <div
          className="p-4 mb-4 text-center"
          style={{
            backgroundColor: 'rgba(209,0,0,0.08)',
            border: '1px solid rgba(209,0,0,0.3)',
          }}
        >
          <p
            className="font-heading text-xs uppercase tracking-widest mb-1"
            style={{ color: 'rgba(201,201,201,0.5)' }}
          >
            Order ID
          </p>
          <p className="font-mono font-bold text-xl" style={{ color: '#D10000' }}>
            #{orderId}
          </p>
        </div>

        {/* Customer & Shipping */}
        <div
          className="p-4 mb-4"
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} style={{ color: '#D10000' }} />
            <p
              className="font-heading text-xs uppercase tracking-widest"
              style={{ color: 'rgba(201,201,201,0.5)' }}
            >
              Shipping Address
            </p>
          </div>
          <p className="font-heading font-bold text-sm text-white mb-1">{customerName}</p>
          <p className="font-body text-sm" style={{ color: '#C9C9C9' }}>
            {fullAddress}
          </p>
          <p className="font-body text-sm" style={{ color: '#C9C9C9' }}>
            {city}, {state} – {pincode}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Phone size={12} style={{ color: 'rgba(201,201,201,0.4)' }} />
            <p className="font-body text-xs" style={{ color: 'rgba(201,201,201,0.6)' }}>
              {mobileNumber}
            </p>
            {email && (
              <>
                <span style={{ color: 'rgba(201,201,201,0.2)' }}>·</span>
                <p className="font-body text-xs" style={{ color: 'rgba(201,201,201,0.6)' }}>
                  {email}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Products */}
        <div
          className="p-4 mb-4"
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={16} style={{ color: '#D10000' }} />
            <p
              className="font-heading text-xs uppercase tracking-widest"
              style={{ color: 'rgba(201,201,201,0.5)' }}
            >
              Ordered Items
            </p>
          </div>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span className="font-body text-sm" style={{ color: '#C9C9C9' }}>
                  {item.name}{' '}
                  <span style={{ color: 'rgba(201,201,201,0.5)' }}>×{item.quantity}</span>
                </span>
                <span className="font-heading font-bold text-sm" style={{ color: '#ffffff' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div
            className="mt-3 pt-3 space-y-1"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex justify-between">
              <span className="font-body text-xs" style={{ color: 'rgba(201,201,201,0.5)' }}>
                Subtotal
              </span>
              <span className="font-heading text-xs" style={{ color: '#C9C9C9' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-xs" style={{ color: 'rgba(201,201,201,0.5)' }}>
                Shipping
              </span>
              <span
                className="font-heading text-xs"
                style={{ color: shippingCost === 0 ? '#4ADE80' : '#C9C9C9' }}
              >
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div
              className="flex justify-between pt-1"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span
                className="font-heading font-bold text-sm uppercase tracking-wider"
                style={{ color: '#ffffff' }}
              >
                Total
              </span>
              <span className="font-heading font-black text-sm" style={{ color: '#D10000' }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div
          className="p-4 mb-6"
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} style={{ color: '#D10000' }} />
            <p
              className="font-heading text-xs uppercase tracking-widest"
              style={{ color: 'rgba(201,201,201,0.5)' }}
            >
              Payment Method
            </p>
          </div>
          <p className="font-heading font-bold text-sm text-white">
            {PAYMENT_LABELS[paymentMethod] ?? String(paymentMethod)}
          </p>
          {paymentMethod === PaymentMethod.COD && (
            <p className="font-body text-xs mt-1" style={{ color: 'rgba(201,201,201,0.5)' }}>
              Please keep the exact amount ready at the time of delivery.
            </p>
          )}
        </div>

        {/* Status badge */}
        <div
          className="p-3 mb-6 text-center"
          style={{
            backgroundColor: 'rgba(234,179,8,0.08)',
            border: '1px solid rgba(234,179,8,0.25)',
          }}
        >
          <p
            className="font-heading text-xs uppercase tracking-widest"
            style={{ color: '#EAB308' }}
          >
            Status: Pending
          </p>
          <p className="font-body text-xs mt-1" style={{ color: 'rgba(201,201,201,0.5)' }}>
            We'll update you once your order is confirmed.
          </p>
        </div>

        {/* CTA */}
        <button
          className="beast-btn w-full flex items-center justify-center gap-2"
          style={{
            fontSize: '0.9rem',
            padding: '1rem',
            clipPath:
              'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
            minHeight: '52px',
          }}
          onClick={() => navigate({ to: '/shop' })}
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
