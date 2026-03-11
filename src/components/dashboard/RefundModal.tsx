import { useState } from 'react';
import { RefreshCcw, Loader2, AlertTriangle } from 'lucide-react@0.468.0';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog-simple';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../ui/sonner';
import { processRefund, processSquareRefund } from '../../utils/dashboard-api';

interface RefundModalProps {
  invoice: any;
  onUpdate?: () => void;
}

export function RefundModal({ invoice, onUpdate }: RefundModalProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [customAmount, setCustomAmount] = useState('');

  const isPaid = invoice.status === 'paid' || invoice.status === 'partially_refunded';
  const totalAmount = invoice.total || 0;
  const alreadyRefunded = invoice.refundedAmount || 0;
  const maxRefundable = totalAmount - alreadyRefunded;

  const handleRefund = async () => {
    const refundAmount = refundType === 'full'
      ? maxRefundable
      : parseFloat(customAmount);

    if (refundType === 'partial') {
      if (!customAmount || refundAmount <= 0 || refundAmount > maxRefundable) {
        toast.error(`Please enter a valid refund amount (max $${maxRefundable.toFixed(2)})`);
        return;
      }
    }

    setIsProcessing(true);
    try {
      // For Square-paid invoices, call Square refund first, then update invoice
      if (invoice.paymentProvider === 'square' && invoice.squarePaymentId) {
        const amountInCents = Math.round(refundAmount * 100);
        await processSquareRefund(invoice.squarePaymentId, amountInCents);
      }

      // Call backend refund endpoint (handles Stripe refund + invoice status update)
      await processRefund(invoice.id, refundAmount);

      const label = refundType === 'full' ? 'Full' : 'Partial';
      toast.success(`${label} refund of $${refundAmount.toFixed(2)} processed successfully!`);
      setOpen(false);
      if (onUpdate) {
        onUpdate();
      }

      // Reset form
      setRefundType('full');
      setCustomAmount('');
    } catch (error: any) {
      console.error('Error processing refund:', error);
      toast.error(error.message || 'Failed to process refund. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Hide refund button if invoice isn't paid or was paid manually (outside of Stripe/Square)
  const hasPaidViaProcessor = !!(invoice.paymentIntentId || invoice.squarePaymentId);
  if (!isPaid || !hasPaidViaProcessor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refund
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <RefreshCcw className="w-5 h-5" />
            Process Refund
          </DialogTitle>
          <DialogDescription>
            Refund payment for invoice <strong>{invoice.number || invoice.id}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Original Amount */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Original Payment</p>
            <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              ${totalAmount.toFixed(2)}
            </p>
            {alreadyRefunded > 0 && (
              <p className="text-sm text-orange-600 mt-1">
                Already refunded: ${alreadyRefunded.toFixed(2)} — Remaining: ${maxRefundable.toFixed(2)}
              </p>
            )}
          </div>

          {/* Refund Type Selection */}
          <div className="space-y-3">
            <Label>Refund Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRefundType('full')}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  refundType === 'full'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm text-gray-900">Full Refund</p>
                <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  ${maxRefundable.toFixed(2)}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRefundType('partial')}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  refundType === 'partial'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm text-gray-900">Partial Refund</p>
                <p className="text-xs text-gray-600 mt-1">
                  Custom amount
                </p>
              </button>
            </div>
          </div>

          {/* Custom Amount Input */}
          {refundType === 'partial' && (
            <div className="space-y-2">
              <Label htmlFor="customAmount">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="customAmount"
                  type="number"
                  min="0"
                  max={maxRefundable}
                  step="0.01"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-7"
                  disabled={isProcessing}
                />
              </div>
              <p className="text-xs text-gray-500">
                Maximum: ${maxRefundable.toFixed(2)}
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-800">
              This action will process a {refundType} refund via {invoice.paymentProvider === 'square' ? 'Square' : 'Stripe'}. Make sure you have verified the refund request.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleRefund}
              disabled={isProcessing}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Process {refundType === 'full' ? 'Full' : 'Partial'} Refund
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
