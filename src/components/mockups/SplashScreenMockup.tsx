import { Button } from "../ui/button";
import { FileText, CreditCard, Users, Shield } from "lucide-react";

export function SplashScreenMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] flex flex-col items-center justify-between p-6 text-white">
      {/* Logo and Title */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-6 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-3xl flex items-center justify-center shadow-2xl">
          <FileText className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-5xl mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>BilltUp</h1>
        <p className="text-xl text-white/80 mb-12">Invoice. Send. Get Paid.</p>

        {/* Features */}
        <div className="space-y-4 w-full max-w-sm">
          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-10 h-10 bg-[#14B8A6] rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Create Invoices</p>
              <p className="text-sm text-white/70">Professional invoices in seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-10 h-10 bg-[#14B8A6] rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Accept Payments</p>
              <p className="text-sm text-white/70">Secure card processing</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-10 h-10 bg-[#14B8A6] rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Manage Customers</p>
              <p className="text-sm text-white/70">Track all your clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-sm space-y-4">
        <Button className="w-full bg-white text-[#1E3A8A] hover:bg-white/90 h-12">
          Get Started
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-white/60">
          <Shield className="w-4 h-4" />
          <p className="text-xs">Secure • Encrypted • PCI Compliant</p>
        </div>
      </div>
    </div>
  );
}
