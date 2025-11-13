import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Crown, 
  Sparkles, 
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Zap,
  PieChart
} from 'lucide-react';
import { usePremiumFeatures } from '../utils/usePremiumFeatures';
import { Customer } from './CustomersScreen';
import { Invoice } from './Dashboard';

interface CustomerAnalyticsSectionProps {
  customers: Customer[];
  invoices: Invoice[];
  onUpgrade?: () => void;
}

interface CustomerInsight {
  id: string;
  name: string;
  email: string;
  totalRevenue: number;
  invoiceCount: number;
  avgInvoiceValue: number;
  lastPurchaseDate: string;
  lifetimeValue: number;
  segment: 'VIP' | 'Regular' | 'New' | 'At Risk';
  growth: number;
}

export function CustomerAnalyticsSection({ customers, invoices, onUpgrade }: CustomerAnalyticsSectionProps) {
  const { hasCustomerAnalytics, subscription } = usePremiumFeatures();

  // Calculate customer insights
  const calculateCustomerInsights = (): CustomerInsight[] => {
    return customers.map(customer => {
      const customerInvoices = invoices.filter(inv => inv.customer === customer.name);
      const paidInvoices = customerInvoices.filter(inv => inv.status === 'paid');
      
      const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const invoiceCount = paidInvoices.length;
      const avgInvoiceValue = invoiceCount > 0 ? totalRevenue / invoiceCount : 0;
      
      // Find last purchase
      const sortedInvoices = paidInvoices.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const lastPurchaseDate = sortedInvoices[0]?.date || '';
      
      // Calculate lifetime value (total revenue + projected future value)
      const lifetimeValue = totalRevenue * 1.3; // Simple projection: 30% growth potential
      
      // Determine segment
      let segment: 'VIP' | 'Regular' | 'New' | 'At Risk' = 'New';
      const daysSinceLastPurchase = lastPurchaseDate 
        ? Math.floor((new Date().getTime() - new Date(lastPurchaseDate).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      if (totalRevenue > 5000 && invoiceCount > 10) {
        segment = 'VIP';
      } else if (daysSinceLastPurchase > 90 && invoiceCount > 0) {
        segment = 'At Risk';
      } else if (invoiceCount > 3) {
        segment = 'Regular';
      } else {
        segment = 'New';
      }
      
      // Calculate growth (comparing last 3 invoices to previous 3)
      const recentRevenue = paidInvoices.slice(0, 3).reduce((sum, inv) => sum + (inv.total || 0), 0);
      const previousRevenue = paidInvoices.slice(3, 6).reduce((sum, inv) => sum + (inv.total || 0), 0);
      const growth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        totalRevenue,
        invoiceCount,
        avgInvoiceValue,
        lastPurchaseDate,
        lifetimeValue,
        segment,
        growth
      };
    }).sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  };

  const insights = hasCustomerAnalytics ? calculateCustomerInsights() : [];
  
  // Segment statistics
  const segmentCounts = {
    VIP: insights.filter(c => c.segment === 'VIP').length,
    Regular: insights.filter(c => c.segment === 'Regular').length,
    New: insights.filter(c => c.segment === 'New').length,
    'At Risk': insights.filter(c => c.segment === 'At Risk').length,
  };

  const totalLifetimeValue = insights.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const avgLifetimeValue = insights.length > 0 ? totalLifetimeValue / insights.length : 0;

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'Regular':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'New':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'At Risk':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return <Crown className="w-4 h-4" />;
      case 'Regular':
        return <Users className="w-4 h-4" />;
      case 'New':
        return <Sparkles className="w-4 h-4" />;
      case 'At Risk':
        return <Target className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  // Premium feature gate
  if (!hasCustomerAnalytics) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <h3>Customer Analytics</h3>
              <p className="text-sm text-muted-foreground">Powerful insights to grow your business</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>

        <Alert className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-sm">
            <strong className="text-purple-900">Unlock Customer Analytics</strong>
            <p className="text-purple-800 mt-2 mb-4">
              Gain powerful customer insights with lifetime value tracking, segmentation, and detailed analytics to grow your business.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Lifetime value tracking</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Customer segmentation (VIP, Regular, New, At Risk)</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Revenue & growth analytics per customer</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Detailed customer insights dashboard</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={onUpgrade}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Customer Analytics Dashboard for Premium/Trial users
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <h3>Customer Analytics</h3>
              <p className="text-sm text-muted-foreground">Powerful insights to grow your business</p>
            </div>
          </div>
          {subscription?.isTrial && (
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Trial Feature
            </Badge>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-700">Total LTV</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl text-purple-900">${totalLifetimeValue.toFixed(0)}</p>
            <p className="text-xs text-purple-600 mt-1">Lifetime Value</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">Avg LTV</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl text-blue-900">${avgLifetimeValue.toFixed(0)}</p>
            <p className="text-xs text-blue-600 mt-1">Per Customer</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700">VIP Customers</span>
              <Crown className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl text-green-900">{segmentCounts.VIP}</p>
            <p className="text-xs text-green-600 mt-1">High Value</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-700">At Risk</span>
              <Target className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl text-amber-900">{segmentCounts['At Risk']}</p>
            <p className="text-xs text-amber-600 mt-1">Needs Attention</p>
          </Card>
        </div>

        {/* Segmentation Overview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-5 h-5 text-muted-foreground" />
            <h4>Customer Segmentation</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(segmentCounts).map(([segment, count]) => (
              <Card key={segment} className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getSegmentIcon(segment)}
                  <span className="text-sm">{segment}</span>
                </div>
                <p className="text-2xl mb-1">{count}</p>
                <p className="text-xs text-muted-foreground">
                  {customers.length > 0 ? Math.round((count / customers.length) * 100) : 0}% of total
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Customer Insights List */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-600" />
          <h4>Customer Insights</h4>
        </div>

        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No customer data available yet</p>
            <p className="text-sm mt-1">Add customers and create invoices to see insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 10).map((insight) => (
              <Card key={insight.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="truncate">{insight.name}</h4>
                      <Badge className={getSegmentColor(insight.segment)}>
                        {getSegmentIcon(insight.segment)}
                        <span className="ml-1">{insight.segment}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-3">{insight.email}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                        <p className="font-medium text-purple-700">${insight.lifetimeValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                        <p className="font-medium">${insight.totalRevenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Invoice</p>
                        <p className="font-medium">${insight.avgInvoiceValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Invoices</p>
                        <p className="font-medium">{insight.invoiceCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Growth Indicator */}
                  {insight.growth !== 0 && (
                    <div className={`flex items-center gap-1 ${insight.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {insight.growth > 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{Math.abs(insight.growth).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
            
            {insights.length > 10 && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Showing top 10 of {insights.length} customers
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
