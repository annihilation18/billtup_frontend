import { useState } from "react";
import { ArrowLeft, Lock, CreditCard as CreditCardIcon, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { BilltUpLogo } from "./BilltUpLogo";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner@2.0.3";
import { paymentApi } from "../utils/api";

// Initialize Stripe - use environment variable or placeholder for development
const stripePublishableKey = typeof import.meta !== 'undefined' && import.meta.env 
  ? (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder")
  : "pk_test_placeholder";

const stripePromise = loadStripe(stripePublishableKey);

interface PaymentScreenProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    total: number;
    customerName: string;
    customerEmail: string;
  };
  businessName: string;
  businessLogo?: string;
  onBack: () => void;
  onPaymentSuccess: (paymentDetails: {
    paymentMethod: string;
    totalCharge: number;
    date: string;
  }) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0F172A",
      fontFamily: "'Inter', sans-serif",
      "::placeholder": {
        color: "#94A3B8",
      },
    },
    invalid: {
      color: "#EF4444",
    },
  },
};

function PaymentForm({ invoice, businessName, businessLogo, onBack, onPaymentSuccess }: PaymentScreenProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [billingEmail, setBillingEmail] = useState(invoice.customerEmail);
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Calculate processing fee: 3.5% + $0.50
  // Platform fee: 0.6% + $0.20 (goes to BilltUp)
  // Stripe fee: 2.9% + $0.30 (goes to Stripe)
  // Total: 3.5% + $0.50
  const platformFeePercentage = 0.006; // 0.6%
  const platformFeeFlat = 0.20;
  const stripeFeePercentage = 0.029; // 2.9%
  const stripeFeeFlat = 0.30;
  const processingFeePercentage = 0.035; // 3.5%
  const processingFeeFlat = 0.50;
  
  const platformFee = (invoice.total * platformFeePercentage) + platformFeeFlat;
  const stripeFee = (invoice.total * stripeFeePercentage) + stripeFeeFlat;
  const processingFee = (invoice.total * processingFeePercentage) + processingFeeFlat;
  const totalCharge = invoice.total + processingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    if (!nameOnCard.trim()) {
      toast.error("Please enter the name on card");
      return;
    }

    if (!billingAddress.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      toast.error("Please fill in all billing address fields");
      return;
    }

    setLoading(true);

    try {
      // DEMO MODE: Simulate successful payment without actual Stripe processing
      // In production, this would use the real Stripe API with the backend
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get card element to validate it's filled
      const cardNumberElement = elements.getElement(CardNumberElement);
      
      if (!cardNumberElement) {
        throw new Error("Card element not found");
      }

      // Simulate successful payment
      toast.success("Payment successful!");
      onPaymentSuccess({
        paymentMethod: "4242", // Mock last 4 digits
        totalCharge: totalCharge,
        date: new Date().toISOString(),
      });

      /* PRODUCTION CODE - Uncomment when backend is deployed:
      
      // Create payment intent on the backend
      const { clientSecret, paymentIntentId } = await paymentApi.createPaymentIntent(
        invoice.id,
        totalCharge,
        invoice.customerEmail
      );

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: nameOnCard,
            email: billingEmail,
            address: {
              line1: billingAddress || undefined,
              city: city || undefined,
              postal_code: postalCode || undefined,
              country: country || undefined,
            },
          },
        },
      });

      if (error) {
        console.error("Payment error:", error);
        toast.error(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Update invoice status in the backend
        await paymentApi.updateInvoicePaymentStatus(invoice.id, paymentIntentId);
        
        toast.success("Payment successful!");
        onPaymentSuccess({
          paymentMethod: paymentIntent.payment_method?.card?.last4 || "4242",
          totalCharge: totalCharge,
          date: new Date().toISOString(),
        });
      }
      */
      
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#0D9488] flex flex-col">
      {/* Header */}
      <div className="p-6 text-white">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="mb-4">
            {businessLogo ? (
              <img src={businessLogo} alt={businessName} className="w-24 h-24 rounded-full" />
            ) : (
              <BilltUpLogo size={96} />
            )}
          </div>
          <p className="text-lg opacity-90">Payment for</p>
          <h1 className="text-3xl mb-6">{businessName}</h1>
        </div>

        {/* Invoice Info Card */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm opacity-90">Invoice</span>
            <span className="text-sm">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg opacity-90">Amount Due</span>
            <span className="text-3xl">${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="flex-1 bg-background p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          {/* Stripe Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-[#14B8A6]" />
            <span>Secure payment powered by Stripe</span>
          </div>

          {/* Card Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCardIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg">Card Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="mt-2 p-3 border border-input rounded-lg bg-input-background">
                  <CardNumberElement
                    id="cardNumber"
                    options={CARD_ELEMENT_OPTIONS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <div className="mt-2 p-3 border border-input rounded-lg bg-input-background">
                    <CardExpiryElement
                      id="cardExpiry"
                      options={CARD_ELEMENT_OPTIONS}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardCvc">CVC</Label>
                  <div className="mt-2 p-3 border border-input rounded-lg bg-input-background">
                    <CardCvcElement
                      id="cardCvc"
                      options={CARD_ELEMENT_OPTIONS}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Billing Information */}
          <Card className="p-6">
            <h2 className="text-lg mb-4">Billing Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  type="text"
                  placeholder="John Doe"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="billingEmail">Email</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="billingAddress">Address</Label>
                <Input
                  id="billingAddress"
                  type="text"
                  placeholder="123 Main St"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Payment Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Invoice Amount</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Processing Fee (3.5% + $0.50)</span>
              <span>${processingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Charge</span>
                <span className="font-medium">${totalCharge.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By clicking "Pay Now" you agree to the payment terms and authorize this charge.
          </p>

          {/* Pay Button */}
          <Button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6] hover:opacity-90 text-white py-6 rounded-2xl shadow-lg"
          >
            <Lock className="w-5 h-5 mr-2" />
            {loading ? "Processing..." : `Pay $${totalCharge.toFixed(2)}`}
          </Button>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#F59E0B]" />
              <span>Encrypted</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#F59E0B]" />
              <span>PCI Compliant</span>
            </div>
            <span>•</span>
            <span>Secure</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PaymentScreen(props: PaymentScreenProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}