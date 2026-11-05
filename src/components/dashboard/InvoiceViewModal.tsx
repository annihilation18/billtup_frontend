import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, XCircle, Send, Loader2, X, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from '../ui/sonner';
import { fetchBusinessProfile, getInvoicePhotos, updateBusinessProfile } from '../../utils/dashboard-api';
import { formatAmount } from "../../utils/money";
import { recordedTip } from '../../utils/tips';

interface InvoiceViewModalProps {
  invoice: any;
  open?: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function InvoiceViewModal({ invoice, open = true, onClose }: InvoiceViewModalProps) {
  const [customerEmail, setCustomerEmail] = useState(invoice?.customerEmail || '');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [photos, setPhotos] = useState<Array<{ id: string; url: string; filename: string; uploadedAt: string }>>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // "Allow tip" (BACKLOG P2.0): starts from the business's last choice, shared with the app
  const [allowTip, setAllowTip] = useState(false);

  // Load the remembered "Allow tip" choice when the modal opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetchBusinessProfile()
      .then((business) => {
        if (!cancelled) setAllowTip(business?.defaultAllowTip ?? false);
      })
      .catch(() => { /* keep off */ });
    return () => { cancelled = true; };
  }, [open]);

  const handleAllowTipChange = (checked: boolean) => {
    setAllowTip(checked);
    // Remember it for next time (website and app); a failed save doesn't block sending
    updateBusinessProfile({ defaultAllowTip: checked })
      .catch((error) => console.error('Error saving tip preference:', error));
  };

  // Load photos when modal opens
  useEffect(() => {
    if (open && invoice?.id) {
      setIsLoadingPhotos(true);
      getInvoicePhotos(invoice.id)
        .then((result) => setPhotos(result.photos || []))
        .catch((error) => console.error('Error loading photos:', error))
        .finally(() => setIsLoadingPhotos(false));
    }
  }, [open, invoice?.id]);

  const handleSendEmail = async () => {
    if (!customerEmail) {
      toast.error('Please enter a customer email address');
      return;
    }

    setIsSending(true);
    setSendStatus('idle');
    try {
      const { API_CONFIG } = await import('../../utils/config');
      const { getIdToken } = await import('../../utils/auth/cognito');
      const token = await getIdToken();
      const businessData = await fetchBusinessProfile() || {};
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
            businessData,
            ...(tipSwitchShown ? { allowTip } : {}),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setSendStatus('success');
      toast.success('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice email:', error);
      setSendStatus('error');
      toast.error('Failed to send invoice. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!invoice) return null;

  // The email has a Pay Now button only for invoices still owed; tips go with that
  const tipSwitchShown = invoice.status !== 'paid' && invoice.status !== 'refunded';
  const tipAmount = recordedTip(invoice.tipAmount);
  const paymentsWithTips: Array<{ amount?: number; tipAmount: number; date?: string; paidAt?: string; createdAt?: string }> =
    Array.isArray(invoice.payments)
      ? invoice.payments
          .map((p: any) => ({ ...p, tipAmount: recordedTip(p?.tipAmount) }))
          .filter((p: any) => p.tipAmount > 0)
      : [];

  // Ensure lineItems array exists and map to display format
  const invoiceItems = invoice.lineItems?.map((item: any) => ({
    id: item.id,
    description: item.name,
    quantity: item.quantity,
    rate: item.price,
    amount: item.quantity * item.price
  })) || [];

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Invoice Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View invoice details and send to customer via email.
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
                            <p className="text-xs text-gray-500">Rate: ${formatAmount(item.rate)}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-900 ml-4" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        ${formatAmount((item.amount || item.price || (item.quantity * item.rate) || 0))}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Subtotal */}
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-300">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    ${formatAmount(invoiceItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
            <span className="text-lg text-gray-900">Total</span>
            <span className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              ${formatAmount((invoice.total || 0))}
            </span>
          </div>

          {/* Tip from the customer: paid on top, not part of the invoice total */}
          {tipAmount > 0 && (
            <div className="space-y-1" data-testid="invoice-tip">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tip</span>
                <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  ${formatAmount(tipAmount)}
                </span>
              </div>
              <p className="text-xs text-gray-400">Added by the customer when paying; not part of the invoice total.</p>
              {paymentsWithTips.length > 1 && (
                <ul className="text-xs text-gray-500 space-y-1">
                  {paymentsWithTips.map((p, i) => {
                    const when = p.paidAt || p.date || p.createdAt;
                    return (
                      <li key={i} className="flex justify-between">
                        <span>Payment{when ? ` ${new Date(when).toLocaleDateString()}` : ` ${i + 1}`}</span>
                        <span>Tip ${formatAmount(p.tipAmount)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Photos Section */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Photos</h4>

            {isLoadingPhotos ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : photos.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                No photos attached
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full h-28 object-cover rounded-lg cursor-pointer border border-gray-200 hover:border-gray-400 transition-colors"
                      onClick={() => setPhotoPreview(photo.url)}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">{photos.length}/4 photos</p>
              </>
            )}
          </div>

          {/* Photo Lightbox */}
          {photoPreview && (
            <div
              className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
              onClick={() => setPhotoPreview(null)}
            >
              <button
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
                onClick={() => setPhotoPreview(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={photoPreview}
                alt="Photo preview"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

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
            {tipSwitchShown && (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Label htmlFor="allowTip">Allow tip</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Customer can add an optional tip when paying online.
                  </p>
                </div>
                <Switch
                  id="allowTip"
                  checked={allowTip}
                  onCheckedChange={handleAllowTipChange}
                  disabled={isSending}
                />
              </div>
            )}
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
            {sendStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Invoice sent successfully
              </div>
            )}
            {sendStatus === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                Unable to send invoice. Please try again.
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}