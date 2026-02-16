import { useState } from 'react';
import { Loader2, User } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from '../ui/sonner';
import { createCustomer } from '../../utils/dashboard-api';

interface CreateCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateCustomerModal({ open, onClose, onCreated }: CreateCustomerModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setIsCreating(true);
    try {
      await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      });
      toast.success('Customer created successfully!');
      onCreated();
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle id="create-customer-title" className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#1E3A8A]" aria-hidden="true" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Add New Customer</span>
          </DialogTitle>
          <DialogDescription id="create-customer-description" className="text-sm text-gray-500">
            Enter the customer's details to create a new account.
          </DialogDescription>
        </DialogHeader>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
          className="space-y-4 py-4"
        >
          {/* Basic Information */}
          <fieldset className="space-y-4">
            <legend className="text-sm text-gray-500 uppercase tracking-wide">Basic Information</legend>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">
                  Name <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="customer-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="border-gray-300"
                  required
                  aria-required="true"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-email">
                  Email <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="border-gray-300"
                  required
                  aria-required="true"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-phone">Phone</Label>
                <Input
                  id="customer-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="border-gray-300"
                  autoComplete="tel"
                />
              </div>
            </div>
          </fieldset>

          {/* Address Information */}
          <fieldset className="space-y-4">
            <legend className="text-sm text-gray-500 uppercase tracking-wide">Address Information</legend>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-address">Street Address</Label>
                <Input
                  id="customer-address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="border-gray-300"
                  autoComplete="street-address"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-2">
                  <Label htmlFor="customer-city">City</Label>
                  <Input
                    id="customer-city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="border-gray-300"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-state">State</Label>
                  <Input
                    id="customer-state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="border-gray-300"
                    autoComplete="address-level1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-zip">ZIP</Label>
                  <Input
                    id="customer-zip"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    className="border-gray-300"
                    autoComplete="postal-code"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-country">Country</Label>
                <Input
                  id="customer-country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="border-gray-300"
                  autoComplete="country-name"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1"
              aria-label="Cancel and close dialog"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              aria-label={isCreating ? 'Creating customer...' : 'Create customer'}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  Creating...
                </>
              ) : (
                'Create Customer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}