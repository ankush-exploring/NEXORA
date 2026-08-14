'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, ShieldCheck, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  useEffect(() => {
    // Prefill if logged in
    const userStr = localStorage.getItem('aura_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setShipping((prev) => ({
          ...prev,
          name: u.name || '',
          email: u.email || '',
        }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Fetch seller's UPI ID for the first item in cart
    if (items.length > 0) {
      fetch(`/api/checkout/seller-upi?productId=${items[0].id}`)
        .then(res => res.json())
        .then(data => {
          if (data.upiId) setUpiId(data.upiId);
        })
        .catch(console.error);
    }
  }, [items]);

  const subtotal = getSubtotal();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping,
          paymentMethod: `${paymentMethod} - ${upiId}`,
          items,
          totalAmount: subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderConfirmed(data.order);
        clearCart();
      } else {
        alert(data.error || 'Failed to place order.');
      }
    } catch (err) {
      alert('Network error while placing order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8 bg-white dark:bg-[#050505] min-h-[70vh] flex flex-col justify-center">
        <div className="w-20 h-20 rounded-full bg-nexora-500/10 text-nexora-500 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 stroke-[2]" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Order Confirmed</h1>
          <p className="text-base text-gray-500 mt-2 leading-relaxed">
            Thank you for shopping with NEXORA. Your order number is{' '}
            <strong className="text-gray-900 dark:text-white font-mono">{orderConfirmed.orderNumber}</strong>.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border p-6 rounded-2xl text-left text-sm space-y-4">
          <div className="flex justify-between border-b border-gray-200 dark:border-dark-border pb-3">
            <span className="text-gray-500 dark:text-gray-400">Ship To</span>
            <span className="font-bold text-gray-900 dark:text-white">{orderConfirmed.shippingName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 dark:border-dark-border pb-3">
            <span className="text-gray-500 dark:text-gray-400">City & State</span>
            <span className="font-bold text-gray-900 dark:text-white">{orderConfirmed.shippingCity}, {shipping.state} - {shipping.pincode}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-gray-500 dark:text-gray-400">Total Paid</span>
            <span className="font-extrabold text-gray-900 dark:text-white text-base">₹{orderConfirmed.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="bg-[#0a0a0a] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-sm"
          >
            View Order History
          </Link>
          <Link
            href="/products"
            className="bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-gray-200 dark:border-dark-border transition-colors"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white dark:bg-[#050505] min-h-screen">
      
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-nexora-500 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Checkout</h1>

      {items.length === 0 ? (
        <div className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border p-12 text-center rounded-2xl space-y-6">
          <p className="text-base text-gray-500 dark:text-gray-400">Your shopping cart is empty.</p>
          <Link
            href="/products"
            className="inline-block text-sm font-semibold bg-[#0a0a0a] dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Shipping & Payment Info */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Shipping Card */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-200 dark:border-dark-border pb-4">
                <span className="w-6 h-6 rounded-full bg-nexora-500 text-white flex items-center justify-center text-xs">1</span>
                Shipping Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1.5">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-sm">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Tech Way, Suite 400"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                <div className="space-y-1.5">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Maharashtra"
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="400001"
                    value={shipping.pincode}
                    onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-200 dark:border-dark-border pb-4">
                <span className="w-6 h-6 rounded-full bg-nexora-500 text-white flex items-center justify-center text-xs">2</span>
                Payment Method
              </h2>

              <div className="p-4 bg-nexora-50 dark:bg-nexora-500/10 border border-nexora-200 dark:border-nexora-500/30 rounded-xl flex items-center gap-3 text-sm text-nexora-700 dark:text-nexora-400">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>Direct UPI Payment. Scan the QR code to pay the seller instantly. Zero fees.</span>
              </div>

              <div className="space-y-6 text-sm">
                <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-card border border-nexora-500 rounded-xl cursor-pointer shadow-sm">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="w-4 h-4 text-nexora-500 focus:ring-nexora-500"
                  />
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-900 dark:text-white">Direct UPI (Scan & Pay)</span>
                </label>
                
                {upiId && (
                  <div className="mt-4 p-6 border border-gray-200 dark:border-dark-border rounded-xl flex flex-col items-center text-center space-y-4 bg-white dark:bg-dark-card">
                    <p className="font-bold text-gray-900 dark:text-white">Pay ₹{subtotal.toFixed(2)} to {upiId}</p>
                    <div className="bg-white p-2 rounded-xl">
                      <QRCodeSVG value={`upi://pay?pa=${upiId}&pn=Seller&am=${subtotal.toFixed(2)}`} size={180} />
                    </div>
                    <p className="text-xs text-gray-500">Scan with GPay, PhonePe, or Paytm</p>
                  </div>
                )}
                
                <div className="mt-4 space-y-1.5 px-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-bold">12-Digit UTR Number</label>
                  <p className="text-xs text-gray-500 mb-2">After paying, enter the transaction reference number below.</p>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 312345678901"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-nexora-500 focus:ring-1 focus:ring-nexora-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border p-6 sm:p-8 rounded-2xl space-y-6 sticky top-24 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-dark-border pb-4">Order Summary</h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block line-clamp-1 max-w-[150px]">{item.title}</span>
                        <span className="text-gray-500 dark:text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-dark-border pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !upiId}
                className="w-full bg-[#0a0a0a] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 text-white dark:text-black font-bold py-4 px-4 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 mt-4"
              >
                <Lock className="w-4 h-4" />
                {submitting ? 'Processing...' : `Pay ₹${subtotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
