import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-[#050505] mt-auto py-16 text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/">
            <Logo className="h-6" />
          </Link>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Discover better. Shop smarter.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mt-4">
            NEXORA is a modern lifestyle e-commerce platform focused on making product discovery, comparison and purchasing simple, fast and visually premium.
          </p>
        </div>

        {/* Support & Legal links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Support & Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/support/contact" className="hover:text-nexora-500 transition-colors">Contact Us</Link></li>
            <li><Link href="/support/faq" className="hover:text-nexora-500 transition-colors">FAQ & Help Center</Link></li>
            <li><Link href="/support/shipping" className="hover:text-nexora-500 transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-nexora-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/legal/terms" className="hover:text-nexora-500 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-200 dark:border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} NEXORA. All rights reserved.</p>
        <div className="flex gap-4">
          {/* Social links removed as requested */}
        </div>
      </div>
    </footer>
  );
}
