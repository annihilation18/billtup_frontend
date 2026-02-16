/**
 * Central Configuration File
 * Manages all environment variables and configuration constants
 */

import { API_BASE_URL } from './auth/config';

// API Configuration
export const API_CONFIG = {
  baseUrl: `${API_BASE_URL}/billtup-api`,
  timeout: 30000, // 30 seconds
  retryAttempts: 3
} as const;

// Stripe Configuration
// Note: Stripe publishable key is safe to expose in frontend
export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_51QUnWrAEhJsFVtrcPnA4DPd5xGQEY5IqeJ1LdGHEHYU9pKQIHtXqSxLlxAuNpTFDpEvIjqMn3wQDaWqTOcEF0vZg00cMgE0Uxx'
} as const;

// App Configuration
export const APP_CONFIG = {
  name: 'BilltUp',
  description: 'Modern Invoicing for Service Businesses',
  supportEmail: 'support@billtup.com',
  version: '1.0.0'
} as const;

// Pricing Configuration
export const PRICING_CONFIG = {
  basic: {
    monthly: 4.99,
    annual: 49.99,
    invoiceLimit: 25
  },
  premium: {
    monthly: 9.99,
    annual: 99.99,
    invoiceLimit: Infinity
  },
  taxRate: 0.085, // 8.5%
  trialDays: 14
} as const;

// Feature Flags
export const FEATURES = {
  enableAnalytics: true,
  enableEmailNotifications: true,
  enablePdfGeneration: true,
  enableStripePayments: true,
  enableRefunds: true
} as const;

// Validation Rules
export const VALIDATION = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false
  },
  email: {
    maxLength: 255,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  invoice: {
    numberMaxLength: 50,
    notesMaxLength: 1000,
    lineItemsMax: 100
  },
  customer: {
    nameMaxLength: 255,
    emailMaxLength: 255,
    phoneMaxLength: 20,
    addressMaxLength: 500
  }
} as const;

// Storage Bucket Names
export const STORAGE_BUCKETS = {
  logos: 'make-dce439b6-logos',
  invoices: 'make-dce439b6-invoices'
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  userProfileTTL: 15 * 60 * 1000, // 15 minutes
  businessProfileTTL: 15 * 60 * 1000, // 15 minutes
  invoicesTTL: 2 * 60 * 1000, // 2 minutes
  customersTTL: 5 * 60 * 1000 // 5 minutes
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  encryption: {
    algorithm: 'AES-256-GCM',
    iterations: 100000,
    saltLength: 16,
    ivLength: 12
  },
  session: {
    timeout: 60 * 60 * 1000, // 1 hour
    renewalThreshold: 15 * 60 * 1000 // Renew if < 15 min remaining
  }
} as const;

// Rate Limiting Configuration (for future implementation)
export const RATE_LIMITS = {
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5
  },
  api: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30
  }
} as const;

// Environment Detection
export const isDevelopment = () => {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

export const isProduction = () => !isDevelopment();
