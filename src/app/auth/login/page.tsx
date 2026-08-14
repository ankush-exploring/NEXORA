'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, LogIn } from 'lucide-react';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('aura_user', JSON.stringify(data.user));
        localStorage.setItem('aura_token', data.token);
        window.dispatchEvent(new Event('authStateChanged'));
        
        if (data.user.role === 'SELLER') {
          router.push('/seller');
        } else {
          router.push('/products');
        }
        router.refresh();
      } else {
        setError(data.error || 'Failed to login');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center">
      <div className="bg-white dark:bg-dark-card p-10 rounded-[2rem] space-y-8 shadow-2xl border border-gray-100 dark:border-dark-border">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo className="h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your NEXORA account to continue.</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormLogin} className="space-y-5 text-sm">
          <div className="space-y-1.5">
            <label className="block text-gray-700 dark:text-gray-300 font-bold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nexora-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-gray-700 dark:text-gray-300 font-bold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nexora-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black font-bold py-4 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-bold text-nexora-600 dark:text-nexora-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
