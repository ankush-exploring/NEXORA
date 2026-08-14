import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ArrowLeft, Ruler } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

interface PDPProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PDPProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product) {
    notFound();
  }

  const images: string[] = JSON.parse(product.images);
  const firstImage = images[0] || '';
  
  // Parse specifications and sizes
  let specifications: any[] = [];
  try {
    if (product.specifications) specifications = JSON.parse(product.specifications);
  } catch(e) {}

  let sizes: string[] = [];
  try {
    if (product.sizes) sizes = JSON.parse(product.sizes);
  } catch(e) {}

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    take: 4,
    include: { category: true },
  });

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Breadcrumb / Back button */}
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-nexora-500 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-nexora-500 transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-200">{product.title}</span>
        </nav>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Product Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden">
              <Image
                src={firstImage}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
              {discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-nexora-500 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md tracking-wider shadow-sm">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
            
            {/* Thumbnail Gallery (Mocked layout for multi-images) */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 dark:border-dark-border cursor-pointer hover:border-nexora-500 transition-colors">
                    <Image src={img} alt={`${product.title} view ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Meta & Purchase Panel */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
                NEXORA
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rating Stars */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-yellow-500' : 'text-gray-300 dark:text-gray-700'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-300">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500 underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4 cursor-pointer">
                  {product.reviews.length} reviews
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹{product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-lg font-medium text-gray-400 line-through decoration-1">
                  ₹{product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {sizes && sizes.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Select Size</h3>
                  <button className="text-sm text-gray-500 hover:text-nexora-500 flex items-center gap-1 transition-colors">
                    <Ruler className="w-4 h-4" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((s, idx) => (
                    <button key={idx} className="py-3 px-4 border border-gray-200 dark:border-dark-border rounded-xl text-sm font-semibold text-gray-900 dark:text-white hover:border-nexora-500 focus:outline-none focus:ring-2 focus:ring-nexora-500 focus:border-nexora-500 transition-all bg-white dark:bg-dark-card shadow-sm">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-dark-border">
              <div className="flex-1">
                <AddToCartButton
                  product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: firstImage,
                    category: product.category.name,
                  }}
                />
              </div>

              <button className="p-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-nexora-500 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Value props badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-dark-border text-sm font-medium text-gray-900 dark:text-gray-300">
              <div className="flex flex-col gap-2">
                <Truck className="w-5 h-5 text-nexora-500" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex flex-col gap-2">
                <RotateCcw className="w-5 h-5 text-nexora-500" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-5 h-5 text-nexora-500" />
                <span>2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {specifications && specifications.length > 0 && (
          <section className="border-t border-gray-200 dark:border-dark-border pt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-8">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{spec.key}</span>
                  <span className="text-gray-900 dark:text-gray-200 font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <section className="border-t border-gray-200 dark:border-dark-border pt-16 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Customer Reviews</h2>

          {product.reviews.length === 0 ? (
            <div className="bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-dark-border rounded-2xl p-8 text-center">
              <p className="text-gray-500 font-medium">Be the first to review this product.</p>
              <button className="mt-4 px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Write a Review</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((r) => (
                <div key={r.id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-900 dark:text-white">{r.userName}</span>
                    <span className="text-xs text-gray-400 font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-yellow-500' : 'text-gray-300 dark:text-gray-700'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-200 dark:border-dark-border pt-16 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Complete the Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
