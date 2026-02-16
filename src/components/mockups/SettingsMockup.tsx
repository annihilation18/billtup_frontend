import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  User,
  Building2,
  CreditCard,
  Bell,
  Shield,
} from "lucide-react@0.468.0";
import { BilltUpLogo } from "../BilltUpLogo";

export function SettingsMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <BilltUpLogo size={40} />
          <h1 className="text-2xl">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 pb-20">
        {/* Account Section */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-2 px-1">
            Account
          </h2>
          <Card className="divide-y divide-border">
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <div className="p-2 bg-[#1E3A8A]/10 rounded-lg">
                <User className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Profile</p>
                <p className="text-sm text-muted-foreground">
                  john@business.com
                </p>
              </div>
            </button>
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <div className="p-2 bg-[#14B8A6]/10 rounded-lg">
                <Shield className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Security</p>
                <p className="text-sm text-muted-foreground">
                  Password & authentication
                </p>
              </div>
            </button>
          </Card>
        </div>

        {/* Business Section */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-2 px-1">
            Business
          </h2>
          <Card className="divide-y divide-border">
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <div className="p-2 bg-[#1E3A8A]/10 rounded-lg">
                <Building2 className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Business Profile</p>
                <p className="text-sm text-muted-foreground">
                  Name, logo, address
                </p>
              </div>
            </button>
          </Card>
        </div>

        {/* Business Profile Preview */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <BilltUpLogo size={64} />
            <div className="flex-1">
              <p className="font-medium">My Design Business</p>
              <p className="text-sm text-muted-foreground">
                design@mybusiness.com
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Upload Logo
          </Button>
        </Card>

        {/* Payments Section */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-2 px-1">
            Payments
          </h2>
          <Card className="divide-y divide-border">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#14B8A6]/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-[#14B8A6]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Stripe Connect</p>
                  <p className="text-sm text-muted-foreground">
                    Accept online payments
                  </p>
                </div>
              </div>
              <div className="p-3 bg-[#14B8A6]/5 rounded-lg border border-[#14B8A6]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#14B8A6]">
                    ✓ Connected
                  </span>
                  <span className="text-xs text-muted-foreground">
                    stripe.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  john@business.com
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Manage in Stripe
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Invoice Settings */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-2 px-1">
            Invoice Settings
          </h2>
          <Card className="p-4 space-y-3">
            <div>
              <label className="text-sm mb-1.5 block">
                Invoice Number Prefix
              </label>
              <Input
                value="INV-"
                className="bg-input-background"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block">
                Default Tax Rate (%)
              </label>
              <Input
                value="8.5"
                type="number"
                className="bg-input-background"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block">
                Currency
              </label>
              <select className="w-full p-2 rounded-lg border border-border bg-input-background">
                <option selected>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Notifications Section */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-2 px-1">
            Notifications
          </h2>
          <Card className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                  <Bell className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="font-medium">
                    Payment Received
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email notifications
                  </p>
                </div>
              </div>
              <div className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                  readOnly
                />
                <div className="w-11 h-6 bg-[#14B8A6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                  <Bell className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="font-medium">Invoice Sent</p>
                  <p className="text-sm text-muted-foreground">
                    Confirmation emails
                  </p>
                </div>
              </div>
              <div className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                  readOnly
                />
                <div className="w-11 h-6 bg-[#14B8A6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* App Info */}
        <Card className="p-4 bg-muted/50">
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">BilltUp</p>
            <p className="text-xs text-muted-foreground">
              Version 1.4.0
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 BilltUp. All rights reserved.
            </p>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation - Removed for documentation */}
    </div>
  );
}