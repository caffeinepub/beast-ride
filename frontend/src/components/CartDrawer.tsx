import React, { useState } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Loader2,
  LogIn,
  ArrowLeft,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateOrder } from '../hooks/useMutations';
import { PaymentMethod } from '../backend';
import { toast } from 'sonner';
import CheckoutStepIndicator from './CheckoutStepIndicator';
import PaymentMethodSelector from './PaymentMethodSelector';

// ─── Shipping form types ───────────────────────────────────────────────────────
interface ShippingForm {
  fullName: string;
  mobileNumber: string;
  email: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
}

type ShippingErrors = Partial<Record<keyof ShippingForm, string>>;

const INITIAL_SHIPPING: ShippingForm = {
  fullName: '',
  mobileNumber: '',
  email: '',
  fullAddress: '',
  city: '',
  state: '',
  pincode: '',
};

// ─── Validation ────────────────────────────────────────────────────────────────
function validateShipping(form: ShippingForm): ShippingErrors {
  const errors: ShippingErrors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required';
  if (!form.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!/^\d{10,}$/.test(form.mobileNumber.trim())) {
    errors.mobileNumber = 'Enter a valid 10-digit mobile number';
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.fullAddress.trim()) errors.fullAddress = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state.trim()) errors.state = 'State is required';
  if (!form.pincode.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!/^\d{6}$/.test(form.pincode.trim())) {
    errors.pincode = 'Enter a valid 6-digit pincode';
  }
  return errors;
}

