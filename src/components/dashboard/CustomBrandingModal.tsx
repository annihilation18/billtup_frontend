import { useState, useEffect } from 'react';
import { 
  Palette, 
  Upload, 
  Loader2, 
  Check,
  Sparkles,
  X,
  Eye,
  FileText
} from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { getIdToken } from '../../utils/auth/cognito';
import { API_CONFIG } from '../../utils/config';
import { TemplateBrowserModal } from './TemplateBrowserModal';

interface CustomBrandingModalProps {
  open: boolean;
  onClose: () => void;
  businessProfile: any;
  onDataUpdated: () => void;
  userPlan: 'basic' | 'premium';
}

// Template list with all 15 templates
const INVOICE_TEMPLATES = [
  // Professional (6 templates)
  { id: 'modern', name: 'Modern', description: 'Clean lines with a side accent bar', category: 'Professional' },
  { id: 'classic', name: 'Classic', description: 'Traditional business invoice layout', category: 'Professional' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant design', category: 'Professional' },
  { id: 'corporate', name: 'Corporate', description: 'Professional with structured sections', category: 'Professional' },
  { id: 'compact', name: 'Compact', description: 'Space-efficient design', category: 'Professional' },
  { id: 'traditional', name: 'Traditional', description: 'Formal business document style', category: 'Professional' },
  // Creative (5 templates)
  { id: 'bold', name: 'Bold', description: 'Strong header with gradient accents', category: 'Creative' },
  { id: 'creative', name: 'Creative', description: 'Colorful and modern with unique layout', category: 'Creative' },
  { id: 'sleek', name: 'Sleek', description: 'Ultra-modern with subtle gradients', category: 'Creative' },
  { id: 'contemporary', name: 'Contemporary', description: 'Modern with asymmetric elements', category: 'Creative' },
  { id: 'vibrant', name: 'Vibrant', description: 'Colorful and eye-catching', category: 'Creative' },
  // Tech (2 templates)
  { id: 'technical', name: 'Technical', description: 'Grid-based tech-focused design', category: 'Tech' },
  { id: 'startup', name: 'Startup', description: 'Fresh and energetic style', category: 'Tech' },
  // Premium (2 templates)
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated serif typography', category: 'Premium' },
  { id: 'luxury', name: 'Luxury', description: 'Premium gold accents', category: 'Premium' },
];

export function CustomBrandingModal({ 
  open, 
  onClose, 
  businessProfile,
  onDataUpdated,
  userPlan
}: CustomBrandingModalProps) {
  const [brandColor, setBrandColor] = useState('#1E3A8A');
  const [accentColor, setAccentColor] = useState('#14B8A6');
  const [invoiceTemplate, setInvoiceTemplate] = useState<string>('modern');
  const [customLogo, setCustomLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);

  const isPremium = userPlan === 'premium';

  useEffect(() => {
    if (businessProfile && open) {
      setBrandColor(businessProfile.brandColor || '#1E3A8A');
      setAccentColor(businessProfile.accentColor || '#14B8A6');
      setInvoiceTemplate(businessProfile.invoiceTemplate || 'modern');
      setCustomLogo(businessProfile.customLogo || businessProfile.logo || '');
      setLogoPreview(businessProfile.customLogo || businessProfile.logo || '');
    }
  }, [businessProfile, open]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo file size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCustomLogo(dataUrl);
        setLogoPreview(dataUrl);
        toast.success('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setCustomLogo('');
    setLogoPreview('');
    toast.success('Logo removed');
  };

  const handleSave = async () => {
    if (!isPremium) {
      toast.error('Custom branding is a Premium feature');
      return;
    }

    setSaving(true);
    try {
      const token = await getIdToken();

      if (!token) {
        toast.error('Please sign in to save settings');
        return;
      }

      const response = await fetch(
        `${API_CONFIG.baseUrl}/business`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            brandColor,
            accentColor,
            invoiceTemplate,
            customLogo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save branding settings');
      }

      toast.success('Branding settings saved successfully!');
      onDataUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast.error('Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };

  const templates = [
    {
      id: 'modern' as const,
      name: 'Modern',
      description: 'Clean with accent bar',
      preview: (
        <div className="w-full h-24 border border-gray-200 rounded-lg p-3 bg-white relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentColor }}></div>
          <div className="ml-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 bg-gray-100" style={{ borderColor: brandColor }}></div>
            <div className="flex-1">
              <div className="h-2 w-16 rounded mb-1" style={{ backgroundColor: brandColor }}></div>
              <div className="h-1.5 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'classic' as const,
      name: 'Classic',
      description: 'Traditional with header',
      preview: (
        <div className="w-full h-24 border border-gray-200 rounded-lg overflow-hidden">
          <div className="h-12 flex items-center gap-2 px-3" style={{ backgroundColor: brandColor }}>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-white/20"></div>
            <div className="h-2 w-16 bg-white/80 rounded"></div>
          </div>
          <div className="px-3 py-2 space-y-1">
            <div className="h-1.5 w-20 bg-gray-200 rounded"></div>
            <div className="h-1.5 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      description: 'Ultra-clean design',
      preview: (
        <div className="w-full h-24 border border-gray-200 rounded-lg p-3 bg-white">
          <div className="border-b pb-2 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border bg-gray-100" style={{ borderColor: brandColor }}></div>
            <div className="h-1.5 w-12 rounded" style={{ backgroundColor: brandColor }}></div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-20 bg-gray-200 rounded"></div>
            <div className="h-1.5 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ),
    },
  ];

  if (!isPremium) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#1E3A8A]" />
              <span style={{ fontFamily: 'Poppins, sans-serif' }}>Custom Branding</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Customize your invoice appearance with your brand
            </DialogDescription>
          </DialogHeader>

          {/* Upgrade Prompt */}
          <div className="py-8">
            <Card className="p-6 bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5 border-[#14B8A6]/20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm text-gray-600">
                    Custom branding is available on our Premium plan
                  </p>
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#14B8A6]" />
                    <span>Custom brand colors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#14B8A6]" />
                    <span>Upload your logo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#14B8A6]" />
                    <span>Professional invoice templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#14B8A6]" />
                    <span>Consistent brand experience</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 text-white"
                  onClick={onClose}
                >
                  View Plans
                </Button>
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Custom Branding</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Customize your invoice appearance with your brand colors, logo, and template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Logo Upload */}
          <div className="space-y-3">
            <Label className="text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Invoice Logo
            </Label>
            <p className="text-sm text-gray-600">
              Upload a custom logo that will appear on your invoices
            </p>
            
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative w-24 h-24 rounded-lg border-2 border-[#14B8A6] overflow-hidden bg-gray-50">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label="Remove logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Label htmlFor="logo-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="cursor-pointer"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </>
                    )}
                  </Button>
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, or GIF • Max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Brand Color */}
            <div className="space-y-3">
              <Label htmlFor="brand-color" className="text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Primary Brand Color
              </Label>
              <p className="text-sm text-gray-600">
                Used for headings and main elements
              </p>
              <div className="flex gap-3">
                <input
                  type="color"
                  id="brand-color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <Input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder="#1E3A8A"
                  className="flex-1 border-gray-300 font-mono"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <Label htmlFor="accent-color" className="text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Accent Color
              </Label>
              <p className="text-sm text-gray-600">
                Used for highlights and secondary elements
              </p>
              <div className="flex gap-3">
                <input
                  type="color"
                  id="accent-color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#14B8A6"
                  className="flex-1 border-gray-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Invoice Template - Quick Selector */}
          <div className="space-y-3">
            <Label className="text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Invoice Template
            </Label>
            <p className="text-sm text-gray-600 mb-3">
              Choose from 15 professional invoice templates. Preview full invoices before selecting.
            </p>
            
            {/* Quick Selector Card */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              {/* Left side: Current template info */}
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#1E3A8A]" />
                </div>

                {/* Text */}
                <div>
                  <div className="text-sm text-gray-600">Current Template</div>
                  <div className="text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {INVOICE_TEMPLATES.find(t => t.id === invoiceTemplate)?.name || 'Modern'}
                  </div>
                </div>
              </div>

              {/* Right side: Browse button */}
              <Button
                variant="outline"
                onClick={() => setShowTemplateBrowser(true)}
                className="border-gray-300 hover:bg-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>

          {/* Preview Card */}
          <Card className="p-4 bg-gray-50 border-gray-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Preview your changes
                </p>
                <p className="text-gray-600">
                  Your custom branding will be applied to all new invoices. Existing invoices will keep their original appearance.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="flex-1 border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Branding
              </>
            )}
          </Button>
        </div>
      </DialogContent>

      {/* Template Browser Modal */}
      <TemplateBrowserModal
        open={showTemplateBrowser}
        onClose={() => setShowTemplateBrowser(false)}
        currentTemplate={invoiceTemplate}
        onTemplateSelected={(templateId) => setInvoiceTemplate(templateId)}
        brandColor={brandColor}
        accentColor={accentColor}
        businessProfile={businessProfile}
        customLogo={logoPreview || customLogo}
      />
    </Dialog>
  );
}