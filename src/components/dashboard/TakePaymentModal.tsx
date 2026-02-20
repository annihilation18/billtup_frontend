import { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react@0.468.0';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog-simple';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../ui/sonner';
import { updateInvoice } from '../../utils/dashboard-api';

interface TakePaymentModalProps {
  invoice: any;
  onUpdate?: () => void;
  stripeConnected?: boolean;
  squareConnected?: boolean;
  activeProvider?: string;
}

export function TakePaymentModal({
  invoice,
  onUpdate,
  stripeConnected = false,
  squareConnected = false,
  activeProvider = 'stripe',
}: TakePaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const isPaid = invoice.status === 'paid';
  const bothConnected = stripeConnected && squareConnected;

  const handleOpen = () => {
    if (bothConnected) {
      setSelectedProvider(null);
    } else if (stripeConnected) {
      setSelectedProvider('stripe');
    } else if (squareConnected) {
      setSelectedProvider('square');
    } else {
      setSelectedProvider(activeProvider);
    }
    setOpen(true);
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv || !cardholderName) {
      toast.error('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update invoice status to paid
      await updateInvoice(invoice.id, {
        ...invoice,
        status: 'paid',
        paidAt: new Date().toISOString(),
      });

      toast.success('Payment processed successfully!');
      setOpen(false);
      if (onUpdate) {
        onUpdate();
      }

      // Reset form
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardholderName('');
      setSelectedProvider(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return null;
  }

  const providerLabel = selectedProvider === 'stripe' ? 'Stripe' : 'Square';

  return (
    <>
      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={handleOpen}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Take Payment
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
              Process Payment
            </DialogTitle>
            <DialogDescription>
              {selectedProvider
                ? <>Processing via {providerLabel} for invoice <strong>{invoice.number || invoice.id}</strong>.</>
                : <>Select a payment provider for invoice <strong>{invoice.number || invoice.id}</strong>.</>
              }
            </DialogDescription>
          </DialogHeader>

          {/* Provider Selection — shown when both are connected */}
          {bothConnected && !selectedProvider && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Amount to charge</p>
                <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  ${(invoice.total || 0).toFixed(2)}
                </p>
              </div>

              <p className="text-sm text-gray-600">Choose a payment provider:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedProvider('stripe')}
                  className="border-2 border-gray-200 hover:border-[#635BFF] rounded-xl p-4 text-center transition-all"
                >
                  <div className="text-lg font-semibold text-[#635BFF]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Stripe
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Industry standard</div>
                </button>
                <button
                  onClick={() => setSelectedProvider('square')}
                  className="border-2 border-gray-200 hover:border-black rounded-xl p-4 text-center transition-all"
                >
                  <div className="text-lg font-semibold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Square
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Lower in-person fees</div>
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Payment Form — shown after provider is selected */}
          {selectedProvider && (
            <div className="space-y-4 py-4">
              {/* Amount */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Amount to charge</p>
                <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  ${(invoice.total || 0).toFixed(2)}
                </p>
              </div>

              {/* Card Details */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '');
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setCardNumber(formatted);
                    }}
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value;
                        setExpiry(formatted);
                      }}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                {bothConnected && (
                  <Button variant="outline" onClick={() => setSelectedProvider(null)} disabled={isProcessing}>
                    Back
                  </Button>
                )}
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Process ${(invoice.total || 0).toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
