import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const categories = await prisma.category.findMany();
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    include: { category: true, seller: true },
  });
  
  // Get new arrivals (mocked by just taking the last 4)
  const newArrivals = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { category: true, seller: true },
  });

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-left space-y-6">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Discover products you'll <span className="text-nexora-500">actually love.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-normal max-w-2xl leading-relaxed">
              Curated essentials, smarter discovery, and a shopping experience built around you. Welcome to the future of retail.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#0a0a0a] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold px-8 py-4 rounded-xl transition-all shadow-md text-sm"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=new"
                className="inline-flex items-center gap-2 bg-white dark:bg-[#171717] hover:bg-gray-50 dark:hover:bg-[#262626] text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl border border-gray-200 dark:border-dark-border transition-colors text-sm shadow-sm"
              >
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle Hero Background Accent */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-nexora-500/5 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Trending Now / Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Trending Now</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">The products everyone is talking about.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-nexora-500 hover:text-nexora-600 transition-colors flex items-center gap-1 mb-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shop by Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-4 flex flex-col items-center text-center space-y-4 hover:border-nexora-500 transition-colors shadow-sm"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 group-hover:scale-105 transition-transform duration-300">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-nexora-500 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-dark-border pt-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">New Arrivals</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Just dropped. Get them before they're gone.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* Value Propositions & Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-nexora-900 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-nexora-100 via-transparent to-transparent"></div>
          <div className="relative z-10 px-6 py-16 md:py-20 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold">Join the NEXORA Club</h3>
              <p className="text-nexora-100 text-lg max-w-md">
                Get early access to drops, exclusive discounts, and a smarter way to shop.
              </p>
            </div>
            <div className="md:w-1/2 w-full max-w-md">
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-nexora-100 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
                <button type="button" className="bg-white text-nexora-900 font-bold px-6 py-3 rounded-xl hover:bg-nexora-50 transition-colors">
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-nexora-100 mt-3 opacity-80">By subscribing you agree to our Terms of Service.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-dark-border pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white mx-auto flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Free Express Shipping</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Complimentary 2-day delivery on all orders over $50 worldwide.</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white mx-auto flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">30-Day Trial Guarantee</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Try your gear risk-free with zero-hassle prepaid return shipping labels.</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Secure Checkout</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your payment information is encrypted and securely processed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
