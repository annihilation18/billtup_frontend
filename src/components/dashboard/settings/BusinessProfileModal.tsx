import { Loader2, Save } from 'lucide-react@0.468.0';
import { toast } from '../../ui/sonner';
import { fetchBusinessProfile, updateBusinessProfile } from '../../../utils/dashboard-api';

interface BusinessProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function BusinessProfileModal({ open, onClose }: BusinessProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [taxId, setTaxId] = useState('');

  useEffect(() => {
    if (open) {
      loadBusinessProfile();
    }
  }, [open]);

  const loadBusinessProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await fetchBusinessProfile();
      if (profile) {
        setBusinessName(profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setAddress(profile.address || '');
        setWebsite(profile.website || '');
        setTaxId(profile.taxId || '');
      }
    } catch (error) {
      console.error('Error loading business profile:', error);
      toast.error('Failed to load business profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!businessName) {
      toast.error('Business name is required');
      return;
    }

    setIsSaving(true);
    try {
      await updateBusinessProfile({
        name: businessName,
        email,
        phone,
        address,
        website,
        taxId
      });
      toast.success('Business profile updated successfully!');
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
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Business Profile
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">
                  Business Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Business Name"
                  className="mt-2 border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="business@example.com"
                  className="mt-2 border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="businessPhone">Phone Number</Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-2 border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, State, ZIP"
                  className="mt-2 border-gray-300 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="businessWebsite">Website (Optional)</Label>
                <Input
                  id="businessWebsite"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="mt-2 border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="taxId">Tax ID / EIN (Optional)</Label>
                <Input
                  id="taxId"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="12-3456789"
                  className="mt-2 border-gray-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1"
              >
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
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}