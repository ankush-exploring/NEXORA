import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import ProductSort from '@/components/ProductSort';

export const revalidate = 0; // Dynamic rendering

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    price?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, q, sort, price } = await searchParams;

  const categories = await prisma.category.findMany();

  // Build filter conditions
  const where: any = {};
  if (category && category !== 'new' && category !== 'deals') {
    where.category = { slug: category };
  }
  if (category === 'deals') {
    where.compareAtPrice = { not: null };
  }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }
  if (price) {
    if (price === 'under-150') where.price = { lt: 150 };
    if (price === '150-450') where.price = { gte: 150, lte: 450 };
    if (price === 'over-450') where.price = { gt: 450 };
  }

  // Build sort condition
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-low') orderBy = { price: 'asc' };
  if (sort === 'price-high') orderBy = { price: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true, seller: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white dark:bg-dark-bg min-h-screen">
      
      {/* Header Banner */}
      <div className="border-b border-gray-200 dark:border-dark-border pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {category ? `${category.toUpperCase().replace('-', ' ')} Collection` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Showing {products.length} products {q ? `matching "${q}"` : ''}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <ProductFilters categories={categories} currentCategory={category} />

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Top Control Bar */}
          <div className="flex justify-end items-center py-2">
            <ProductSort currentSort={sort} />
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border rounded-2xl">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">Try relaxing your search terms or selecting a different category.</p>
              <Link
                href="/products"
                className="mt-6 inline-block text-sm font-semibold bg-[#0a0a0a] dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
