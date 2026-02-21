import { getIdToken } from './auth/cognito';
import { API_CONFIG } from './config';
import { captureError } from './errorReporter';

type TimePeriod = 'current_month' | 'billing_cycle' | 'quarter' | 'year';

// Helper function to get date range for a time period
function getDateRangeForPeriod(period: TimePeriod): { startDate: Date; endDate: Date } {
  const now = new Date();
  const endDate = now;
  let startDate: Date;

  switch (period) {
    case 'current_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'billing_cycle':
      // Billing cycle starts on the 1st of each month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      // Calculate quarter: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate };
}

// Helper function to get previous period date range for comparison
function getPreviousPeriodRange(period: TimePeriod): { startDate: Date; endDate: Date } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'current_month':
    case 'billing_cycle':
      // Previous month
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      break;
    case 'quarter':
      // Previous quarter
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const prevQuarter = currentQuarter - 1;
      const prevQuarterYear = prevQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const prevQuarterMonth = prevQuarter < 0 ? 9 : prevQuarter * 3;
      startDate = new Date(prevQuarterYear, prevQuarterMonth, 1);
      endDate = new Date(prevQuarterYear, prevQuarterMonth + 3, 0, 23, 59, 59);
      break;
    case 'year':
      // Previous year
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  }

  return { startDate, endDate };
}

// Helper function to make authenticated API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = await getIdToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Only log errors for endpoints we expect to exist
    if (response.status !== 404) {
      console.error(`API Error [${endpoint}]:`, errorText);
    }
    const err = new Error(`API call failed: ${response.status} ${response.statusText}`);
    if (response.status >= 500) {
      captureError(err, { endpoint, statusCode: response.status });
    }
    throw err;
  }

  return response.json();
}

