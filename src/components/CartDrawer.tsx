'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const delivery = subtotal > 50 ? 0 : 5.99;
  const finalTotal = subtotal + (items.length > 0 ? delivery : 0);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-[#050505] border-l border-gray-200 dark:border-dark-border flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gray-900 dark:text-white" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Cart ({items.length})</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700 stroke-[1]" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-2">Discover better products.</p>
                <button
                  onClick={closeCart}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold bg-[#0a0a0a] dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border rounded-xl items-center relative group"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">₹{item.price.toFixed(2)}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-[#0a0a0a] space-y-4">
              
              <div className="space-y-2 text-sm text-gray-500 pt-2 border-t border-gray-200 dark:border-dark-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-gray-900 dark:text-white font-medium">{delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
                <span className="text-gray-900 dark:text-white font-bold">Total</span>
                <span className="text-xl font-extrabold text-gray-900 dark:text-white">₹{finalTotal.toFixed(2)}</span>
              </div>
              
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold py-3.5 px-4 rounded-xl transition-all shadow-md mt-2"
              >
                Checkout Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
