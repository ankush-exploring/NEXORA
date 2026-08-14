'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, ShieldCheck } from 'lucide-react';

export default function DashboardProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('aura_user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    } else {
      // Mock user for UI if not logged in for preview purposes
      setUser({
        name: 'Alex Morgan',
        email: 'alex@example.com',
      });
    }
  }, []);

  if (!user) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Profile Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-sm">
        <div className="w-20 h-20 bg-nexora-500/10 text-nexora-500 rounded-full flex items-center justify-center font-bold text-2xl border border-nexora-500/20">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200">Full Name</label>
          <input 
            type="text" 
            defaultValue={user.name}
            className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200">Email Address</label>
          <input 
            type="email" 
            defaultValue={user.email}
            disabled
            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-500 dark:text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-6">
        <button className="bg-[#0a0a0a] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
}