// Customer APIs
export async function fetchCustomers() {
  try {
    return await apiCall('/customers');
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function fetchCustomer(customerId: string) {
  try {
    return await apiCall(`/customers/${customerId}`);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function createCustomer(customerData: any) {
  try {
    return await apiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export async function updateCustomer(customerId: string, customerData: any) {
  try {
    return await apiCall(`/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(customerData),
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    return await apiCall(`/customers/${customerId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}

// Fix invoice references (migration) - endpoint doesn't exist yet
export async function fixInvoiceCustomerReferences() {
  try {
    return await apiCall('/customers/fix-invoice-references', {
      method: 'POST',
    });
  } catch (error) {
    // Silently fail - endpoint doesn't exist yet
    return null;
  }
}

// Invoice APIs
export async function fetchInvoices() {
  try {
    return await apiCall('/invoices');
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function fetchInvoice(invoiceId: string) {
  try {
    return await apiCall(`/invoices/${invoiceId}`);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export async function createInvoice(invoiceData: any) {
  try {
    return await apiCall('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

export async function updateInvoice(invoiceId: string, invoiceData: any) {
  try {
    return await apiCall(`/invoices/${invoiceId}`, {
      method: 'PATCH',
      body: JSON.stringify(invoiceData),
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    return await apiCall(`/invoices/${invoiceId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}

// Business Profile APIs
export async function fetchBusinessProfile() {
  try {
    return await apiCall('/business');
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return null;
  }
}

export async function updateBusinessProfile(businessData: any) {
  try {
    return await apiCall('/business', {
      method: 'PUT',
      body: JSON.stringify(businessData),
    });
  } catch (error) {
    console.error('Error updating business profile:', error);
    throw error;
  }
}

// User Profile APIs
export async function fetchUserProfile() {
  try {
    return await apiCall('/user/profile');
  } catch (error) {
    // Silently return null - endpoint doesn't exist yet
    return null;
  }
}

export async function updateUserProfile(userData: any) {
  try {
    return await apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Analytics APIs
export async function fetchSalesStats(period: TimePeriod = 'current_month') {
  try {
    const invoicesData = await fetchInvoices();
    const customersData = await fetchCustomers();

    // Ensure we have arrays
    const invoices = Array.isArray(invoicesData) ? invoicesData : [];
    const customers = Array.isArray(customersData) ? customersData : [];

    // Get date ranges for the selected period
    const { startDate, endDate } = getDateRangeForPeriod(period);

    // Helper function to get the invoice date (try multiple fields for compatibility)
    const getInvoiceDate = (inv: any): Date => {
      // Try date (invoice date field), then createdAt (system timestamp)
      const dateStr = inv.date || inv.createdAt;
      return dateStr ? new Date(dateStr) : new Date();
    };

    // Filter invoices by period
    const periodInvoices = invoices.filter((inv: any) => {
      const invDate = getInvoiceDate(inv);
      return invDate >= startDate && invDate <= endDate;
    });

    console.log(`[Analytics] Period: ${period}, Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Calculate stats for current period
    const paidInvoices = periodInvoices.filter((inv: any) => inv.status === 'paid');
    const pendingInvoices = periodInvoices.filter((inv: any) => inv.status === 'pending');
    const overdueInvoices = periodInvoices.filter((inv: any) => inv.status === 'overdue');

    const totalRevenue = paidInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0);
    const pendingAmount = pendingInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0);

    // Get comparison period label
    const comparisonLabel = period === 'year' ? 'last year' :
                            period === 'quarter' ? 'last quarter' :
                            'last month';

    // Count new customers in this period
    const newCustomersThisPeriod = customers.filter((cust: any) => {
      const custDate = new Date(cust.createdAt);
      return custDate >= startDate && custDate <= endDate;
    }).length;

    return {
      totalRevenue,
      totalInvoices: periodInvoices.length,
      totalCustomers: customers.length,
      pendingAmount,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      newInvoicesThisMonth: periodInvoices.length,
      newCustomersThisMonth: newCustomersThisPeriod,
      avgInvoiceValue: paidInvoices.length > 0
        ? totalRevenue / paidInvoices.length
        : 0,
      comparisonLabel,
    };
  } catch (error) {
    console.error('Error calculating sales stats:', error);
    return {
      totalRevenue: 0,
      totalInvoices: 0,
      totalCustomers: 0,
      pendingAmount: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0,
      newInvoicesThisMonth: 0,
      newCustomersThisMonth: 0,
      avgInvoiceValue: 0,
      comparisonLabel: 'last month',
    };
  }
}

// Get top customers by revenue
export async function fetchTopCustomers(limit: number = 10, period: TimePeriod = 'current_month') {
  try {
    const customersData = await fetchCustomers();
    const invoicesData = await fetchInvoices();

    // Ensure we have arrays
    const customers = Array.isArray(customersData) ? customersData : [];
    const invoices = Array.isArray(invoicesData) ? invoicesData : [];

    // Get date ranges for the selected period
    const { startDate, endDate } = getDateRangeForPeriod(period);

    // Helper function to get the invoice date (try multiple fields for compatibility)
    const getInvoiceDate = (inv: any): Date => {
      const dateStr = inv.issueDate || inv.date || inv.createdAt;
      return dateStr ? new Date(dateStr) : new Date();
    };

    // Filter invoices by period
    const periodInvoices = invoices.filter((inv: any) => {
      const invDate = getInvoiceDate(inv);
      return invDate >= startDate && invDate <= endDate;
    });

    // Calculate revenue per customer
    const customerRevenue = customers.map((customer: any) => {
      const customerInvoices = periodInvoices.filter(
        (inv: any) => inv.customerId === customer.id && inv.status === 'paid'
      );
      const totalRevenue = customerInvoices.reduce(
        (sum: number, inv: any) => sum + inv.total,
        0
      );
      return {
        ...customer,
        totalRevenue,
        totalInvoices: customerInvoices.length,
      };
    });

    // Sort by revenue and return top N
    return customerRevenue
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    return [];
  }
}

// Get revenue trend data
export async function fetchRevenueTrend(months: number = 12, period: TimePeriod = 'current_month') {
  try {
    const invoicesData = await fetchInvoices();

    // Ensure we have an array
    const invoices = Array.isArray(invoicesData) ? invoicesData : [];
    const now = new Date();

    const trendData = [];

    // Helper function to get the invoice date (try multiple fields for compatibility)
    const getInvoiceDate = (inv: any): Date => {
      // Try date (invoice date field), then createdAt (system timestamp)
      const dateStr = inv.date || inv.createdAt;
      return dateStr ? new Date(dateStr) : new Date();
    };

    // For current month, show daily data from 1st to today
    if (period === 'current_month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = now.getDate(); // Only show up to current day

      for (let i = 0; i < daysInMonth; i++) {
        const dayDate = new Date(monthStart);
        dayDate.setDate(monthStart.getDate() + i);

        const nextDayDate = new Date(dayDate);
        nextDayDate.setDate(dayDate.getDate() + 1);

        const dayInvoices = invoices.filter((inv: any) => {
          const invDate = getInvoiceDate(inv);
          return invDate >= dayDate && invDate < nextDayDate && inv.status === 'paid';
        });

        const dayRevenue = dayInvoices.reduce(
          (sum: number, inv: any) => sum + inv.total,
          0
        );

        trendData.push({
          month: `${dayDate.getDate()}`, // Just show day number
          revenue: dayRevenue,
          count: dayInvoices.length,
        });
      }

      return trendData;
    }

    // For billing cycle, show daily data based on actual billing cycle dates
    if (period === 'billing_cycle') {
      // Get subscription status to find the actual billing cycle dates
      const subscription = await fetchSubscription();

      if (!subscription || !subscription.currentPeriodStart) {
        console.log('[Revenue Trend] No subscription data available');
        return trendData;
      }

      const billingCycleStart = new Date(subscription.currentPeriodStart);
      const billingCycleEnd = new Date(subscription.currentPeriodEnd);

      console.log('[Revenue Trend] Billing cycle from subscription:', {
        start: billingCycleStart.toISOString(),
        end: billingCycleEnd.toISOString(),
        isTrial: subscription.isTrial || false,
      });

      // Only show days from billing cycle start to current day (not including future days)
      const endOfDataRange = now < billingCycleEnd ? now : billingCycleEnd;
      const millisInCycle = endOfDataRange.getTime() - billingCycleStart.getTime();
      const daysInCycle = Math.floor(millisInCycle / (1000 * 60 * 60 * 24)) + 1;

      // Track if we cross month boundary for better labeling
      let previousMonth = billingCycleStart.getMonth();

      for (let i = 0; i < daysInCycle; i++) {
        const dayDate = new Date(billingCycleStart);
        dayDate.setDate(billingCycleStart.getDate() + i);

        // Stop if we've gone past today
        if (dayDate > now) {
          break;
        }

        const nextDayDate = new Date(dayDate);
        nextDayDate.setDate(dayDate.getDate() + 1);

        const dayInvoices = invoices.filter((inv: any) => {
          const invDate = getInvoiceDate(inv);
          return invDate >= dayDate && invDate < nextDayDate && inv.status === 'paid';
        });

        const dayRevenue = dayInvoices.reduce(
          (sum: number, inv: any) => sum + inv.total,
          0
        );

        // Show actual calendar date (day of month)
        const dayOfMonth = dayDate.getDate();
        const currentMonth = dayDate.getMonth();

        // If we cross a month boundary, include month abbreviation
        let label = `${dayOfMonth}`;
        if (currentMonth !== previousMonth) {
          label = `${dayDate.toLocaleString('default', { month: 'short' })} ${dayOfMonth}`;
          previousMonth = currentMonth;
        }

        trendData.push({
          month: label,
          revenue: dayRevenue,
          count: dayInvoices.length,
        });
      }

      return trendData;
    }

    // For other periods, show monthly data
    let iterations = months;

    if (period === 'year') {
      // For year view, show all 12 months
      iterations = 12;
    } else if (period === 'quarter') {
      // For quarter view, show 3 months
      iterations = 3;
    }

    for (let i = iterations - 1; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthInvoices = invoices.filter((inv: any) => {
        const invDate = getInvoiceDate(inv);
        return invDate >= monthDate && invDate < nextMonthDate && inv.status === 'paid';
      });

      const monthRevenue = monthInvoices.reduce(
        (sum: number, inv: any) => sum + inv.total,
        0
      );

      trendData.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        revenue: monthRevenue,
        count: monthInvoices.length,
      });
    }

    return trendData;
  } catch (error) {
    console.error('Error fetching revenue trend:', error);
    return [];
  }
}

// Payment APIs (optional - if Stripe is connected)
export async function fetchPayments() {
  try {
    return await apiCall('/payments');
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
}

// Refund API
export async function processRefund(invoiceId: string, amount: number, reason: string) {
  try {
    return await apiCall('/refunds', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, amount, reason }),
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}

// Subscription API
export async function fetchSubscription() {
  try {
    return await apiCall('/subscription/status');
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

// Cancel subscription
export async function cancelSubscription() {
  try {
    return await apiCall('/subscription/cancel', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Trial Status API
export async function fetchTrialStatus(): Promise<{
  isInTrial: boolean;
  trialEndsAt: string | null;
  daysRemaining: number;
}> {
  try {
    // Use the subscription status endpoint for accurate data
    const subscription = await fetchSubscription();
    if (subscription) {
      return {
        isInTrial: subscription.isTrial || false,
        trialEndsAt: subscription.trialEndsAt || null,
        daysRemaining: subscription.trialEndsAt
          ? Math.max(0, Math.ceil((new Date(subscription.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
          : 0,
      };
    }

    // Fallback to business profile if subscription endpoint fails
    const business = await fetchBusinessProfile();
    if (!business?.trialEndsAt) {
      return { isInTrial: false, trialEndsAt: null, daysRemaining: 0 };
    }

    const trialEndDate = new Date(business.trialEndsAt);
    const now = new Date();
    // Check both the isTrial flag and the date
    const isInTrial = (business.isTrial === true || business.planType === 'trial') && now < trialEndDate;
    const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      isInTrial,
      trialEndsAt: business.trialEndsAt,
      daysRemaining,
    };
  } catch (error) {
    console.error('Error fetching trial status:', error);
    return { isInTrial: false, trialEndsAt: null, daysRemaining: 0 };
  }
}

// Billing Cycle Usage API
export async function fetchBillingCycleUsage(): Promise<{ used: number; limit: number }> {
  try {
    const result = await apiCall('/billing/usage');
    return result;
  } catch (error) {
    // Silently return default limits - endpoint doesn't exist yet
    return { used: 0, limit: 50 };
  }
}

// Payment Provider Status APIs
export async function fetchStripeStatus(): Promise<{ connected: boolean; chargesEnabled: boolean }> {
  try {
    const result = await apiCall('/stripe/account-status');
    return result;
  } catch (error) {
    return { connected: false, chargesEnabled: false };
  }
}

export async function fetchSquareStatus(): Promise<{
  connected: boolean;
  active: boolean;
  applicationId?: string;
  locationId?: string;
}> {
  try {
    const result = await apiCall('/square/account-status');
    return result;
  } catch (error) {
    return { connected: false, active: false };
  }
}

export async function fetchActiveProvider(): Promise<{ provider: string }> {
  try {
    const result = await apiCall('/payment-provider/active');
    return result;
  } catch (error) {
    return { provider: 'stripe' };
  }
}

export async function setActiveProvider(provider: string): Promise<{ success: boolean; provider: string }> {
  try {
    const result = await apiCall('/payment-provider/set', {
      method: 'POST',
      body: JSON.stringify({ provider }),
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// Payment Processing APIs
export async function createPaymentIntent(amount: number, invoiceId?: string, customerEmail?: string, invoiceAmount?: number): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> {
  return apiCall('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({ amount, invoiceId, customerEmail, invoiceAmount }),
  });
}

export async function updatePaymentIntent(paymentIntentId: string, amount: number, invoiceAmount?: number): Promise<{
  success: boolean;
  paymentIntentId: string;
}> {
  return apiCall('/payments/update-intent', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId, amount, invoiceAmount }),
  });
}

export async function createSquarePayment(
  amount: number,
  sourceId: string,
  invoiceId?: string,
  customerEmail?: string,
): Promise<{
  success: boolean;
  paymentId: string;
  status: string;
  receiptUrl?: string;
}> {
  return apiCall('/square/create-payment', {
    method: 'POST',
    body: JSON.stringify({ amount, sourceId, invoiceId, customerEmail }),
  });
}
