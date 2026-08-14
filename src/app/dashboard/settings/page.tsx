'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Lock, AlertTriangle, CreditCard, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    upiId: '',
    twoFactorEnabled: false,
    notifyOrderUpdates: true,
    notifyPromotions: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storedUser = localStorage.getItem('aura_user');
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }
        setUser(currentUser);

        const res = await fetch(`/api/user/settings?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setSettings({
            upiId: data.upiId || '',
            twoFactorEnabled: data.twoFactorEnabled || false,
            notifyOrderUpdates: data.notifyOrderUpdates ?? true,
            notifyPromotions: data.notifyPromotions ?? false,
          });
        }
      } catch (err) {
        console.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [router]);

  const saveSettings = async (updates: Partial<typeof settings>) => {
    if (!user) return;
    setSaving(true);
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings); // Optimistic UI update

    try {
      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...newSettings }),
      });
    } catch (err) {
      console.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-900 dark:text-white">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your preferences and security settings.</p>
      </div>

      <div className="space-y-6">
        
        {/* Payments Section (For Sellers) */}
        {user?.role === 'SELLER' && (
          <section className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-dark-border pb-4">
              <CreditCard className="w-5 h-5 text-gray-900 dark:text-white" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payments & Payouts</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Direct UPI ID</h3>
                <p className="text-xs text-gray-500 mb-3">Enter your personal UPI ID so shoppers can pay you directly at checkout.</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    placeholder="e.g. username@okicici"
                    className="flex-1 bg-white dark:bg-[#050505] border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-nexora-500"
                  />
                  <button 
                    onClick={() => saveSettings(settings)}
                    disabled={saving}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-80"
                  >
                    {saving ? 'Saving...' : 'Save UPI'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Security Section */}
        <section className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 dark:border-dark-border pb-4">
            <Lock className="w-5 h-5 text-gray-900 dark:text-white" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security & Password</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Password</h3>
                <p className="text-xs text-gray-500 mt-1">Make sure your password is strong.</p>
              </div>
              <button onClick={() => alert('Password change requires a verification email code. (Simulated)')} className="text-sm font-semibold text-nexora-500 hover:text-nexora-600 transition-colors">
                Update
              </button>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
              </div>
              <button 
                onClick={() => saveSettings({ twoFactorEnabled: !settings.twoFactorEnabled })}
                className={`text-sm font-semibold transition-colors ${settings.twoFactorEnabled ? 'text-red-500 hover:text-red-600' : 'text-nexora-500 hover:text-nexora-600'}`}
              >
                {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 dark:border-dark-border pb-4">
            <Bell className="w-5 h-5 text-gray-900 dark:text-white" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-5">
            <label className="flex items-start justify-between cursor-pointer group">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Order Updates</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px] sm:max-w-none">Get emails about your order status, shipping, and delivery.</p>
              </div>
              <div 
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 mt-1 ${settings.notifyOrderUpdates ? 'bg-nexora-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                onClick={() => saveSettings({ notifyOrderUpdates: !settings.notifyOrderUpdates })}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.notifyOrderUpdates ? 'translate-x-6' : 'translate-x-1'}`}/>
              </div>
            </label>

            <label className="flex items-start justify-between cursor-pointer group pt-4 border-t border-gray-200 dark:border-dark-border">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Promotions & Marketing</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px] sm:max-w-none">Receive updates about new products, sales, and exclusive offers.</p>
              </div>
              <div 
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 mt-1 ${settings.notifyPromotions ? 'bg-nexora-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                onClick={() => saveSettings({ notifyPromotions: !settings.notifyPromotions })}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.notifyPromotions ? 'translate-x-6' : 'translate-x-1'}`}/>
              </div>
            </label>
          </div>
        </section>

      </div>
    </div>
  );
}
