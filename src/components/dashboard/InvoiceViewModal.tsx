import { useState } from 'react';
import { CheckCircle2, Clock, XCircle, Send, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../ui/sonner';
import { DeleteInvoiceModal } from './DeleteInvoiceModal';
import { EditInvoiceModal } from './EditInvoiceModal';
import { TakePaymentModal } from './TakePaymentModal';
import { RefundModal } from './RefundModal';

interface InvoiceViewModalProps {
  invoice: any;
  open?: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function InvoiceViewModal({ invoice, open = true, onClose, onUpdate }: InvoiceViewModalProps) {
  const [customerEmail, setCustomerEmail] = useState(invoice?.customerEmail || '');
  const [isSending, setIsSending] = useState(false);

  const handleActionComplete = () => {
    if (onUpdate) {
      onUpdate();
    }
    onClose();
  };

  const handleSendEmail = async () => {
    if (!customerEmail) {
      toast.error('Please enter a customer email address');
      return;
    }

    setIsSending(true);
    try {
      const { API_CONFIG } = await import('../../utils/config');
      const { getIdToken } = await import('../../utils/auth/cognito');
      const token = await getIdToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/invoices/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            invoiceData: invoice,
            customerEmail,
            businessData: {}, // Optional business data can be added
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      toast.success('Invoice sent successfully!');
      handleActionComplete();
    } catch (error) {
      console.error('Error sending invoice email:', error);
      toast.error('Failed to send invoice. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!invoice) return null;

  // Ensure lineItems array exists and map to display format
  const invoiceItems = invoice.lineItems?.map((item: any) => ({
    id: item.id,
    description: item.name,
    quantity: item.quantity,
    rate: item.price,
    amount: item.quantity * item.price
  })) || [];
  const hasItems = invoiceItems.length > 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'overdue':
        return <XCircle className="w-5 h-5" />;
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Invoice Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View invoice information and send it to the customer via email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {invoice.number || invoice.id}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {invoice.date 
                  ? new Date(invoice.date).toLocaleDateString()
                  : invoice.createdAt 
                    ? new Date(invoice.createdAt).toLocaleDateString() 
                    : 'N/A'
                }
              </p>
            </div>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${getStatusColor(invoice.status)}`}>
              {getStatusIcon(invoice.status)}
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>

          {/* Customer Info */}
          <div className="border-t border-b border-gray-200 py-4">
            <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Customer</h4>
            <p className="text-lg text-gray-900">{invoice.customer}</p>
            {invoice.customerEmail && (
              <p className="text-sm text-gray-600 mt-1">{invoice.customerEmail}</p>
            )}
          </div>

          {/* Line Items */}
          <div>
            <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Items</h4>
            {!invoiceItems || invoiceItems.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                No items found for this invoice
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {invoiceItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.description || item.name || 'Item'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {item.quantity && (
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          )}
                          {item.rate && (
                            <p className="text-xs text-gray-500">Rate: ${item.rate.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-900 ml-4" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        ${(item.amount || item.price || (item.quantity * item.rate) || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Subtotal */}
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-300">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    ${invoiceItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
            <span className="text-lg text-gray-900">Total</span>
            <span className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              ${(invoice.total || 0).toFixed(2)}
            </span>
          </div>

          {/* Email Section */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h4 className="text-sm text-gray-900">Send Invoice via Email</h4>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="customer@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <Button
              onClick={handleSendEmail}
              disabled={isSending || !customerEmail}
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invoice
                </>
              )}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="space-x-2">
              <EditInvoiceModal invoice={invoice} onUpdate={onUpdate} />
              <DeleteInvoiceModal invoice={invoice} onUpdate={onUpdate} />
            </div>
            <div className="space-x-2">
              <TakePaymentModal invoice={invoice} onUpdate={onUpdate} />
              <RefundModal invoice={invoice} onUpdate={onUpdate} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}