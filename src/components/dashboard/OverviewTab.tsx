import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Plus,
  Loader2
} from 'lucide-react@0.468.0';
import { fetchSalesStats, fetchInvoices, fetchBillingCycleUsage } from '../../utils/dashboard-api';

interface OverviewTabProps {
  userPlan: 'basic' | 'premium';
  onNavigateToTab?: (tab: 'customers' | 'invoices' | 'analytics') => void;
  onUpgrade?: () => void;
}

export function OverviewTab({ userPlan, onNavigateToTab, onUpgrade }: OverviewTabProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingUsage, setBillingUsage] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, invoicesData, usageData] = await Promise.all([
        fetchSalesStats(),
        fetchInvoices(),
        fetchBillingCycleUsage(),
      ]);
      
      setStats(statsData);
      
      // Get 4 most recent invoices
      const sorted = invoicesData
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);
      setRecentInvoices(sorted);

      setBillingUsage(usageData);
    } catch (error) {
      console.error('Error loading overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`,
      change: stats?.revenueChange || '0%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Invoices',
      value: stats?.totalInvoices?.toString() || '0',
      change: `+${stats?.newInvoicesThisMonth || 0} this month`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Customers',
      value: stats?.totalCustomers?.toString() || '0',
      change: `+${stats?.newCustomersThisMonth || 0} new`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Pending',
      value: `$${stats?.pendingAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`,
      change: `${stats?.pendingCount || 0} invoices`,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Track your business performance at a glance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl text-gray-900 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Recent Invoices
            </h3>
            <Button 
              onClick={() => onNavigateToTab?.('invoices')}
              variant="outline" 
              className="h-9 text-sm border-gray-300"
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      {invoice.number || invoice.id}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-700'
                        : invoice.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{invoice.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    ${invoice.total?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(invoice.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigateToTab?.('invoices')}
              className="p-4 bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5 hover:from-[#1E3A8A]/10 hover:to-[#14B8A6]/10 rounded-xl border border-[#14B8A6]/20 transition-colors text-left"
            >
              <FileText className="w-8 h-8 text-[#1E3A8A] mb-2" />
              <p className="text-sm text-gray-900">Create Invoice</p>
            </button>
            <button 
              onClick={() => onNavigateToTab?.('customers')}
              className="p-4 bg-gradient-to-br from-[#14B8A6]/5 to-[#F59E0B]/5 hover:from-[#14B8A6]/10 hover:to-[#F59E0B]/10 rounded-xl border border-[#14B8A6]/20 transition-colors text-left"
            >
              <Users className="w-8 h-8 text-[#14B8A6] mb-2" />
              <p className="text-sm text-gray-900">Add Customer</p>
            </button>
            {userPlan === 'premium' ? (
              <button 
                onClick={() => onNavigateToTab?.('analytics')}
                className="p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#1E3A8A]/5 hover:from-[#F59E0B]/10 hover:to-[#1E3A8A]/10 rounded-xl border border-[#F59E0B]/20 transition-colors text-left"
              >
                <TrendingUp className="w-8 h-8 text-[#F59E0B] mb-2" />
                <p className="text-sm text-gray-900">View Reports</p>
              </button>
            ) : (
              <button 
                onClick={onUpgrade}
                className="p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#1E3A8A]/5 hover:from-[#F59E0B]/10 hover:to-[#1E3A8A]/10 rounded-xl border border-[#F59E0B]/20 transition-colors text-left relative"
              >
                <TrendingUp className="w-8 h-8 text-[#F59E0B] mb-2 opacity-40" />
                <p className="text-sm text-gray-900 opacity-40">View Reports</p>
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white text-xs rounded">Premium</span>
              </button>
            )}
            <button 
              onClick={() => onNavigateToTab?.('invoices')}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors text-left"
            >
              <CheckCircle2 className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-sm text-gray-900">Mark Paid</p>
            </button>
          </div>
        </Card>
      </div>

      {/* Plan Info (if Basic) */}
      {userPlan === 'basic' && (
        <Card className="p-6 bg-gradient-to-br from-[#F59E0B]/10 to-[#1E3A8A]/10 border-[#F59E0B]/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Upgrade to Premium
              </h3>
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Unlock advanced features like analytics, refund management, and custom branding.
              </p>
              <p className="text-xs text-gray-500">
                You've used {billingUsage?.used || 0} of {billingUsage?.limit || 50} invoices this cycle
              </p>
            </div>
            <Button className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 text-white rounded-lg whitespace-nowrap" onClick={onUpgrade}>
              Upgrade Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}