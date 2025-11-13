// Subscription Plans Configuration
// Defines the Basic and Premium plan features and pricing

export type PlanType = 'trial' | 'basic' | 'premium';

export interface PlanFeatures {
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'trial';
  features: {
    invoicesPerMonth: number | 'unlimited';
    maxCustomers: number | 'unlimited';
    paymentProcessing: boolean;
    automaticPDFReceipts: boolean;
    customerManagement: 'basic' | 'advanced';
    mobileAndWebAccess: boolean;
    support: 'email' | 'priority';
    transactionFee: string;
    analytics: boolean;
    customBranding: boolean;
    domainEmail: boolean;
  };
  highlighted?: boolean;
}

export interface SubscriptionStatus {
  planType: PlanType;
  isActive: boolean;
  isTrial: boolean;
  trialEndsAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;       // True if subscription is set to cancel
  canceledAt?: string;               // When cancellation was requested
  invoicesThisPeriod: number;
  customerCount: number;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export const PLANS: Record<PlanType, PlanFeatures> = {
  trial: {
    name: 'Free Trial',
    price: 0,
    billingPeriod: 'trial',
    features: {
      invoicesPerMonth: 'unlimited', // Trial gets unlimited like Premium
      maxCustomers: 'unlimited', // Trial gets unlimited like Premium
      paymentProcessing: true,
      automaticPDFReceipts: true,
      customerManagement: 'advanced', // Trial gets advanced features
      mobileAndWebAccess: true,
      support: 'priority', // Trial gets priority support
      transactionFee: '3.5% + $0.50',
      analytics: true, // Trial gets analytics
      customBranding: true, // Trial gets custom branding
      domainEmail: true, // Trial gets domain email
    },
  },
  basic: {
    name: 'Basic',
    price: 4.99,
    billingPeriod: 'monthly',
    features: {
      invoicesPerMonth: 50,
      maxCustomers: 100,
      paymentProcessing: true,
      automaticPDFReceipts: true,
      customerManagement: 'basic',
      mobileAndWebAccess: true,
      support: 'email',
      transactionFee: '3.5% + $0.50',
      analytics: false,
      customBranding: false,
      domainEmail: false,
    },
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    billingPeriod: 'monthly',
    features: {
      invoicesPerMonth: 'unlimited',
      maxCustomers: 'unlimited',
      paymentProcessing: true,
      automaticPDFReceipts: true,
      customerManagement: 'advanced',
      mobileAndWebAccess: true,
      support: 'priority',
      transactionFee: '3.5% + $0.50',
      analytics: true,
      customBranding: true,
      domainEmail: true,
    },
    highlighted: true,
  },
};

// Plan limits check utilities
export class PlanLimits {
  static canCreateInvoice(subscription: SubscriptionStatus): { allowed: boolean; reason?: string } {
    // Trial and Premium have unlimited invoices
    if (subscription.planType === 'trial' || subscription.planType === 'premium') {
      return { allowed: true };
    }

    // Basic plan: check monthly limit
    const limit = PLANS.basic.features.invoicesPerMonth as number;
    if (subscription.invoicesThisPeriod >= limit) {
      return {
        allowed: false,
        reason: `You've reached your monthly limit of ${limit} invoices. Upgrade to Premium for unlimited invoices.`,
      };
    }

    return { allowed: true };
  }

  static canAddCustomer(subscription: SubscriptionStatus): { allowed: boolean; reason?: string } {
    // Trial and Premium have unlimited customers
    if (subscription.planType === 'trial' || subscription.planType === 'premium') {
      return { allowed: true };
    }

    // Basic plan: check customer limit
    const limit = PLANS.basic.features.maxCustomers as number;
    if (subscription.customerCount >= limit) {
      return {
        allowed: false,
        reason: `You've reached your limit of ${limit} customers. Upgrade to Premium for unlimited customers.`,
      };
    }

    return { allowed: true };
  }

  static hasFeatureAccess(subscription: SubscriptionStatus, feature: keyof PlanFeatures['features']): boolean {
    const plan = PLANS[subscription.planType];
    return !!plan.features[feature];
  }

  static getRemainingInvoices(subscription: SubscriptionStatus): number | 'unlimited' {
    if (subscription.planType === 'trial' || subscription.planType === 'premium') {
      return 'unlimited';
    }

    const limit = PLANS.basic.features.invoicesPerMonth as number;
    return Math.max(0, limit - subscription.invoicesThisPeriod);
  }

  static getRemainingCustomers(subscription: SubscriptionStatus): number | 'unlimited' {
    if (subscription.planType === 'trial' || subscription.planType === 'premium') {
      return 'unlimited';
    }

    const limit = PLANS.basic.features.maxCustomers as number;
    return Math.max(0, limit - subscription.customerCount);
  }

  static getUsagePercentage(subscription: SubscriptionStatus, type: 'invoices' | 'customers'): number {
    if (subscription.planType === 'trial' || subscription.planType === 'premium') {
      return 0; // Unlimited plans don't show percentage
    }

    if (type === 'invoices') {
      const limit = PLANS.basic.features.invoicesPerMonth as number;
      return Math.min(100, (subscription.invoicesThisPeriod / limit) * 100);
    } else {
      const limit = PLANS.basic.features.maxCustomers as number;
      return Math.min(100, (subscription.customerCount / limit) * 100);
    }
  }

  static isTrialExpired(subscription: SubscriptionStatus): boolean {
    if (!subscription.isTrial || !subscription.trialEndsAt) {
      return false;
    }

    return new Date(subscription.trialEndsAt) < new Date();
  }

  static getDaysUntilTrialEnd(subscription: SubscriptionStatus): number {
    if (!subscription.isTrial || !subscription.trialEndsAt) {
      return 0;
    }

    const now = new Date();
    const trialEnd = new Date(subscription.trialEndsAt);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}

// Stripe Price IDs (these should match your Stripe dashboard)
export const STRIPE_PRICE_IDS = {
  basic_monthly: import.meta.env?.VITE_STRIPE_BASIC_PRICE_ID || 'price_basic_monthly',
  premium_monthly: import.meta.env?.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
};

// Helper to format plan display
export function formatPlanPrice(plan: PlanFeatures): string {
  if (plan.price === 0) {
    return 'Free for 14 days';
  }
  return `$${plan.price}/month`;
}

export function getPlanBadgeColor(planType: PlanType): string {
  switch (planType) {
    case 'trial':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'basic':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'premium':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}