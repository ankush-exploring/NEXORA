'use client';

import React, { useEffect, useState } from 'react';
import AdminProductManager from './AdminProductManager';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedUser = localStorage.getItem('aura_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user || user.role !== 'SELLER') {
          router.push('/auth/login');
          return;
        }

        const res = await fetch(`/api/seller/products?sellerId=${user.id}`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-white">Loading products...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Product Catalog CRUD Management</h1>
        <p className="text-xs text-gray-400 mt-1">Create new products, edit pricing and stock levels, or delete items.</p>
      </div>

      <AdminProductManager products={products} categories={categories} />
    </div>
  );
}
