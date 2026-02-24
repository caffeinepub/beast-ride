import React from 'react';
import { useAllProducts } from '../hooks/useQueries';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  currentProductId: bigint;
  category: string;
}

export default function RelatedProducts({ currentProductId, category }: Props) {
  const { data: allProducts = [], isLoading } = useAllProducts();

  const related = allProducts
    .filter(p => p.id !== currentProductId && p.category === category)
    .slice(0, 6);

  const fallback = allProducts
    .filter(p => p.id !== currentProductId)
    .slice(0, 6);

  const products = related.length > 0 ? related : fallback;

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[0, 1, 2, 3].map(i => (
          <Skeleton key={i} className="w-48 h-64 shrink-0 rounded-none" style={{ backgroundColor: '#1A1A1A' }} />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
        {products.map(product => (
          <div key={product.id.toString()} className="w-52 shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
