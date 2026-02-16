import { Loader2, Save, Mail, AlertCircle } from 'lucide-react@0.468.0';

interface CommunicationSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function CommunicationSettingsModal({ open, onClose }: CommunicationSettingsModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');

  const handleSave = async () => {
    if (!smtpHost || !smtpPort || !smtpUser || !fromEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      // Save email configuration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Email configuration saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    toast.info('Sending test email...');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Test email sent successfully! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Communication Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-gray-900 mb-1">Email Configuration</h4>
                <p className="text-xs text-gray-600">
                  Configure your email server to send invoices and notifications to customers.
                  We recommend using Gmail, Outlook, or a dedicated SMTP service.
                </p>
              </div>
            </div>
          </div>

          {/* SMTP Settings */}
          <div className="space-y-4">
            <h3 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SMTP Server Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="smtpHost">
                  SMTP Host <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="smtpHost"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="mt-2 border-gray-300"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="smtpPort">
                  SMTP Port <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="smtpPort"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="587"
                  className="mt-2 border-gray-300"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="smtpUser">
                SMTP Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="smtpUser"
                type="email"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="your-email@gmail.com"
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                For Gmail, use an App Password instead of your regular password
              </p>
            </div>
          </div>

          {/* Sender Information */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Sender Information
            </h3>

            <div>
              <Label htmlFor="fromEmail">
                From Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fromEmail"
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="noreply@yourbusiness.com"
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your Business Name"
                className="mt-2 border-gray-300"
              />
            </div>
          </div>

          {/* Test Email */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleTestEmail}
              variant="outline"
              className="w-full border-gray-300"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Test Email
            </Button>
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
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}