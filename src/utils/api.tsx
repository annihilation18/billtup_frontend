import { getIdToken, signIn as cognitoSignIn, signOut as cognitoSignOut, getSession, getUserEmail, getUserId } from './auth/cognito';
import { API_CONFIG } from './config';

const BASE_URL = API_CONFIG.baseUrl;

// Get the current ID token for API auth
async function getAccessToken(): Promise<string> {
  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');
  return token;
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

      // Create user via our Lambda signup endpoint (unauthenticated)
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, businessName }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[Auth API] Sign up failed:', error);
        throw new Error(error.error || 'Sign up failed');
      }

      console.log('[Auth API] User created, signing in...');

      // Sign in with Cognito to get session
      const result = await cognitoSignIn(email, password);

      console.log('[Auth API] Sign up successful');
      return result;
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
      const result = await cognitoSignIn(email, password);
      console.log('[Auth API] Sign in successful');
      return result;
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
      await cognitoSignOut();
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
      const session = await getSession();
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
      const session = await getSession();
      if (!session) return null;
      const user = { id: session.user.id, email: session.user.email };
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
    return apiRequest('/invoices');
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
    return apiRequest('/customers');
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
