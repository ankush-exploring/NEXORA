import React from 'react';

export default async function SupportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const contentMap: Record<string, { title: string, content: string }> = {
    'contact': {
      title: 'Contact Us',
      content: 'Get in touch with our team 24/7. Email us at support@nexora.com or call 1-800-NEXORA.',
    },
    'faq': {
      title: 'FAQ & Help Center',
      content: 'Find answers to common questions about your account, orders, and products.',
    },
    'shipping': {
      title: 'Shipping & Returns',
      content: 'We offer free shipping over ₹50. Returns are accepted within 30 days of purchase.',
    }
  };

  const pageData = contentMap[slug] || { title: 'Support', content: 'We are here to help.' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 min-h-[70vh]">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">{pageData.title}</h1>
      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{pageData.content}</p>
      </div>
    </div>
  );
}
