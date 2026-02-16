import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Save, Loader2, Shield, Bell } from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { updateUserProfile } from '../../utils/dashboard-api';

interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
  userProfile: any;
  onDataUpdated: () => void;
}

export function PreferencesModal({ open, onClose, userProfile, onDataUpdated }: PreferencesModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    invoicePaid: true,
    paymentFailed: true,
    newCustomer: false,
    overdueInvoices: true,
    weeklySummary: true,
  });

  // Load existing notification preferences from user profile
  useEffect(() => {
    if (userProfile?.notifications) {
      setNotifications({
        invoicePaid: userProfile.notifications.invoicePaid ?? true,
        paymentFailed: userProfile.notifications.paymentFailed ?? true,
        newCustomer: userProfile.notifications.newCustomer ?? false,
        overdueInvoices: userProfile.notifications.overdueInvoices ?? true,
        weeklySummary: userProfile.notifications.weeklySummary ?? true,
      });
    }
  }, [userProfile]);

  // Auto-save notification preference when it changes
  const handleToggleChange = async (key: string, value: boolean) => {
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);

    try {
      await updateUserProfile({ notifications: updatedNotifications });
      toast.success('Preference updated!');
      onDataUpdated();
    } catch (error) {
      console.error('Error updating notification preference:', error);
      toast.error('Failed to update preference');
      // Revert the change on error
      setNotifications(notifications);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Preferences</span>
          </DialogTitle>
          <DialogDescription>
            Manage your notification preferences and security settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notifications Section */}
          <Card className="p-6 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Email Notifications
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Choose which email notifications you want to receive
            </p>
            <div className="space-y-4">
              {[
                { 
                  key: 'invoicePaid' as const,
                  label: 'Invoice Paid', 
                  description: 'Get notified when a customer pays an invoice' 
                },
                { 
                  key: 'paymentFailed' as const,
                  label: 'Payment Failed', 
                  description: 'Alert when a payment attempt fails' 
                },
                { 
                  key: 'newCustomer' as const,
                  label: 'New Customer', 
                  description: 'Notification when a new customer is added' 
                },
                { 
                  key: 'overdueInvoices' as const,
                  label: 'Overdue Invoices', 
                  description: 'Daily reminder for overdue payments' 
                },
                { 
                  key: 'weeklySummary' as const,
                  label: 'Weekly Summary', 
                  description: 'Weekly report of your business activity' 
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(e) => handleToggleChange(item.key, e)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="p-6 border-gray-200">
            <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Two-Factor Authentication
            </h3>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-900 mb-1">Status: Not Enabled</p>
                <p className="text-xs text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" className="border-gray-300">
                Enable 2FA
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}