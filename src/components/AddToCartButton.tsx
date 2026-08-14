'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
  quantity?: number;
}

export default function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, quantity);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
        added
          ? 'bg-emerald-500 text-dark-bg scale-105'
          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-dark-bg'
      }`}
    >
      {added ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          Added!
        </>
      ) : (
        <>
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Cart
        </>
      )}
    </button>
  );
}
