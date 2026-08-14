import React from 'react';
import Link from 'next/link';
import { Shield, LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 flex flex-col sm:flex-row">
      
      {/* Seller Sidebar */}
      <aside className="w-full sm:w-64 bg-gray-50 dark:bg-gray-950 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-white/10 p-5 space-y-6 flex-shrink-0">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">NEXORA Seller</h2>
              <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold uppercase tracking-wider">Dashboard</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <nav className="space-y-1 text-xs font-semibold">
          <Link
            href="/seller"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Sales Overview
          </Link>

          <Link
            href="/seller/products"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Package className="w-4 h-4" />
            My Products
          </Link>

          <Link
            href="/seller/orders"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Fulfillment
          </Link>
        </nav>

        <div className="pt-6 border-t border-gray-200 dark:border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
