import { Shield } from "lucide-react";

export function SecurityBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
      <Shield className="w-4 h-4 flex-shrink-0" />
      <div>
        <span className="font-medium">Secure & PCI Compliant</span>
        <span className="hidden sm:inline"> • All data encrypted</span>
      </div>
    </div>
  );
}

export function SecurityInfo() {
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <div className="flex items-start gap-2">
        <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
        <p>
          <strong className="text-foreground">Bank-level encryption and PCI compliance</strong> ensure your data and payments are always protected.
        </p>
      </div>
      <ul className="ml-6 space-y-1 text-xs list-disc">
        <li>All data is encrypted in transit and at rest</li>
        <li>We use bank-level security measures and are PCI compliant</li>
        <li>Your customers' payment information is processed through Stripe and never stored on our servers</li>
        <li>Advanced DDoS protection and rate limiting prevent abuse and protect your account</li>
        <li>Automatic IP blocking for suspicious activity with temporary bans</li>
      </ul>
    </div>
  );
}
