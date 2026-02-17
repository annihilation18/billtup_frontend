import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  User,
  Building2,
  Mail,
  TrendingUp,
  CreditCard,
  Settings2,
  ChevronRight,
  Loader2,
  HelpCircle,
  ExternalLink,
  Bell
} from 'lucide-react@0.468.0';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { fetchBusinessProfile, fetchUserProfile } from '../../utils/dashboard-api';
import { AccountSettingsModal } from './AccountSettingsModal';
import { BusinessProfileModal } from './BusinessProfileModal';
import { CommunicationModal } from './CommunicationModal';
import { CustomerAnalyticsModal } from './CustomerAnalyticsModal';
import { PaymentSettingsModal } from './PaymentSettingsModal';
import { PreferencesModal } from './PreferencesModal';
import { EmailNotificationsModal } from './EmailNotificationsModal';

interface SettingsTabProps {
  userPlan: 'basic' | 'premium';
  onSignOut: () => void;
  onPlanChange?: (newPlan: 'basic' | 'premium') => void;
}

export function SettingsTab({ userPlan, onSignOut, onPlanChange }: SettingsTabProps) {
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isPremium = userPlan === 'premium';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [business, user] = await Promise.all([
        fetchBusinessProfile(),
        fetchUserProfile()
      ]);
      console.log('SettingsTab - Loaded business profile:', business);
      console.log('SettingsTab - Business name:', business?.businessName);
      setBusinessProfile(business);
      setUserProfile(user);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const settingsCards = [
    {
      id: 'account',
      icon: User,
      title: 'Account',
      subtitle: 'Subscription & account management',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'business',
      icon: Building2,
      title: 'Business Profile',
      subtitle: businessProfile?.businessName || 'Set up your business information',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      id: 'communication',
      icon: Mail,
      title: 'Communication',
      subtitle: 'Email configuration & notifications',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      title: 'Customer Analytics',
      subtitle: 'Lifetime value & insights',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      premium: true,
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Payment Settings',
      subtitle: 'Stripe Connect & payment processing',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Email Notifications',
      subtitle: 'Choose which emails you receive',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      id: 'preferences',
      icon: Settings2,
      title: 'Preferences',
      subtitle: 'Security settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Contact support & documentation',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Settings
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Manage your account and preferences
          </p>
        </div>
        <Button 
          onClick={onSignOut}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Sign Out
        </Button>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsCards.map((card) => {
          return (
            <Card
              key={card.id}
              onClick={() => setActiveModal(card.id)}
              className="p-6 border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-[#1E3A8A]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {card.title}
                  </h3>
                  {card.premium && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {card.subtitle}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* App Info */}
      <Card className="p-6 border-gray-200 bg-gray-50">
        <div className="text-center">
          <h3 className="text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BilltUp
          </h3>
          <p className="text-sm text-gray-600 mb-1">Professional Invoicing Platform</p>
          <p className="text-xs text-gray-500">Version 1.0.0</p>
          <p className="text-xs text-gray-500 mt-2">
            © 2025 BilltUp. All rights reserved.
          </p>
        </div>
      </Card>

      {/* Modals */}
      <AccountSettingsModal
        open={activeModal === 'account'}
        onClose={() => setActiveModal(null)}
        userPlan={userPlan}
        userProfile={userProfile}
        onDataUpdated={loadData}
        onSignOut={onSignOut}
        onPlanChange={onPlanChange}
      />
      <BusinessProfileModal
        open={activeModal === 'business'}
        onClose={() => setActiveModal(null)}
        businessProfile={businessProfile}
        onDataUpdated={loadData}
        userPlan={userPlan}
      />
      <CommunicationModal
        open={activeModal === 'communication'}
        onClose={() => setActiveModal(null)}
        businessProfile={businessProfile}
        onDataUpdated={loadData}
        userPlan={userPlan}
      />
      <CustomerAnalyticsModal
        open={activeModal === 'analytics'}
        onClose={() => setActiveModal(null)}
        userPlan={userPlan}
      />
      <PaymentSettingsModal
        open={activeModal === 'payment'}
        onClose={() => setActiveModal(null)}
        onDataUpdated={loadData}
      />
      <EmailNotificationsModal
        open={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
        userProfile={userProfile}
        onDataUpdated={loadData}
      />
      <PreferencesModal
        open={activeModal === 'preferences'}
        onClose={() => setActiveModal(null)}
        userProfile={userProfile}
        onDataUpdated={loadData}
      />
      <Dialog open={activeModal === 'help'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#1E3A8A]" />
              <span style={{ fontFamily: 'Poppins, sans-serif' }}>Help & Support</span>
            </DialogTitle>
            <DialogDescription>
              Get help with your BilltUp account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Contact Support</h4>
              <p className="text-sm text-gray-600">
                Email us at{' '}
                <a href="mailto:support@billtup.com" className="text-[#1E3A8A] hover:underline font-medium">
                  support@billtup.com
                </a>
              </p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Help Center</h4>
              <p className="text-sm text-gray-600 mb-3">
                Browse documentation, FAQs, and guides.
              </p>
              <a
                href="https://billtup.com/help"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#1E3A8A] hover:underline font-medium"
              >
                Visit Help Center
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">App Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Version: 1.0.0</p>
                <p>Plan: <span className="font-medium capitalize">{userPlan}</span></p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}