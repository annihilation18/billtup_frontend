import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Clock,
  MoreVertical 
} from 'lucide-react@0.468.0';

interface AppMockupProps {
  type: 'dashboard' | 'invoice' | 'payment' | 'customers';
}

export function AppMockup({ type }: AppMockupProps) {
  if (type === 'dashboard') {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Dashboard</h3>
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-sm">
            JD
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">This Month</span>
            </div>
            <p className="text-2xl text-gray-900">$4,250</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Year to Date</span>
            </div>
            <p className="text-2xl text-gray-900">$32,180</p>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Invoices</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-900">INV-142</p>
                <p className="text-xs text-gray-500">John Smith</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">$850.00</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-900">INV-141</p>
                <p className="text-xs text-gray-500">Sarah Johnson</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">$1,200.00</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">INV-140</p>
                <p className="text-xs text-gray-500">Mike Davis</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">$650.00</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="bg-[#1E3A8A] text-white rounded-xl p-3 text-sm">
            + New Invoice
          </button>
          <button className="bg-white text-gray-700 rounded-xl p-3 text-sm border border-gray-200">
            View Reports
          </button>
        </div>
      </div>
    );
  }

  if (type === 'invoice') {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>New Invoice</h3>
          <button className="text-gray-600">×</button>
        </div>

        {/* Customer Selection */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <label className="text-xs text-gray-600 mb-2 block">Customer</label>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">John Smith</span>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <h4 className="text-sm mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Line Items</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <p className="text-gray-900">Full Auto Detail</p>
                <p className="text-xs text-gray-500">Qty: 1 × $200.00</p>
              </div>
              <span className="text-gray-900">$200.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <p className="text-gray-900">Interior Cleaning</p>
                <p className="text-xs text-gray-500">Qty: 1 × $150.00</p>
              </div>
              <span className="text-gray-900">$150.00</span>
            </div>
          </div>
          <button className="mt-3 text-sm text-[#1E3A8A]">+ Add Item</button>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">$350.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8.5%)</span>
              <span className="text-gray-900">$29.75</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900 text-lg">$379.75</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white text-gray-700 rounded-xl p-3 text-sm border border-gray-200">
            Save Draft
          </button>
          <button className="bg-[#1E3A8A] text-white rounded-xl p-3 text-sm">
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  if (type === 'payment') {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Payment</h3>
          <p className="text-sm text-gray-600">Invoice #INV-143</p>
        </div>

        {/* Amount */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-blue-700 rounded-xl p-6 mb-6 text-white text-center">
          <p className="text-sm mb-1 opacity-90">Total Amount</p>
          <p className="text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>$379.75</p>
        </div>

        {/* Card Details */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <h4 className="text-sm mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Card Details</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Cardholder Name</label>
              <div className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900">
                John Smith
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Card Number</label>
              <div className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900">
                •••• •••• •••• 4242
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Expiry</label>
                <div className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900">
                  12/25
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">CVV</label>
                <div className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900">
                  •••
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button className="w-full bg-green-600 text-white rounded-xl p-4 text-sm flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Pay $379.75
        </button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center mt-3">
          Secure Payments • PCI Compliant
        </p>
      </div>
    );
  }

  if (type === 'customers') {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Customers</h3>
          <button className="bg-[#1E3A8A] text-white rounded-lg px-3 py-1.5 text-sm">
            + Add
          </button>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm">
                JS
              </div>
              <div>
                <p className="text-sm text-gray-900">John Smith</p>
                <p className="text-xs text-gray-500">john@email.com</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-900">$2,450</p>
              <p className="text-xs text-gray-500">3 invoices</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm">
                SJ
              </div>
              <div>
                <p className="text-sm text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-500">sarah@email.com</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-900">$1,850</p>
              <p className="text-xs text-gray-500">2 invoices</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm">
                MD
              </div>
              <div>
                <p className="text-sm text-gray-900">Mike Davis</p>
                <p className="text-xs text-gray-500">mike@email.com</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-900">$3,200</p>
              <p className="text-xs text-gray-500">4 invoices</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl text-gray-900">15</p>
              <p className="text-xs text-gray-600">Total Customers</p>
            </div>
            <div>
              <p className="text-2xl text-gray-900">$12.5K</p>
              <p className="text-xs text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}