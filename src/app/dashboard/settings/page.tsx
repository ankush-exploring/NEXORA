'use client';

import React, { useState, useEffect } from 'react';
import { Lock, CreditCard, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [upiId, setUpiId] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
          setUpiId(data.upiId || '');
        }
      } catch (err) {
        console.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [router]);

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const payload: any = { userId: user.id, upiId };
      if (newPassword) payload.newPassword = newPassword;

      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Settings updated successfully!');
        setNewPassword(''); // clear password field after save
      } else {
        alert('Failed to update settings');
      }
    } catch (err) {
      alert('Network error. Please try again later.');
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
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. username@okicici"
                    className="flex-1 bg-white dark:bg-[#050505] border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-nexora-500"
                  />
                  <button 
                    onClick={saveSettings}
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
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Update Password</h3>
              <p className="text-xs text-gray-500 mt-1 mb-3">Set a new password for your account directly.</p>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="flex-1 bg-white dark:bg-[#050505] border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-nexora-500"
                />
                <button 
                  onClick={saveSettings}
                  disabled={saving || !newPassword}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-80 disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
