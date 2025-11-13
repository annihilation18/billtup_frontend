import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { TrendingUp, DollarSign, FileText, Users, Calendar, ArrowUp, ArrowDown, Crown, Sparkles, Settings, BarChart } from 'lucide-react';
import { analyticsApi } from '../utils/api';
import { usePremiumFeatures } from '../utils/usePremiumFeatures';
import { BarChart as RechartsBarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesSummary {
  monthToDate: {
    totalRevenue: number;
    invoiceCount: number;
    averageInvoiceValue: number;
  };
  yearToDate: {
    totalRevenue: number;
    invoiceCount: number;
    averageInvoiceValue: number;
  };
}

interface RevenueData {
  name: string;
  revenue: number;
  invoices: number;
}

interface AnalyticsScreenProps {
  onUpgrade?: () => void;
  currentTab: string;
  onTabChange: (tab: string) => void;
  businessLogo?: string;
  businessName?: string;
}

export function AnalyticsScreen({ onUpgrade, currentTab, onTabChange, businessLogo, businessName }: AnalyticsScreenProps) {
  const { hasAnalytics, subscription } = usePremiumFeatures();
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    if (hasAnalytics) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [hasAnalytics, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [summary, chart] = await Promise.all([
        analyticsApi.getSalesSummary(),
        analyticsApi.getRevenueChart(period),
      ]);

      setSalesSummary(summary.analytics);
      setRevenueData(chart.data || generateMockData(period));
    } catch (error) {
      // Use mock data for development
      setSalesSummary({
        monthToDate: {
          totalRevenue: 4250.50,
          invoiceCount: 23,
          averageInvoiceValue: 184.80,
        },
        yearToDate: {
          totalRevenue: 28450.75,
          invoiceCount: 145,
          averageInvoiceValue: 196.21,
        },
      });
      setRevenueData(generateMockData(period));
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (period: string): RevenueData[] => {
    switch (period) {
      case 'week':
        return [
          { name: 'Mon', revenue: 450, invoices: 3 },
          { name: 'Tue', revenue: 620, invoices: 4 },
          { name: 'Wed', revenue: 380, invoices: 2 },
          { name: 'Thu', revenue: 890, invoices: 5 },
          { name: 'Fri', revenue: 750, invoices: 4 },
          { name: 'Sat', revenue: 320, invoices: 2 },
          { name: 'Sun', revenue: 180, invoices: 1 },
        ];
      case 'month':
        return [
          { name: 'Week 1', revenue: 2100, invoices: 12 },
          { name: 'Week 2', revenue: 2850, invoices: 15 },
          { name: 'Week 3', revenue: 1950, invoices: 11 },
          { name: 'Week 4', revenue: 3200, invoices: 18 },
        ];
      case 'quarter':
        return [
          { name: 'Month 1', revenue: 8500, invoices: 45 },
          { name: 'Month 2', revenue: 9200, invoices: 52 },
          { name: 'Month 3', revenue: 10750, invoices: 58 },
        ];
      case 'year':
        return [
          { name: 'Jan', revenue: 5200, invoices: 28 },
          { name: 'Feb', revenue: 4800, invoices: 25 },
          { name: 'Mar', revenue: 6500, invoices: 35 },
          { name: 'Apr', revenue: 7200, invoices: 38 },
          { name: 'May', revenue: 8100, invoices: 42 },
          { name: 'Jun', revenue: 7800, invoices: 41 },
          { name: 'Jul', revenue: 8900, invoices: 47 },
          { name: 'Aug', revenue: 9200, invoices: 49 },
          { name: 'Sep', revenue: 8600, invoices: 45 },
          { name: 'Oct', revenue: 9500, invoices: 51 },
          { name: 'Nov', revenue: 8800, invoices: 46 },
          { name: 'Dec', revenue: 10200, invoices: 53 },
        ];
      default:
        return [];
    }
  };

  // Premium feature gate
  if (!hasAnalytics) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
            <TrendingUp className="w-10 h-10 text-purple-600" />
          </div>
          
          <h2 className="mb-3">Sales Analytics & Reports</h2>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get insights into your business performance with detailed sales analytics, revenue charts, and custom reports.
          </p>

          <div className="mb-8">
            <Card className="p-6 max-w-md mx-auto border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Premium Feature</div>
                  <div className="text-sm text-muted-foreground">Available on Premium & Trial plans</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-left mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>Revenue tracking & trends</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>Invoice volume analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>Customer insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                  <span>Customizable date ranges</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={onUpgrade}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>

              <p className="text-xs text-muted-foreground mt-3">
                Only $9.99/month • 14-day free trial
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Analytics content for Premium/Trial users
  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            {businessLogo && (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground">
                <img src={businessLogo} alt={businessName || "Logo"} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-2xl">Analytics</h1>
          </div>
        </div>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Safe defaults with proper null coalescing
  const mtdRevenue = salesSummary?.monthToDate?.totalRevenue ?? 0;
  const mtdInvoiceCount = salesSummary?.monthToDate?.invoiceCount ?? 0;
  const mtdAvgInvoice = salesSummary?.monthToDate?.averageInvoiceValue ?? 0;
  const ytdRevenue = salesSummary?.yearToDate?.totalRevenue ?? 0;
  const ytdInvoiceCount = salesSummary?.yearToDate?.invoiceCount ?? 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {businessLogo && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground">
              <img src={businessLogo} alt={businessName || "Logo"} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl">Analytics</h1>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header with Trial Badge */}
        <div className="flex items-center justify-between">
          <div>
            <h2>Sales Analytics</h2>
            <p className="text-sm text-muted-foreground">Track your business performance</p>
          </div>
          {subscription?.isTrial && (
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Trial Feature
            </Badge>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* MTD Revenue */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">MTD Revenue</span>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold mb-1">
              ${mtdRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>12% vs last month</span>
            </div>
          </Card>

          {/* MTD Invoices */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">MTD Invoices</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {mtdInvoiceCount}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>8% vs last month</span>
            </div>
          </Card>

          {/* Average Invoice */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Invoice</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold mb-1">
              ${mtdAvgInvoice.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>3% vs last month</span>
            </div>
          </Card>

          {/* YTD Revenue */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">YTD Revenue</span>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold mb-1">
              ${ytdRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">
              {ytdInvoiceCount} invoices
            </div>
          </Card>
        </div>

        {/* Period Selector */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3>Revenue Trends</h3>
            <div className="flex gap-2">
              {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" radius={[8, 8, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Card>

        {/* Invoice Volume Chart */}
        <Card className="p-4">
          <h3 className="mb-4">Invoice Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="invoices" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Invoices"
                dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-around p-2">
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "invoices" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("invoices")}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Invoices</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "customers" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("customers")}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Customers</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "analytics" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("analytics")}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Analytics</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "settings" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("settings")}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
        <div className="text-center pb-1">
          <p className="text-[10px] text-muted-foreground">BilltUp v1.0</p>
        </div>
      </div>
    </div>
  );
}
