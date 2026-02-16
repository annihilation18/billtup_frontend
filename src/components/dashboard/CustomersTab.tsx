import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Crown,
  TrendingUp,
  DollarSign,
  Loader2
} from 'lucide-react@0.468.0';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { fetchCustomers, fetchInvoices, fixInvoiceCustomerReferences } from '../../utils/dashboard-api';
import { CreateCustomerModal } from './CreateCustomerModal';
import { CustomerViewModal } from './CustomerViewModal';
import { EditCustomerModal } from './EditCustomerModal';
import { DeleteCustomerModal } from './DeleteCustomerModal';

interface CustomersTabProps {
  userPlan: 'basic' | 'premium';
}

export function CustomersTab({ userPlan }: CustomersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<any>(null);

  useEffect(() => {
    loadCustomers();
    // Auto-fix any invoices missing customerId
    fixInvoiceCustomerReferences().catch(console.error);
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const [customersData, invoicesData] = await Promise.all([
        fetchCustomers(),
        fetchInvoices(),
      ]);

      // Calculate revenue and invoice counts for each customer
      const enrichedCustomers = customersData.map((customer: any) => {
        const customerInvoices = invoicesData.filter(
          (inv: any) => inv.customerId === customer.id && inv.status === 'paid'
        );
        const totalRevenue = customerInvoices.reduce(
          (sum: number, inv: any) => sum + (inv.total || 0),
          0
        );
        
        // Get last invoice date
        const sortedInvoices = invoicesData
          .filter((inv: any) => inv.customerId === customer.id)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const lastInvoice = sortedInvoices[0];
        const lastInvoiceDate = lastInvoice ? formatDate(lastInvoice.createdAt) : 'Never';

        return {
          ...customer,
          totalInvoices: invoicesData.filter((inv: any) => inv.customerId === customer.id).length,
          totalRevenue,
          lastInvoice: lastInvoiceDate,
        };
      });

      setCustomers(enrichedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPremium = userPlan === 'premium';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Customers
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Manage your customer relationships
            {!isPremium && ' (Basic features only)'}
          </p>
        </div>
        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-lg" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          {isPremium && (
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300">
                Filter
              </Button>
              <Button variant="outline" className="border-gray-300">
                Export
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Premium Feature Banner */}
      {!isPremium && (
        <Card className="p-4 bg-gradient-to-br from-[#F59E0B]/10 to-[#1E3A8A]/10 border-[#F59E0B]/20">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Unlock Advanced Customer Management
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Upgrade to Premium for advanced filtering, customer analytics, revenue tracking, export options, and more.
              </p>
              <Button className="h-8 text-xs bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 text-white rounded-lg">
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="p-6 border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Customer Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {customer.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{customer.location}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingCustomer(customer)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingCustomer(customer)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => setDeletingCustomer(customer)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Advanced Stats (Premium Only) */}
                {isPremium && (
                  <div className="flex flex-wrap gap-6 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Invoices</p>
                        <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                          {customer.totalInvoices}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Revenue</p>
                        <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                          ${customer.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs text-gray-600">Last Invoice</p>
                        <p className="text-sm text-gray-900">{customer.lastInvoice}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Usage Limit (Basic Plan) */}
      {!isPremium && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Basic Plan:</strong> You have {customers.length} of 50 customers. Upgrade to Premium for unlimited customers and advanced features.
          </p>
        </Card>
      )}

      {/* Modals */}
      <CreateCustomerModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={loadCustomers} />
      <CustomerViewModal customer={viewingCustomer} open={viewingCustomer !== null} onClose={() => setViewingCustomer(null)} />
      <EditCustomerModal customer={editingCustomer} open={editingCustomer !== null} onClose={() => setEditingCustomer(null)} onUpdated={loadCustomers} />
      <DeleteCustomerModal customer={deletingCustomer} open={deletingCustomer !== null} onClose={() => setDeletingCustomer(null)} onDeleted={loadCustomers} />
    </div>
  );
}