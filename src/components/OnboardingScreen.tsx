import { useState, useRef } from "react";
import { Upload, Building2, X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { businessApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { formatPhoneNumber } from "../utils/formatters";

// Comprehensive list of industries
const INDUSTRIES = [
  "Accounting & Tax Services",
  "Advertising & Marketing",
  "Aerospace & Defense",
  "Agriculture & Farming",
  "Architecture & Design",
  "Art & Crafts",
  "Auto Detailing & Car Wash",
  "Automotive Repair & Maintenance",
  "Bakery & Pastry",
  "Banking & Financial Services",
  "Barber & Hair Salon",
  "Beauty & Cosmetics",
  "Building & Construction",
  "Business Consulting",
  "Catering & Food Services",
  "Childcare & Daycare",
  "Cleaning Services",
  "Clothing & Fashion",
  "Computer Repair & IT Services",
  "Consulting Services",
  "Counseling & Therapy",
  "Dance & Fitness Studio",
  "Dental Services",
  "E-commerce & Online Retail",
  "Education & Training",
  "Electrical Services",
  "Engineering Services",
  "Entertainment & Events",
  "Environmental Services",
  "Event Planning",
  "Fitness & Personal Training",
  "Florist & Plant Services",
  "Food & Beverage",
  "Freight & Logistics",
  "Funeral Services",
  "Graphic Design",
  "Healthcare & Medical",
  "Home Improvement & Remodeling",
  "Hotel & Hospitality",
  "HVAC Services",
  "Insurance Services",
  "Interior Design",
  "Janitorial Services",
  "Jewelry & Accessories",
  "Landscaping & Lawn Care",
  "Legal Services",
  "Manufacturing",
  "Massage & Spa",
  "Mobile App Development",
  "Moving & Storage",
  "Music & Audio Production",
  "Nonprofit & Charity",
  "Painting & Decorating",
  "Pest Control",
  "Pet Care & Grooming",
  "Photography & Videography",
  "Plumbing Services",
  "Printing & Publishing",
  "Property Management",
  "Real Estate",
  "Restaurant & Cafe",
  "Retail & Sales",
  "Roofing Services",
  "Security Services",
  "Software Development",
  "Tailoring & Alterations",
  "Telecommunications",
  "Translation Services",
  "Transportation & Delivery",
  "Travel & Tourism",
  "Tutoring & Education",
  "Veterinary Services",
  "Web Design & Development",
  "Wedding Services",
  "Welding & Metalwork",
  "Writing & Editing",
  "Other",
].sort();

interface OnboardingScreenProps {
  onComplete: (businessData: BusinessData) => void;
}

export interface BusinessData {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  chargeTax?: boolean;
  defaultTaxRate: string;
  logo?: string;
  customLogo?: string; // Custom uploaded logo (premium feature)
  contactEmail?: string; // Email for "Contact At" section on invoices
  brandColor?: string; // Primary brand color (premium feature)
  accentColor?: string; // Secondary/accent color (premium feature)
  invoiceTemplate?: string; // Invoice template selection (premium feature)
  // User Preferences
  darkMode?: boolean; // Dark mode preference
  notificationsEnabled?: boolean; // Push notifications enabled
  nfcEnabled?: boolean; // NFC payments enabled
  biometricEnabled?: boolean; // Biometric authentication enabled
  // Subscription Status (cached for efficient loading)
  subscriptionStatus?: {
    planType?: 'trial' | 'basic' | 'premium';
    isTrial?: boolean;
    isTrialExpired?: boolean;
    trialEndsAt?: string;
  };
  // Bank details removed for PCI compliance - use Stripe Connect instead
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
  });
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [industryOpen, setIndustryOpen] = useState(false);

  const totalSteps = 3; // Reduced from 4 - removed bank details step
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

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setBusinessData({ ...businessData, phone: formatted });
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
          toast.success("Logo uploaded successfully!");
        } catch (error) {
          console.error("Error uploading logo:", error);
          toast.error("Failed to upload logo, but continuing setup");
        }
      }
      
      // Complete onboarding
      toast.info("Completing setup...");
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
                <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={industryOpen}
                      className="w-full justify-between"
                    >
                      {businessData.industry || "Select industry..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search industries..." />
                      <CommandList>
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup>
                          {INDUSTRIES.map((industry) => (
                            <CommandItem
                              key={industry}
                              value={industry}
                              onSelect={(currentValue) => {
                                setBusinessData({ ...businessData, industry: currentValue });
                                setIndustryOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  businessData.industry === industry ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {industry}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                  onChange={(e) => handlePhoneChange(e.target.value)}
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