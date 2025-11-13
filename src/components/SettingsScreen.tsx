import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Building2, 
  Bell, 
  Shield, 
  Palette, 
  Upload, 
  X, 
  Trash2, 
  User, 
  ChevronDown, 
  ChevronRight, 
  Crown, 
  ChevronsRight, 
  AlertTriangle, 
  Receipt, 
  Mail, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  Fingerprint, 
  LogOut, 
  FileText, 
  Users 
} from "lucide-react";
import { BusinessData } from "./OnboardingScreen";
import { signatureApi, businessApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { SignatureData } from "./SignatureManagementScreen";
import { formatPhoneNumber } from "../utils/formatters";
import { sessionManager } from "../utils/sessionManager";
import { CustomBrandingSection } from "./CustomBrandingSection";
import { DomainEmailSection } from "./DomainEmailSection";
import { CustomerAnalyticsSection } from "./CustomerAnalyticsSection";
import { StripeConnectSettings } from "./StripeConnectSettings";
import { BilltUpLogo } from "./BilltUpLogo";

interface SettingsScreenProps {
  businessData: BusinessData;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onUpdateBusinessData: (data: BusinessData) => void;
  customers?: any[];
  invoices?: any[];
  onShowSubscriptionPlans?: () => void;
}

export function SettingsScreen({ businessData, currentTab, onTabChange, onLogout, onUpdateBusinessData, customers, invoices, onShowSubscriptionPlans }: SettingsScreenProps) {
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [nfcEnabled, setNfcEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Accordion state - track which sections are expanded (can have multiple)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Business Profile Form State
  const [businessName, setBusinessName] = useState(businessData.businessName);
  const [email, setEmail] = useState(businessData.email);
  const [phone, setPhone] = useState(formatPhoneNumber(businessData.phone));
  const [address, setAddress] = useState(businessData.address);
  const [contactEmail, setContactEmail] = useState(businessData.contactEmail || "");
  const [logoPreview, setLogoPreview] = useState(businessData.logo || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tax Form State
  const [chargeTax, setChargeTax] = useState(businessData.chargeTax);
  const [taxRate, setTaxRate] = useState(businessData.defaultTaxRate);

  // Initialize biometric setting after component mounts
  useEffect(() => {
    try {
      // Load settings from businessData (database)
      setDarkMode(businessData.darkMode || false);
      setNotifications(businessData.notificationsEnabled !== false); // Default true
      setNfcEnabled(businessData.nfcEnabled !== false); // Default true
      setBiometricEnabled(businessData.biometricEnabled || false);
      
      // Apply dark mode if enabled
      if (businessData.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Sync biometric setting to localStorage for session manager
      sessionManager.setBiometricEnabled(businessData.biometricEnabled || false);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [businessData]);

  const toggleSection = (section: string) => {
    const currentSections = new Set(expandedSections);
    if (currentSections.has(section)) {
      currentSections.delete(section);
    } else {
      currentSections.add(section);
    }
    setExpandedSections(currentSections);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
  };

  const handleSaveBusinessProfile = async () => {
    if (!businessName || !email || !phone || !contactEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const updatedData: BusinessData = {
        ...businessData,
        businessName,
        email,
        phone,
        address,
        contactEmail,
        logo: logoPreview,
        darkMode,
        notificationsEnabled: notifications,
        nfcEnabled,
        biometricEnabled,
      };

      await businessApi.update(updatedData);
      onUpdateBusinessData(updatedData);
      setShowBusinessDialog(false);
      toast.success("Business profile updated successfully");
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast.error("Failed to update business profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTaxSettings = async () => {
    if (chargeTax && (!taxRate || parseFloat(taxRate) < 0)) {
      toast.error("Please enter a valid tax rate");
      return;
    }

    setIsSaving(true);
    try {
      const updatedData: BusinessData = {
        ...businessData,
        chargeTax,
        defaultTaxRate: taxRate,
      };

      await businessApi.update(updatedData);
      onUpdateBusinessData(updatedData);
      setShowTaxDialog(false);
      toast.success("Tax settings updated successfully");
    } catch (error) {
      console.error("Error updating tax settings:", error);
      toast.error("Failed to update tax settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDarkModeToggle = async (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to database
    try {
      const updatedData: BusinessData = {
        ...businessData,
        darkMode: checked,
      };
      await businessApi.update(updatedData);
      onUpdateBusinessData(updatedData);
      toast.success(checked ? "Dark mode enabled" : "Dark mode disabled");
    } catch (error) {
      console.error("Error saving dark mode setting:", error);
      toast.error("Failed to save setting");
    }
  };

  const handleNotificationsToggle = async (checked: boolean) => {
    setNotifications(checked);
    
    // Save to database
    try {
      const updatedData: BusinessData = {
        ...businessData,
        notificationsEnabled: checked,
      };
      await businessApi.update(updatedData);
      onUpdateBusinessData(updatedData);
      toast.success(checked ? "Notifications enabled" : "Notifications disabled");
    } catch (error) {
      console.error("Error saving notifications setting:", error);
      toast.error("Failed to save setting");
    }
  };

  const handleNFCToggle = async (checked: boolean) => {
    setNfcEnabled(checked);
    
    // Save to database
    try {
      const updatedData: BusinessData = {
        ...businessData,
        nfcEnabled: checked,
      };
      await businessApi.update(updatedData);
      onUpdateBusinessData(updatedData);
      toast.success(checked ? "NFC payments enabled" : "NFC payments disabled");
    } catch (error) {
      console.error("Error saving NFC setting:", error);
      toast.error("Failed to save setting");
    }
  };

  const handleBiometricToggle = async (checked: boolean) => {
    setBiometricEnabled(checked);
    sessionManager.setBiometricEnabled(checked);
    
    // Save to database
    try {
      const updatedData: BusinessData = {
        ...businessData,
        biometricEnabled: checked,
      };
      await businessApi.update(updatedData);
      onUpdateBusinessData(updatedData);
      toast.success(checked ? "Biometric authentication enabled" : "Biometric authentication disabled");
    } catch (error) {
      console.error("Error saving biometric setting:", error);
      toast.error("Failed to save setting");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {businessData.logo && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground">
              <img src={businessData.logo} alt={businessData.businessName || "Logo"} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl">Settings</h1>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Account Section - Collapsible */}
        <Card>
          <button
            onClick={() => toggleSection('account')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Account</div>
                <div className="text-sm text-muted-foreground">Subscription & account management</div>
              </div>
            </div>
            {expandedSections.has('account') ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('account') && (
            <div className="px-4 pb-4 space-y-3">
              {/* Manage Subscription Button */}
              <button
                onClick={() => onShowSubscriptionPlans?.()}
                className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Manage Subscription</div>
                    <div className="text-xs text-muted-foreground">View plans & billing</div>
                  </div>
                </div>
                <ChevronsRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Delete Account */}
              <div className="pt-2 border-t border-destructive/20">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div>
                      <div className="mb-2">
                        <div className="text-sm font-medium text-destructive flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Permanently delete your account and all associated data
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Account Permanently?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone and will permanently delete your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-3 py-2">
                      <p className="text-sm font-medium">This will:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Delete your account and all personal data</li>
                        <li>Remove all invoices, customers, and business information</li>
                        <li>Cancel your subscription immediately</li>
                        <li>Disconnect your Stripe account</li>
                      </ul>
                      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-4">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          <strong>Note:</strong> BilltUp will retain an anonymized copy of your data for record-keeping and compliance purposes. This data cannot be used to identify you and will only be accessible to BilltUp administrators.
                        </p>
                      </div>
                      <p className="text-sm font-medium pt-2">
                        You will be able to create a new account with the same email address after deletion.
                      </p>
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={async () => {
                          try {
                            toast.info("Deleting account...");
                            await businessApi.deleteAccount();
                            toast.success("Account deleted successfully");
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            onLogout();
                          } catch (error) {
                            console.error("Error deleting account:", error);
                            toast.error("Failed to delete account. Please try again or contact support.");
                          }
                        }}
                      >
                        Yes, Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </Card>

        {/* Business Profile Section - Collapsible */}
        <Card>
          <button
            onClick={() => toggleSection('business')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Business Profile</div>
                <div className="text-sm text-muted-foreground">{businessData.businessName || "Not set"}</div>
              </div>
            </div>
            {expandedSections.has('business') ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('business') && (
            <div className="px-4 pb-4 space-y-3">
              <div className="divide-y divide-border border border-border rounded-lg">
                <button 
                  className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => setShowBusinessDialog(true)}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-primary" />
                    <div className="text-left">
                      <div className="text-sm font-medium">{businessData.businessName || "Business Name"}</div>
                      <div className="text-xs text-muted-foreground">{businessData.email || "Not set"}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button 
                  className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => setShowTaxDialog(true)}
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-primary" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Tax Settings</div>
                      <div className="text-xs text-muted-foreground">
                        {businessData.chargeTax ? `Default: ${businessData.defaultTaxRate}%` : "Tax not charged"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Custom Branding */}
              <div className="border border-border rounded-lg">
                <button
                  onClick={() => toggleSection('branding')}
                  className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium flex items-center gap-2">
                        Custom Branding
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Premium</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Customize invoice appearance</div>
                    </div>
                  </div>
                  {expandedSections.has('branding') ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.has('branding') && (
                  <div className="px-3 pb-3 border-t border-border">
                    <CustomBrandingSection 
                      businessData={businessData} 
                      onUpdateBusinessData={onUpdateBusinessData}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Communication - Collapsible */}
        <Card>
          <button
            onClick={() => toggleSection('communication')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Communication</div>
                <div className="text-sm text-muted-foreground">Email configuration</div>
              </div>
            </div>
            {expandedSections.has('communication') ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('communication') && (
            <div className="px-4 pb-4">
              <div className="border border-border rounded-lg">
                <button
                  onClick={() => toggleSection('email')}
                  className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium flex items-center gap-2">
                        Domain Email
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Premium</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Send from custom domain</div>
                    </div>
                  </div>
                  {expandedSections.has('email') ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.has('email') && (
                  <div className="px-3 pb-3 border-t border-border">
                    <DomainEmailSection 
                      businessData={businessData} 
                      onUpdateBusinessData={onUpdateBusinessData}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Analytics - Collapsible */}
        <Card>
          <button
            onClick={() => toggleSection('analytics')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium flex items-center gap-2">
                  Customer Analytics
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Premium</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Lifetime value & insights</div>
              </div>
            </div>
            {expandedSections.has('analytics') ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('analytics') && (
            <div className="px-4 pb-4">
              <CustomerAnalyticsSection 
                customers={customers || []} 
                invoices={invoices || []}
              />
            </div>
          )}
        </Card>

        {/* Payment Section - Collapsible */}
        <Card>
          <button
            onClick={() => toggleSection('payment')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Payment Settings</div>
                <div className="text-sm text-muted-foreground">Stripe Connect & NFC</div>
              </div>
            </div>
            {expandedSections.has('payment') ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('payment') && (
            <div className="px-4 pb-4 space-y-4">
              {/* Stripe Connect */}
              <div>
                <StripeConnectSettings businessData={businessData} />
              </div>
              
              <div className="border border-border rounded-lg">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Enable NFC Payments</div>
                    <div className="text-xs text-muted-foreground">Tap to pay support</div>
                  </div>
                  <Switch checked={nfcEnabled} onCheckedChange={handleNFCToggle} />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Preferences Section - Collapsible */}
        <Card>
          <button
            onClick={() => toggleSection('preferences')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Preferences</div>
                <div className="text-sm text-muted-foreground">App settings & security</div>
              </div>
            </div>
            {expandedSections.has('preferences') ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('preferences') && (
            <div className="px-4 pb-4">
              <div className="divide-y divide-border border border-border rounded-lg">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium text-sm">Biometric Authentication</div>
                      <div className="text-xs text-muted-foreground">Fingerprint or face recognition</div>
                    </div>
                  </div>
                  <Switch checked={biometricEnabled} onCheckedChange={handleBiometricToggle} />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Dark Mode</div>
                    <div className="text-xs text-muted-foreground">Enable dark theme</div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Notifications</div>
                    <div className="text-xs text-muted-foreground">Payment alerts</div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={handleNotificationsToggle} />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Logout Button - Outside collapsible sections */}
      <div className="p-4 max-w-4xl mx-auto">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* App Info */}
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center py-4 space-y-2">
          <div className="inline-flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1E3A8A]/10 to-[#14B8A6]/10 rounded-xl border border-[#1E3A8A]/20">
            <BilltUpLogo size={32} />
            <div className="text-left">
              <p className="font-medium text-[#1E3A8A]">BilltUp</p>
              <p className="text-xs text-muted-foreground">Professional Invoicing</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2025 BilltUp. All rights reserved.</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-around p-2">
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "invoices" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("invoices")}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Invoices</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "customers" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("customers")}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Customers</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "settings" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("settings")}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
        <div className="text-center pb-1">
          <p className="text-[10px] text-muted-foreground">BilltUp v1.0</p>
        </div>
      </div>

      {/* Business Profile Dialog */}
      <Dialog open={showBusinessDialog} onOpenChange={setShowBusinessDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Business Profile</DialogTitle>
            <DialogDescription>
              Update your business information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Business Logo</Label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                    <button
                      onClick={() => setLogoPreview("")}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter business name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="business@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State 12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@example.com"
              />
              <p className="text-xs text-muted-foreground">
                This email will appear in the "Contact At" section on invoices and emails
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBusinessDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBusinessProfile} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tax Settings Dialog */}
      <Dialog open={showTaxDialog} onOpenChange={setShowTaxDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tax Settings</DialogTitle>
            <DialogDescription>
              Configure how tax is applied to invoices
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="chargeTax" className="text-base cursor-pointer">
                  Charge Tax on Invoices
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable this if your business charges sales tax
                </p>
              </div>
              <Switch
                id="chargeTax"
                checked={chargeTax}
                onCheckedChange={setChargeTax}
              />
            </div>

            {chargeTax && (
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="8.5"
                />
                <p className="text-xs text-muted-foreground">
                  This will be automatically applied to all new invoices
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaxDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTaxSettings} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}