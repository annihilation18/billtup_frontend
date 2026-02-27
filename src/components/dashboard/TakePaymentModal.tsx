import { useState, useEffect, useRef, useCallback } from 'react';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react@0.468.0';
import { loadStripe } from '@stripe/stripe-js@4.0.0';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js@2.8.0';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog-simple';
import { Button } from '../ui/button';
import { toast } from '../ui/sonner';
import { updateInvoice, createPaymentIntent, updatePaymentIntent, createSquarePayment } from '../../utils/dashboard-api';
import { STRIPE_CONFIG } from '../../utils/config';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

/** Calculate processing fee based on Stripe payment method type */
function calculateStripeFee(invoiceTotal: number, methodType: string) {
  if (methodType === 'us_bank_account') {
    // ACH: Stripe 0.8% max $5 + Platform 0.6% + $0.20
    const stripeFee = Math.min(5, invoiceTotal * 0.008);
    const platformFee = (invoiceTotal * 0.006) + 0.20;
    return { fee: stripeFee + platformFee, label: 'Processing Fee (ACH)' };
  }
  // Card / Apple Pay / Google Pay / Link: 3.5% + $0.50
  const fee = (invoiceTotal * 0.035) + 0.50;
  return { fee, label: 'Processing Fee (3.5% + $0.50)' };
}

// ─── Stripe Payment Form (rendered inside <Elements> with clientSecret) ───
interface StripeFormProps {
  invoice: any;
  paymentIntentId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onBack?: () => void;
}

