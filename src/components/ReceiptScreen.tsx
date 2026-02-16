import { Input } from "./ui/input";
import { CheckCircle, Send, Home, Mail } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ReceiptScreenProps {
  onSendReceipt: (email: string) => Promise<void>;
  onReturnToDashboard: () => void;
  total: number;
  customerEmail?: string;
}

export function ReceiptScreen({ onSendReceipt, onReturnToDashboard, total, customerEmail }: ReceiptScreenProps) {
  const [email, setEmail] = useState(customerEmail || "");
  const [emailSent, setEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    try {
      await onSendReceipt(email);
      setEmailSent(true);
    } catch (error) {
      // Error already handled in parent component
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-[#14B8A6]/10 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-[#14B8A6]" />
          </div>
        </div>

        {/* Success Message */}
        <div>
          <h1 className="text-3xl mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Payment of <span className="font-mono">${total.toFixed(2)}</span> received
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono">TXN-{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span>Amount Paid</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Email Invoice Section */}
        {!emailSent ? (
          <div className="bg-card rounded-xl p-6 border border-border text-left space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Mail className="w-5 h-5" />
              <h3>Email Invoice to Customer</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Send a professional PDF invoice with payment confirmation
            </p>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSendEmail}
              className="w-full bg-[#14B8A6] hover:bg-[#0D9488]"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invoice via Email
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-[#14B8A6]/10 rounded-xl p-6 border border-[#14B8A6]/20">
            <div className="flex items-center justify-center gap-2 text-[#14B8A6] mb-2">
              <CheckCircle className="w-5 h-5" />
              <p>Invoice Sent!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Invoice has been emailed to <span className="font-mono">{email}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={onReturnToDashboard}
            variant={emailSent ? "default" : "outline"}
            className={emailSent ? "w-full bg-primary hover:bg-primary/90" : "w-full"}
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>

        {/* Success Animation */}
        <div className="text-4xl animate-bounce">✨</div>
      </div>
    </div>
  );
}