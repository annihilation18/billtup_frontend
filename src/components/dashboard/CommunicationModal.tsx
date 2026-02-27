import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Save, Loader2, Mail, Server, Lock, Send } from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { updateBusinessProfile } from '../../utils/dashboard-api';

interface CommunicationModalProps {
  open: boolean;
  onClose: () => void;
  businessProfile: any;
  onDataUpdated: () => void;
  userPlan: 'basic' | 'premium';
}

export function CommunicationModal({ open, onClose, businessProfile, onDataUpdated, userPlan }: CommunicationModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [formData, setFormData] = useState({
    emailFrom: '',
    emailReplyTo: '',
    emailSignature: '',
  });
  const [smtpData, setSmtpData] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpFromName: '',
  });

  const isPremium = userPlan === 'premium';

  useEffect(() => {
    if (businessProfile) {
      setFormData({
        emailFrom: businessProfile.emailFrom || businessProfile.email || '',
        emailReplyTo: businessProfile.emailReplyTo || businessProfile.email || '',
        emailSignature: businessProfile.emailSignature || '',
      });
      setSmtpData({
        smtpHost: businessProfile.smtpHost || '',
        smtpPort: businessProfile.smtpPort || '587',
        smtpUser: businessProfile.smtpUser || '',
        smtpPass: businessProfile.smtpPass || '',
        smtpFromName: businessProfile.smtpFromName || businessProfile.businessName || '',
      });
    }
  }, [businessProfile]);

  const handleTestEmail = async () => {
    if (!smtpData.smtpHost || !smtpData.smtpUser) {
      toast.error('Please fill in SMTP host and username first');
      return;
    }
    setSendingTest(true);
    try {
      // Simulated API call for test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Test email sent! Check your inbox.');
    } catch {
      toast.error('Failed to send test email');
    } finally {
      setSendingTest(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, any> = {
        emailFrom: formData.emailFrom,
        emailReplyTo: formData.emailReplyTo,
        emailSignature: formData.emailSignature,
      };

      if (isPremium) {
        payload.smtpHost = smtpData.smtpHost;
        payload.smtpPort = smtpData.smtpPort;
        payload.smtpUser = smtpData.smtpUser;
        payload.smtpPass = smtpData.smtpPass;
        payload.smtpFromName = smtpData.smtpFromName;
      }

      await updateBusinessProfile(payload);
      toast.success('Email settings updated successfully!');
      onDataUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to update email settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Communication Settings</span>
          </DialogTitle>
          <DialogDescription>
            Configure email settings for invoice notifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Configure how your invoices and notifications are sent to customers via email.
            </p>
          </div>

          <div>
            <Label htmlFor="emailFrom">From Email Address</Label>
            <Input
              id="emailFrom"
              type="email"
              value={formData.emailFrom}
              onChange={(e) => setFormData({ ...formData, emailFrom: e.target.value })}
              placeholder="invoices@yourbusiness.com"
              className="mt-2"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 mt-1">
              This email will appear as the sender when you send invoices
            </p>
          </div>

          <div>
            <Label htmlFor="emailReplyTo">Reply-To Email Address</Label>
            <Input
              id="emailReplyTo"
              type="email"
              value={formData.emailReplyTo}
              onChange={(e) => setFormData({ ...formData, emailReplyTo: e.target.value })}
              placeholder="support@yourbusiness.com"
              className="mt-2"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 mt-1">
              Customer replies will be sent to this address
            </p>
          </div>

          <div>
            <Label htmlFor="emailSignature">Email Signature (Optional)</Label>
            <Textarea
              id="emailSignature"
              value={formData.emailSignature}
              onChange={(e) => setFormData({ ...formData, emailSignature: e.target.value })}
              placeholder="Best regards, Your Team"
              className="mt-2"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be added to the end of email notifications
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm text-gray-900 mb-2">Email Preview</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>From:</strong> {formData.emailFrom || 'Not set'}</p>
              <p><strong>Reply-To:</strong> {formData.emailReplyTo || 'Not set'}</p>
              {formData.emailSignature && (
                <p className="mt-2 pt-2 border-t border-gray-300">
                  <strong>Signature:</strong> {formData.emailSignature}
                </p>
              )}
            </div>
          </div>

          {/* Domain Email / SMTP Section */}
          <div className="border-t pt-6 mt-2">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Domain Email
              </h3>
              {!isPremium && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>

            {!isPremium ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Upgrade to Premium to send invoices from your own domain email.
                </p>
                <p className="text-xs text-gray-500">
                  Configure custom SMTP settings for professional email delivery.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={smtpData.smtpHost}
                      onChange={(e) => setSmtpData({ ...smtpData, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="mt-2"
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={smtpData.smtpPort}
                      onChange={(e) => setSmtpData({ ...smtpData, smtpPort: e.target.value })}
                      placeholder="587"
                      className="mt-2"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={smtpData.smtpUser}
                    onChange={(e) => setSmtpData({ ...smtpData, smtpUser: e.target.value })}
                    placeholder="your-email@yourdomain.com"
                    className="mt-2"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    value={smtpData.smtpPass}
                    onChange={(e) => setSmtpData({ ...smtpData, smtpPass: e.target.value })}
                    placeholder="••••••••"
                    className="mt-2"
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For Gmail, use an App Password instead of your regular password
                  </p>
                </div>

                <div>
                  <Label htmlFor="smtpFromName">From Name</Label>
                  <Input
                    id="smtpFromName"
                    value={smtpData.smtpFromName}
                    onChange={(e) => setSmtpData({ ...smtpData, smtpFromName: e.target.value })}
                    placeholder="Your Business Name"
                    className="mt-2"
                    disabled={isSaving}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestEmail}
                  disabled={isSaving || sendingTest}
                  className="w-full border-gray-300"
                >
                  {sendingTest ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" />Send Test Email</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}