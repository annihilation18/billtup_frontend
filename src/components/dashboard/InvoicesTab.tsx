import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw,
  Loader2
} from 'lucide-react@0.468.0';
import { DeleteInvoiceModal } from './DeleteInvoiceModal';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { InvoiceViewModal } from './InvoiceViewModal';
import { toast } from '../ui/sonner';
import { fetchInvoices, fetchBillingCycleUsage } from '../../utils/dashboard-api';

interface InvoicesTabProps {
  userPlan: 'basic' | 'premium';
}

export function InvoicesTab({ userPlan }: InvoicesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingUsage, setBillingUsage] = useState<{ used: number; limit: number } | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invoicesData, usageData] = await Promise.all([
        fetchInvoices(),
        fetchBillingCycleUsage(),
      ]);
      setInvoices(invoicesData);
      setBillingUsage(usageData);
    } catch (error) {
      console.error('Error loading invoices data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isPremium = userPlan === 'premium';

  const handleNewInvoice = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Invoices
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Create and manage your invoices
          </p>
        </div>
        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-lg" onClick={handleNewInvoice}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {paidCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {pendingCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {overdueCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {invoices.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            {isPremium && (
              <Button variant="outline" className="border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </td>
                </tr>
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        {invoice.number || invoice.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{invoice.customer}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        ${(invoice.total || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {invoice.date 
                          ? new Date(invoice.date).toLocaleDateString()
                          : invoice.createdAt 
                            ? new Date(invoice.createdAt).toLocaleDateString() 
                            : 'N/A'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          className="h-8 px-3 text-xs border-gray-300" 
                          onClick={() => setViewingInvoice(invoice)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <button 
                          className="p-1.5 hover:bg-red-50 rounded transition-colors" 
                          onClick={() => setDeletingInvoice(invoice)}
                          title="Delete invoice"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Usage Limit (Basic Plan) */}
      {!isPremium && billingUsage && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Basic Plan:</strong> You've used {billingUsage.used} of {billingUsage.limit} invoices this cycle. Upgrade to Premium for unlimited invoices.
          </p>
        </Card>
      )}

      {/* Invoice View Modal */}
      {viewingInvoice && (
        <InvoiceViewModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}

      {/* Delete Invoice Modal */}
      {deletingInvoice && (
        <DeleteInvoiceModal
          invoice={deletingInvoice}
          onClose={() => setDeletingInvoice(null)}
          onDeleted={() => {
            setDeletingInvoice(null);
            loadData();
          }}
        />
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}