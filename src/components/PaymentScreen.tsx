import { CreditCard, Wallet, CheckCircle2, Receipt } from "lucide-react";
import { paymentApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface PaymentScreenProps {
  invoiceData: InvoiceData;
  onBack: () => void;
  onPaymentSuccess: (paymentIntentId?: string) => void;
}

export function PaymentScreen({ invoiceData, onBack, onPaymentSuccess }: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<"nfc" | "card" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const handleNFCPayment = async () => {
    setIsProcessing(true);
    try {
      // Process NFC payment (simulated in backend)
      const result = await paymentApi.processNFC(
        invoiceData.total,
        `invoice_${Date.now()}`
      );
      
      if (result.success) {
        toast.success("Payment successful!");
        onPaymentSuccess();
      } else {
        toast.error("Payment failed");
      }
    } catch (error) {
      console.error("NFC payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast.error("Please fill in all card details");
      return;
    }
    
    // Validate card number format (simple check)
    if (cardNumber.replace(/\s/g, '').length < 13) {
      toast.error("Please enter a valid card number");
      return;
    }
    
    // Validate expiry format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast.error("Please enter expiry in MM/YY format");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Create payment intent with Stripe
      const { clientSecret, paymentIntentId } = await paymentApi.createIntent(
        invoiceData.total,
        `invoice_${Date.now()}`,
        invoiceData.customerEmail
      );
      
      console.log("Payment intent created:", paymentIntentId);
      
      // In a production app, you would use Stripe.js/Elements to:
      // 1. Create a payment method from the card details
      // 2. Confirm the payment intent with that payment method
      // For this prototype, we'll simulate the Stripe payment flow
      
      // Simulate Stripe payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      // In production, you would call: await paymentApi.confirmPayment(paymentMethodId, paymentIntentId)
      
      toast.success("Payment processed successfully!");
      
      // Small delay to show success message
      setTimeout(() => {
        onPaymentSuccess(paymentIntentId);
        setIsProcessing(false);
      }, 1000);
      
    } catch (error: any) {
      console.error("Card payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-primary-foreground hover:bg-primary/80">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl">Payment</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Invoice Summary */}
        <Card className="p-4">
          <h3 className="mb-3">Invoice Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span>{invoiceData.customer}</span>
            </div>
            {invoiceData.lineItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name} (×{item.quantity})</span>
                <span className="font-mono">${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            {invoiceData.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono">${invoiceData.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span>Total</span>
              <span className="font-mono">${invoiceData.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Method Selection */}
        {!paymentMethod && (
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <Button
              onClick={() => setPaymentMethod("nfc")}
              className="w-full h-auto py-6 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:from-[#0D9488] hover:to-[#14B8A6]"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6" />
                <div className="text-left">
                  <div>💳 Tap to Pay (NFC)</div>
                  <div className="text-xs opacity-90">Use contactless payment</div>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => setPaymentMethod("card")}
              variant="outline"
              className="w-full h-auto py-6"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                <div className="text-left">
                  <div>✍️ Enter Card Details</div>
                  <div className="text-xs opacity-70">Manual card entry</div>
                </div>
              </div>
            </Button>
          </div>
        )}

        {/* NFC Payment */}
        {paymentMethod === "nfc" && !isProcessing && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="mb-2">Ready for Payment</h3>
            <p className="text-muted-foreground mb-6">Ask customer to tap their card or phone</p>
            <Button
              onClick={handleNFCPayment}
              className="w-full bg-[#14B8A6] hover:bg-[#0D9488]"
            >
              Process Payment
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPaymentMethod(null)}
              className="w-full mt-2"
            >
              Choose Different Method
            </Button>
          </Card>
        )}

        {/* Card Payment Form */}
        {paymentMethod === "card" && !isProcessing && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Card Details</h3>
              <div className="flex gap-1">
                <div className="text-xl">💳</div>
              </div>
            </div>
            
            {/* Test Card Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm">
              <p className="text-amber-900 mb-1">🧪 Test Mode</p>
              <p className="text-xs text-amber-700">Use any card number (e.g., 4242 4242 4242 4242) for testing</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    // Format card number with spaces
                    const formatted = e.target.value
                      .replace(/\s/g, '')
                      .replace(/(\d{4})/g, '$1 ')
                      .trim();
                    setCardNumber(formatted);
                  }}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => {
                      // Auto-format with slash
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setExpiryDate(value);
                    }}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                <p className="mb-1">🔒 Secure Payment</p>
                <p className="text-xs text-blue-700">Your payment is processed securely via Stripe</p>
              </div>
              <Button
                onClick={handleCardPayment}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!cardNumber || !expiryDate || !cvv || !cardholderName}
              >
                Pay ${invoiceData.total.toFixed(2)}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPaymentMethod(null)}
                className="w-full"
              >
                Choose Different Method
              </Button>
            </div>
          </Card>
        )}

        {/* Processing */}
        {isProcessing && (
          <Card className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="mb-2">Processing Payment...</h3>
            <p className="text-muted-foreground">Please wait</p>
          </Card>
        )}
      </div>
    </div>
  );
}