import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Lock, CreditCard } from "lucide-react@0.468.0";

export function PaymentScreenMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col">
      {/* Top Header */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white p-6 shadow-lg">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-3 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold">B</span>
          </div>
          <p className="text-sm opacity-90">Payment for</p>
          <h1 className="text-2xl font-bold mb-1">
            My Design Business
          </h1>
        </div>

        <Card className="bg-white/10 backdrop-blur border-white/20 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-90">Invoice</span>
            <span className="font-mono">INV-003</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">
              Amount Due
            </span>
            <span className="text-3xl font-mono font-bold">
              $2,500.00
            </span>
          </div>
        </Card>
      </div>

      {/* Payment Form */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4 text-[#14B8A6]" />
          <span>Secure payment powered by Stripe</span>
        </div>

        {/* Card Information */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="font-medium">Card Information</h2>
          </div>

          <div>
            <label className="text-sm mb-1.5 block">
              Card Number
            </label>
            <div className="relative">
              <Input
                placeholder="1234 5678 9012 3456"
                className="bg-input-background pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-1.5 block">
                Expiry Date
              </label>
              <Input
                placeholder="MM / YY"
                className="bg-input-background"
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block">
                CVC
              </label>
              <Input
                placeholder="123"
                className="bg-input-background"
              />
            </div>
          </div>
        </Card>

        {/* Billing Information */}
        <Card className="p-4 space-y-4">
          <h2 className="font-medium">Billing Information</h2>

          <div>
            <label className="text-sm mb-1.5 block">
              Name on Card
            </label>
            <Input
              placeholder="John Smith"
              className="bg-input-background"
            />
          </div>

          <div>
            <label className="text-sm mb-1.5 block">
              Email
            </label>
            <Input
              type="email"
              placeholder="john@acmecorp.com"
              className="bg-input-background"
            />
          </div>

          <div>
            <label className="text-sm mb-1.5 block">
              Billing ZIP Code
            </label>
            <Input
              placeholder="12345"
              className="bg-input-background"
            />
          </div>
        </Card>

        {/* Fee Information */}
        <Card className="p-4 bg-muted/50">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Invoice Amount
              </span>
              <span className="font-mono">$2,500.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Processing Fee (3.5% + $0.50)
              </span>
              <span className="font-mono">$88.00</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-medium">Total Charge</span>
              <span className="font-mono font-bold text-primary">
                $2,588.00
              </span>
            </div>
          </div>
        </Card>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground px-4">
          By clicking "Pay Now" you agree to the payment terms
          and authorize this charge.
        </p>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-card border-t border-border space-y-2">
        <Button className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6] hover:opacity-90 h-12">
          <Lock className="w-4 h-4 mr-2" />
          Pay $2,588.00
        </Button>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>🔒 Encrypted</span>
          <span>•</span>
          <span>PCI Compliant</span>
          <span>•</span>
          <span>Secure</span>
        </div>
      </div>
    </div>
  );
}