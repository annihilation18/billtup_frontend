import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Upload, Crown, Sparkles, Palette, Image as ImageIcon, Type, Check, Wand2 } from 'lucide-react';
import { usePremiumFeatures } from '../utils/usePremiumFeatures';
import { toast } from 'sonner@2.0.3';
import { businessApi } from '../utils/api';

interface CustomBrandingSectionProps {
  businessData: any;
  onUpdateBusinessData: (data: any) => void;
  onUpgrade?: () => void;
}

// Function to extract dominant colors from an image
const extractColorsFromImage = (imageDataUrl: string, isDarkMode: boolean = false): Promise<{ options: Array<{ primary: string; accent: string; name: string }> }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ 
          options: [
            { primary: '#1E3A8A', accent: '#14B8A6', name: 'Ocean Blue' },
            { primary: '#14B8A6', accent: '#1E3A8A', name: 'Teal Wave' }
          ]
        });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Store colors with their RGB, HSL, and count
      interface ColorData {
        rgb: string;
        hue: number;
        saturation: number;
        lightness: number;
        count: number;
      }
      const colorData: ColorData[] = [];
      const colorCounts: { [key: string]: number } = {};

      // Helper function to convert RGB to HSL
      const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
      };

      // Get color name based on hue
      const getColorName = (hue: number): string => {
        if (hue >= 0 && hue < 30 || hue >= 330) return 'Red';
        if (hue >= 30 && hue < 60) return 'Orange';
        if (hue >= 60 && hue < 90) return 'Yellow';
        if (hue >= 90 && hue < 150) return 'Green';
        if (hue >= 150 && hue < 210) return 'Cyan';
        if (hue >= 210 && hue < 270) return 'Blue';
        return 'Purple';
      };

      // Get color spectrum category
      const getColorSpectrum = (color: ColorData): string => {
        // Check for greys/neutral colors (low saturation)
        if (color.saturation < 15) {
          if (color.lightness > 80) return 'White';
          if (color.lightness < 20) return 'Black';
          return 'Grey';
        }
        
        // For saturated colors, use hue
        const hue = color.hue;
        if (hue >= 0 && hue < 30 || hue >= 330) return 'Red';
        if (hue >= 30 && hue < 60) return 'Orange';
        if (hue >= 60 && hue < 90) return 'Yellow';
        if (hue >= 90 && hue < 150) return 'Green';
        if (hue >= 150 && hue < 210) return 'Cyan';
        if (hue >= 210 && hue < 270) return 'Blue';
        return 'Purple';
      };

      // Sample every 10th pixel for performance
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 125) continue;
        
        // Calculate brightness (0-255)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // Skip colors that are too light (> 240) or too dark (< 40) for readability
        if (brightness > 240 || brightness < 40) continue;
        
        // In dark mode, prefer darker colors (brightness < 150)
        // In light mode, prefer colors with good contrast (brightness between 50-200)
        if (isDarkMode && brightness > 150) continue;
        if (!isDarkMode && (brightness < 50 || brightness > 200)) continue;

        // Round to nearest 10 to group similar colors
        const rRounded = Math.round(r / 10) * 10;
        const gRounded = Math.round(g / 10) * 10;
        const bRounded = Math.round(b / 10) * 10;
        const color = `${rRounded},${gRounded},${bRounded}`;

        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }

      // Convert color counts to color data with HSL
      Object.entries(colorCounts).forEach(([rgb, count]) => {
        const [r, g, b] = rgb.split(',').map(Number);
        const hsl = rgbToHsl(r, g, b);
        colorData.push({
          rgb,
          hue: hsl.h,
          saturation: hsl.s,
          lightness: hsl.l,
          count
        });
      });

      // Sort by count (most common first)
      colorData.sort((a, b) => b.count - a.count);

      if (colorData.length === 0) {
        // Fallback colors based on mode
        const fallback = isDarkMode 
          ? [
              { primary: '#60A5FA', accent: '#34D399', name: 'Ocean Blue' },
              { primary: '#34D399', accent: '#60A5FA', name: 'Emerald Green' }
            ]
          : [
              { primary: '#1E3A8A', accent: '#14B8A6', name: 'Deep Blue' },
              { primary: '#14B8A6', accent: '#1E3A8A', name: 'Teal Wave' }
            ];
        resolve({ options: fallback });
        return;
      }

      const rgbToHex = (rgb: string) => {
        const [r, g, b] = rgb.split(',').map(Number);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      };

      // Group colors by spectrum
      const spectrumGroups: { [key: string]: ColorData[] } = {};
      colorData.forEach(color => {
        const spectrum = getColorSpectrum(color);
        if (!spectrumGroups[spectrum]) {
          spectrumGroups[spectrum] = [];
        }
        spectrumGroups[spectrum].push(color);
      });

      // Get the most representative color from each spectrum (highest count)
      const spectrumRepresentatives: { [key: string]: ColorData } = {};
      Object.entries(spectrumGroups).forEach(([spectrum, colors]) => {
        // Sort by count and take the most common
        colors.sort((a, b) => b.count - a.count);
        spectrumRepresentatives[spectrum] = colors[0];
      });

      // Calculate contrast between two spectrums
      const getSpectrumContrast = (spectrum1: string, spectrum2: string, color1: ColorData, color2: ColorData): number => {
        // Neutral colors (Grey, White, Black) can pair with any saturated color
        const neutrals = ['Grey', 'White', 'Black'];
        const isNeutral1 = neutrals.includes(spectrum1);
        const isNeutral2 = neutrals.includes(spectrum2);
        
        // Neutral + Saturated = good contrast
        if ((isNeutral1 && !isNeutral2) || (!isNeutral1 && isNeutral2)) {
          return 0.9;
        }
        
        // Two neutrals = low contrast
        if (isNeutral1 && isNeutral2) {
          // But white + black or grey can still work
          const lightnessDiff = Math.abs(color1.lightness - color2.lightness);
          return lightnessDiff / 100 * 0.6;
        }
        
        // For saturated colors, use hue distance
        const hueDiff = Math.abs(color1.hue - color2.hue);
        const circularHueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        // Complementary colors (180° apart) = maximum contrast
        // Adjacent colors (< 60° apart) = low contrast
        return circularHueDiff / 180;
      };

      // Find all spectrum pairs sorted by contrast
      const spectrumPairs: Array<{ 
        spectrum1: string; 
        spectrum2: string; 
        color1: ColorData; 
        color2: ColorData; 
        contrast: number;
        totalCount: number;
      }> = [];

      const spectrumNames = Object.keys(spectrumRepresentatives);
      for (let i = 0; i < spectrumNames.length; i++) {
        for (let j = i + 1; j < spectrumNames.length; j++) {
          const s1 = spectrumNames[i];
          const s2 = spectrumNames[j];
          const c1 = spectrumRepresentatives[s1];
          const c2 = spectrumRepresentatives[s2];
          
          const contrast = getSpectrumContrast(s1, s2, c1, c2);
          const totalCount = c1.count + c2.count;
          
          spectrumPairs.push({
            spectrum1: s1,
            spectrum2: s2,
            color1: c1,
            color2: c2,
            contrast,
            totalCount
          });
        }
      }

      // Sort by contrast first, then by popularity
      spectrumPairs.sort((a, b) => {
        const contrastDiff = b.contrast - a.contrast;
        if (Math.abs(contrastDiff) > 0.1) return contrastDiff;
        return b.totalCount - a.totalCount;
      });

      // Generate options from the most contrasting spectrum pairs
      const options: Array<{ primary: string; accent: string; name: string }> = [];
      const usedPairs = new Set<string>();

      // Add the top 5 most contrasting pairs
      for (const pair of spectrumPairs) {
        if (options.length >= 5) break;
        
        const pairKey1 = `${pair.spectrum1}-${pair.spectrum2}`;
        const pairKey2 = `${pair.spectrum2}-${pair.spectrum1}`;
        
        if (!usedPairs.has(pairKey1) && !usedPairs.has(pairKey2)) {
          // Add normal pair
          options.push({
            primary: rgbToHex(pair.color1.rgb),
            accent: rgbToHex(pair.color2.rgb),
            name: `${pair.spectrum1} & ${pair.spectrum2}`
          });
          
          usedPairs.add(pairKey1);
          
          // Add reversed pair if we need more options
          if (options.length < 5) {
            options.push({
              primary: rgbToHex(pair.color2.rgb),
              accent: rgbToHex(pair.color1.rgb),
              name: `${pair.spectrum2} & ${pair.spectrum1}`
            });
          }
        }
      }

      // If we have multiple colors in a spectrum, add variations
      if (options.length < 5) {
        for (const [spectrum, colors] of Object.entries(spectrumGroups)) {
          if (options.length >= 5) break;
          if (colors.length >= 2) {
            // Find most contrasting pair within the same spectrum
            let maxContrast = 0;
            let bestPair: [ColorData, ColorData] | null = null;
            
            for (let i = 0; i < Math.min(colors.length, 5); i++) {
              for (let j = i + 1; j < Math.min(colors.length, 5); j++) {
                const lightnessDiff = Math.abs(colors[i].lightness - colors[j].lightness);
                const satDiff = Math.abs(colors[i].saturation - colors[j].saturation);
                const contrast = (lightnessDiff + satDiff) / 2;
                
                if (contrast > maxContrast) {
                  maxContrast = contrast;
                  bestPair = [colors[i], colors[j]];
                }
              }
            }
            
            if (bestPair && maxContrast > 30) {
              const opt1 = rgbToHex(bestPair[0].rgb);
              const opt2 = rgbToHex(bestPair[1].rgb);
              
              if (!options.some(o => o.primary === opt1 && o.accent === opt2)) {
                options.push({
                  primary: opt1,
                  accent: opt2,
                  name: `${spectrum} Tones`
                });
              }
            }
          }
        }
      }

      resolve({ options: options.slice(0, 5) });
    };

    img.onerror = () => {
      const fallback = isDarkMode 
        ? [
            { primary: '#60A5FA', accent: '#34D399', name: 'Ocean Blue' },
            { primary: '#34D399', accent: '#60A5FA', name: 'Emerald Green' }
          ]
        : [
            { primary: '#1E3A8A', accent: '#14B8A6', name: 'Deep Blue' },
            { primary: '#14B8A6', accent: '#1E3A8A', name: 'Teal Wave' }
          ];
      resolve({ options: fallback });
    };

    img.src = imageDataUrl;
  });
};

