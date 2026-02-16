import { Button } from "./ui/button";
import { BilltUpLogo } from "./BilltUpLogo";

interface SplashScreenProps {
  onGetStarted: () => void;
  businessLogo?: string;
  businessName?: string;
}

export function SplashScreen({ onGetStarted, businessLogo, businessName }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0F172A] to-[#1E3A8A] text-white p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        {businessLogo ? (
          <div className="w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full overflow-hidden border-4 border-[#14B8A6] shadow-2xl">
            <img src={businessLogo} alt={businessName || "Business Logo"} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="mb-4">
            <BilltUpLogo size={120} />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl mb-3">{businessName || "BilltUp"}</h1>
        <p className="text-lg md:text-xl text-gray-300">Professional Invoicing Made Simple</p>
      </div>
      
      <Button 
        onClick={onGetStarted}
        className="w-full max-w-md bg-[#14B8A6] hover:bg-[#0D9488] text-white py-6 rounded-xl shadow-lg"
      >
        Get Started
      </Button>
    </div>
  );
}