import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Save, Loader2, Mail } from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { updateBusinessProfile } from '../../utils/dashboard-api';

interface CommunicationModalProps {
  open: boolean;
  onClose: () => void;
  businessProfile: any;
  onDataUpdated: () => void;
}

export function CommunicationModal({ open, onClose, businessProfile, onDataUpdated }: CommunicationModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    emailFrom: '',
    emailReplyTo: '',
    emailSignature: '',
  });

  useEffect(() => {
    if (businessProfile) {
      setFormData({
        emailFrom: businessProfile.emailFrom || businessProfile.email || '',
        emailReplyTo: businessProfile.emailReplyTo || businessProfile.email || '',
        emailSignature: businessProfile.emailSignature || '',
      });
    }
  }, [businessProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBusinessProfile({
        emailFrom: formData.emailFrom,
        emailReplyTo: formData.emailReplyTo,
        emailSignature: formData.emailSignature,
      });
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