// ─── Field component ───────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="font-heading text-xs uppercase tracking-wider"
        style={{ color: 'rgba(201,201,201,0.6)' }}
      >
        {label}
        {required && <span style={{ color: '#D10000' }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="font-body text-xs" style={{ color: '#ff6b6b' }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#ffffff',
  padding: '0.55rem 0.75rem',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  minHeight: '44px',
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  border: '1px solid rgba(209,0,0,0.5)',
};

// ─── Order Summary ─────────────────────────────────────────────────────────────
interface OrderSummaryProps {
  items: ReturnType<typeof useCart>['items'];
  subtotal: number;
  shippingCost: number;
}

function OrderSummary({ items, subtotal, shippingCost }: OrderSummaryProps) {
  const total = subtotal + shippingCost;
  return (
    <div
      className="p-3"
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p
        className="font-heading text-xs uppercase tracking-widest mb-3"
        style={{ color: 'rgba(201,201,201,0.5)' }}
      >
        Order Summary
      </p>
      <ul className="space-y-2 mb-3">
        {items.map((item) => (
          <li key={item.product.id.toString()} className="flex justify-between items-start gap-2">
            <span className="font-body text-xs" style={{ color: '#C9C9C9', flex: 1 }}>
              {item.product.name}{' '}
              <span style={{ color: 'rgba(201,201,201,0.5)' }}>×{item.quantity}</span>
            </span>
            <span className="font-heading font-bold text-xs shrink-0" style={{ color: '#ffffff' }}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div
        className="pt-2 space-y-1"
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
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main CartDrawer ───────────────────────────────────────────────────────────
export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingProgress,
    freeShippingThreshold,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const createOrderMutation = useCreateOrder();

  // Step state: 'cart' | 'step1' | 'step2'
  const [view, setView] = useState<'cart' | 'step1' | 'step2'>('cart');
  const [shipping, setShipping] = useState<ShippingForm>(INITIAL_SHIPPING);
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingForm, boolean>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 9.99;
  const total = subtotal + shippingCost;
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);

  // ── Field change handler ──
  const handleChange = (field: keyof ShippingForm, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateShipping({ ...shipping, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof ShippingForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateShipping(shipping);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  // ── Continue to payment ──
  const handleContinueToPayment = async () => {
    const allTouched = Object.keys(INITIAL_SHIPPING).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof ShippingForm, boolean>
    );
    setTouched(allTouched);
    const validationErrors = validateShipping(shipping);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!isAuthenticated) {
      try {
        await login();
      } catch {
        setCheckoutError('Login failed. Please try again.');
        return;
      }
    }
    setView('step2');
  };

  // ── Place order ──
  const handlePlaceOrder = async () => {
    if (!paymentMethod) return;
    setCheckoutError(null);

    const orderItems = items.map((item) => ({
      productId: item.product.id,
      quantity: BigInt(item.quantity),
      price: item.product.price,
    }));

    try {
      const order = await createOrderMutation.mutateAsync({
        customerName: shipping.fullName.trim(),
        mobileNumber: shipping.mobileNumber.trim(),
        email: shipping.email.trim(),
        fullAddress: shipping.fullAddress.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        pincode: shipping.pincode.trim(),
        paymentMethod,
        items: orderItems,
        totalAmount: total,
      });

      // Store order confirmation data in sessionStorage to pass to confirmation page
      const confirmationData = {
        orderId: order.orderId,
        customerName: order.customerName,
        mobileNumber: order.mobileNumber,
        email: order.email,
        fullAddress: order.fullAddress,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        paymentMethod: order.paymentMethod,
        items: items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        totalAmount: total,
        shippingCost,
      };
      sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmationData));

      clearCart();
      closeCart();
      // Reset state for next use
      setView('cart');
      setShipping(INITIAL_SHIPPING);
      setErrors({});
      setTouched({});
      setPaymentMethod(null);

      navigate({ to: '/order-confirmation' });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      setCheckoutError(message);
      toast.error('Order failed', { description: message });
    }
  };

  const handleClose = () => {
    closeCart();
    // Don't reset view immediately so animation looks clean
    setTimeout(() => {
      setView('cart');
    }, 300);
  };

  const isPlacingOrder = createOrderMutation.isPending;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`cart-drawer fixed top-0 right-0 h-full z-50 flex flex-col w-full max-w-sm ${isOpen ? 'open' : ''}`}
        style={{ backgroundColor: '#111111', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* ── CART VIEW ─────────────────────────────────────────────────── */}
        {view === 'cart' && (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} style={{ color: '#D10000' }} />
                <h2 className="font-heading font-bold text-lg uppercase tracking-wider text-white">
                  Your Cart
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-white hover:text-beast-red transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free shipping bar */}
            <div
              className="px-5 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {freeShippingProgress >= 100 ? (
                <p className="font-body text-xs text-center mb-2" style={{ color: '#D10000' }}>
                  🎉 You've unlocked FREE shipping!
                </p>
              ) : (
                <p
                  className="font-body text-xs text-center mb-2"
                  style={{ color: 'rgba(201,201,201,0.5)' }}
                >
                  Add{' '}
                  <span style={{ color: '#C9C9C9' }}>${remaining.toFixed(2)}</span> more for free
                  shipping
                </p>
              )}
              <div className="shipping-bar">
                <div className="shipping-bar-fill" style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <ShoppingBag size={48} style={{ color: 'rgba(201,201,201,0.2)' }} />
                  <p className="font-body text-sm" style={{ color: 'rgba(201,201,201,0.4)' }}>
                    Your cart is empty
                  </p>
                  <button
                    className="beast-btn"
                    style={{ fontSize: '0.8rem', padding: '0.6rem 1.5rem' }}
                    onClick={() => {
                      handleClose();
                      navigate({ to: '/shop' });
                    }}
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.product.id.toString()}
                      className="flex gap-4"
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        paddingBottom: '1rem',
                      }}
                    >
                      <div
                        className="w-16 h-16 shrink-0 overflow-hidden"
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-sm uppercase text-white truncate">
                          {item.product.name}
                        </p>
                        <p
                          className="font-heading font-black text-sm mt-0.5"
                          style={{ color: '#D10000' }}
                        >
                          ${item.product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-white hover:text-beast-red transition-colors"
                            style={{
                              border: '1px solid rgba(255,255,255,0.15)',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-heading font-bold text-sm text-white w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-white hover:text-beast-red transition-colors"
                            style={{
                              border: '1px solid rgba(255,255,255,0.15)',
                              backgroundColor: 'transparent',
                            }}
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
              <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-heading font-semibold text-sm uppercase tracking-wider"
                    style={{ color: 'rgba(201,201,201,0.6)' }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="font-heading font-black text-xl"
                    style={{ color: '#C9C9C9' }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  className="beast-btn w-full flex items-center justify-center gap-2"
                  style={{
                    fontSize: '0.9rem',
                    padding: '1rem',
                    clipPath:
                      'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  }}
                  onClick={() => setView('step1')}
                >
                  <MapPin size={16} />
                  Proceed to Checkout
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP 1: SHIPPING ──────────────────────────────────────────── */}
        {view === 'step1' && (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={() => setView('cart')}
                className="flex items-center gap-2 text-sm font-heading uppercase tracking-wider transition-colors hover:text-beast-red"
                style={{ color: 'rgba(201,201,201,0.6)' }}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-white hover:text-beast-red transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="px-5 pt-4 pb-2">
              <CheckoutStepIndicator currentStep={1} />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <h3
                className="font-heading font-bold text-base uppercase tracking-widest"
                style={{ color: '#ffffff' }}
              >
                Shipping Information
              </h3>

              {/* Form */}
              <div className="space-y-3">
                <Field label="Full Name" required error={errors.fullName}>
                  <input
                    type="text"
                    value={shipping.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="John Doe"
                    style={errors.fullName ? inputErrorStyle : inputStyle}
                  />
                </Field>

                <Field label="Mobile Number" required error={errors.mobileNumber}>
                  <input
                    type="tel"
                    value={shipping.mobileNumber}
                    onChange={(e) =>
                      handleChange('mobileNumber', e.target.value.replace(/\D/g, ''))
                    }
                    onBlur={() => handleBlur('mobileNumber')}
                    placeholder="9876543210"
                    maxLength={15}
                    style={errors.mobileNumber ? inputErrorStyle : inputStyle}
                  />
                </Field>

                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="john@example.com (optional)"
                    style={errors.email ? inputErrorStyle : inputStyle}
                  />
                </Field>

                <Field label="Full Address" required error={errors.fullAddress}>
                  <textarea
                    value={shipping.fullAddress}
                    onChange={(e) => handleChange('fullAddress', e.target.value)}
                    onBlur={() => handleBlur('fullAddress')}
                    placeholder="House No., Street, Area"
                    rows={2}
                    style={{
                      ...(errors.fullAddress ? inputErrorStyle : inputStyle),
                      resize: 'none',
                      minHeight: '60px',
                    }}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="City" required error={errors.city}>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      placeholder="Mumbai"
                      style={errors.city ? inputErrorStyle : inputStyle}
                    />
                  </Field>
                  <Field label="State" required error={errors.state}>
                    <input
                      type="text"
                      value={shipping.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      onBlur={() => handleBlur('state')}
                      placeholder="Maharashtra"
                      style={errors.state ? inputErrorStyle : inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Pincode" required error={errors.pincode}>
                  <input
                    type="text"
                    value={shipping.pincode}
                    onChange={(e) =>
                      handleChange('pincode', e.target.value.replace(/\D/g, ''))
                    }
                    onBlur={() => handleBlur('pincode')}
                    placeholder="400001"
                    maxLength={6}
                    style={errors.pincode ? inputErrorStyle : inputStyle}
                  />
                </Field>
              </div>

              {/* Order summary */}
              <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} />

              {/* Auth hint */}
              {!isAuthenticated && (
                <p
                  className="font-body text-xs text-center flex items-center justify-center gap-1.5"
                  style={{ color: 'rgba(201,201,201,0.5)' }}
                >
                  <LogIn size={12} />
                  You'll be asked to log in to continue
                </p>
              )}

              {checkoutError && (
                <div
                  className="px-3 py-2 text-xs font-body"
                  style={{
                    backgroundColor: 'rgba(209,0,0,0.12)',
                    border: '1px solid rgba(209,0,0,0.3)',
                    color: '#ff6b6b',
                  }}
                >
                  {checkoutError}
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                className="beast-btn w-full flex items-center justify-center gap-2"
                style={{
                  fontSize: '0.9rem',
                  padding: '1rem',
                  clipPath:
                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  opacity: isLoggingIn ? 0.7 : 1,
                  cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                  minHeight: '52px',
                }}
                onClick={handleContinueToPayment}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: PAYMENT ───────────────────────────────────────────── */}
        {view === 'step2' && (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={() => {
                  setView('step1');
                  setCheckoutError(null);
                }}
                className="flex items-center gap-2 text-sm font-heading uppercase tracking-wider transition-colors hover:text-beast-red"
                style={{ color: 'rgba(201,201,201,0.6)' }}
                disabled={isPlacingOrder}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-white hover:text-beast-red transition-colors"
                disabled={isPlacingOrder}
              >
                <X size={20} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="px-5 pt-4 pb-2">
              <CheckoutStepIndicator currentStep={2} />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <h3
                className="font-heading font-bold text-base uppercase tracking-widest"
                style={{ color: '#ffffff' }}
              >
                Payment Method
              </h3>

              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
              />

              {/* Shipping address recap */}
              <div
                className="p-3"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  className="font-heading text-xs uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(201,201,201,0.5)' }}
                >
                  Delivering to
                </p>
                <p className="font-heading font-bold text-sm text-white">{shipping.fullName}</p>
                <p className="font-body text-xs mt-0.5" style={{ color: '#C9C9C9' }}>
                  {shipping.fullAddress}, {shipping.city}, {shipping.state} – {shipping.pincode}
                </p>
                <p
                  className="font-body text-xs mt-0.5"
                  style={{ color: 'rgba(201,201,201,0.5)' }}
                >
                  📞 {shipping.mobileNumber}
                </p>
              </div>

              {/* Order summary */}
              <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} />

              {/* Error */}
              {checkoutError && (
                <div
                  className="px-3 py-2 text-xs font-body"
                  style={{
                    backgroundColor: 'rgba(209,0,0,0.12)',
                    border: '1px solid rgba(209,0,0,0.3)',
                    color: '#ff6b6b',
                  }}
                >
                  {checkoutError}
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                className="beast-btn w-full flex items-center justify-center gap-2"
                style={{
                  fontSize: '0.9rem',
                  padding: '1rem',
                  clipPath:
                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  opacity: isPlacingOrder || !paymentMethod ? 0.6 : 1,
                  cursor: isPlacingOrder || !paymentMethod ? 'not-allowed' : 'pointer',
                  minHeight: '52px',
                }}
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !paymentMethod}
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>Place Order · ${total.toFixed(2)}</>
                )}
              </button>
              {!paymentMethod && (
                <p
                  className="font-body text-xs text-center mt-2"
                  style={{ color: 'rgba(201,201,201,0.4)' }}
                >
                  Please select a payment method to continue
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
