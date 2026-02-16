import { Button } from "../ui/button";
import {
  FileText,
  CreditCard,
  Users,
  Shield,
} from "lucide-react@0.468.0";
import { BilltUpLogo } from "../BilltUpLogo";

export function SplashScreenMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-gradient-to-b from-[#1a2744] via-[#1e3a5f] to-[#1a2744] flex flex-col items-center justify-between p-8 text-white">
      {/* Logo and Title */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          <BilltUpLogo size={96} />
        </div>

        <h1
          className="text-5xl mb-3 text-white"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}
        >
          BilltUp
        </h1>
        <p className="text-lg text-white/70 mb-16">
          Invoice. Send. Get Paid.
        </p>

        {/* Features */}
        <div className="space-y-3 w-full max-w-sm">
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-[#14B8A6] rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white mb-0.5" style={{ fontFamily: "var(--font-poppins)" }}>
                Create Invoices
              </p>
              <p className="text-sm text-white/60">
                Professional invoices in seconds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-[#14B8A6] rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white mb-0.5" style={{ fontFamily: "var(--font-poppins)" }}>
                Accept Payments
              </p>
              <p className="text-sm text-white/60">
                Secure card processing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-[#14B8A6] rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white mb-0.5" style={{ fontFamily: "var(--font-poppins)" }}>
                Manage Customers
              </p>
              <p className="text-sm text-white/60">
                Track all your clients
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-sm space-y-4 pb-4">
        <Button className="w-full bg-white text-[#1E3A8A] hover:bg-white/90 h-14 text-base rounded-2xl" style={{ fontFamily: "var(--font-poppins)", fontWeight: 500 }}>
          Get Started
        </Button>

        <div className="flex items-center justify-center gap-2 text-white/50">
          <Shield className="w-4 h-4" />
          <p className="text-xs">
            Secure • Encrypted • PCI Compliant
          </p>
        </div>
      </div>
    </div>
  );
}