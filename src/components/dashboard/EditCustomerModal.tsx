import { useState, useEffect } from 'react';
import { Loader2, Edit } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from '../ui/sonner';
import { updateCustomer } from '../../utils/dashboard-api';

interface EditCustomerModalProps {
  customer: any;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditCustomerModal({ customer, open, onClose, onUpdated }: EditCustomerModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
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

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip || '',
        country: customer.country || '',
      });
    }
  }, [customer]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setIsUpdating(true);
    try {
      await updateCustomer(customer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      });
      toast.success('Customer updated successfully!');
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Edit Customer</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Make changes to the customer details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">Basic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">Address Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Customer'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}