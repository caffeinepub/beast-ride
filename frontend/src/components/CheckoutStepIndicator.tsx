import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepIndicatorProps {
  currentStep: 1 | 2;
}

const steps = [
  { number: 1, label: 'Shipping' },
  { number: 2, label: 'Payment' },
];

export default function CheckoutStepIndicator({ currentStep }: CheckoutStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all duration-300"
                style={{
                  backgroundColor: isCompleted
                    ? '#D10000'
                    : isActive
                    ? '#D10000'
                    : 'rgba(255,255,255,0.08)',
                  border: isActive
                    ? '2px solid #D10000'
                    : isCompleted
                    ? '2px solid #D10000'
                    : '2px solid rgba(255,255,255,0.15)',
                  color: isActive || isCompleted ? '#ffffff' : 'rgba(201,201,201,0.4)',
                }}
              >
                {isCompleted ? <Check size={14} /> : step.number}
              </div>
              <span
                className="text-xs font-heading uppercase tracking-wider"
                style={{
                  color: isActive ? '#ffffff' : isCompleted ? '#D10000' : 'rgba(201,201,201,0.4)',
                  fontSize: '0.65rem',
                }}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className="h-px flex-1 mx-3 mb-4 transition-all duration-300"
                style={{
                  backgroundColor: isCompleted ? '#D10000' : 'rgba(255,255,255,0.1)',
                  maxWidth: '60px',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
