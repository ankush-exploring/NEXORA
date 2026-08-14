'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Search, User, Heart, Shield, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs relative hidden lg:block">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-all"
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
    </form>
  );
}

function NavbarContent() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const { toggleCart, getTotalCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkUser = () => {
      const savedUser = localStorage.getItem('aura_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('authStateChanged', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('authStateChanged', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-dark-bg/90 border-b border-gray-200 dark:border-dark-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 sm:h-8" />
        </Link>

        {/* Categories Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-nexora-500 transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-nexora-500 transition-colors">
            Shop
          </Link>
          <Link href="/products?category=new" className="hover:text-nexora-500 transition-colors">
            New Arrivals
          </Link>
          <Link href="/products?category=deals" className="hover:text-nexora-500 transition-colors">
            Deals
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Bar */}
          <Suspense fallback={<div className="hidden lg:block w-64" />}>
            <SearchInput />
          </Suspense>

          {/* Mobile Search Icon */}
          <button className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-nexora-500 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 border-l pl-2 sm:pl-4 border-gray-200 dark:border-dark-border">
            <ThemeToggle />

            <Link
              href="/wishlist"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-nexora-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <button
              onClick={() => {
                if (!user) {
                  router.push('/auth/login');
                } else {
                  toggleCart();
                }
              }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-nexora-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card transition-colors relative"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && getTotalCount() > 0 && (
                <span className="absolute top-0 right-0 bg-nexora-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {getTotalCount()}
                </span>
              )}
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-nexora-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                title="Dashboard"
              >
                {user.role === 'ADMIN' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="ml-2 flex items-center gap-1.5 text-xs font-semibold bg-[#0a0a0a] dark:bg-white text-white dark:text-black px-4 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border" />}>
      <NavbarContent />
    </Suspense>
  );
}
