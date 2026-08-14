'use client';

import React, { useState } from 'react';

interface OrderStatusToggleProps {
  orderId: string;
  initialStatus: string;
}

export default function OrderStatusToggle({ orderId, initialStatus }: OrderStatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (newStatus: string) => {
    setUpdating(true);
    setStatus(newStatus);

    try {
      await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={status}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value)}
      className={`text-[11px] font-bold rounded-lg px-2.5 py-1 focus:outline-none border border-white/10 ${
        status === 'DELIVERED'
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          : status === 'SHIPPED'
          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
          : status === 'CANCELLED'
          ? 'bg-red-500/20 text-red-400 border-red-500/30'
          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      }`}
    >
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}
