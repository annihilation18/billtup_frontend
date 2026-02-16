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
  Palette
} from 'lucide-react@0.468.0';
import { fetchBusinessProfile, fetchUserProfile } from '../../utils/dashboard-api';
import { AccountSettingsModal } from './AccountSettingsModal';
import { BusinessProfileModal } from './BusinessProfileModal';
import { CommunicationModal } from './CommunicationModal';
import { CustomerAnalyticsModal } from './CustomerAnalyticsModal';
import { PaymentSettingsModal } from './PaymentSettingsModal';
import { PreferencesModal } from './PreferencesModal';
import { CustomBrandingModal } from './CustomBrandingModal';

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
      premiumOnly: true,
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
      id: 'preferences',
      icon: Settings2,
      title: 'Preferences',
      subtitle: 'Security & notification preferences',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      id: 'branding',
      icon: Palette,
      title: 'Custom Branding',
      subtitle: 'Logo & color scheme',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      premiumOnly: true,
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
          const isLocked = card.premiumOnly && !isPremium;
          return (
            <Card
              key={card.id}
              onClick={() => !isLocked && setActiveModal(card.id)}
              className={`p-6 border-gray-200 hover:shadow-md transition-all ${
                isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[#1E3A8A]'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                {!isLocked && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {card.title}
                  </h3>
                  {card.premiumOnly && (
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
      />
      <CommunicationModal
        open={activeModal === 'communication'}
        onClose={() => setActiveModal(null)}
        businessProfile={businessProfile}
        onDataUpdated={loadData}
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
      <PreferencesModal
        open={activeModal === 'preferences'}
        onClose={() => setActiveModal(null)}
        userProfile={userProfile}
        onDataUpdated={loadData}
      />
      <CustomBrandingModal
        open={activeModal === 'branding'}
        onClose={() => setActiveModal(null)}
        businessProfile={businessProfile}
        onDataUpdated={loadData}
        userPlan={userPlan}
      />
    </div>
  );
}