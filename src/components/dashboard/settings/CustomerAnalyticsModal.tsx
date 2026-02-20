import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Crown, TrendingUp, Users, DollarSign, BarChart } from 'lucide-react@0.468.0';

interface CustomerAnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  userPlan: 'basic' | 'premium';
}

export function CustomerAnalyticsModal({ open, onClose, userPlan }: CustomerAnalyticsModalProps) {
  const navigate = useNavigate();
  const isPremium = userPlan === 'premium';

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  if (!isPremium) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Customer Analytics
            </DialogTitle>
          </DialogHeader>

          <div className="py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Premium Feature
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Unlock powerful customer insights, lifetime value tracking, and advanced analytics with Premium.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
              <div className="bg-blue-50 rounded-lg p-4">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-900">Customer Segmentation</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-900">Lifetime Value</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <BarChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-900">Revenue Analytics</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-900">Growth Insights</p>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 text-white px-8"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Customer Analytics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>127</p>
              <p className="text-xs text-gray-600">Total Customers</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <DollarSign className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>$24.5K</p>
              <p className="text-xs text-gray-600">Avg. LTV</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>+23%</p>
              <p className="text-xs text-gray-600">Growth Rate</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <BarChart className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>4.2</p>
              <p className="text-xs text-gray-600">Avg. Invoices</p>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Top Customers by Revenue
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Acme Corporation', revenue: '$45,230', invoices: 12 },
                { name: 'Tech Solutions Inc', revenue: '$38,900', invoices: 8 },
                { name: 'Design Studio LLC', revenue: '$32,100', invoices: 15 },
                { name: 'Marketing Pro', revenue: '$28,450', invoices: 10 },
                { name: 'Consulting Group', revenue: '$24,800', invoices: 7 },
              ].map((customer, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-600">{customer.invoices} invoices</p>
                  </div>
                  <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {customer.revenue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={onClose}
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}