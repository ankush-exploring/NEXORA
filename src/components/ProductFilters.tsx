'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductFilters({ categories, currentCategory }: { categories: any[], currentCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentPrice = searchParams.get('price');
  
  const handlePriceChange = (priceVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceVal) {
      params.set('price', priceVal);
    } else {
      params.delete('price');
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-64 shrink-0 space-y-8">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Categories</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/products" className={`block py-1 hover:text-nexora-500 transition-colors ${!currentCategory ? 'text-nexora-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
              All Items
            </Link>
          </li>
          <li>
            <Link href="/products?category=new" className={`block py-1 hover:text-nexora-500 transition-colors ${currentCategory === 'new' ? 'text-nexora-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
              New Arrivals
            </Link>
          </li>
          <li>
            <Link href="/products?category=deals" className={`block py-1 hover:text-nexora-500 transition-colors ${currentCategory === 'deals' ? 'text-nexora-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
              Special Deals
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/products?category=${c.slug}`} className={`block py-1 hover:text-nexora-500 transition-colors ${currentCategory === c.slug ? 'text-nexora-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Price</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <label className="flex items-center gap-2 cursor-pointer hover:text-nexora-500">
            <input type="radio" name="price" checked={!currentPrice} onChange={() => handlePriceChange('')} className="accent-nexora-500" /> All Prices
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-nexora-500">
            <input type="radio" name="price" checked={currentPrice === 'under-150'} onChange={() => handlePriceChange('under-150')} className="accent-nexora-500" /> Under ₹150
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-nexora-500">
            <input type="radio" name="price" checked={currentPrice === '150-450'} onChange={() => handlePriceChange('150-450')} className="accent-nexora-500" /> ₹150 - ₹450
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-nexora-500">
            <input type="radio" name="price" checked={currentPrice === 'over-450'} onChange={() => handlePriceChange('over-450')} className="accent-nexora-500" /> Over ₹450
          </label>
        </div>
      </div>
    </div>
  );
}
