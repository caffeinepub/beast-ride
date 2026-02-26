import React from 'react';
import { Banknote, Smartphone, CreditCard } from 'lucide-react';
import { PaymentMethod } from '../backend';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
}

const PAYMENT_OPTIONS: {
  method: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    method: PaymentMethod.COD,
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: <Banknote size={20} />,
  },
  {
    method: PaymentMethod.UPI,
    label: 'UPI',
    description: 'Pay via UPI (GPay, PhonePe, etc.)',
    icon: <Smartphone size={20} />,
  },
  {
    method: PaymentMethod.Card,
    label: 'Card / Debit / Credit',
    description: 'Visa, Mastercard, RuPay',
    icon: <CreditCard size={20} />,
  },
];

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      {PAYMENT_OPTIONS.map(({ method, label, description, icon }) => {
        const isSelected = selectedMethod === method;
        return (
          <button
            key={method}
            type="button"
            onClick={() => onMethodChange(method)}
            className="w-full flex items-center gap-3 p-3 text-left transition-all duration-200"
            style={{
              backgroundColor: isSelected ? 'rgba(209,0,0,0.1)' : 'rgba(255,255,255,0.03)',
              border: isSelected
                ? '1px solid rgba(209,0,0,0.6)'
                : '1px solid rgba(255,255,255,0.08)',
              minHeight: '56px',
            }}
          >
            {/* Radio indicator */}
            <div
              className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
              style={{
                border: isSelected ? '2px solid #D10000' : '2px solid rgba(255,255,255,0.25)',
                backgroundColor: 'transparent',
              }}
            >
              {isSelected && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#D10000' }}
                />
              )}
            </div>

            {/* Icon */}
            <div
              className="shrink-0"
              style={{ color: isSelected ? '#D10000' : 'rgba(201,201,201,0.5)' }}
            >
              {icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="font-heading font-bold text-sm uppercase tracking-wider"
                style={{ color: isSelected ? '#ffffff' : '#C9C9C9' }}
              >
                {label}
              </p>
              <p
                className="font-body text-xs mt-0.5"
                style={{ color: 'rgba(201,201,201,0.45)' }}
              >
                {description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
