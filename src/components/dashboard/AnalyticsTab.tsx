import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText,
  Calendar,
  Download,
  Crown,
  Loader2,
  TrendingDown,
  ChevronDown
} from 'lucide-react@0.468.0';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  fetchSalesStats, 
  fetchTopCustomers, 
  fetchRevenueTrend,
  fetchSubscription
} from '../../utils/dashboard-api';

interface AnalyticsTabProps {
  userPlan: 'basic' | 'premium';
}

interface SalesStats {
  totalRevenue: number;
  totalInvoices: number;
  totalCustomers: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  revenueChange: string;
  newInvoicesThisMonth: number;
  newCustomersThisMonth: number;
  avgInvoiceValue: number;
}

interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalRevenue: number;
  totalInvoices: number;
}

interface RevenueTrendData {
  month: string;
  revenue: number;
  count: number;
}

type TimePeriod = 'current_month' | 'billing_cycle' | 'quarter' | 'year';

const TIME_PERIOD_LABELS = {
  current_month: 'Current Month',
  billing_cycle: 'Billing Cycle to Date',
  quarter: 'Quarter to Date',
  year: 'Year to Date',
};

export function AnalyticsTab({ userPlan }: AnalyticsTabProps) {
  const isPremium = userPlan === 'premium';
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('current_month');
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendData[]>([]);
  const [billingCycleDates, setBillingCycleDates] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    if (isPremium) {
      loadAnalytics();
    }
  }, [isPremium, timePeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [statsData, customersData, trendData, subscription] = await Promise.all([
        fetchSalesStats(timePeriod),
        fetchTopCustomers(4, timePeriod),
        fetchRevenueTrend(12, timePeriod),
        fetchSubscription()
      ]);
      
      console.log('[Analytics] Loaded stats:', statsData);
      console.log('[Analytics] Loaded top customers:', customersData);
      console.log('[Analytics] Loaded revenue trend:', trendData);
      console.log('[Analytics] Loaded subscription:', subscription);
      
      setStats(statsData);
      setTopCustomers(customersData);
      setRevenueTrend(trendData);
      
      // Use billing cycle dates from subscription API (not calculated separately)
      if (timePeriod === 'billing_cycle' && subscription?.currentPeriodStart && subscription?.currentPeriodEnd) {
        const now = new Date();
        const periodStart = new Date(subscription.currentPeriodStart);
        const periodEnd = new Date(subscription.currentPeriodEnd);
        
        // Show from period start to today (or period end if we're past it)
        const effectiveEnd = now < periodEnd ? now : periodEnd;
        
        setBillingCycleDates({ start: periodStart, end: effectiveEnd });
        
        console.log('[Analytics] Billing cycle dates from subscription:', {
          start: periodStart.toISOString(),
          end: effectiveEnd.toISOString(),
          periodEnd: periodEnd.toISOString(),
        });
      } else {
        setBillingCycleDates(null);
      }
    } catch (error) {
      console.error('[Analytics] Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg p-8 text-center border-gray-200">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Premium Feature
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sales analytics and detailed reports are available on the Premium plan. Upgrade to unlock insights about your revenue, top customers, payment trends, and more.
          </p>
          <Button className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 text-white rounded-lg">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sales Analytics
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Track your business performance and insights
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {TIME_PERIOD_LABELS[timePeriod]}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {(Object.keys(TIME_PERIOD_LABELS) as TimePeriod[]).map((period) => (
                <DropdownMenuItem
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={timePeriod === period ? 'bg-gray-100' : ''}
                >
                  {TIME_PERIOD_LABELS[period]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="border-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            {loading ? null : (
              stats?.revenueChange && stats.revenueChange.includes('+') && stats.revenueChange !== '+0%' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : stats?.revenueChange && stats.revenueChange.includes('-') ? (
                <TrendingDown className="w-4 h-4 text-red-600" />
              ) : null
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl text-gray-900 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" />
            ) : (
              `$${stats?.totalRevenue.toLocaleString() || '0'}`
            )}
          </p>
          {!loading && (
            <p 
              className="text-xs" 
              style={{ 
                color: stats?.revenueChange?.includes('+') && stats.revenueChange !== '+0%' 
                  ? '#16a34a' 
                  : stats?.revenueChange?.includes('-') 
                    ? '#dc2626' 
                    : '#6b7280' 
              }}
            >
              {stats?.revenueChange === '0%' || stats?.revenueChange === '+0%' 
                ? 'No change from last month'
                : `${stats?.revenueChange || '0%'} from last month`
              }
            </p>
          )}
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Invoices Sent</p>
          <p className="text-3xl text-gray-900 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
            {stats?.totalInvoices || '0'}
          </p>
          <p className="text-xs text-blue-600">+{stats?.newInvoicesThisMonth || '0'} from last month</p>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Customers</p>
          <p className="text-3xl text-gray-900 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
            {stats?.totalCustomers || '0'}
          </p>
          <p className="text-xs text-purple-600">+{stats?.newCustomersThisMonth || '0'} new this month</p>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Invoice Value</p>
          <p className="text-3xl text-gray-900 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
            ${Math.round(stats?.avgInvoiceValue || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">Based on {stats?.paidCount || '0'} paid invoices</p>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6 border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Revenue Trend
          </h3>
          {billingCycleDates && (
            <p className="text-sm text-gray-600 mt-1">
              Billing Cycle: {billingCycleDates.start.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })} - {billingCycleDates.end.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          )}
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" />
          </div>
        ) : revenueTrend.length > 0 ? (
          <div className="h-64">
            <div className="h-full flex items-end justify-between gap-2">
              {(() => {
                const maxRevenue = Math.max(...revenueTrend.map(d => d.revenue), 1);
                return revenueTrend.map((data, index) => {
                  const heightPercentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative h-full">
                      <div className="flex-1 w-full flex flex-col justify-end">
                        <div
                          className="w-full bg-gradient-to-t from-[#1E3A8A] to-[#14B8A6] rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer"
                          style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                          title={`${data.month}: $${data.revenue.toLocaleString()} (${data.count} invoices)`}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {data.month}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No revenue data available yet</p>
          </div>
        )}
      </Card>

      {/* Top Customers */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Top Customers by Revenue
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" />
              </div>
            ) : topCustomers.length > 0 ? (
              topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] flex items-center justify-center text-white">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.totalInvoices} invoices</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    ${customer.totalRevenue.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No customer data available yet</p>
                <p className="text-xs mt-1">Create invoices to see top customers</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <h3 className="text-lg text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Payment Status Breakdown
          </h3>
          <div className="space-y-4">
            {[
              { status: 'Paid', count: stats?.paidCount || 0, percentage: stats?.paidCount ? Math.round((stats?.paidCount / stats?.totalInvoices) * 100) : 0, color: 'bg-green-500' },
              { status: 'Pending', count: stats?.pendingCount || 0, percentage: stats?.pendingCount ? Math.round((stats?.pendingCount / stats?.totalInvoices) * 100) : 0, color: 'bg-amber-500' },
              { status: 'Overdue', count: stats?.overdueCount || 0, percentage: stats?.overdueCount ? Math.round((stats?.overdueCount / stats?.totalInvoices) * 100) : 0, color: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.status}</span>
                  <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Invoices</span>
              <span className="text-lg text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {stats?.totalInvoices || '0'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}