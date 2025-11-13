import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from './supabase/client';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-dce439b6`;

// Get the current access token
async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[API] Error getting session for token:', error);
    return publicAnonKey;
  }
  
  if (!session || !session.access_token) {
    console.warn('[API] No session or access token available, using anon key');
    return publicAnonKey;
  }
  
  console.log('[API] Using user access token');
  return session.access_token;
}

// Make authenticated API request
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    console.log(`[API Request] Starting request to: ${endpoint}`, {
      method: options.method || 'GET',
      timestamp: new Date().toISOString()
    });
    
    const token = await getAccessToken();
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    console.log(`[API Response] ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      
      console.error(`[API Error] ${endpoint}:`, {
        status: response.status,
        error: error,
        endpoint: endpoint
      });
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API Success] ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API Request Failed] ${endpoint}:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

// ==================== AUTH API ====================

export const authApi = {
  async signUp(email: string, password: string, businessName: string) {
    try {
      console.log('[Auth API] Starting sign up...', { email, businessName });
      const supabase = createClient();
      
      // First create the user via our server endpoint (to ensure business name is stored)
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, businessName }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[Auth API] Sign up failed:', error);
        throw new Error(error.error || 'Sign up failed');
      }

      console.log('[Auth API] User created, signing in...');
      
      // Then sign in to get the session
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Auth API] Sign in after sign up failed:', error);
        throw error;
      }
      
      console.log('[Auth API] Sign in response received:', { 
        hasSession: !!data.session,
        hasUser: !!data.user
      });
      
      // Wait for session to be persisted to storage
      console.log('[Auth API] Waiting for session to persist to storage...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify session is stored - poll up to 5 times
      let sessionVerified = false;
      for (let i = 0; i < 5; i++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.access_token) {
          console.log('[Auth API] Session verified successfully on attempt', i + 1);
          sessionVerified = true;
          break;
        }
        console.log('[Auth API] Session not found, waiting... attempt', i + 1);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      if (!sessionVerified) {
        console.error('[Auth API] Warning: Session not persisted after sign up');
      }
      
      console.log('[Auth API] Sign up successful');
      return data;
    } catch (error) {
      console.error('[Auth API] Sign up error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('[Auth API] Starting sign in...', { email });
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Auth API] Sign in failed:', error);
        throw error;
      }
      
      console.log('[Auth API] Sign in response received:', { 
        hasSession: !!data.session,
        hasUser: !!data.user
      });
      
      // Wait for session to be persisted to storage
      console.log('[Auth API] Waiting for session to persist to storage...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify session is stored - poll up to 5 times
      let sessionVerified = false;
      for (let i = 0; i < 5; i++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.access_token) {
          console.log('[Auth API] Session verified successfully on attempt', i + 1);
          sessionVerified = true;
          break;
        }
        console.log('[Auth API] Session not found, waiting... attempt', i + 1);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      if (!sessionVerified) {
        console.error('[Auth API] Warning: Session not persisted after sign in');
      }
      
      console.log('[Auth API] Sign in successful');
      return data;
    } catch (error) {
      console.error('[Auth API] Sign in error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  async signOut() {
    try {
      console.log('[Auth API] Starting sign out...');
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[Auth API] Sign out failed:', error);
        throw error;
      }
      console.log('[Auth API] Sign out successful');
    } catch (error) {
      console.error('[Auth API] Sign out error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  async getSession() {
    try {
      console.log('[Auth API] Getting session...');
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('[Auth API] Get session failed:', error);
        throw error;
      }
      console.log('[Auth API] Session retrieved:', session ? 'exists' : 'null');
      return session;
    } catch (error) {
      console.error('[Auth API] Get session error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  async getUser() {
    try {
      console.log('[Auth API] Getting user...');
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('[Auth API] Get user failed:', error);
        throw error;
      }
      console.log('[Auth API] User retrieved:', user ? 'exists' : 'null');
      return user;
    } catch (error) {
      console.error('[Auth API] Get user error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
};

// ==================== BUSINESS API ====================

export const businessApi = {
  async save(businessData: any) {
    return apiRequest('/business', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  },

  async get() {
    return apiRequest('/business');
  },

  async update(businessData: any) {
    return apiRequest('/business', {
      method: 'PATCH',
      body: JSON.stringify(businessData),
    });
  },

  async uploadLogo(logoData: string, fileName: string) {
    return apiRequest('/business/logo', {
      method: 'POST',
      body: JSON.stringify({ logoData, fileName }),
    });
  },

  async deleteAccount() {
    return apiRequest('/account/delete', {
      method: 'POST',
    });
  }
};

// ==================== INVOICE API ====================

export const invoiceApi = {
  async create(invoiceData: any) {
    return apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  },

  async getAll() {
    // Fetch with high limit to get all data (backend enforces MAX_QUERY_LIMIT)
    const response = await apiRequest('/invoices?limit=1000');
    // Unwrap paginated response
    return response.data || response;
  },

  async getById(id: string) {
    return apiRequest(`/invoices/${id}`);
  },

  async update(id: string, updates: any) {
    return apiRequest(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async sendEmail(invoiceData: any, customerEmail: string, businessData: any) {
    return apiRequest('/invoices/send-email', {
      method: 'POST',
      body: JSON.stringify({ invoiceData, customerEmail, businessData }),
    });
  },

  async delete(id: string) {
    return apiRequest(`/invoices/${id}`, {
      method: 'DELETE',
    });
  },

  async updateSignature(id: string, signature: string | null) {
    // Use the regular update endpoint instead of a dedicated signature endpoint
    return apiRequest(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ signature }),
    });
  }
};

// ==================== CUSTOMER API ====================

export const customerApi = {
  async create(customerData: any) {
    return apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  async getAll() {
    // Fetch with high limit to get all data (backend enforces MAX_QUERY_LIMIT)
    const response = await apiRequest('/customers?limit=1000');
    // Unwrap paginated response
    return response.data || response;
  },

  async getById(id: string) {
    return apiRequest(`/customers/${id}`);
  },

  async update(id: string, updates: any) {
    return apiRequest(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return apiRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
};

// ==================== PAYMENT API ====================

export const paymentApi = {
  async createPaymentIntent(invoiceId: string, amount: number, customerEmail: string) {
    return apiRequest('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ 
        invoiceId, 
        amount: Math.round(amount * 100), // Convert to cents
        customerEmail 
      }),
    });
  },

  async updateInvoicePaymentStatus(invoiceId: string, paymentIntentId: string) {
    return apiRequest(`/invoices/${invoiceId}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        paymentIntentId,
        status: 'paid',
        paidDate: new Date().toISOString()
      }),
    });
  },

  async createIntent(amount: number, invoiceId: string, customerEmail: string) {
    return apiRequest('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, invoiceId, customerEmail }),
    });
  },

  async confirmPayment(paymentMethodId: string, paymentIntentId: string) {
    return apiRequest('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId, paymentIntentId }),
    });
  },

  async processNFC(amount: number, invoiceId: string) {
    return apiRequest('/payments/nfc', {
      method: 'POST',
      body: JSON.stringify({ amount, invoiceId }),
    });
  },

  async refundPayment(invoiceId: string, amount: number) {
    return apiRequest('/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, amount }),
    });
  }
};

// ==================== ANALYTICS API ====================

export const analyticsApi = {
  async getSalesSummary() {
    return apiRequest('/analytics/sales');
  },

  async getRevenueChart(period: 'week' | 'month' | 'quarter' | 'year', year?: number, month?: number) {
    const params = new URLSearchParams({ period });
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return apiRequest(`/analytics/revenue-chart?${params.toString()}`);
  },

  async getMonthlyInvoiceCount() {
    return apiRequest('/analytics/monthly-invoice-count');
  }
};

// ==================== USER DATA API (GDPR Compliance) ====================

export const userDataApi = {
  async exportData() {
    return apiRequest('/user/export');
  },

  async deleteAccount() {
    return apiRequest('/user/account', {
      method: 'DELETE',
    });
  }
};

// ==================== STRIPE CONNECT API ====================

export const stripeConnectApi = {
  async getOAuthUrl() {
    return apiRequest('/stripe/oauth-url');
  },

  async handleOAuthCallback(code: string, state: string) {
    return apiRequest('/stripe/oauth-callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    });
  },

  async getAccountStatus() {
    return apiRequest('/stripe/account-status');
  },

  async calculateFees(amount: number) {
    return apiRequest('/stripe/calculate-fees', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  async refreshOnboarding() {
    return apiRequest('/stripe/refresh-onboarding', {
      method: 'POST',
    });
  },

  async disconnect() {
    return apiRequest('/stripe/disconnect', {
      method: 'POST',
    });
  }
};

// ==================== SUBSCRIPTION API ====================

export const subscriptionApi = {
  async getStatus() {
    return apiRequest('/subscription/status');
  },

  async createSubscription(planType: string, paymentMethodId?: string) {
    return apiRequest('/subscription/create', {
      method: 'POST',
      body: JSON.stringify({ planType, paymentMethodId }),
    });
  },

  async updatePlan(planType: string) {
    return apiRequest('/subscription/update-plan', {
      method: 'POST',
      body: JSON.stringify({ planType }),
    });
  },

  async cancelSubscription() {
    return apiRequest('/subscription/cancel', {
      method: 'POST',
    });
  },

  async addPaymentMethod(paymentMethodId: string) {
    return apiRequest('/subscription/payment-method', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });
  }
};