import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CheckCircle2, Send, Home } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ReceiptScreenProps {
  onSendReceipt: (email: string) => Promise<void>;
  onReturnToDashboard: () => void;
  total: number;
  customerEmail?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  date?: string;
}

export function ReceiptScreen({ 
  onSendReceipt, 
  onReturnToDashboard, 
  total, 
  customerEmail,
  invoiceNumber,
  paymentMethod,
  date 
}: ReceiptScreenProps) {
  const [email, setEmail] = useState(customerEmail || "");
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
      toast.success("Receipt sent successfully!");
    } catch (error) {
      // Error already handled in parent component
    } finally {
      setIsSending(false);
    }
  };

  const displayDate = date || new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1e4a8a] to-[#0F172A] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon with animated rings */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#14B8A6] rounded-full opacity-20 animate-ping"></div>
            <div className="relative w-32 h-32 rounded-full bg-[#14B8A6] bg-opacity-40 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#14B8A6] bg-opacity-60 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-white text-4xl">Payment Successful!</h1>
          <p className="text-white/70 text-lg">
            Your payment has been processed securely
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-2xl p-6 space-y-6 text-left shadow-xl">
          {/* Amount Paid */}
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="text-[#14B8A6] text-3xl">${total.toFixed(2)}</span>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {invoiceNumber && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-medium">{invoiceNumber}</span>
              </div>
            )}
            
            {paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">•••• {paymentMethod}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{displayDate}</span>
            </div>
          </div>

          {/* Send Receipt Section */}
          <div className="pt-4 border-t border-border space-y-3">
            <label className="text-sm block text-foreground">Send receipt to customer</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="customer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-6"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Return to Dashboard Button */}
        <Button
          onClick={onReturnToDashboard}
          variant="outline"
          className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white py-6 rounded-xl"
        >
          <Home className="w-5 h-5 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
