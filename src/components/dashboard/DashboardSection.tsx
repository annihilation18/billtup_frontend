import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  TrendingUp,
  RefreshCw,
  Crown,
  LogOut,
  Menu,
  X,
  Smartphone,
  Clock,
  Sparkles
} from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CustomersTab } from './CustomersTab';
import { InvoicesTab } from './InvoicesTab';
import { AnalyticsTab } from './AnalyticsTab';
import { SettingsTab } from './SettingsTab';
import { OverviewTab } from './OverviewTab';
import { BilltUpLogo } from '../BilltUpLogo';
import { UserMenu } from './UserMenu';
import { fetchTrialStatus } from '../../utils/dashboard-api';
import { pathToTab, tabToPath } from '../../utils/routes';
import type { DashboardTab } from '../../utils/routes';

interface DashboardSectionProps {
  userPlan: 'basic' | 'premium';
  onSignOut: () => void;
  onPlanChange?: (newPlan: 'basic' | 'premium') => void;
}

export function DashboardSection({ userPlan, onSignOut, onPlanChange }: DashboardSectionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = pathToTab(location.pathname);
  const setActiveTab = useCallback((tab: DashboardTab) => {
    navigate(tabToPath(tab));
  }, [navigate]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [trialStatus, setTrialStatus] = useState<{
    isInTrial: boolean;
    daysRemaining: number;
  } | null>(null);

  useEffect(() => {
    loadTrialStatus();
  }, []);

  const loadTrialStatus = async () => {
    const status = await fetchTrialStatus();
    setTrialStatus({
      isInTrial: status.isInTrial,
      daysRemaining: status.daysRemaining,
    });
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, premiumOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isPremium = userPlan === 'premium';
  // If user is in trial, treat them as premium for features
  const effectivePlan = trialStatus?.isInTrial ? 'premium' : userPlan;
  const isPremiumOrTrial = effectivePlan === 'premium';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link */}
      <a
        href="#dashboard-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring"
      >
        Skip to dashboard content
      </a>

      {/* Trial Banner */}
      {trialStatus?.isInTrial && (
        <div 
          className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white py-3 px-4 sm:px-6 lg:px-8"
          role="banner"
          aria-label="Premium trial status"
        >
          <div className="flex items-center justify-center gap-2 text-center">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            <p className="text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong>Trial Active:</strong> You have {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''} remaining in your Premium trial
              {userPlan === 'basic' && ' – Enjoying Premium features!'}
            </p>
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40" role="banner">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BilltUpLogo size={40} />
            <div>
              <h1 id="dashboard-title" className="text-xl text-[#1E3A8A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                BilltUp
              </h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Plan Badge */}
            <div 
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                trialStatus?.isInTrial
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white'
                  : isPremium 
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white' 
                  : 'bg-[#14B8A6]/10 text-[#14B8A6]'
              }`}
              role="status"
              aria-label={`Current plan: ${trialStatus?.isInTrial ? 'Premium Trial' : isPremium ? 'Premium' : 'Basic'}`}
            >
              {(isPremium || trialStatus?.isInTrial) && <Crown className="w-4 h-4" aria-hidden="true" />}
              <span className="text-sm">
                {trialStatus?.isInTrial ? 'Premium Trial' : isPremium ? 'Premium' : 'Basic'} Plan
              </span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#1E3A8A]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-dashboard-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden lg:block">
              <UserMenu 
                onSignOut={onSignOut}
                onNavigateToSettings={() => setActiveTab('settings')}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-dashboard-menu" 
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-3 space-y-2">
              <div 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg w-fit ${
                  trialStatus?.isInTrial
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white'
                    : isPremium 
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white' 
                    : 'bg-[#14B8A6]/10 text-[#14B8A6]'
                }`}
                role="status"
                aria-label={`Current plan: ${trialStatus?.isInTrial ? 'Premium Trial' : isPremium ? 'Premium' : 'Basic'}`}
              >
                {(isPremium || trialStatus?.isInTrial) && <Crown className="w-4 h-4" aria-hidden="true" />}
                <span className="text-sm">
                  {trialStatus?.isInTrial ? 'Premium Trial' : isPremium ? 'Premium' : 'Basic'} Plan
                </span>
              </div>
              {/* User Menu - Mobile */}
              <UserMenu 
                onSignOut={onSignOut}
                onNavigateToSettings={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav 
            className="p-4 space-y-1" 
            aria-label="Dashboard navigation"
            role="navigation"
          >
            {tabs.map((tab) => {
              const isLocked = tab.premiumOnly && !isPremiumOrTrial;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && setActiveTab(tab.id as any)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-[#1E3A8A] text-white'
                      : isLocked
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={`${tab.label}${isLocked ? ' (Premium only)' : ''}${isActive ? ' (current)' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={isLocked}
                >
                  <tab.icon className="w-5 h-5" aria-hidden="true" />
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>{tab.label}</span>
                  {isLocked && (
                    <Crown className="w-4 h-4 ml-auto text-[#F59E0B]" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile App Promo */}
          <div className="p-4 mt-4" role="complementary" aria-label="Mobile app promotion">
            <Card className="p-4 bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5 border-[#14B8A6]/20">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-5 h-5 text-[#14B8A6]" aria-hidden="true" />
                <h3 className="text-sm text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Get the App
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Invoice on the go with our mobile app
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full h-9 text-xs border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                  onClick={() => window.open('https://apps.apple.com/app/billtup', '_blank')}
                  aria-label="Download BilltUp on the App Store"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span>App Store</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-9 text-xs border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=com.billtup', '_blank')}
                  aria-label="Get BilltUp on Google Play"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.916V2.73a1 1 0 0 1 .609-.916zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <span>Google Play</span>
                </Button>
              </div>
            </Card>
          </div>
        </aside>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <nav 
            className="flex justify-around p-2" 
            aria-label="Mobile dashboard navigation"
            role="navigation"
          >
            {tabs.map((tab) => {
              const isLocked = tab.premiumOnly && !isPremiumOrTrial;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && setActiveTab(tab.id as any)}
                  disabled={isLocked}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
                      : isLocked
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                  aria-label={`${tab.label}${isLocked ? ' (Premium only)' : ''}${isActive ? ' (current)' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={isLocked}
                >
                  <div className="relative">
                    <tab.icon className="w-5 h-5" aria-hidden="true" />
                    {isLocked && (
                      <Crown className="w-3 h-3 absolute -top-1 -right-1 text-[#F59E0B]" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <main 
          id="dashboard-main-content" 
          className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8" 
          role="main"
          aria-labelledby="dashboard-title"
        >
          {activeTab === 'overview' && <OverviewTab userPlan={effectivePlan} onNavigateToTab={setActiveTab} onUpgrade={handleUpgrade} />}
          {activeTab === 'customers' && <CustomersTab userPlan={effectivePlan} />}
          {activeTab === 'invoices' && <InvoicesTab userPlan={effectivePlan} />}
          {activeTab === 'analytics' && <AnalyticsTab userPlan={effectivePlan} />}
          {activeTab === 'settings' && <SettingsTab userPlan={effectivePlan} onSignOut={onSignOut} onPlanChange={onPlanChange} />}
        </main>
      </div>
    </div>
  );
}