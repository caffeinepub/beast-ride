import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../backend';

interface Props {
  product: Product;
}

const TABS = ['Description', 'Specifications', 'Shipping'];

export default function ProductTabs({ product }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab]);

  return (
    <div>
      {/* Tab headers */}
      <div
        className="relative flex"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {TABS.map((tab, i) => (
          <button
            key={tab}
            ref={el => { tabRefs.current[i] = el; }}
            onClick={() => setActiveTab(i)}
            className="px-6 py-4 font-heading font-bold text-sm uppercase tracking-wider transition-colors duration-200"
            style={{
              color: activeTab === i ? '#ffffff' : 'rgba(201,201,201,0.4)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
        {/* Animated indicator */}
        <div
          className="tab-indicator"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>

      {/* Tab content */}
      <div className="py-8">
        {activeTab === 0 && (
          <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(201,201,201,0.7)' }}>
            {product.description}
          </p>
        )}
        {activeTab === 1 && (
          <div className="space-y-3">
            {[
              ['Category', product.category],
              ['Product ID', product.id.toString()],
              ['Material', 'Premium Grade Alloy / Carbon Composite'],
              ['Finish', 'Matte Black / Anodized'],
              ['Warranty', '2 Years Limited'],
            ].map(([key, val]) => (
              <div
                key={key}
                className="flex gap-4 py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="font-heading font-semibold text-sm uppercase w-32 shrink-0" style={{ color: 'rgba(201,201,201,0.4)' }}>
                  {key}
                </span>
                <span className="font-body text-sm" style={{ color: '#C9C9C9' }}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        )}
        {activeTab === 2 && (
          <div className="space-y-4">
            {[
              { title: 'Standard Shipping', desc: '5–7 business days. Free on orders over $150.' },
              { title: 'Express Shipping', desc: '2–3 business days. Flat rate $12.99.' },
              { title: 'Overnight', desc: 'Next business day. Flat rate $24.99.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4">
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                  style={{ backgroundColor: '#D10000' }}
                />
                <div>
                  <p className="font-heading font-bold text-sm uppercase text-white mb-1">{item.title}</p>
                  <p className="font-body text-sm" style={{ color: 'rgba(201,201,201,0.6)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
