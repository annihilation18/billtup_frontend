import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  TrendingUp,
  User,
  Building2,
  CreditCard,
  Loader2,
  Smartphone
} from 'lucide-react@0.468.0';
import { fetchBillingCycleUsage } from '../../utils/dashboard-api';

interface OverviewTabProps {
  userPlan: 'basic' | 'premium';
  onNavigateToTab?: (tab: 'analytics' | 'settings') => void;
  onUpgrade?: () => void;
}

export function OverviewTab({ userPlan, onNavigateToTab, onUpgrade }: OverviewTabProps) {
  const [loading, setLoading] = useState(true);
  const [billingUsage, setBillingUsage] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const usageData = await fetchBillingCycleUsage();
      setBillingUsage(usageData);
    } catch (error) {
      console.error('Error loading overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Account Overview
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Manage your account settings and subscription
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-gray-200">
        <h3 className="text-lg text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigateToTab?.('settings')}
            className="p-4 bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5 hover:from-[#1E3A8A]/10 hover:to-[#14B8A6]/10 rounded-xl border border-[#14B8A6]/20 transition-colors text-left"
          >
            <User className="w-8 h-8 text-[#1E3A8A] mb-2" />
            <p className="text-sm text-gray-900">Account Settings</p>
          </button>
          {userPlan === 'premium' ? (
            <button
              onClick={() => onNavigateToTab?.('analytics')}
              className="p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#1E3A8A]/5 hover:from-[#F59E0B]/10 hover:to-[#1E3A8A]/10 rounded-xl border border-[#F59E0B]/20 transition-colors text-left"
            >
              <TrendingUp className="w-8 h-8 text-[#F59E0B] mb-2" />
              <p className="text-sm text-gray-900">View Reports</p>
            </button>
          ) : (
            <button
              onClick={onUpgrade}
              className="p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#1E3A8A]/5 hover:from-[#F59E0B]/10 hover:to-[#1E3A8A]/10 rounded-xl border border-[#F59E0B]/20 transition-colors text-left relative"
            >
              <TrendingUp className="w-8 h-8 text-[#F59E0B] mb-2 opacity-40" />
              <p className="text-sm text-gray-900 opacity-40">View Reports</p>
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white text-xs rounded">Premium</span>
            </button>
          )}
          <button
            onClick={() => onNavigateToTab?.('settings')}
            className="p-4 bg-gradient-to-br from-[#14B8A6]/5 to-[#F59E0B]/5 hover:from-[#14B8A6]/10 hover:to-[#F59E0B]/10 rounded-xl border border-[#14B8A6]/20 transition-colors text-left"
          >
            <Building2 className="w-8 h-8 text-[#14B8A6] mb-2" />
            <p className="text-sm text-gray-900">Business Profile</p>
          </button>
          <button
            onClick={() => onNavigateToTab?.('settings')}
            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors text-left"
          >
            <CreditCard className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-sm text-gray-900">Payment Settings</p>
          </button>
        </div>
      </Card>

      {/* Mobile App Promo */}
      <Card className="p-6 border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-[#14B8A6]" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Manage Your Business on the Go
            </h3>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Create invoices, estimates, manage customers, take payments, and more from the BilltUp mobile app.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-9 text-sm border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                onClick={() => window.open('https://apps.apple.com/app/billtup', '_blank')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </Button>
              <Button
                variant="outline"
                className="h-9 text-sm border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.billtup', '_blank')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.916V2.73a1 1 0 0 1 .609-.916zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Plan Info (if Basic) */}
      {userPlan === 'basic' && (
        <Card className="p-6 bg-gradient-to-br from-[#F59E0B]/10 to-[#1E3A8A]/10 border-[#F59E0B]/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Upgrade to Premium
              </h3>
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Unlock advanced features like analytics, custom branding, and more.
              </p>
              <p className="text-xs text-gray-500">
                You've used {billingUsage?.used || 0} of {billingUsage?.limit || 10} invoices this cycle
              </p>
            </div>
            <Button className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 text-white rounded-lg whitespace-nowrap" onClick={onUpgrade}>
              Upgrade Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}