export function CustomBrandingSection({ businessData, onUpdateBusinessData, onUpgrade }: CustomBrandingSectionProps) {
  const { hasCustomBranding, subscription } = usePremiumFeatures();
  const [brandColor, setBrandColor] = useState(businessData.brandColor || '#1E3A8A');
  const [accentColor, setAccentColor] = useState(businessData.accentColor || '#14B8A6');
  const [invoiceTemplate, setInvoiceTemplate] = useState(businessData.invoiceTemplate || 'modern');
  // Use customLogo if available, otherwise use the business logo from settings
  const [customLogo, setCustomLogo] = useState(businessData.customLogo || businessData.logo || '');
  const [saving, setSaving] = useState(false);
  const [extractingColors, setExtractingColors] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [colorOptions, setColorOptions] = useState<Array<{ primary: string; accent: string; name: string }>>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        setCustomLogo(dataUrl);
        
        // Automatically extract colors from the logo
        setExtractingColors(true);
        toast.info('Extracting colors from your logo...');
        
        try {
          const { options } = await extractColorsFromImage(dataUrl);
          if (options.length > 0) {
            setColorOptions(options);
            setShowColorOptions(true);
            toast.success(`Found ${options.length} color combinations from your logo!`);
          } else {
            toast.info('Logo uploaded! Set your colors manually.');
          }
        } catch (error) {
          console.error('Error extracting colors:', error);
          toast.info('Logo uploaded! Set your colors manually.');
        } finally {
          setExtractingColors(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectColorOption = (option: { primary: string; accent: string; name: string }) => {
    setBrandColor(option.primary);
    setAccentColor(option.accent);
    setShowColorOptions(false);
    toast.success(`Applied ${option.name} color scheme!`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        ...businessData,
        brandColor,
        accentColor,
        invoiceTemplate,
        customLogo,
      };
      
      // Save to backend
      await businessApi.update(updatedData);
      
      // Update parent component state
      onUpdateBusinessData(updatedData);
      toast.success('Branding settings saved successfully!');
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast.error('Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };

  // Premium feature gate
  if (!hasCustomBranding) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-purple-600" />
            <div>
              <h3>Custom Branding</h3>
              <p className="text-sm text-muted-foreground">Customize your invoice appearance</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>

        <Alert className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-sm">
            <strong className="text-purple-900">Unlock Custom Branding</strong>
            <p className="text-purple-800 mt-2 mb-4">
              Make your invoices stand out with custom colors, logos, and templates that match your brand identity.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Custom brand colors</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Upload your logo</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Professional invoice templates</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800">
                <Check className="w-4 h-4" />
                <span>Consistent brand experience</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={onUpgrade}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Branding settings for Premium/Trial users
  return (
    <>
      {/* Color Options Dialog */}
      <Dialog open={showColorOptions} onOpenChange={setShowColorOptions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-600" />
              Choose Your Brand Colors
            </DialogTitle>
            <DialogDescription>
              We extracted {colorOptions.length} color combinations from your logo. Select one to apply it instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {colorOptions.map((option, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary"
                onClick={() => handleSelectColorOption(option)}
              >
                <div className="flex items-center gap-4">
                  {/* Color Preview */}
                  <div className="flex gap-2">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: option.primary }}
                      title={`Primary: ${option.primary}`}
                    />
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: option.accent }}
                      title={`Accent: ${option.accent}`}
                    />
                  </div>

                  {/* Option Details */}
                  <div className="flex-1">
                    <h4 className="font-medium">{option.name}</h4>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Primary: {option.primary}</span>
                      <span>Accent: {option.accent}</span>
                    </div>
                  </div>

                  {/* Mini Preview */}
                  <div className="hidden md:block">
                    <div className="w-32 h-20 border border-border rounded-lg p-2 bg-white">
                      <div className="h-3 rounded" style={{ backgroundColor: option.primary, width: '70%' }} />
                      <div className="h-2 rounded mt-1" style={{ backgroundColor: option.accent, width: '50%' }} />
                      <div className="h-2 rounded mt-1 bg-muted" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowColorOptions(false)}>
              Skip & Set Manually
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-purple-600" />
            <div>
              <h3>Custom Branding</h3>
              <p className="text-sm text-muted-foreground">Customize your invoice appearance</p>
            </div>
          </div>
          {subscription?.isTrial && (
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Trial Feature
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Custom Logo
            </Label>
            <div className="flex items-center gap-4">
              {customLogo && (
                <div className="w-24 h-24 border-2 border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <img src={customLogo} alt="Custom Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {customLogo ? 'Change Logo' : 'Upload Logo'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: PNG or SVG, 500x500px
                </p>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand-color" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Primary Brand Color
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="brand-color"
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="flex-1"
                  placeholder="#1E3A8A"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Accent Color
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1"
                  placeholder="#14B8A6"
                />
              </div>
            </div>
          </div>

          {/* Invoice Template */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Invoice Template
            </Label>
            <div className="flex gap-2">
              {['modern', 'classic', 'minimal'].map((template) => (
                <Button
                  key={template}
                  variant={invoiceTemplate === template ? 'default' : 'outline'}
                  onClick={() => setInvoiceTemplate(template)}
                  className="flex-1 capitalize"
                >
                  {invoiceTemplate === template && <Check className="w-4 h-4 mr-2" />}
                  {template}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Brand Preview</Label>
            {/* Invoice-like preview with white background */}
            <div className="bg-white border-2 border-border rounded-lg p-8 shadow-sm">
              {/* Modern Template - Clean with accent bar */}
              {invoiceTemplate === 'modern' && (
                <div className="space-y-6">
                  {/* Header with colored accent bar */}
                  <div className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {customLogo ? (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: brandColor }}>
                            <img src={customLogo} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: brandColor }}>
                            <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-700 truncate">Your Business</div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                        <div className="font-semibold text-base sm:text-lg" style={{ color: brandColor }}>INVOICE</div>
                        <div className="text-xs sm:text-sm text-gray-600">#001</div>
                        <div className="text-xs text-gray-400 mt-1">Nov 12, 2025</div>
                      </div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div>
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: accentColor }}>Bill To</div>
                    <div className="text-sm text-gray-700">Sample Customer</div>
                    <div className="text-xs text-gray-500">customer@email.com</div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wider pb-2 border-b" style={{ color: brandColor }}>
                      <div className="col-span-7">Description</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-3 text-right">Amount</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 text-sm py-2">
                      <div className="col-span-7 text-gray-700">Professional Service</div>
                      <div className="col-span-2 text-center text-gray-600">2</div>
                      <div className="col-span-3 text-right text-gray-700">$100.00</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 text-sm py-2">
                      <div className="col-span-7 text-gray-700">Consultation</div>
                      <div className="col-span-2 text-center text-gray-600">1</div>
                      <div className="col-span-3 text-right text-gray-700">$50.00</div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 pt-3" style={{ borderColor: accentColor }}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold" style={{ color: brandColor }}>TOTAL DUE</span>
                      <span className="text-xl font-bold" style={{ color: brandColor }}>$150.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Classic Template - Traditional with header box */}
              {invoiceTemplate === 'classic' && (
                <div className="space-y-6">
                  {/* Header with colored background box */}
                  <div className="rounded-lg p-4 md:p-6 -mx-2" style={{ backgroundColor: brandColor }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {customLogo ? (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 sm:border-4 border-white flex-shrink-0">
                            <img src={customLogo} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 border-3 sm:border-4 border-white flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                          </div>
                        )}
                        <div className="text-white min-w-0 flex-1">
                          <div className="font-semibold text-sm sm:text-base truncate">Your Business</div>
                          <div className="text-xs opacity-90 truncate">123 Main St, City, ST</div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right text-white flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold">INVOICE</div>
                        <div className="text-xs sm:text-sm opacity-90">#001</div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold mb-1 text-gray-500">BILL TO</div>
                      <div className="text-sm text-gray-700">Sample Customer</div>
                      <div className="text-xs text-gray-500">customer@email.com</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold mb-1 text-gray-500">DATE</div>
                      <div className="text-sm text-gray-700">Nov 12, 2025</div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2" style={{ borderColor: brandColor }}>
                        <th className="text-left py-2 text-xs font-semibold text-gray-700">DESCRIPTION</th>
                        <th className="text-center py-2 text-xs font-semibold text-gray-700">QTY</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-700">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-sm text-gray-700">Professional Service</td>
                        <td className="py-3 text-center text-sm text-gray-600">2</td>
                        <td className="py-3 text-right text-sm text-gray-700">$100.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-sm text-gray-700">Consultation</td>
                        <td className="py-3 text-center text-sm text-gray-600">1</td>
                        <td className="py-3 text-right text-sm text-gray-700">$50.00</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Total */}
                  <div className="flex justify-end">
                    <div className="w-full sm:w-64 rounded-lg p-4" style={{ backgroundColor: accentColor + '20', borderLeft: `4px solid ${accentColor}` }}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700 text-sm sm:text-base">TOTAL DUE</span>
                        <span className="text-xl sm:text-2xl font-bold" style={{ color: brandColor }}>$150.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Minimal Template - Clean and simple */}
              {invoiceTemplate === 'minimal' && (
                <div className="space-y-8">
                  {/* Minimal Header */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {customLogo ? (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: brandColor }}>
                          <img src={customLogo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-50 border flex items-center justify-center flex-shrink-0" style={{ borderColor: brandColor }}>
                          <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400">FROM</div>
                        <div className="text-sm text-gray-700 truncate">Your Business</div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                      <div className="text-2xl sm:text-3xl font-light tracking-tight" style={{ color: brandColor }}>Invoice</div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">#001 • Nov 12, 2025</div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div>
                    <div className="text-xs text-gray-400 mb-2">TO</div>
                    <div className="text-sm text-gray-700">Sample Customer</div>
                    <div className="text-xs text-gray-500 mt-1">customer@email.com</div>
                  </div>

                  {/* Minimal Items */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <div className="text-sm text-gray-700">Professional Service</div>
                        <div className="text-xs text-gray-400 mt-1">Qty: 2</div>
                      </div>
                      <div className="text-sm text-gray-700">$100.00</div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <div className="text-sm text-gray-700">Consultation</div>
                        <div className="text-xs text-gray-400 mt-1">Qty: 1</div>
                      </div>
                      <div className="text-sm text-gray-700">$50.00</div>
                    </div>
                  </div>

                  {/* Minimal Total */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-sm text-gray-500">Total Due</span>
                    <span className="text-3xl font-light tracking-tight" style={{ color: brandColor }}>$150.00</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Branding Settings'}
          </Button>
        </div>
      </Card>
    </>
  );
}