import { Crown, Check, Loader2 } from 'lucide-react';
import { toast } from '../../ui/sonner';
import { getUserEmail } from '../../../utils/auth/cognito';

interface AccountSettingsModalProps {
  open: boolean;
  onClose: () => void;
  userPlan: 'basic' | 'premium';
}

export function AccountSettingsModal({ open, onClose, userPlan }: AccountSettingsModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isPremium = userPlan === 'premium';

  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [open]);

  const loadUserData = async () => {
    try {
      const email = getUserEmail();
      if (email) {
        setEmail(email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save user data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Account settings updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    toast.info('Redirecting to upgrade page...');
    // Redirect to pricing/upgrade page
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Account Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Plan */}
          <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {isPremium ? 'Premium Plan' : 'Basic Plan'}
                </h3>
                <p className="text-blue-100 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isPremium ? '$9.99/month' : '$4.99/month'}
                </p>
              </div>
              {isPremium && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Crown className="w-6 h-6 text-[#F59E0B]" />
                </div>
              )}
            </div>

            {isPremium ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Unlimited invoices & customers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Custom branding & logo</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Priority support</span>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-blue-100 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Upgrade to Premium for unlimited features and advanced tools
                </p>
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-white text-[#1E3A8A] hover:bg-gray-100"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </>
            )}
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-2 border-gray-300"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}