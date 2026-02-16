import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { CheckCircle2, Send, Home } from "lucide-react@0.468.0";

export function ReceiptMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] flex flex-col items-center justify-center p-6">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-[#14B8A6] rounded-full flex items-center justify-center mb-6 animate-pulse">
        <CheckCircle2 className="w-14 h-14 text-white" />
      </div>

      {/* Success Message */}
      <h1 className="text-white text-3xl text-center mb-2">
        Payment Successful!
      </h1>
      <p className="text-white/70 text-center mb-8">
        Your payment has been processed securely
      </p>

      {/* Payment Details Card */}
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur-sm mb-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-muted-foreground">
              Amount Paid
            </span>
            <span className="text-2xl font-mono text-[#14B8A6]">
              $1,250.00
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Invoice Number
              </span>
              <span className="font-mono text-primary">
                INV-002
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Payment Method
              </span>
              <span className="font-medium">•••• 4242</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Date
              </span>
              <span className="font-medium">Nov 11, 2025</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <label className="text-sm mb-2 block">
              Send receipt to customer
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="customer@email.com"
                defaultValue="customer@email.com"
                className="bg-input-background flex-1"
              />
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Send className="w-4 h-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Return Button */}
      <Button
        variant="outline"
        className="w-full max-w-md bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Button>
    </div>
  );
}