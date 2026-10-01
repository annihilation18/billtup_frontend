import { useState, useEffect } from 'react';
import { Check, Crown, Loader2, Lock, Calendar } from 'lucide-react@0.468.0';
import { loadStripe } from '@stripe/stripe-js@4.0.0';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js@2.8.0';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog-simple';
import { Button } from '../ui/button';
import { toast } from '../ui/sonner';
import { createSetupIntent, activateSubscription } from '../../utils/dashboard-api';
import { STRIPE_CONFIG } from '../../utils/config';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

type Plan = 'basic' | 'premium';

const PLANS: Record<Plan, { name: string; price: string; features: string[] }> = {
  basic: { name: 'Basic', price: '4.99', features: ['10 invoices per month', '10 customers', 'Email & PDF invoicing'] },
  premium: { name: 'Premium', price: '9.99', features: ['Unlimited invoices & customers', 'Custom branding & templates', 'Analytics'] },
};

const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/** End of the free trial if it's still running, otherwise null (billing starts today) */
function activeTrialEnd(trialEndsAt?: string | null): Date | null {
  if (!trialEndsAt) return null;
  const end = new Date(trialEndsAt);
  end.setHours(23, 59, 59, 999);
  return end > new Date() ? end : null;
}

interface SubscribeModalProps {
  open: boolean;
  onClose: () => void;
  /** Plan preselected when the dialog opens */
  initialPlan?: Plan;
  /** Trial end date — billing starts then; if it has passed, billing starts today */
  trialEndsAt?: string | null;
  onSubscribed: () => void;
}

function CardForm({ submitLabel, onPaymentMethod }: {
  submitLabel: string;
  onPaymentMethod: (paymentMethodId: string) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    try {
      const { error, setupIntent } = await stripe.confirmSetup({ elements, redirect: 'if_required' });
      if (error) {
        toast.error(error.message || 'We could not verify your card. Please try again.');
        return;
      }
      const pm = setupIntent?.payment_method;
      const paymentMethodId = typeof pm === 'string' ? pm : pm?.id;
      if (setupIntent?.status !== 'succeeded' || !paymentMethodId) {
        toast.error('We could not verify your card. Please try again.');
        return;
      }
      await onPaymentMethod(paymentMethodId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button
        className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
        onClick={handleSubmit}
        disabled={!stripe || !elements || submitting}
      >
        {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subscribing...</> : submitLabel}
      </Button>
    </div>
  );
}

/**
 * Subscribe on the website with a card (Stripe). Used during the free trial (billing starts
 * when it ends) and after it ends, when the account is read-only (billing starts today).
 */
export function SubscribeModal({ open, onClose, initialPlan = 'premium', trialEndsAt, onSubscribed }: SubscribeModalProps) {
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingSetup, setLoadingSetup] = useState(false);

  const trialEnd = activeTrialEnd(trialEndsAt);

  useEffect(() => {
    if (open) setPlan(initialPlan);
  }, [open, initialPlan]);

  // One SetupIntent per dialog opening (the card isn't tied to a plan)
  useEffect(() => {
    if (!open || clientSecret || loadingSetup) return;
    setLoadingSetup(true);
    createSetupIntent(plan)
      .then((r) => setClientSecret(r.clientSecret))
      .catch(() => toast.error('Could not load the payment form. Please try again.'))
      .finally(() => setLoadingSetup(false));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    setClientSecret(null);
    onClose();
  };

  const handlePaymentMethod = async (paymentMethodId: string) => {
    try {
      await activateSubscription(plan, paymentMethodId);
      toast.success(trialEnd
        ? `You're subscribed to ${PLANS[plan].name}. Your first payment is on ${formatDate(trialEnd)}.`
        : `You're subscribed to ${PLANS[plan].name}!`);
      setClientSecret(null);
      onSubscribed();
    } catch {
      toast.error('Your card could not be charged. Please try a different card.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose your plan</DialogTitle>
          <DialogDescription>
            {trialEnd
              ? `Nothing is charged until your free trial ends on ${formatDate(trialEnd)}.`
              : 'Subscribe to keep creating invoices, quotes and customers. Cancel anytime.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 my-4">
          {(Object.keys(PLANS) as Plan[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPlan(id)}
              className={`text-left rounded-lg border-2 p-3 transition-all ${
                plan === id ? 'border-[#1E3A8A] bg-[#1E3A8A]/5' : 'border-gray-200 hover:border-[#1E3A8A]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-1">
                  {id === 'premium' && <Crown className="w-4 h-4 text-[#F59E0B]" />}
                  {PLANS[id].name}
                </span>
                {plan === id && <Check className="w-4 h-4 text-[#1E3A8A]" />}
              </div>
              <p className="text-xl font-bold mt-1">${PLANS[id].price}<span className="text-xs font-normal text-gray-500">/mo</span></p>
              <ul className="mt-2 space-y-0.5 text-xs text-gray-600">
                {PLANS[id].features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>
            {trialEnd
              ? `First payment of $${PLANS[plan].price} on ${formatDate(trialEnd)}, then monthly`
              : `$${PLANS[plan].price} today, then monthly`}
          </span>
        </div>

        {loadingSetup && (
          <div className="flex items-center justify-center py-6 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading payment form...
          </div>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CardForm
              submitLabel={trialEnd ? `Subscribe to ${PLANS[plan].name}` : `Subscribe — $${PLANS[plan].price}/month`}
              onPaymentMethod={handlePaymentMethod}
            />
          </Elements>
        )}

        <p className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-4">
          <Lock className="w-3 h-3" /> Payments secured by Stripe
        </p>
      </DialogContent>
    </Dialog>
  );
}
