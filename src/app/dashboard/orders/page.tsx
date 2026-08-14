'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Clock, Truck, CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react';

export default function DashboardOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem('aura_user');
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }
        setUser(currentUser);

        const res = await fetch(`/api/orders/user?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, userId: user.id }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      } else {
        alert('Failed to cancel order.');
      }
    } catch (err) {
      console.error(err);
      alert('Error cancelling order.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-900 dark:text-white">Loading orders...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Order History</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your recent orders and fulfillment statuses.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border p-12 text-center rounded-2xl space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No past orders found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Place an order from our storefront to see tracking updates.</p>
          <Link
            href="/products"
            className="inline-block mt-4 text-sm font-semibold bg-[#0a0a0a] dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => {
            let statusBadge = (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-500/20">
                <Clock className="w-3.5 h-3.5" />
                Processing
              </span>
            );

            if (o.status === 'SHIPPED') {
              statusBadge = (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                  <Truck className="w-3.5 h-3.5" />
                  Shipped
                </span>
              );
            } else if (o.status === 'DELIVERED') {
              statusBadge = (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Delivered
                </span>
              );
            } else if (o.status === 'CANCELLED') {
              statusBadge = (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-500/20">
                  <XCircle className="w-3.5 h-3.5" />
                  Cancelled
                </span>
              );
            }

            return (
              <div key={o.id} className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-dark-border rounded-2xl p-6 space-y-6 shadow-sm">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-gray-900 dark:text-white">Order {o.orderNumber}</span>
                      {statusBadge}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
                      Placed on {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">₹{o.totalAmount.toFixed(2)}</span>
                    {o.status === 'PROCESSING' && (
                      <button 
                        onClick={() => handleCancelOrder(o.id)}
                        disabled={cancelling === o.id}
                        className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3 h-3" /> {cancelling === o.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Items list */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {o.items?.map((item: any) => (
                    <div key={item.id} className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-gray-900 flex-shrink-0 border border-gray-100 dark:border-gray-800">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white block truncate">{item.title}</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping summary */}
                <div className="pt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 bg-gray-50 dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-dark-border">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Sent to <strong className="text-gray-900 dark:text-gray-200 font-semibold">{o.shippingName}</strong> at {o.shippingAddress}, {o.shippingCity} {o.shippingZip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
