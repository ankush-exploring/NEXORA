import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Heart, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0;

export default async function WishlistPage() {
  // Show top featured items as saved wishlist items (Mock data)
  const wishlistItems = await prisma.product.findMany({
    take: 4,
    include: { category: true },
  });

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-nexora-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="border-b border-gray-200 dark:border-dark-border pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Heart className="w-6 h-6 text-nexora-500 fill-nexora-500" /> My Saved Wishlist
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Products you've saved for later. Keep track of price drops here.</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border p-12 text-center rounded-2xl space-y-6 shadow-sm">
            <Heart className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto stroke-[1.5]" />
            <p className="text-base text-gray-500 dark:text-gray-400">Your wishlist is empty.</p>
            <Link
              href="/products"
              className="inline-block text-sm font-semibold bg-[#0a0a0a] dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
