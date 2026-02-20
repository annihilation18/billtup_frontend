import { useState, useEffect, useRef, useCallback } from 'react';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react@0.468.0';
import { loadStripe } from '@stripe/stripe-js@4.0.0';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js@2.8.0';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog-simple';
import { Button } from '../ui/button';
import { toast } from '../ui/sonner';
import { updateInvoice, createPaymentIntent, createSquarePayment } from '../../utils/dashboard-api';
import { STRIPE_CONFIG } from '../../utils/config';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
};

// ─── Stripe Payment Form (rendered inside <Elements>) ───────────────
interface StripeFormProps {
  invoice: any;
  onSuccess: () => void;
  onCancel: () => void;
  onBack?: () => void;
}

function StripePaymentForm({ invoice, onSuccess, onCancel, onBack }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);
    setCardError(null);

    try {
      // 1) Create PaymentIntent on backend (amount in cents)
      const amountInCents = Math.round((invoice.total || 0) * 100);
      const { clientSecret, paymentIntentId } = await createPaymentIntent(
        amountInCents,
        invoice.id,
        invoice.customerEmail,
      );

      // 2) Confirm with Stripe.js — card data never touches our server
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setCardError(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // 3) Mark invoice paid
        await updateInvoice(invoice.id, {
          ...invoice,
          status: 'paid',
          paidAt: new Date().toISOString(),
          paymentIntentId,
          paymentProvider: 'stripe',
        });
        toast.success('Payment processed successfully via Stripe!');
        onSuccess();
      } else {
        setCardError(`Unexpected payment status: ${paymentIntent?.status}`);
      }
    } catch (err: any) {
      console.error('Stripe payment error:', err);
      setCardError(err.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-600 mb-1">Amount to charge</p>
        <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
          ${(invoice.total || 0).toFixed(2)}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Card details</label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement options={cardElementOptions} onChange={(e) => setCardError(e.error?.message || null)} />
        </div>
      </div>

      {cardError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{cardError}</span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} disabled={isProcessing}>Back</Button>
        )}
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !stripe}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4 mr-2" />Process ${(invoice.total || 0).toFixed(2)}</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Square Payment Form (loads Square Web Payments SDK) ─────────────
interface SquareFormProps {
  invoice: any;
  applicationId: string;
  locationId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onBack?: () => void;
}

function SquarePaymentForm({ invoice, applicationId, locationId, onSuccess, onCancel, onBack }: SquareFormProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<any>(null);
  const paymentsRef = useRef<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const initAttemptedRef = useRef(false);

  const initSquare = useCallback(async () => {
    if (initAttemptedRef.current) return;
    initAttemptedRef.current = true;

    if (!applicationId || !locationId) {
      setSdkError('Square SDK configuration missing. Please reconnect Square in Settings.');
      return;
    }

    try {
      // Load SDK script if not present
      if (!(window as any).Square) {
        await new Promise<void>((resolve, reject) => {
          // Check if script tag already exists
          if (document.querySelector('script[src*="square"]')) {
            const check = setInterval(() => {
              if ((window as any).Square) { clearInterval(check); resolve(); }
            }, 100);
            setTimeout(() => { clearInterval(check); reject(new Error('Square SDK load timeout')); }, 10000);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Square SDK'));
          document.head.appendChild(script);
        });
      }

      const payments = (window as any).Square.payments(applicationId, locationId);
      paymentsRef.current = payments;

      const card = await payments.card();
      cardRef.current = card;

      if (cardContainerRef.current) {
        await card.attach(cardContainerRef.current);
        setSdkReady(true);
      }
    } catch (err: any) {
      console.error('Square SDK init error:', err);
      setSdkError(err.message || 'Failed to initialize Square payment form');
    }
  }, [applicationId, locationId]);

  useEffect(() => {
    initSquare();

    return () => {
      if (cardRef.current) {
        try { cardRef.current.destroy(); } catch (_) {}
        cardRef.current = null;
      }
      initAttemptedRef.current = false;
    };
  }, [initSquare]);

  const handleSubmit = async () => {
    if (!cardRef.current) return;

    setIsProcessing(true);
    setCardError(null);

    try {
      // 1) Tokenize card via Square SDK
      const tokenResult = await cardRef.current.tokenize();

      if (tokenResult.status !== 'OK') {
        setCardError(tokenResult.errors?.[0]?.message || 'Card tokenization failed');
        setIsProcessing(false);
        return;
      }

      // 2) Send token to backend to create payment (amount in cents)
      const amountInCents = Math.round((invoice.total || 0) * 100);
      const result = await createSquarePayment(
        amountInCents,
        tokenResult.token,
        invoice.id,
        invoice.customerEmail,
      );

      if (result.success) {
        // 3) Mark invoice paid
        await updateInvoice(invoice.id, {
          ...invoice,
          status: 'paid',
          paidAt: new Date().toISOString(),
          squarePaymentId: result.paymentId,
          paymentProvider: 'square',
        });
        toast.success('Payment processed successfully via Square!');
        onSuccess();
      } else {
        setCardError('Square payment failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Square payment error:', err);
      setCardError(err.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-600 mb-1">Amount to charge</p>
        <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
          ${(invoice.total || 0).toFixed(2)}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Card details</label>
        {sdkError ? (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{sdkError}</span>
          </div>
        ) : (
          <div
            ref={cardContainerRef}
            className="border border-gray-300 rounded-lg p-1 bg-white min-h-[44px]"
          />
        )}
        {!sdkReady && !sdkError && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading payment form...
          </div>
        )}
      </div>

      {cardError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{cardError}</span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} disabled={isProcessing}>Back</Button>
        )}
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !sdkReady}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4 mr-2" />Process ${(invoice.total || 0).toFixed(2)}</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main TakePaymentModal ──────────────────────────────────────────
interface TakePaymentModalProps {
  invoice: any;
  onUpdate?: () => void;
  stripeConnected?: boolean;
  squareConnected?: boolean;
  activeProvider?: string;
  squareApplicationId?: string;
  squareLocationId?: string;
}

export function TakePaymentModal({
  invoice,
  onUpdate,
  stripeConnected = false,
  squareConnected = false,
  activeProvider = 'stripe',
  squareApplicationId = '',
  squareLocationId = '',
}: TakePaymentModalProps) {
  const [open, setOpen] = useState(false);
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

  const handleSuccess = () => {
    setOpen(false);
    setSelectedProvider(null);
    if (onUpdate) onUpdate();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProvider(null);
  };

  if (isPaid) return null;

  const providerLabel = selectedProvider === 'stripe' ? 'Stripe' : 'Square';

  return (
    <>
      <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleOpen}>
        <CreditCard className="w-4 h-4 mr-2" />
        Take Payment
      </Button>
      <Dialog open={open} onOpenChange={handleClose}>
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
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Stripe Payment Form */}
          {selectedProvider === 'stripe' && (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                invoice={invoice}
                onSuccess={handleSuccess}
                onCancel={handleClose}
                onBack={bothConnected ? () => setSelectedProvider(null) : undefined}
              />
            </Elements>
          )}

          {/* Square Payment Form */}
          {selectedProvider === 'square' && (
            <SquarePaymentForm
              invoice={invoice}
              applicationId={squareApplicationId}
              locationId={squareLocationId}
              onSuccess={handleSuccess}
              onCancel={handleClose}
              onBack={bothConnected ? () => setSelectedProvider(null) : undefined}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
