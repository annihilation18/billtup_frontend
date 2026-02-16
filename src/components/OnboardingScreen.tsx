import { useState, useRef } from "react";
import { Upload, Building2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { businessApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface OnboardingScreenProps {
  onComplete: (businessData: BusinessData) => void;
}

export interface BusinessData {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  chargeTax: boolean;
  defaultTaxRate: string;
  logo?: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    industry: "",
    chargeTax: true,
    defaultTaxRate: "8.5",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setBusinessData({ ...businessData, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview("");
    setBusinessData({ ...businessData, logo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Upload logo if exists, then complete onboarding
      let finalBusinessData = { ...businessData };
      
      if (businessData.logo) {
        try {
          toast.info("Uploading logo...");
          const result = await businessApi.uploadLogo(businessData.logo, "logo.png");
          finalBusinessData.logo = result.logoUrl;
        } catch (error) {
          console.error("Error uploading logo:", error);
          toast.error("Failed to upload logo, but continuing setup");
        }
      }
      
      onComplete(finalBusinessData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl">Business Setup</h2>
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg border border-border">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {logoPreview ? (
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                      <img src={logoPreview} alt="Business Logo" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 cursor-pointer hover:bg-muted/80 transition-colors border-2 border-dashed border-muted-foreground/30"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {logoPreview ? "Click X to remove logo" : "Upload Business Logo"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Enter business name"
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry Type</Label>
                <Select value={businessData.industry} onValueChange={(value) => setBusinessData({ ...businessData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto-detailing">Auto Detailing</SelectItem>
                    <SelectItem value="remodeling">Remodeling</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  value={businessData.email}
                  onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={businessData.phone}
                  onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State 12345"
                  value={businessData.address}
                  onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h3>Bank Account Details</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="e.g., Chase, Bank of America"
                  value={businessData.bankName}
                  onChange={(e) => setBusinessData({ ...businessData, bankName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  placeholder="Full name on account"
                  value={businessData.accountHolderName}
                  onChange={(e) => setBusinessData({ ...businessData, accountHolderName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="password"
                  placeholder="Enter account number"
                  value={businessData.accountNumber}
                  onChange={(e) => setBusinessData({ ...businessData, accountNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="9-digit routing number"
                  maxLength={9}
                  value={businessData.routingNumber}
                  onChange={(e) => setBusinessData({ ...businessData, routingNumber: e.target.value })}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                <p>💡 Your bank details are encrypted and securely stored. Payments will be deposited directly to this account.</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="chargeTax" className="text-base cursor-pointer">
                      Charge Tax on Invoices
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enable this if your business charges sales tax
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="chargeTax"
                      type="checkbox"
                      checked={businessData.chargeTax}
                      onChange={(e) => setBusinessData({ ...businessData, chargeTax: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E3A8A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A8A]"></div>
                  </label>
                </div>

                {businessData.chargeTax && (
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="8.5"
                      value={businessData.defaultTaxRate}
                      onChange={(e) => setBusinessData({ ...businessData, defaultTaxRate: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be automatically applied to all invoices
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="mb-3">Review Your Information</h3>
                <div className="space-y-2 text-sm">
                  {logoPreview && (
                    <div className="flex items-center gap-2 mb-3">
                      <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                      <span className="text-muted-foreground">Logo uploaded ✓</span>
                    </div>
                  )}
                  <p><span className="text-muted-foreground">Business:</span> {businessData.businessName || "Not set"}</p>
                  <p><span className="text-muted-foreground">Industry:</span> {businessData.industry || "Not set"}</p>
                  <p><span className="text-muted-foreground">Email:</span> {businessData.email || "Not set"}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {businessData.phone || "Not set"}</p>
                  <p><span className="text-muted-foreground">Bank:</span> {businessData.bankName || "Not set"}</p>
                  <p><span className="text-muted-foreground">Account Holder:</span> {businessData.accountHolderName || "Not set"}</p>
                  <p><span className="text-muted-foreground">Tax:</span> {businessData.chargeTax ? `${businessData.defaultTaxRate}%` : "Not charged"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90">
              {step === totalSteps ? "Complete Setup" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}