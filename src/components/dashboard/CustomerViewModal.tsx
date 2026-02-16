import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Loader2
} from 'lucide-react@0.468.0';
import { fetchInvoices } from '../../utils/dashboard-api';
import { InvoiceViewModal } from './InvoiceViewModal';

interface CustomerViewModalProps {
  customer: any;
  open: boolean;
  onClose: () => void;
}

export function CustomerViewModal({ customer, open, onClose }: CustomerViewModalProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);

  useEffect(() => {
    if (open && customer) {
      loadCustomerInvoices();
    }
  }, [open, customer]);

  const loadCustomerInvoices = async () => {
    setLoading(true);
    try {
      const allInvoices = await fetchInvoices();
      
      // Try matching by customerId first
      let customerInvoices = allInvoices.filter((inv: any) => 
        inv.customerId === customer.id
      );
      
      // Fallback: Try matching by customer name if no ID matches found
      if (customerInvoices.length === 0) {
        customerInvoices = allInvoices.filter((inv: any) => 
          inv.customer?.toLowerCase() === customer.name?.toLowerCase()
        );
      }
      
      setInvoices(customerInvoices);
    } catch (error) {
      console.error('Error loading customer invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Customer Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View detailed information about the customer and their invoices.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div>
            <h3 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {customer.name}
            </h3>
            
            <div className="space-y-3 text-sm">
              {customer.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {(customer.address || customer.city || customer.state) && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>
                    {[customer.address, customer.city, customer.state, customer.zip]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Total Invoices</span>
              </div>
              <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {invoices.length}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Total Revenue</span>
              </div>
              <p className="text-2xl text-green-700" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                ${totalRevenue.toFixed(2)}
              </p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Pending</span>
              </div>
              <p className="text-2xl text-amber-700" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                ${pendingAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Invoices List */}
          <div>
            <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Invoices
            </h4>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No invoices found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setViewingInvoice(invoice)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                          {invoice.number || invoice.id}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(invoice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        ${(invoice.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Invoice View Modal */}
      {viewingInvoice && (
        <InvoiceViewModal
          invoice={viewingInvoice}
          open={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onUpdate={loadCustomerInvoices}
        />
      )}
    </Dialog>
  );
}