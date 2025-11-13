import { Button } from "./ui/button";
import { BilltUpLogo } from "./BilltUpLogo";
import { FileText, CreditCard, Users, Shield } from "lucide-react";

interface SplashScreenProps {
  onGetStarted: () => void;
  businessLogo?: string;
  businessName?: string;
}

export function SplashScreen({ onGetStarted, businessLogo, businessName }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between bg-gradient-to-b from-[#0F172A] to-[#1E3A8A] text-white p-8">
      {/* Logo and Title Section */}
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        {businessLogo ? (
          <div className="w-24 h-24 mb-6 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#3B82F6] to-[#14B8A6]">
            <img src={businessLogo} alt={businessName || "Business Logo"} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="mb-6">
            <BilltUpLogo size={96} />
          </div>
        )}
        <h1 className="text-5xl mb-2">{businessName || "BilltUp"}</h1>
        <p className="text-xl text-gray-300">Invoice. Send. Get Paid.</p>
      </div>
      
      {/* Feature Cards Section */}
      <div className="w-full max-w-md space-y-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-medium">Create Invoices</h3>
            <p className="text-sm text-gray-300">Professional invoices in seconds</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-medium">Accept Payments</h3>
            <p className="text-sm text-gray-300">Secure card processing</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-medium">Manage Customers</h3>
            <p className="text-sm text-gray-300">Track all your clients</p>
          </div>
        </div>
      </div>

      {/* Get Started Button and Security Badge */}
      <div className="w-full max-w-md space-y-4">
        <Button 
          onClick={onGetStarted}
          className="w-full bg-white hover:bg-gray-100 text-primary py-6 rounded-2xl shadow-lg"
        >
          Get Started
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Secure • Encrypted • PCI Compliant</span>
        </div>
      </div>
    </div>
  );
}