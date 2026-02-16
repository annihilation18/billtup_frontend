import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Crown, TrendingUp, Users, DollarSign, Activity, Loader2 } from 'lucide-react@0.468.0';
import { useState, useEffect } from 'react';
import { fetchCustomers, fetchInvoices, fetchTopCustomers } from '../../utils/dashboard-api';

interface CustomerAnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  userPlan: 'basic' | 'premium';
}

export function CustomerAnalyticsModal({ open, onClose, userPlan }: CustomerAnalyticsModalProps) {
  const isPremium = userPlan === 'premium';
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    avgLifetimeValue: 0,
    paymentRate: 0,
    topCustomers: [] as Array<{ name: string; email: string; totalRevenue: number; totalInvoices: number }>,
  });

  useEffect(() => {
    if (open && isPremium) {
      loadAnalyticsData();
    }
  }, [open, isPremium]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [customers, invoices, topCustomers] = await Promise.all([
        fetchCustomers(),
        fetchInvoices(),
        fetchTopCustomers(5, 'year'), // Top 5 customers for the year
      ]);

      // Calculate total customers
      const totalCustomers = Array.isArray(customers) ? customers.length : 0;

      // Calculate payment rate
      const allInvoices = Array.isArray(invoices) ? invoices : [];
      const paidInvoices = allInvoices.filter((inv: any) => inv.status === 'paid');
      const paymentRate = allInvoices.length > 0 
        ? Math.round((paidInvoices.length / allInvoices.length) * 100) 
        : 0;

      // Calculate average lifetime value
      const totalRevenue = paidInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
      const avgLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

      setAnalytics({
        totalCustomers,
        avgLifetimeValue,
        paymentRate,
        topCustomers: Array.isArray(topCustomers) ? topCustomers : [],
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <span style={{ fontFamily: 'Poppins, sans-serif' }}>Customer Analytics</span>
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Premium Feature
            </h3>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Get insights into customer lifetime value, payment patterns, and more with Premium.
            </p>
            <Button className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 text-white">
              Upgrade to Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Customer Analytics</span>
          </DialogTitle>
          <DialogDescription>
            Insights into customer lifetime value and behavior
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#14B8A6]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : analytics.totalCustomers}
                  </p>
                  <p className="text-xs text-gray-600 whitespace-nowrap">Total Customers</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-[#1E3A8A]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `$${analytics.avgLifetimeValue.toFixed(2)}`}
                  </p>
                  <p className="text-xs text-gray-600 whitespace-nowrap">Avg. Lifetime Value</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${analytics.paymentRate}%`}
                  </p>
                  <p className="text-xs text-gray-600 whitespace-nowrap">Payment Rate</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Customers */}
          <Card className="p-6 border-gray-200">
            <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Top Customers by Revenue
            </h3>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : analytics.topCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No customer data available yet</p>
                  <p className="text-xs text-gray-500 mt-1">Add customers and invoices to see analytics</p>
                </div>
              ) : (
                analytics.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-600">{customer.totalInvoices} invoices</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      ${customer.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Coming Soon Features */}
          <Card className="p-6 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Coming Soon
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Customer segmentation by payment behavior</li>
              <li>• Predictive churn analysis</li>
              <li>• Automated follow-up recommendations</li>
              <li>• Customer satisfaction tracking</li>
            </ul>
          </Card>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}