import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Shield } from 'lucide-react@0.468.0';

interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
  userProfile: any;
  onDataUpdated: () => void;
}

export function PreferencesModal({ open, onClose }: PreferencesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Preferences</span>
          </DialogTitle>
          <DialogDescription>
            Manage your security settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}