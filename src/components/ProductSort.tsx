'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

export default function ProductSort({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort && newSort !== 'newest') {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <SlidersHorizontal className="w-4 h-4 text-gray-400" />
      <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
      <select
        value={currentSort || 'newest'}
        onChange={handleSortChange}
        className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-nexora-500 font-medium"
      >
        <option value="newest">Newest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
