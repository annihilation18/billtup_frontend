import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Save, Loader2, Upload, X, Palette, Eye, FileText } from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { updateBusinessProfile } from '../../utils/dashboard-api';
import { getIdToken } from '../../utils/auth/cognito';
import { API_CONFIG } from '../../utils/config';
import { TemplateBrowserModal } from './TemplateBrowserModal';

// Template list
const INVOICE_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean lines with a side accent bar', category: 'Professional' },
  { id: 'classic', name: 'Classic', description: 'Traditional business invoice layout', category: 'Professional' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant design', category: 'Professional' },
  { id: 'corporate', name: 'Corporate', description: 'Professional with structured sections', category: 'Professional' },
  { id: 'compact', name: 'Compact', description: 'Space-efficient design', category: 'Professional' },
  { id: 'traditional', name: 'Traditional', description: 'Formal business document style', category: 'Professional' },
  { id: 'bold', name: 'Bold', description: 'Strong header with gradient accents', category: 'Creative' },
  { id: 'creative', name: 'Creative', description: 'Colorful and modern with unique layout', category: 'Creative' },
  { id: 'sleek', name: 'Sleek', description: 'Ultra-modern with subtle gradients', category: 'Creative' },
  { id: 'contemporary', name: 'Contemporary', description: 'Modern with asymmetric elements', category: 'Creative' },
  { id: 'vibrant', name: 'Vibrant', description: 'Colorful and eye-catching', category: 'Creative' },
  { id: 'technical', name: 'Technical', description: 'Grid-based tech-focused design', category: 'Tech' },
  { id: 'startup', name: 'Startup', description: 'Fresh and energetic style', category: 'Tech' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated serif typography', category: 'Premium' },
  { id: 'luxury', name: 'Luxury', description: 'Premium gold accents', category: 'Premium' },
];

interface BusinessProfileModalProps {
  open: boolean;
  onClose: () => void;
  businessProfile: any;
  onDataUpdated: () => void;
  userPlan: 'basic' | 'premium';
}

export function BusinessProfileModal({ open, onClose, businessProfile, onDataUpdated, userPlan }: BusinessProfileModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
  });

  // Branding state
  const [brandColor, setBrandColor] = useState('#1E3A8A');
  const [accentColor, setAccentColor] = useState('#14B8A6');
  const [invoiceTemplate, setInvoiceTemplate] = useState('modern');
  const [customLogo, setCustomLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoError, setLogoError] = useState('');
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);

  const isPremium = userPlan === 'premium';

  useEffect(() => {
    if (businessProfile && open) {
      setFormData({
        businessName: businessProfile.businessName || '',
        email: businessProfile.email || '',
        phone: businessProfile.phone || '',
        address: businessProfile.address || '',
        website: businessProfile.website || '',
        description: businessProfile.description || '',
      });
      setBrandColor(businessProfile.brandColor || '#1E3A8A');
      setAccentColor(businessProfile.accentColor || '#14B8A6');
      setInvoiceTemplate(businessProfile.invoiceTemplate || 'modern');
      setCustomLogo(businessProfile.customLogo || businessProfile.logo || '');
      setLogoPreview(businessProfile.customLogo || businessProfile.logo || '');
      setLogoRemoved(false);
      setLogoError('');
    }
  }, [businessProfile, open]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setLogoError('File is too large. Please upload an image under 1.5MB.');
      event.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setLogoError('Please upload an image file.');
      event.target.value = '';
      return;
    }

    setLogoError('');
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCustomLogo(dataUrl);
      setLogoPreview(dataUrl);
      setLogoRemoved(false);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCustomLogo('');
    setLogoPreview('');
    setLogoRemoved(true);
    setLogoError('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await getIdToken();
      if (!token) {
        toast.error('Please sign in to save settings');
        return;
      }

      // Upload logo to S3 if it's a new base64 data URL
      let logoUrl = customLogo;
      let logoPath = businessProfile?.logoPath;
      if (isPremium && customLogo && customLogo.startsWith('data:')) {
        const logoResponse = await fetch(`${API_CONFIG.baseUrl}/business/logo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ logoData: customLogo, fileName: 'logo.png' }),
        });

        if (!logoResponse.ok) {
          const errData = await logoResponse.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to upload logo');
        }

        const logoResult = await logoResponse.json();
        logoUrl = logoResult.logoUrl;
        logoPath = logoResult.path;
      }

      // Build update payload with basic info + branding
      const updatePayload: Record<string, any> = {
        ...formData,
      };

      if (isPremium) {
        updatePayload.brandColor = brandColor;
        updatePayload.accentColor = accentColor;
        updatePayload.invoiceTemplate = invoiceTemplate;
        updatePayload.customLogo = logoUrl;

        if (logoRemoved) {
          updatePayload.customLogo = '';
          updatePayload.logoPath = '';
        } else if (logoPath) {
          updatePayload.logoPath = logoPath;
        }
      }

      await updateBusinessProfile(updatePayload);
      toast.success('Business profile saved successfully!');
      onDataUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Failed to save business profile');
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
            Manage your business information and branding
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

          {/* Branding Section */}
          <div className="border-t pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Custom Branding
              </h3>
              {!isPremium && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>

            {!isPremium ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Upgrade to Premium to customize your logo, brand colors, and invoice templates.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Invoice Logo</Label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative w-20 h-20 rounded-lg border-2 border-[#14B8A6] overflow-hidden bg-gray-50">
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        <button
                          onClick={handleRemoveLogo}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          aria-label="Remove logo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="bp-logo-upload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading || isSaving}
                        className="cursor-pointer"
                        onClick={() => document.getElementById('bp-logo-upload')?.click()}
                      >
                        {uploading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
                        ) : (
                          <><Upload className="w-4 h-4 mr-2" />{logoPreview ? 'Change Logo' : 'Upload Logo'}</>
                        )}
                      </Button>
                      {logoError && (
                        <p className="text-xs text-red-500 font-medium mt-1">{logoError}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, or SVG. Max 1.5MB</p>
                    </div>
                  </div>
                </div>

                {/* Brand Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bp-brand-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="bp-brand-color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                        disabled={isSaving}
                      />
                      <Input
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="flex-1 font-mono text-sm"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-accent-color">Accent Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="bp-accent-color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                        disabled={isSaving}
                      />
                      <Input
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1 font-mono text-sm"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Template */}
                <div className="space-y-2">
                  <Label>Invoice Template</Label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#1E3A8A]" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Current</div>
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {INVOICE_TEMPLATES.find(t => t.id === invoiceTemplate)?.name || 'Modern'}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTemplateBrowser(true)}
                      disabled={isSaving}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Browse
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Changes</>
            )}
          </Button>
        </div>
      </DialogContent>

      {/* Template Browser Modal */}
      {isPremium && (
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
      )}
    </Dialog>
  );
}
