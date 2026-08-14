'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    rating: number;
    images: string; // JSON string
    category: { name: string };
    seller?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const images = JSON.parse(product.images);
  const mainImage = images[0];
  const hoverImage = images.length > 1 ? images[1] : mainImage;
  const { addItem, toggleCart } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock data for new UI requirements
  const brand = "NEXORA";
  const numReviews = (product.title.length * 3) + 12;
  
  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = localStorage.getItem('aura_user');
    if (!user) {
      router.push('/auth/login');
      return;
    }
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: mainImage,
      category: product.category?.name || 'Uncategorized',
    });
    toggleCart();
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div 
      className="premium-card group flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-gray-900 block overflow-hidden">
        <Image
          src={isHovered ? hoverImage : mainImage}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="bg-nexora-500 text-white font-bold text-[10px] uppercase px-2 py-1 rounded-sm tracking-wider">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-gray-500 hover:text-red-500 transition-all z-10 hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white border border-gray-200 dark:border-dark-border font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {product.seller?.name || "NEXORA"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)} ({numReviews})</span>
          </div>
        </div>
        
        <Link href={`/products/${product.slug}`} className="mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-nexora-500 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            ₹{product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
