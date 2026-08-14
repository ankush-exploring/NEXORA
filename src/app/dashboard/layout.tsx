'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Package, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('aura_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (e) {}
    }
  }, []);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
    window.dispatchEvent(new Event('authStateChanged'));
    router.push('/auth/login');
  };

  return (
    <div className="bg-gray-50 dark:bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Dashboard Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 px-4">My Account</h2>
            
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              
              <Link 
                href="/dashboard/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
              >
                <Package className="w-4 h-4" />
                Order History
              </Link>
              
              <Link 
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>

              {userRole === 'SELLER' && (
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-border">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">Seller Tools</h3>
                  <Link 
                    href="/seller"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-nexora-600 dark:text-nexora-400 hover:bg-nexora-50 dark:hover:bg-nexora-500/10 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Seller Dashboard
                  </Link>
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-border">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border rounded-3xl p-6 sm:p-10 shadow-sm min-h-[600px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
