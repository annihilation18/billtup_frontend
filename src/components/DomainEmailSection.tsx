import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, Crown, Sparkles, Check, AlertCircle, Server } from 'lucide-react';
import { usePremiumFeatures } from '../utils/usePremiumFeatures';
import { toast } from 'sonner@2.0.3';

interface DomainEmailSectionProps {
  businessData: any;
  onUpdateBusinessData: (data: any) => void;
  onUpgrade?: () => void;
}

export function DomainEmailSection({ businessData, onUpdateBusinessData, onUpgrade }: DomainEmailSectionProps) {
  const { hasDomainEmail, subscription } = usePremiumFeatures();
  const [emailHost, setEmailHost] = useState(businessData.emailHost || '');
  const [emailPort, setEmailPort] = useState(businessData.emailPort || '587');
  const [emailUser, setEmailUser] = useState(businessData.emailUser || '');
  const [emailPassword, setEmailPassword] = useState(businessData.emailPassword || '');
  const [fromEmail, setFromEmail] = useState(businessData.fromEmail || '');
  const [fromName, setFromName] = useState(businessData.fromName || businessData.businessName || '');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        ...businessData,
        emailHost,
        emailPort,
        emailUser,
        emailPassword,
        fromEmail,
        fromName,
      };
      
      onUpdateBusinessData(updatedData);
      toast.success('Email settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save email settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    try {
      // Simulate test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Test email sent successfully! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setTesting(false);
    }
  };

  // Premium feature gate
  if (!hasDomainEmail) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-purple-600" />
            <div>
              <h3>Domain Email</h3>
              <p className="text-sm text-muted-foreground">Send invoices from your own domain</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>

        <Alert className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-sm">
            <strong className="text-purple-900">Professional Email Delivery</strong>
            <p className="text-purple-800 mt-2 mb-4">
              Build trust with your customers by sending invoices from your own domain email address instead of a generic one.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Custom SMTP configuration</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Use your domain (e.g., billing@yourbusiness.com)</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Better email deliverability</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Professional brand image</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={onUpgrade}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Domain email settings for Premium/Trial users
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-purple-600" />
          <div>
            <h3>Domain Email Configuration</h3>
            <p className="text-sm text-muted-foreground">Configure SMTP to send from your domain</p>
          </div>
        </div>
        {subscription?.isTrial && (
          <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Trial Feature
          </Badge>
        )}
      </div>

      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          <strong>Setup Guide:</strong> You'll need SMTP credentials from your email provider (Gmail, Outlook, etc.) or hosting provider.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {/* From Email & Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-email">From Email Address</Label>
            <Input
              id="from-email"
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="billing@yourbusiness.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-name">From Name</Label>
            <Input
              id="from-name"
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Your Business Name"
            />
          </div>
        </div>

        {/* SMTP Settings */}
        <div className="space-y-2">
          <Label htmlFor="email-host" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            SMTP Host
          </Label>
          <Input
            id="email-host"
            type="text"
            value={emailHost}
            onChange={(e) => setEmailHost(e.target.value)}
            placeholder="smtp.gmail.com"
          />
          <p className="text-xs text-muted-foreground">
            Common hosts: smtp.gmail.com (Gmail), smtp-mail.outlook.com (Outlook)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-port">SMTP Port</Label>
          <Input
            id="email-port"
            type="text"
            value={emailPort}
            onChange={(e) => setEmailPort(e.target.value)}
            placeholder="587"
          />
          <p className="text-xs text-muted-foreground">
            Common ports: 587 (TLS), 465 (SSL), 25 (unencrypted)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-user">SMTP Username</Label>
          <Input
            id="email-user"
            type="text"
            value={emailUser}
            onChange={(e) => setEmailUser(e.target.value)}
            placeholder="your-email@domain.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-password">SMTP Password</Label>
          <Input
            id="email-password"
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            placeholder="••••••••"
          />
          <p className="text-xs text-muted-foreground">
            For Gmail, use an App Password instead of your regular password
          </p>
        </div>

        {/* Preview */}
        {fromEmail && fromName && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900">
              <strong>Email Preview:</strong> Invoices will be sent from "{fromName}" &lt;{fromEmail}&gt;
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? 'Saving...' : 'Save Email Settings'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTestEmail} 
            disabled={testing || !emailHost || !emailUser || !emailPassword}
          >
            {testing ? 'Testing...' : 'Send Test Email'}
          </Button>
        </div>

        {/* Help Text */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Need help?</strong> Check out our setup guides for{' '}
            <a href="#" className="text-primary underline">Gmail</a>,{' '}
            <a href="#" className="text-primary underline">Outlook</a>, or{' '}
            <a href="#" className="text-primary underline">other providers</a>.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
}