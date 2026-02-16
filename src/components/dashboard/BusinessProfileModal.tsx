import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Save, Loader2 } from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { updateBusinessProfile } from '../../utils/dashboard-api';

interface BusinessProfileModalProps {
  open: boolean;
  onClose: () => void;
  businessProfile: any;
  onDataUpdated: () => void;
}

export function BusinessProfileModal({ open, onClose, businessProfile, onDataUpdated }: BusinessProfileModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    if (businessProfile) {
      setFormData({
        businessName: businessProfile.businessName || '',
        email: businessProfile.email || '',
        phone: businessProfile.phone || '',
        address: businessProfile.address || '',
        website: businessProfile.website || '',
        description: businessProfile.description || '',
      });
    }
  }, [businessProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBusinessProfile(formData);
      toast.success('Business profile updated successfully!');
      onDataUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Failed to update business profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Business Profile</span>
          </DialogTitle>
          <DialogDescription>
            Manage your business information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Your Business Name"
              className="mt-2"
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="businessEmail">Email Address</Label>
            <Input
              id="businessEmail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="business@example.com"
              className="mt-2"
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="businessPhone">Phone Number</Label>
            <Input
              id="businessPhone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="mt-2"
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="businessAddress">Business Address</Label>
            <Textarea
              id="businessAddress"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
              className="mt-2"
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="businessWebsite">Website (Optional)</Label>
            <Input
              id="businessWebsite"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourbusiness.com"
              className="mt-2"
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="businessDescription">Description (Optional)</Label>
            <Textarea
              id="businessDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your business..."
              className="mt-2"
              disabled={isSaving}
            />
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}