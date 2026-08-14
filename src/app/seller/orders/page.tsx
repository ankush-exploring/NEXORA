'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import OrderStatusToggle from '../OrderStatusToggle';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem('aura_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user || user.role !== 'SELLER') {
          router.push('/auth/login');
          return;
        }

        const res = await fetch(`/api/seller/orders?sellerId=${user.id}`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-gray-900 dark:text-white">Loading orders...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Order Fulfillment Management</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Track customer orders, manage shipping statuses, and review your line items.</p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-sm">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
              <div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{o.orderNumber}</span>
                <span className="text-xs text-gray-500 block sm:inline sm:ml-4">
                  Placed on {new Date(o.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-base font-extrabold text-gray-900 dark:text-white">₹{o.orderRevenue?.toFixed(2)}</span>
                <OrderStatusToggle orderId={o.id} initialStatus={o.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <span className="text-gray-900 dark:text-gray-500 font-bold block mb-1">Customer Shipping Info</span>
                <span className="text-gray-800 dark:text-gray-200 font-bold block">{o.shippingName} ({o.shippingEmail})</span>
                <span>{o.shippingAddress}, {o.shippingCity} {o.shippingZip}</span>
              </div>

              <div>
                <span className="text-gray-900 dark:text-gray-500 font-bold block mb-1">Payment & Security</span>
                <span className="text-gray-800 dark:text-gray-200 block">{o.paymentMethod}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Payment Status: Verified (Test Mode)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {o.sellerItems?.map((item: any) => (
                <div key={item.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-3 rounded-xl flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 text-xs">
                    <span className="font-bold text-gray-900 dark:text-gray-200 block truncate">{item.title}</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">₹{item.price.toFixed(2)} &times; {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-2xl">
            You have no orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
