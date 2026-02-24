import React from 'react';

const CATEGORIES = ['All', 'Bike Accessories', 'Car Performance'];

interface Props {
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function FilterSidebar({ activeCategory, onChange }: Props) {
  return (
    <aside
      className="w-full md:w-56 shrink-0"
      style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="p-6">
        <h3
          className="font-heading font-bold text-sm uppercase tracking-widest mb-6"
          style={{ color: '#C9C9C9' }}
        >
          Filter
        </h3>

        <div>
          <p
            className="font-heading text-xs uppercase tracking-widest mb-3"
            style={{ color: 'rgba(201,201,201,0.4)' }}
          >
            Category
          </p>
          <ul className="space-y-1">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <li key={cat}>
                  <button
                    onClick={() => onChange(cat)}
                    className="w-full text-left px-3 py-2.5 font-body text-sm transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? 'rgba(209,0,0,0.15)' : 'transparent',
                      color: isActive ? '#D10000' : 'rgba(201,201,201,0.6)',
                      borderLeft: isActive ? '2px solid #D10000' : '2px solid transparent',
                    }}
                  >
                    {cat}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
