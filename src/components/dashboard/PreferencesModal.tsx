import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Settings } from 'lucide-react@0.468.0';

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
            <Settings className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Preferences</span>
          </DialogTitle>
          <DialogDescription>
            Manage your account settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-gray-500 text-center py-8">
            More preferences coming soon.
          </p>
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