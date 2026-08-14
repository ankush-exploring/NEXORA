import React from 'react';

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const contentMap: Record<string, { title: string, content: string }> = {
    'privacy': {
      title: 'Privacy Policy',
      content: 'Your privacy is important to us. We securely encrypt all data and never sell your personal information.',
    },
    'terms': {
      title: 'Terms of Service',
      content: 'By using NEXORA, you agree to our platform guidelines and terms of service.',
    }
  };

  const pageData = contentMap[slug] || { title: 'Legal', content: 'NEXORA Legal Documentation.' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 min-h-[70vh]">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">{pageData.title}</h1>
      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{pageData.content}</p>
      </div>
    </div>
  );
}
