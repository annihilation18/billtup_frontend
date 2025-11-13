import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { BilltUpLogo } from "./BilltUpLogo";
import { CreditCard, Lock, Calendar, Info } from "lucide-react";
import { PLANS, PlanType, formatPlanPrice } from "../utils/subscriptionPlans";
import { toast } from "sonner@2.0.3";

interface SubscriptionPaymentScreenProps {
  selectedPlan: Exclude<PlanType, 'trial'>;
  onComplete: (paymentMethodId?: string) => void;
  onBack: () => void;
}

export function SubscriptionPaymentScreen({
  selectedPlan,
  onComplete,
  onBack,
}: SubscriptionPaymentScreenProps) {
  const [loading, setLoading] = useState(false);
  const [skipPayment, setSkipPayment] = useState(true); // Start trial without payment
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [billingZip, setBillingZip] = useState("");

  const plan = PLANS[selectedPlan];
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);

  const handleStartTrial = () => {
    setLoading(true);
    // Start trial without payment info
    setTimeout(() => {
      toast.success("Welcome to your 14-day free trial! 🎉");
      onComplete(); // No payment method ID during trial
      setLoading(false);
    }, 1000);
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardholderName || !cardNumber || !expiryDate || !cvc || !billingZip) {
      toast.error("Please fill in all payment details");
      return;
    }

    setLoading(true);

    try {
      // TODO: In production, integrate with Stripe Elements
      // For now, simulate payment method creation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockPaymentMethodId = `pm_${Date.now()}`;
      toast.success("Payment method added successfully!");
      onComplete(mockPaymentMethodId);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to add payment method");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <BilltUpLogo variant="white" size="lg" />
            </div>
          </div>
          <h1 className="text-white mb-2">Start Your Free Trial</h1>
          <p className="text-white/80">
            14 days free, then ${plan.price}/month
          </p>
        </div>

        {/* Plan Summary */}
        <Card className="p-6 mb-6 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3>{plan.name} Plan</h3>
                <Badge className="bg-blue-100 text-blue-800">14-Day Free Trial</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Full access to all {plan.name.toLowerCase()} features
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${plan.price}</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span>Trial ends on {trialEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Info className="w-4 h-4" />
              <span>Cancel anytime before trial ends - no charges</span>
            </div>
          </div>
        </Card>

        {/* Payment Options */}
        {skipPayment ? (
          <Card className="p-8 bg-white/95 backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="mb-2">No Credit Card Required</h2>
              <p className="text-muted-foreground">
                Start your free trial now and add payment details later
              </p>
            </div>

            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                <strong>What happens next:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Enjoy unlimited access for 14 days</li>
                  <li>We'll remind you 3 days before your trial ends</li>
                  <li>Add payment details anytime in settings</li>
                  <li>No automatic charges until you add payment</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-[#14B8A6] hover:bg-[#14B8A6]/90"
                onClick={handleStartTrial}
                disabled={loading}
              >
                {loading ? "Starting Trial..." : "Start Free Trial"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSkipPayment(false)}
              >
                Add Payment Method Now
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={onBack}
              >
                Back to Plans
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2>Payment Details</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Secure & encrypted</span>
              </div>
            </div>

            <form onSubmit={handleAddPaymentMethod} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Cardholder Name</label>
                <Input
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Doe"
                  disabled={loading}
                  className="bg-input-background"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Card Number</label>
                <div className="relative">
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    disabled={loading}
                    className="bg-input-background"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm mb-2">Expiry Date</label>
                  <Input
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    disabled={loading}
                    className="bg-input-background"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">CVC</label>
                  <Input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substr(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    disabled={loading}
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Billing ZIP Code</label>
                <Input
                  value={billingZip}
                  onChange={(e) => setBillingZip(e.target.value)}
                  placeholder="12345"
                  disabled={loading}
                  className="bg-input-background"
                />
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-sm text-amber-900">
                  Your card will not be charged during the 14-day trial period. 
                  You can cancel anytime before {trialEndDate.toLocaleDateString()}.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#14B8A6] hover:bg-[#14B8A6]/90"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Start Free Trial"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSkipPayment(true)}
                  disabled={loading}
                >
                  Skip for Now
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={onBack}
                  disabled={loading}
                >
                  Back to Plans
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Security Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/60">
            🔒 Payments secured by Stripe • PCI DSS compliant • Your data is encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