function StripePaymentForm({ invoice, paymentIntentId, onSuccess, onCancel, onBack }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedMethodType, setSelectedMethodType] = useState('card');
  const [updatingFee, setUpdatingFee] = useState(false);

  const invoiceTotal = invoice.total || 0;
  const { fee: processingFee } = calculateStripeFee(invoiceTotal, selectedMethodType);
  const { fee: cardFee } = calculateStripeFee(invoiceTotal, 'card');
  const { fee: achFee } = calculateStripeFee(invoiceTotal, 'us_bank_account');
  const totalCharge = invoiceTotal + processingFee;

  const handlePaymentElementChange = async (event: any) => {
    const newType = event.value?.type;
    if (!newType || newType === selectedMethodType) return;

    setSelectedMethodType(newType);

    const { fee: newFee } = calculateStripeFee(invoiceTotal, newType);
    const newTotal = invoiceTotal + newFee;

    setUpdatingFee(true);
    try {
      const newTotalCents = Math.round(newTotal * 100);
      const invoiceCents = Math.round(invoiceTotal * 100);
      await updatePaymentIntent(paymentIntentId, newTotalCents, invoiceCents);
    } catch (err) {
      console.error('[Payment] Failed to update PI amount:', err);
    } finally {
      setUpdatingFee(false);
    }
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        await updateInvoice(invoice.id, {
          ...invoice,
          status: 'paid',
          paidAt: new Date().toISOString(),
          paymentIntentId,
          paymentProvider: 'stripe',
        });
        toast.success('Payment processed successfully via Stripe!');
        onSuccess();
      } else if (paymentIntent?.status === 'processing') {
        await updateInvoice(invoice.id, {
          ...invoice,
          status: 'processing',
          paymentIntentId,
          paymentProvider: 'stripe',
        });
        toast.success('Bank transfer submitted! It typically completes in 1-3 business days.');
        onSuccess();
      } else {
        setPaymentError(`Unexpected payment status: ${paymentIntent?.status}`);
      }
    } catch (err: any) {
      console.error('Stripe payment error:', err);
      setPaymentError(err.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-600 mb-1">Amount to charge</p>
        <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
          ${invoiceTotal.toFixed(2)}
        </p>
        <div className={`flex justify-between text-xs mt-2 ${selectedMethodType !== 'us_bank_account' ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
          <span>Card / Wallet (3.5% + $0.50)</span>
          <span>${cardFee.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between text-xs mt-1 ${selectedMethodType === 'us_bank_account' ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
          <span>Bank Transfer (ACH)</span>
          <span>${achFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-700 mt-2 pt-1 border-t border-gray-200">
          <span>Total</span>
          <span>{updatingFee ? '...' : `$${totalCharge.toFixed(2)}`}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Payment method</label>
        <PaymentElement onChange={handlePaymentElementChange} />
      </div>

      {paymentError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} disabled={isProcessing}>Back</Button>
        )}
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || updatingFee || !stripe}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4 mr-2" />Process ${totalCharge.toFixed(2)}</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Stripe Payment Wrapper (creates PI then renders Elements + form) ────
interface StripeWrapperProps {
  invoice: any;
  onSuccess: () => void;
  onCancel: () => void;
  onBack?: () => void;
}

function StripePaymentWrapper({ invoice, onSuccess, onCancel, onBack }: StripeWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createIntent = async () => {
      try {
        const amountInCents = Math.round((invoice.total || 0) * 100);
        const result = await createPaymentIntent(
          amountInCents,
          invoice.id,
          invoice.customerEmail,
          amountInCents,
        );
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
      } catch (err: any) {
        console.error('Failed to create payment intent:', err);
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [invoice.id, invoice.total, invoice.customerEmail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-sm text-gray-500">Initializing payment...</span>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="space-y-4 py-4">
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error || 'Failed to initialize payment'}</span>
        </div>
        <div className="flex justify-end gap-3">
          {onBack && (
            <Button variant="outline" onClick={onBack}>Back</Button>
          )}
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm
        invoice={invoice}
        paymentIntentId={paymentIntentId}
        onSuccess={onSuccess}
        onCancel={onCancel}
        onBack={onBack}
      />
    </Elements>
  );
}

// ─── Square Payment Form (loads Square Web Payments SDK) ─────────────
type SquareMethod = 'card' | 'google_pay' | 'ach';

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
  const googlePayContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<any>(null);
  const googlePayRef = useRef<any>(null);
  const achRef = useRef<any>(null);
  const paymentsRef = useRef<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [googlePayReady, setGooglePayReady] = useState(false);
  const [achReady, setAchReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<SquareMethod>('card');
  const [accountHolderName, setAccountHolderName] = useState('');
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

      // Initialize Card
      const card = await payments.card();
      cardRef.current = card;

      if (cardContainerRef.current) {
        await card.attach(cardContainerRef.current);
        setSdkReady(true);
      }

      // Initialize Google Pay
      try {
        const googlePay = await payments.googlePay({
          countryCode: 'US',
          currencyCode: 'USD',
          total: { amount: (invoice.total || 0).toFixed(2), label: 'Payment' },
        });
        googlePayRef.current = googlePay;
        setGooglePayReady(true);
      } catch (gpErr) {
        console.warn('Google Pay not available:', gpErr);
      }

      // Initialize ACH
      try {
        const ach = await payments.ach();
        achRef.current = ach;
        setAchReady(true);
      } catch (achErr) {
        console.warn('ACH not available:', achErr);
      }
    } catch (err: any) {
      console.error('Square SDK init error:', err);
      setSdkError(err.message || 'Failed to initialize Square payment form');
    }
  }, [applicationId, locationId, invoice.total]);

  // Attach Google Pay when tab is selected and ref is ready
  useEffect(() => {
    if (selectedMethod === 'google_pay' && googlePayRef.current && googlePayContainerRef.current) {
      try {
        googlePayRef.current.attach(googlePayContainerRef.current, {
          buttonColor: 'black',
          buttonSizeMode: 'fill',
          buttonType: 'long',
        });
      } catch (err) {
        console.warn('Failed to attach Google Pay:', err);
      }
    }
  }, [selectedMethod]);

  useEffect(() => {
    initSquare();

    return () => {
      if (cardRef.current) {
        try { cardRef.current.destroy(); } catch (_) {}
        cardRef.current = null;
      }
      if (googlePayRef.current) {
        try { googlePayRef.current.destroy(); } catch (_) {}
        googlePayRef.current = null;
      }
      if (achRef.current) {
        try { achRef.current.destroy(); } catch (_) {}
        achRef.current = null;
      }
      initAttemptedRef.current = false;
    };
  }, [initSquare]);

  const handleSubmit = async () => {
    setIsProcessing(true);
    setCardError(null);

    try {
      let tokenResult: any;
      let paymentMethodLabel = 'Card';

      if (selectedMethod === 'card') {
        if (!cardRef.current) return;
        tokenResult = await cardRef.current.tokenize();
      } else if (selectedMethod === 'google_pay') {
        if (!googlePayRef.current) return;
        tokenResult = await googlePayRef.current.tokenize();
        paymentMethodLabel = 'Google Pay';
      } else {
        // ACH
        if (!achRef.current) return;
        if (!accountHolderName.trim()) {
          setCardError('Please enter the account holder name');
          setIsProcessing(false);
          return;
        }
        tokenResult = await achRef.current.tokenize({
          accountHolderName,
        });
        paymentMethodLabel = 'Bank Transfer';
      }

      if (tokenResult.status !== 'OK') {
        setCardError(tokenResult.errors?.[0]?.message || `${paymentMethodLabel} tokenization failed`);
        setIsProcessing(false);
        return;
      }

      const amountInCents = Math.round((invoice.total || 0) * 100);
      const result = await createSquarePayment(
        amountInCents,
        tokenResult.token,
        invoice.id,
        invoice.customerEmail,
      );

      if (result.success) {
        const status = selectedMethod === 'ach' ? 'processing' : 'paid';
        await updateInvoice(invoice.id, {
          ...invoice,
          status,
          paidAt: status === 'paid' ? new Date().toISOString() : undefined,
          squarePaymentId: result.paymentId,
          paymentProvider: 'square',
        });

        if (selectedMethod === 'ach') {
          toast.success('Bank transfer submitted! It typically completes in 1-3 business days.');
        } else {
          toast.success(`Payment processed successfully via Square (${paymentMethodLabel})!`);
        }
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

  const methodTabs: { key: SquareMethod; label: string; available: boolean }[] = [
    { key: 'card', label: 'Card', available: true },
    { key: 'google_pay', label: 'Google Pay', available: googlePayReady },
    { key: 'ach', label: 'Bank Transfer', available: achReady },
  ];

  const availableTabs = methodTabs.filter(t => t.available);

  return (
    <div className="space-y-4 py-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-600 mb-1">Amount to charge</p>
        <p className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
          ${(invoice.total || 0).toFixed(2)}
        </p>
      </div>

      {/* Method tabs */}
      {availableTabs.length > 1 && (
        <div className="flex gap-2">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedMethod(tab.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                selectedMethod === tab.key
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Card form */}
      {selectedMethod === 'card' && (
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
      )}

      {/* Google Pay */}
      {selectedMethod === 'google_pay' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Google Pay</label>
          <div
            ref={googlePayContainerRef}
            className="min-h-[48px]"
          />
          <p className="text-xs text-gray-500">
            Tap the Google Pay button to complete your payment.
          </p>
        </div>
      )}

      {/* ACH */}
      {selectedMethod === 'ach' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bank Transfer (ACH)</label>
          <div>
            <label className="text-sm text-gray-600">Account Holder Name</label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <p className="text-xs text-gray-500">
            You will be prompted to link your bank account. Bank transfers typically complete in 1-3 business days.
          </p>
        </div>
      )}

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
          disabled={isProcessing || (selectedMethod === 'card' && !sdkReady)}
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

          {/* Stripe Payment — creates PI then renders PaymentElement */}
          {selectedProvider === 'stripe' && (
            <StripePaymentWrapper
              invoice={invoice}
              onSuccess={handleSuccess}
              onCancel={handleClose}
              onBack={bothConnected ? () => setSelectedProvider(null) : undefined}
            />
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
