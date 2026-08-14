'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { useCartStore } from '@/store/useCartStore';

export default function CompareModal() {
  const { items, isOpen, toggleModal, removeItem, clearCompare } = useCompareStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  // Extract all unique spec keys from compared items
  const allSpecKeys = new Set<string>();
  items.forEach(item => {
    try {
      const specs = JSON.parse(item.specifications);
      specs.forEach((s: any) => allSpecKeys.add(s.key));
    } catch (e) {}
  });
  
  const specKeysArray = Array.from(allSpecKeys);

  const getSpecValue = (item: any, key: string) => {
    try {
      const specs = JSON.parse(item.specifications);
      const spec = specs.find((s: any) => s.key === key);
      return spec ? spec.value : '-';
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-bg w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 dark:border-dark-border">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between bg-gray-50 dark:bg-[#0a0a0a]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare Products</h2>
          <div className="flex items-center gap-4">
            {items.length > 0 && (
              <button 
                onClick={clearCompare}
                className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            )}
            <button 
              onClick={toggleModal}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-card text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No products added to compare.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Product Headers */}
              <div className="flex min-w-max border-b border-gray-200 dark:border-dark-border pb-6">
                <div className="w-48 shrink-0 flex items-center p-4 font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-dark-border">
                  Product
                </div>
                {items.map(item => (
                  <div key={item.id} className="w-64 shrink-0 px-4 relative flex flex-col border-r border-gray-200 dark:border-dark-border last:border-0">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-0 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-dark-card text-gray-500 hover:text-red-500 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 min-h-[40px] mb-2">{item.title}</h3>
                    <p className="font-bold text-lg text-nexora-500 mb-4">₹{item.price.toFixed(2)}</p>
                    <button 
                      onClick={() => addItem({ id: item.id, title: item.title, price: item.price, image: item.image, category: item.category })}
                      className="w-full py-2 bg-[#0a0a0a] dark:bg-white text-white dark:text-black font-semibold rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              {/* Specs Rows */}
              <div className="flex min-w-max border-b border-gray-200 dark:border-dark-border">
                <div className="w-48 shrink-0 p-4 font-semibold text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-[#0a0a0a]">
                  Category
                </div>
                {items.map(item => (
                  <div key={item.id} className="w-64 shrink-0 p-4 text-sm text-gray-900 dark:text-gray-300 border-r border-gray-200 dark:border-dark-border last:border-0">
                    {item.category}
                  </div>
                ))}
              </div>
              <div className="flex min-w-max border-b border-gray-200 dark:border-dark-border">
                <div className="w-48 shrink-0 p-4 font-semibold text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-[#0a0a0a]">
                  Rating
                </div>
                {items.map(item => (
                  <div key={item.id} className="w-64 shrink-0 p-4 text-sm text-gray-900 dark:text-gray-300 border-r border-gray-200 dark:border-dark-border last:border-0 font-bold">
                    {item.rating.toFixed(1)} / 5.0
                  </div>
                ))}
              </div>
              
              {specKeysArray.map((key, idx) => (
                <div key={key} className={`flex min-w-max ${idx !== specKeysArray.length - 1 ? 'border-b border-gray-200 dark:border-dark-border' : ''}`}>
                  <div className="w-48 shrink-0 p-4 font-semibold text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-[#0a0a0a]">
                    {key}
                  </div>
                  {items.map(item => (
                    <div key={`${item.id}-${key}`} className="w-64 shrink-0 p-4 text-sm text-gray-900 dark:text-gray-300 border-r border-gray-200 dark:border-dark-border last:border-0">
                      {getSpecValue(item, key) === 'true' ? <Check className="w-4 h-4 text-emerald-500" /> : getSpecValue(item, key)}
                    </div>
                  ))}
                </div>
              ))}
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
