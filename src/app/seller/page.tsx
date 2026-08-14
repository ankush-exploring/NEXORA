'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import OrderStatusToggle from './OrderStatusToggle';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const storedUser = localStorage.getItem('aura_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user || user.role !== 'SELLER') {
          router.push('/auth/login');
          return;
        }

        const res = await fetch(`/api/seller/dashboard?sellerId=${user.id}`);
        const result = await res.json();
        if (res.ok) {
          setData(result);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading || !data) {
    return <div className="p-8 text-gray-900 dark:text-white">Loading dashboard...</div>;
  }

  const { totalRevenue, totalOrders, activeProducts, lowStockCount, recentOrders, balance } = data;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Executive Dashboard Overview</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Real-time revenue metrics, order statuses, and catalog alerts.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Wallet Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{balance?.toFixed(2) || '0.00'}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            Available for payout via Paytm
          </span>
        </div>

        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalOrders}</p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Processed successfully</span>
        </div>

        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Active Products</span>
            <Package className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeProducts}</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">Live in storefront</span>
        </div>

        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{lowStockCount}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Items with &le; 20 units left</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Fulfillment Orders</h2>
          <Link href="/seller/orders" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Manage All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-tl-lg">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {recentOrders.map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{o.orderNumber}</td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-900 dark:text-white block">{o.shippingName}</span>
                    <span className="text-[10px] text-gray-500">{o.shippingEmail}</span>
                  </td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">₹{o.orderRevenue?.toFixed(2) || '0.00'}</td>
                  <td className="p-3">
                    <OrderStatusToggle orderId={o.id} initialStatus={o.status} />
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
