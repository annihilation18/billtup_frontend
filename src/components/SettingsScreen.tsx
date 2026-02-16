import React, { useState, useRef } from "react";
import { BilltUpLogo } from "./BilltUpLogo";
import { businessApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Building2, Receipt, CreditCard, ChevronRight, FileText, Users, Settings, Upload, X, Mail } from "lucide-react";
import { API_CONFIG } from "../utils/config";

interface SettingsScreenProps {
  businessData: BusinessData;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onUpdateBusinessData: (data: BusinessData) => void;
}

export function SettingsScreen({ businessData, currentTab, onTabChange, onLogout, onUpdateBusinessData }: SettingsScreenProps) {
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [nfcEnabled, setNfcEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Business Profile Form State
  const [businessName, setBusinessName] = useState(businessData.businessName);
  const [email, setEmail] = useState(businessData.email);
  const [phone, setPhone] = useState(businessData.phone);
  const [address, setAddress] = useState(businessData.address);
  const [logoPreview, setLogoPreview] = useState(businessData.logo || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tax Form State
  const [chargeTax, setChargeTax] = useState(businessData.chargeTax);
  const [taxRate, setTaxRate] = useState(businessData.defaultTaxRate);

  // Bank Form State
  const [bankName, setBankName] = useState(businessData.bankName);
  const [accountHolder, setAccountHolder] = useState(businessData.accountHolderName);
  const [accountNumber, setAccountNumber] = useState(businessData.accountNumber);
  const [routingNumber, setRoutingNumber] = useState(businessData.routingNumber);

  // Email Configuration State
  const [emailHost, setEmailHost] = useState("");
  const [emailPort, setEmailPort] = useState("587");
  const [emailUser, setEmailUser] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

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

  const handleSaveBusinessProfile = async () => {
    if (!businessName || !email || !phone || !address) {
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
        logo: logoPreview,
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

  const handleSaveBankAccount = async () => {
    if (!bankName || !accountHolder || !accountNumber || !routingNumber) {
      toast.error("Please fill in all bank details");
      return;
    }

    if (routingNumber.length !== 9) {
      toast.error("Routing number must be 9 digits");
      return;
    }

    setIsSaving(true);
    try {
      const updatedData: BusinessData = {
        ...businessData,
        bankName,
        accountHolderName: accountHolder,
        accountNumber,
        routingNumber,
      };

      await businessApi.update(updatedData);
      onUpdateBusinessData(updatedData);
      setShowBankDialog(false);
      toast.success("Bank account updated successfully");
    } catch (error) {
      console.error("Error updating bank account:", error);
      toast.error("Failed to update bank account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmailConfig = async () => {
    if (!emailHost || !emailPort || !emailUser || !emailPassword) {
      toast.error("Please fill in all email configuration fields");
      return;
    }

    setIsSaving(true);
    try {
      const { getIdToken } = await import("../utils/auth/cognito");
      const token = await getIdToken();
      const response = await fetch(`${API_CONFIG.baseUrl}/email-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          emailHost,
          emailPort,
          emailUser,
          emailPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check for specific error types
        if (data.error && data.error.includes("Invalid login")) {
          toast.error("Invalid credentials. For Gmail, make sure you're using an App Password, not your regular password.", {
            duration: 8000,
          });
        } else if (data.error && data.error.includes("Management API error")) {
          toast.error("Email validated successfully, but couldn't save configuration. Please try again.", {
            duration: 10000,
          });
        } else {
          toast.error(data.error || "Failed to validate email configuration", {
            duration: 6000,
          });
        }
        console.error("Email configuration error:", data.error);
        return;
      }

      setShowEmailDialog(false);
      
      // Show success with instructions
      toast.success("✅ Email configuration saved successfully!", {
        duration: 8000,
      });
      
      toast.info(
        "Email settings are now active! Your invoices will be sent using these credentials.",
        { duration: 8000 }
      );
      
      // Clear sensitive fields after successful save
      setEmailPassword("");
      setEmailHost("");
      setEmailPort("587");
      setEmailUser("");
    } catch (error) {
      console.error("Error saving email config:", error);
      toast.error("Failed to save email configuration. Please check your settings and try again.", {
        duration: 6000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      toast.success("Dark mode enabled");
    } else {
      document.documentElement.classList.remove('dark');
      toast.success("Dark mode disabled");
    }
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    toast.success(checked ? "Notifications enabled" : "Notifications disabled");
  };

  const handleNFCToggle = (checked: boolean) => {
    setNfcEnabled(checked);
    toast.success(checked ? "NFC payments enabled" : "NFC payments disabled");
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
        {/* Business Profile Section */}
        <div>
          <h3 className="mb-3 px-2">Business Profile</h3>
          <Card className="divide-y divide-border">
            <button 
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => setShowBusinessDialog(true)}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{businessData.businessName || "Business Name"}</div>
                  <div className="text-sm text-muted-foreground">{businessData.email || "Not set"}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => setShowTaxDialog(true)}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Tax Settings</div>
                  <div className="text-sm text-muted-foreground">
                    {businessData.chargeTax ? `Default: ${businessData.defaultTaxRate}%` : "Tax not charged"}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        {/* Payment Section */}
        <div>
          <h3 className="mb-3 px-2">Payment</h3>
          <Card className="divide-y divide-border">
            <button 
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => setShowBankDialog(true)}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Bank Account</div>
                  <div className="text-sm text-muted-foreground">
                    {businessData.bankName ? `${businessData.bankName} - ${businessData.accountHolderName}` : "Not configured"}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">Enable NFC Payments</div>
                  <div className="text-sm text-muted-foreground">Tap to pay support</div>
                </div>
              </div>
              <Switch checked={nfcEnabled} onCheckedChange={handleNFCToggle} />
            </div>
          </Card>
        </div>

        {/* Preferences Section */}
        <div>
          <h3 className="mb-3 px-2">Preferences</h3>
          <Card className="divide-y divide-border">
            <button 
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => setShowEmailDialog(true)}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Email Configuration</div>
                  <div className="text-sm text-muted-foreground">Configure email server settings</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">Enable dark theme</div>
              </div>
              <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-muted-foreground">Payment alerts</div>
              </div>
              <Switch checked={notifications} onCheckedChange={handleNotificationsToggle} />
            </div>
          </Card>
        </div>

        {/* Logout Section */}
        <div>
          <Card className="p-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={onLogout}
            >
              Logout
            </Button>
          </Card>
        </div>

        {/* App Info */}
        <div className="text-center py-4 space-y-2">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1E3A8A]/10 to-[#14B8A6]/10 rounded-xl border border-[#1E3A8A]/20">
            <div className="text-2xl">🧾</div>
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
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State 12345"
              />
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

      {/* Bank Account Dialog */}
      <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Account Details</DialogTitle>
            <DialogDescription>
              Optional: Add your bank details to display on invoices for direct transfers
            </DialogDescription>
          </DialogHeader>

          {/* Information Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">ℹ</span>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Note: This is NOT for Stripe integration
                </p>
                <p className="text-blue-800 text-xs leading-relaxed">
                  These details are optional and only displayed on your invoices for customers who prefer wire/ACH transfers. 
                  To receive Stripe payments, configure payouts in your Stripe Dashboard.
                </p>
                <a 
                  href="/STRIPE_SETUP_GUIDE.md" 
                  target="_blank"
                  className="text-blue-600 hover:text-blue-700 underline text-xs mt-1 inline-block"
                >
                  View Stripe Setup Guide →
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g., Chase, Bank of America"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder Name *</Label>
              <Input
                id="accountHolder"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Full name on account"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                type="password"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number *</Label>
              <Input
                id="routingNumber"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="9-digit routing number"
                maxLength={9}
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
              💡 Your bank details are encrypted and securely stored. Payments will be deposited directly to this account.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBankDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBankAccount} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Configuration Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Configuration</DialogTitle>
            <DialogDescription>
              Set up your email server for sending invoices
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Gmail Instructions Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-blue-900 text-sm">Using Gmail?</p>
                  <p className="text-xs text-blue-800">
                    Gmail requires an <strong>App Password</strong> instead of your regular password. Follow these steps:
                  </p>
                  <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                    <li>Enable 2-Factor Authentication on your Google Account</li>
                    <li>Go to Google Account → Security → 2-Step Verification</li>
                    <li>Scroll to "App passwords" and click it</li>
                    <li>Generate a new app password for "Mail"</li>
                    <li>Use that 16-character password below</li>
                  </ol>
                  <a 
                    href="https://support.google.com/accounts/answer/185833" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 underline mt-2"
                  >
                    View Google's App Password Guide →
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailHost">Email Host (SMTP Server) *</Label>
              <Input
                id="emailHost"
                value={emailHost}
                onChange={(e) => setEmailHost(e.target.value)}
                placeholder="smtp.gmail.com"
              />
              <p className="text-xs text-muted-foreground">
                Gmail: smtp.gmail.com | Outlook: smtp-mail.outlook.com
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailPort">Email Port *</Label>
              <Input
                id="emailPort"
                value={emailPort}
                onChange={(e) => setEmailPort(e.target.value)}
                placeholder="587"
              />
              <p className="text-xs text-muted-foreground">
                Use 587 for TLS or 465 for SSL
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailUser">Email Address *</Label>
              <Input
                id="emailUser"
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
                placeholder="your-email@gmail.com"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailPassword">Password *</Label>
              <Input
                id="emailPassword"
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="App password (16 characters for Gmail)"
              />
              <p className="text-xs text-amber-600 font-medium">
                ⚠️ For Gmail: Use App Password, NOT your regular password
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground space-y-1">
              <p>🔒 Your credentials will be validated and stored securely.</p>
              <p>After saving, email sending will use these credentials immediately!</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmailConfig} disabled={isSaving}>
              {isSaving ? "Validating..." : "Test & Validate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}