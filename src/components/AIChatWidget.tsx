'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon } from 'lucide-react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Hi! I am the NEXORA AI Support Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('CUSTOMER');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is seller or customer
    const userStr = localStorage.getItem('aura_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role) setUserRole(u.role);
      } catch (e) {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, role: userRole }),
      });
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: data.reply || (data.details ? `Error: ${data.details}` : 'Sorry, something went wrong.') },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Network error. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#0a0a0a] dark:bg-white text-white dark:text-black p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-nexora-500 rounded-full p-1.5 text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">NEXORA Support</h3>
                <p className="text-xs opacity-70">Powered by Llama 3 on Groq</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#050505]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-800' : 'bg-nexora-500/20 text-nexora-500'}`}>
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#0a0a0a] dark:bg-white text-white dark:text-black rounded-tr-sm' 
                    : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-white/5 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="shrink-0 w-8 h-8 rounded-full bg-nexora-500/20 text-nexora-500 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-white dark:bg-dark-card border border-gray-200 dark:border-white/5 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-nexora-500 dark:text-white transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 hover:opacity-80 transition-opacity"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0a0a0a] dark:bg-white text-white dark:text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
