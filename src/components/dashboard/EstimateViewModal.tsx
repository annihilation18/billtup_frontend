import {
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  FileText,
  ArrowRightLeft,
} from 'lucide-react@0.468.0';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface EstimateViewModalProps {
  estimate: any;
  open?: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function EstimateViewModal({ estimate, open = true, onClose }: EstimateViewModalProps) {
  if (!estimate) return null;

  const estimateItems = estimate.lineItems?.map((item: any) => ({
    id: item.id,
    description: item.name || item.description,
    quantity: item.quantity,
    rate: item.price || item.rate,
    amount: item.quantity * (item.price || item.rate || 0)
  })) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-5 h-5" />;
      case 'sent':
        return <Send className="w-5 h-5" />;
      case 'approved':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'converted':
        return <ArrowRightLeft className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'converted':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Estimate Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              View estimate information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Estimate Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  {estimate.number || estimate.id}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {estimate.date
                    ? new Date(estimate.date).toLocaleDateString()
                    : estimate.createdAt
                      ? new Date(estimate.createdAt).toLocaleDateString()
                      : 'N/A'
                  }
                </p>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${getStatusColor(estimate.status)}`}>
                {getStatusIcon(estimate.status)}
                {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="border-t border-b border-gray-200 py-4">
              <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Customer</h4>
              <p className="text-lg text-gray-900">{estimate.customer}</p>
              {estimate.customerEmail && (
                <p className="text-sm text-gray-600 mt-1">{estimate.customerEmail}</p>
              )}
            </div>

            {/* Valid Until */}
            {estimate.validUntil && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Valid until: {new Date(estimate.validUntil).toLocaleDateString()}</span>
              </div>
            )}

            {/* Status Timestamps */}
            {estimate.sentAt && (
              <div className="text-sm text-gray-500">
                Sent: {new Date(estimate.sentAt).toLocaleString()}
              </div>
            )}
            {estimate.approvedAt && (
              <div className="text-sm text-green-600">
                Approved: {new Date(estimate.approvedAt).toLocaleString()}
              </div>
            )}
            {estimate.rejectedAt && (
              <div className="text-sm text-red-600">
                Rejected: {new Date(estimate.rejectedAt).toLocaleString()}
                {estimate.rejectionReason && (
                  <span className="block mt-1 text-gray-600">Reason: {estimate.rejectionReason}</span>
                )}
              </div>
            )}

            {/* Line Items */}
            <div>
              <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Items</h4>
              {estimateItems.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                  No items found for this estimate
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {estimateItems.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{item.description || 'Item'}</p>
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
                          ${(item.amount || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-300">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      ${estimateItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
              <span className="text-lg text-gray-900">Estimated Total</span>
              <span className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                ${(estimate.total || 0).toFixed(2)}
              </span>
            </div>

            {/* Notes */}
            {estimate.notes && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Notes / Terms</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{estimate.notes}</p>
              </div>
            )}

            {/* Converted Info */}
            {estimate.status === 'converted' && estimate.convertedInvoiceId && (
              <div className="text-sm text-purple-700 bg-purple-50 px-4 py-2 rounded-lg mt-4">
                Converted to invoice. View it in the Invoices tab.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
}
