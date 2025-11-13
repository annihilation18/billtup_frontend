import { useState, useEffect } from 'react';
import { SubscriptionStatus, PlanLimits } from './subscriptionPlans';
import { subscriptionApi } from './api';

export function usePremiumFeatures() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionApi.getStatus();
      setSubscription(data);
    } catch (error) {
      // API not available yet - use mock subscription for development
      setSubscription({
        planType: 'trial',
        isActive: true,
        isTrial: true,
        trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        invoicesThisPeriod: 12,
        customerCount: 34,
      });
    } finally {
      setLoading(false);
    }
  };

  const hasFeature = (feature: 'analytics' | 'customBranding' | 'domainEmail' | 'customerAnalytics') => {
    if (!subscription) return false;
    
    // Trial and Premium users get all features
    if (subscription.planType === 'trial' || subscription.planType === 'premium') {
      return true;
    }
    
    return false;
  };

  const isPremiumOrTrial = subscription?.planType === 'premium' || subscription?.planType === 'trial';

  return {
    subscription,
    loading,
    hasFeature,
    isPremiumOrTrial,
    hasAnalytics: hasFeature('analytics'),
    hasCustomBranding: hasFeature('customBranding'),
    hasDomainEmail: hasFeature('domainEmail'),
    hasCustomerAnalytics: hasFeature('customerAnalytics'),
  };
}