import { useState, useEffect } from 'react';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Bell } from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { updateUserProfile } from '../../utils/dashboard-api';

interface EmailNotificationsModalProps {
  open: boolean;
  onClose: () => void;
  userProfile: any;
  onDataUpdated: () => void;
}

const NOTIFICATION_OPTIONS = [
  {
    key: 'invoicePaid' as const,
    label: 'Invoice Paid',
    description: 'Get notified when a customer pays an invoice',
  },
  {
    key: 'paymentFailed' as const,
    label: 'Payment Failed',
    description: 'Alert when a payment attempt fails',
  },
  {
    key: 'newCustomer' as const,
    label: 'New Customer',
    description: 'Notification when a new customer is added',
  },
  {
    key: 'overdueInvoices' as const,
    label: 'Overdue Invoices',
    description: 'Daily reminder for overdue payments',
  },
  {
    key: 'weeklySummary' as const,
    label: 'Weekly Summary',
    description: 'Weekly report of your business activity',
  },
];

export function EmailNotificationsModal({ open, onClose, userProfile, onDataUpdated }: EmailNotificationsModalProps) {
  const [notifications, setNotifications] = useState({
    invoicePaid: true,
    paymentFailed: true,
    newCustomer: false,
    overdueInvoices: true,
    weeklySummary: true,
  });

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

  const handleToggleChange = async (key: string, value: boolean) => {
    const prev = { ...notifications };
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);

    try {
      await updateUserProfile({ notifications: updatedNotifications });
      toast.success('Preference updated!');
      onDataUpdated();
    } catch (error) {
      console.error('Error updating notification preference:', error);
      toast.error('Failed to update preference');
      setNotifications(prev);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Email Notifications</span>
          </DialogTitle>
          <DialogDescription>
            Choose which email notifications you receive
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-1">
            {NOTIFICATION_OPTIONS.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div>
                  <p className="text-sm text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => handleToggleChange(item.key, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
