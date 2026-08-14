'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Package } from 'lucide-react';

interface AdminProductManagerProps {
  products: any[];
  categories: any[];
}

export default function AdminProductManager({ products, categories }: AdminProductManagerProps) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: categories[0]?.id || '',
    imageUrl: '',
    stock: '50',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || loading) return;

    setLoading(true);

    try {
      const storedUser = localStorage.getItem('aura_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user || user.role !== 'SELLER') {
        alert('Unauthorized. Please log in as a seller.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/admin/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          sellerId: user.id,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setForm({ title: '', description: '', price: '', categoryId: categories[0]?.id || '', imageUrl: '', stock: '50' });
        router.refresh();
      } else {
        alert('Failed to create product.');
      }
    } catch (err) {
      alert('Error creating product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/delete?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Create Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/5 text-gray-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => {
                const img = JSON.parse(p.images)[0];
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                          <Image src={img} alt={p.title} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-white max-w-xs truncate">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-emerald-400">{p.category.name}</td>
                    <td className="p-3 font-bold text-white">₹{p.price.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`font-bold ${p.stock <= 20 ? 'text-amber-400' : 'text-gray-300'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Product</h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Precision Earbuds"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="129.99"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Product specs and description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({ ...form, imageUrl: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30"
                />
                {form.imageUrl && (
                  <div className="mt-3 relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-bold rounded-xl"
                >
                  {loading ? 'Creating...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
