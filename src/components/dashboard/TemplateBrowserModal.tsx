import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';

interface TemplateBrowserModalProps {
  open: boolean;
  onClose: () => void;
  currentTemplate: string;
  onTemplateSelected: (templateId: string) => void;
  brandColor: string;
  accentColor: string;
  businessProfile: any;
  customLogo?: string;
}

// All 15 templates
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

const CATEGORIES = ['All', 'Professional', 'Creative', 'Tech', 'Premium'];

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '30, 58, 138'; // Default blue
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

export function TemplateBrowserModal({
  open,
  onClose,
  currentTemplate,
  onTemplateSelected,
  brandColor,
  accentColor,
  businessProfile,
  customLogo
}: TemplateBrowserModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(currentTemplate);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get RGB values for gradients
  const primaryColorRgb = hexToRgb(brandColor);
  const accentColorRgb = hexToRgb(accentColor);

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'All' 
    ? INVOICE_TEMPLATES 
    : INVOICE_TEMPLATES.filter(t => t.category === selectedCategory);

  // Update current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Navigate between templates
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredTemplates.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredTemplates.length - 1 ? prev + 1 : 0));
  };

  const currentTemplateData = filteredTemplates[currentIndex];

  const handleSelect = () => {
    if (currentTemplateData) {
      setSelectedTemplateId(currentTemplateData.id);
      onTemplateSelected(currentTemplateData.id);
      toast.success(`${currentTemplateData.name} template selected!`);
      onClose();
    }
  };

  const renderTemplatePreview = (template: typeof INVOICE_TEMPLATES[0]) => {
    // Use actual business data if available, fallback to sample data
    const sampleData = {
      businessName: businessProfile?.businessName || "Your Business",
      email: businessProfile?.email || "hello@yourbusiness.com",
      phone: businessProfile?.phone || "(555) 123-4567",
      address: businessProfile?.address || "123 Business Ave\nYour City, ST 12345",
      logo: customLogo || businessProfile?.customLogo || businessProfile?.logo || null,
      businessInitials: businessProfile?.businessName?.substring(0, 2).toUpperCase() || "YB",
      invoiceNumber: "INV-001",
      date: "Nov 15, 2024",
      dueDate: "Dec 15, 2024",
      customerName: "John Smith",
      customerAddress: "123 Main St\nNew York, NY 10001",
      items: [
        { name: "Web Design Services", qty: 1, rate: 2500, total: 2500 },
        { name: "Development Hours", qty: 20, rate: 150, total: 3000 }
      ],
      subtotal: 5500,
      tax: 550,
      total: 6050
    };

    // Logo component (used by multiple templates)
    const LogoCircle = ({ size, fontSize, bgColor }: { size: number; fontSize: number; bgColor?: string }) => (
      <div 
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          backgroundColor: bgColor || brandColor,
          color: 'white'
        }}
      >
        {sampleData.logo ? (
          <img src={sampleData.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
        ) : (
          <span style={{ fontWeight: 700, fontSize: `${fontSize}px` }}>{sampleData.businessInitials}</span>
        )}
      </div>
    );

    switch (template.id) {
      // TEMPLATE 1: MODERN
      case 'modern':
        return (
          <div className="p-6 sm:p-8">
            <div className="flex gap-3">
              {/* Accent Bar */}
              <div className="w-1 rounded-sm flex-shrink-0" style={{ backgroundColor: accentColor }}></div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-col justify-between items-start gap-4 mb-6">
                  <div className="min-w-0 flex gap-3 items-start">
                    {/* Logo (48px circle) */}
                    <LogoCircle size={48} fontSize={18} />

                    <div>
                      <h1 className="text-xl mb-2 text-gray-900">{sampleData.businessName}</h1>
                      <p className="text-xs mb-0.5 text-gray-600">{sampleData.email}</p>
                      <p className="text-xs text-gray-600">{sampleData.phone}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="text-lg mb-1 text-gray-900">INVOICE</div>
                    <div className="text-xs text-gray-600">#{sampleData.invoiceNumber}</div>
                  </div>
                </div>

                {/* Bill To & Invoice Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-2">Bill To</div>
                    <div className="font-medium mb-1 text-gray-900">{sampleData.customerName}</div>
                    <div className="text-xs text-gray-600 whitespace-pre-line">{sampleData.customerAddress}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase text-gray-500 mb-2">Invoice Details</div>
                    <div className="text-xs mb-1 text-gray-900">
                      <span className="text-gray-600">Date:</span> {sampleData.date}
                    </div>
                    <div className="text-xs text-gray-900">
                      <span className="text-gray-600">Due Date:</span> {sampleData.dueDate}
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${accentColor}` }}>
                        <th className="text-left py-2 text-xs text-gray-900">Description</th>
                        <th className="text-center px-2 py-2 text-xs text-gray-900">Qty</th>
                        <th className="text-right px-2 py-2 text-xs text-gray-900">Rate</th>
                        <th className="text-right py-2 text-xs text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="py-3">
                            <div className="font-medium text-gray-900 text-xs">{item.name}</div>
                          </td>
                          <td className="text-center text-gray-900 text-xs">{item.qty}</td>
                          <td className="text-right text-gray-900 text-xs">${item.rate.toLocaleString()}</td>
                          <td className="text-right font-medium text-gray-900 text-xs">${item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-6">
                  <div className="w-full max-w-72">
                    <div className="flex justify-between py-2 text-sm border-b border-gray-200">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${sampleData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm border-b border-gray-200">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="text-gray-900">${sampleData.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 text-lg text-gray-900">
                      <span className="font-medium">Total Due</span>
                      <span className="font-medium">${sampleData.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs uppercase text-gray-500 mb-2">Notes</div>
                  <p className="text-xs text-gray-600 m-0">Payment is due within 30 days. Thank you for your business!</p>
                </div>
              </div>
            </div>
          </div>
        );

      // TEMPLATE 2: CLASSIC
      case 'classic':
        return (
          <div className="p-8 sm:p-12">
            {/* Colored Header */}
            <div className="mb-8 p-6 rounded-lg text-white" style={{ backgroundColor: brandColor }}>
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  {/* Logo with white background (56px circle) */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'white', color: brandColor }}
                  >
                    {sampleData.logo ? (
                      <img src={sampleData.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="font-bold text-xl">{sampleData.businessInitials}</span>
                    )}
                  </div>

                  <div>
                    <h1 className="text-3xl mb-2">{sampleData.businessName}</h1>
                    <p className="text-sm opacity-90">{sampleData.email} • {sampleData.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl mb-1">INVOICE</div>
                  <div className="text-sm">#{sampleData.invoiceNumber}</div>
                </div>
              </div>
            </div>

            <div className="px-6">
              {/* Bill To & Invoice Details */}
              <div className="grid grid-cols-2 gap-6 mb-8 pb-6 border-b-2 border-gray-200">
                <div>
                  <div className="text-xs uppercase mb-2" style={{ color: brandColor }}>Bill To</div>
                  <div className="font-medium mb-1 text-black">{sampleData.customerName}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{sampleData.customerAddress}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase mb-2" style={{ color: brandColor }}>Invoice Date</div>
                  <div className="text-sm mb-3 text-black">{sampleData.date}</div>
                  <div className="text-xs uppercase mb-2" style={{ color: brandColor }}>Due Date</div>
                  <div className="text-sm text-black">{sampleData.dueDate}</div>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full mb-8 border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 text-sm text-black">Item Description</th>
                    <th className="text-center p-3 text-sm text-black">Qty</th>
                    <th className="text-right p-3 text-sm text-black">Rate</th>
                    <th className="text-right p-3 text-sm text-black">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="p-3">
                        <div className="font-medium text-black">{item.name}</div>
                      </td>
                      <td className="text-center p-3 text-black">{item.qty}</td>
                      <td className="text-right p-3 text-black">${item.rate.toLocaleString()}</td>
                      <td className="text-right p-3 font-medium text-black">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-72">
                  <div className="flex justify-between py-2 text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 text-gray-600">
                    <span>Tax</span>
                    <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-xl border-t-2 border-gray-300" style={{ color: brandColor }}>
                    <span>Total Due</span>
                    <span>${sampleData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-6 border-t border-gray-200">
                <div className="text-xs uppercase mb-2" style={{ color: brandColor }}>Payment Terms</div>
                <p className="text-sm text-gray-600 m-0">Payment is due within 30 days. Thank you for your business!</p>
              </div>
            </div>
          </div>
        );

      // TEMPLATE 3: MINIMAL
      case 'minimal':
        return (
          <div className="p-12" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header with Logo */}
            <div className="flex items-center gap-4 mb-12">
              {/* Logo (56px circle) */}
              <LogoCircle size={56} fontSize={21} />
              <h1 className="text-4xl m-0 text-gray-900">{sampleData.businessName}</h1>
            </div>

            {/* From/To Section */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <div className="text-xs uppercase text-gray-400 mb-3 tracking-wide">From</div>
                <div className="text-sm text-gray-700">
                  <div>{sampleData.email}</div>
                  <div>{sampleData.phone}</div>
                  <div className="whitespace-pre-line">{sampleData.address}</div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400 mb-3 tracking-wide">To</div>
                <div className="text-sm text-gray-700">
                  <div className="font-medium text-gray-900">{sampleData.customerName}</div>
                  <div className="whitespace-pre-line">{sampleData.customerAddress}</div>
                </div>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="flex justify-between items-baseline mb-12 pb-6 border-b border-gray-300">
              <div>
                <div className="text-xs uppercase text-gray-400 mb-1 tracking-wide">Invoice Number</div>
                <div className="text-lg text-gray-900">{sampleData.invoiceNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase text-gray-400 mb-1 tracking-wide">Date</div>
                <div className="text-lg text-gray-900">{sampleData.date}</div>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-12 border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left pb-3 text-xs uppercase text-gray-400 font-normal tracking-wide">Item</th>
                  <th className="text-center pb-3 text-xs uppercase text-gray-400 font-normal tracking-wide">Qty</th>
                  <th className="text-right pb-3 text-xs uppercase text-gray-400 font-normal tracking-wide">Rate</th>
                  <th className="text-right pb-3 text-xs uppercase text-gray-400 font-normal tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-4">
                      <div className="text-gray-900">{item.name}</div>
                    </td>
                    <td className="text-center text-gray-700">{item.qty}</td>
                    <td className="text-right text-gray-700">${item.rate.toLocaleString()}</td>
                    <td className="text-right text-gray-900">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="flex justify-between py-3 text-gray-700 border-b border-gray-200">
                  <span>Subtotal</span>
                  <span>${sampleData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 text-gray-700 border-b border-gray-200">
                  <span>Tax</span>
                  <span>${sampleData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-4 text-2xl text-gray-900">
                  <span>Total</span>
                  <span>${sampleData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 4: BOLD
      case 'bold':
        return (
          <div>
            {/* Gradient Header */}
            <div 
              className="h-24 flex items-center justify-between px-12 text-white"
              style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)` }}
            >
              <h1 className="text-3xl m-0">{sampleData.businessName}</h1>
              <div className="text-right">
                <div className="text-2xl mb-1">INVOICE</div>
                <div className="text-sm opacity-90">#{sampleData.invoiceNumber}</div>
              </div>
            </div>

            <div className="p-12">
              {/* Bill To & Invoice Details */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="text-xs uppercase mb-3" style={{ color: brandColor }}>Billed To</div>
                  <div className="font-medium text-lg mb-2 text-gray-900">{sampleData.customerName}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{sampleData.customerAddress}</div>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <div className="text-xs uppercase text-gray-500 mb-1">Invoice Date</div>
                    <div className="font-medium text-gray-900">{sampleData.date}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-1">Payment Due</div>
                    <div className="font-medium text-gray-900">{sampleData.dueDate}</div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full mb-8 border-collapse">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${accentColor}` }}>
                    <th className="text-left py-4 text-sm uppercase tracking-wide text-black">Service</th>
                    <th className="text-center px-4 py-4 text-sm uppercase tracking-wide text-black">Qty</th>
                    <th className="text-right px-4 py-4 text-sm uppercase tracking-wide text-black">Price</th>
                    <th className="text-right py-4 text-sm uppercase tracking-wide text-black">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="text-center text-black">{item.qty}</td>
                      <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                      <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Box */}
              <div className="flex justify-end">
                <div 
                  className="w-80 p-6 rounded-lg" 
                  style={{ backgroundColor: `rgba(${accentColorRgb}, 0.08)` }}
                >
                  <div className="flex justify-between py-2 text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">${sampleData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 text-gray-700">
                    <span>Tax (10%)</span>
                    <span className="font-medium text-black">${sampleData.tax.toLocaleString()}</span>
                  </div>
                  <div 
                    className="flex justify-between py-3 mt-2 text-2xl border-t-2"
                    style={{ borderColor: accentColor, color: brandColor }}
                  >
                    <span>Amount Due</span>
                    <span>${sampleData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div 
                className="mt-10 p-4 rounded border-l-4 bg-gray-50"
                style={{ borderColor: accentColor }}
              >
                <div className="text-xs uppercase mb-2" style={{ color: brandColor }}>Payment Instructions</div>
                <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
              </div>
            </div>
          </div>
        );

      // TEMPLATE 5: ELEGANT
      case 'elegant':
        return (
          <div className="p-12" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Centered Header */}
            <div className="text-center mb-12 pb-8 border-b-2 border-gray-300">
              <h1 className="text-5xl m-0 mb-4 text-gray-900">{sampleData.businessName}</h1>
              <p className="text-gray-600 m-0">{sampleData.email} | {sampleData.phone}</p>
              <p className="text-sm text-gray-500 mt-2 mb-0 whitespace-pre-line">{sampleData.address}</p>
            </div>

            {/* Invoice To & Info */}
            <div className="flex justify-between mb-8">
              <div>
                <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">Invoice To</div>
                <div className="text-xl mb-2 text-gray-900">{sampleData.customerName}</div>
                <div className="text-sm text-gray-500 whitespace-pre-line">{sampleData.customerAddress}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl mb-2 tracking-wide" style={{ color: brandColor }}>INVOICE</div>
                <div className="text-sm text-gray-500 mb-1">Number: {sampleData.invoiceNumber}</div>
                <div className="text-sm text-gray-500 mb-1">Date: {sampleData.date}</div>
                <div className="text-sm text-gray-500">Due: {sampleData.dueDate}</div>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-10 border-collapse">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-400">
                  <th className="text-left py-4 text-sm uppercase tracking-widest text-gray-900">Description</th>
                  <th className="text-center px-4 py-4 text-sm uppercase tracking-widest text-gray-900">Quantity</th>
                  <th className="text-right px-4 py-4 text-sm uppercase tracking-widest text-gray-900">Rate</th>
                  <th className="text-right py-4 text-sm uppercase tracking-widest text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="py-4">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="text-center text-black">{item.qty}</td>
                    <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                    <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-96 border-t-2 border-gray-400 pt-4">
                <div className="flex justify-between py-2 text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-500">
                  <span>Tax</span>
                  <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                </div>
                <div 
                  className="flex justify-between py-4 mt-2 text-2xl border-t-2 border-gray-400"
                  style={{ color: brandColor }}
                >
                  <span>Total Due</span>
                  <span>${sampleData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-12 pt-8 border-t border-gray-300 text-center">
              <p className="text-sm text-gray-500 italic m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 6: CREATIVE
      case 'creative':
        return (
          <div className="p-10">
            <div className="mb-10 flex items-start justify-between">
              <div className="flex-1">
                {/* Business Name Pill */}
                <div 
                  className="inline-block px-6 py-3 rounded-full mb-4"
                  style={{ backgroundColor: accentColor }}
                >
                  <h1 className="text-2xl text-white m-0">{sampleData.businessName}</h1>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{sampleData.email}</div>
                  <div>{sampleData.phone}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl mb-2" style={{ color: brandColor }}>INVOICE</div>
                <div 
                  className="px-4 py-2 rounded inline-block text-white text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  #{sampleData.invoiceNumber}
                </div>
              </div>
            </div>

            {/* Bill To & Details Cards */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {/* Bill To Card */}
              <div 
                className="p-6 rounded-xl"
                style={{ backgroundColor: `rgba(${primaryColorRgb}, 0.06)` }}
              >
                <div 
                  className="text-xs uppercase mb-3 tracking-wide"
                  style={{ color: brandColor }}
                >Bill To</div>
                <div className="font-medium text-lg mb-1 text-gray-900">{sampleData.customerName}</div>
                <div className="text-sm text-gray-800 whitespace-pre-line">{sampleData.customerAddress}</div>
              </div>
              {/* Invoice Details Card */}
              <div 
                className="p-6 rounded-xl text-right"
                style={{ backgroundColor: `rgba(${accentColorRgb}, 0.06)` }}
              >
                <div 
                  className="text-xs uppercase mb-3 tracking-wide"
                  style={{ color: accentColor }}
                >Invoice Details</div>
                <div className="text-sm mb-2 text-gray-900">
                  <span className="text-gray-700">Date:</span> {sampleData.date}
                </div>
                <div className="text-sm text-gray-900">
                  <span className="text-gray-700">Due Date:</span> {sampleData.dueDate}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-xl overflow-hidden mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-white" style={{ backgroundColor: brandColor }}>
                    <th className="text-left p-4">Item</th>
                    <th className="text-center p-4">Qty</th>
                    <th className="text-right p-4">Rate</th>
                    <th className="text-right p-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.items.map((item, idx) => (
                    <tr key={idx} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="p-4">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="text-center text-black">{item.qty}</td>
                      <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                      <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${sampleData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-gray-900">${sampleData.tax.toLocaleString()}</span>
                </div>
                <div 
                  className="flex justify-between py-3 mt-2 text-xl border-t-2"
                  style={{ borderColor: accentColor, color: brandColor }}
                >
                  <span className="font-medium">Total Due</span>
                  <span className="font-medium">${sampleData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div 
              className="mt-10 p-6 rounded-xl border-2"
              style={{ borderColor: accentColor }}
            >
              <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 7: CORPORATE
      case 'corporate':
        return (
          <div className="p-10">
            {/* Header with Logo and Invoice Box */}
            <div 
              className="flex justify-between items-start mb-10 pb-8 border-b-2"
              style={{ borderColor: brandColor }}
            >
              <div className="flex gap-4">
                {/* Logo (64px circle) */}
                <LogoCircle size={64} fontSize={20} />
                
                {/* Business Info */}
                <div>
                  <h1 className="text-3xl m-0 mb-4" style={{ color: brandColor }}>{sampleData.businessName}</h1>
                  <div className="text-sm text-gray-800">
                    <div>{sampleData.email} | {sampleData.phone}</div>
                  </div>
                </div>
              </div>
              
              {/* Invoice Box */}
              <div className="text-right">
                <div className="bg-gray-100 px-4 py-4 rounded inline-block">
                  <div className="text-2xl mb-2" style={{ color: brandColor }}>INVOICE</div>
                  <div className="text-sm text-gray-800">
                    <div className="mb-1"><strong>No:</strong> {sampleData.invoiceNumber}</div>
                    <div className="mb-1"><strong>Date:</strong> {sampleData.date}</div>
                    <div><strong>Due:</strong> {sampleData.dueDate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice To */}
            <div className="mb-8">
              <div className="bg-gray-50 p-6 rounded">
                <div 
                  className="text-xs uppercase mb-2 tracking-wide"
                  style={{ color: brandColor }}
                >Invoice To</div>
                <div className="font-medium text-lg mb-1 text-gray-900">{sampleData.customerName}</div>
                <div className="text-sm text-gray-800 whitespace-pre-line">{sampleData.customerAddress}</div>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-8 border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 text-sm text-gray-900">Description</th>
                  <th className="text-center p-4 text-sm text-gray-900">Qty</th>
                  <th className="text-right p-4 text-sm text-gray-900">Unit Price</th>
                  <th className="text-right p-4 text-sm text-gray-900">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-4">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="text-center text-black">{item.qty}</td>
                    <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                    <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>Subtotal</span>
                  <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>Tax (10%)</span>
                  <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                </div>
                <div 
                  className="flex justify-between py-3 px-4 text-white text-xl"
                  style={{ backgroundColor: brandColor }}
                >
                  <span>Total Due</span>
                  <span>${sampleData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-10 p-6 bg-gray-50 rounded">
              <div 
                className="text-xs uppercase mb-2 tracking-wide"
                style={{ color: brandColor }}
              >Terms & Conditions</div>
              <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 8: COMPACT
      case 'compact':
        return (
          <div className="p-6">
            {/* Header with accent border */}
            <div 
              className="flex justify-between items-start mb-6 pb-4 border-b-2"
              style={{ borderColor: accentColor }}
            >
              <div>
                <h1 className="text-2xl m-0 mb-1 text-gray-900">{sampleData.businessName}</h1>
                <div className="text-xs text-gray-800">{sampleData.email} • {sampleData.phone}</div>
              </div>
              <div className="text-right">
                <div className="text-xl mb-1" style={{ color: brandColor }}>INVOICE</div>
                <div className="text-xs text-gray-800">#{sampleData.invoiceNumber}</div>
              </div>
            </div>

            {/* Bill To & Details (2 columns) */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div>
                <div className="uppercase text-gray-700 mb-1">To</div>
                <div className="font-medium mb-1 text-gray-900">{sampleData.customerName}</div>
                <div className="text-gray-800 whitespace-pre-line">{sampleData.customerAddress}</div>
              </div>
              <div className="text-right">
                <div className="uppercase text-gray-700 mb-1">Details</div>
                <div className="mb-1 text-gray-900">Date: {sampleData.date}</div>
                <div className="text-gray-900">Due: {sampleData.dueDate}</div>
              </div>
            </div>

            {/* Line Items (compact table) */}
            <table className="w-full mb-6 text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 text-black">Item</th>
                  <th className="text-center p-2 text-black">Qty</th>
                  <th className="text-right p-2 text-black">Rate</th>
                  <th className="text-right p-2 text-black">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-4">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="text-center text-black">{item.qty}</td>
                    <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                    <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>Subtotal</span>
                  <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>Tax (10%)</span>
                  <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                </div>
                <div 
                  className="flex justify-between py-3 text-xl"
                  style={{ color: brandColor }}
                >
                  <span>Total</span>
                  <span>${sampleData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 9: SLEEK
      case 'sleek':
        return (
          <div>
            {/* Gradient Header with overlay */}
            <div className="h-32 relative overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, rgba(${primaryColorRgb}, 0.87) 0%, rgba(${accentColorRgb}, 0.87) 100%)` }}
              ></div>
              <div className="relative z-10 h-full flex items-center justify-between px-12 text-white">
                <h1 className="text-4xl m-0">{sampleData.businessName}</h1>
                <div className="text-right">
                  <div className="text-3xl mb-1">INVOICE</div>
                  <div className="text-sm opacity-90">#{sampleData.invoiceNumber}</div>
                </div>
              </div>
            </div>

            <div className="p-12">
              {/* Client Details & Invoice Info */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <div className="text-xs uppercase mb-3 tracking-wide text-gray-500">Client Details</div>
                  <div className="font-medium text-lg mb-2 text-gray-900">{sampleData.customerName}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{sampleData.customerAddress}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase mb-3 tracking-wide text-gray-500">Invoice Information</div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Invoice Date:</span>
                      <span className="font-medium text-gray-900">{sampleData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium text-gray-900">{sampleData.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items with gradient header */}
              <div className="rounded-lg overflow-hidden shadow-sm mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: `linear-gradient(135deg, rgba(${primaryColorRgb}, 0.08) 0%, rgba(${accentColorRgb}, 0.08) 100%)` }}>
                      <th className="text-left p-4 text-sm text-gray-900">Description</th>
                      <th className="text-center p-4 text-sm text-gray-900">Qty</th>
                      <th className="text-right p-4 text-sm text-gray-900">Rate</th>
                      <th className="text-right p-4 text-sm text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="p-4">
                          <div className="font-medium">{item.name}</div>
                        </td>
                        <td className="text-center text-black">{item.qty}</td>
                        <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                        <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals with gradient background */}
              <div className="flex justify-end">
                <div 
                  className="w-96 rounded-lg p-6"
                  style={{ background: `linear-gradient(135deg, rgba(${primaryColorRgb}, 0.06) 0%, rgba(${accentColorRgb}, 0.06) 100%)` }}
                >
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium text-black">${sampleData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Tax (10%)</span>
                    <span className="font-medium text-black">${sampleData.tax.toLocaleString()}</span>
                  </div>
                  <div 
                    className="flex justify-between py-4 mt-2 text-2xl border-t-2"
                    style={{ borderColor: accentColor, color: brandColor }}
                  >
                    <span>Total</span>
                    <span>${sampleData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div 
                className="mt-10 p-5 rounded-lg"
                style={{ backgroundColor: `rgba(${accentColorRgb}, 0.06)` }}
              >
                <div className="text-xs uppercase mb-2 tracking-wide" style={{ color: accentColor }}>Notes</div>
                <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
              </div>
            </div>
          </div>
        );

      // TEMPLATE 10: TECHNICAL
      case 'technical':
        return (
          <div className="p-10" style={{ fontFamily: "'Roboto Mono', 'Courier New', monospace" }}>
            <div className="border-2 border-gray-300 p-1 mb-8">
              <div 
                className="border border-gray-300 p-6 text-white"
                style={{ backgroundColor: brandColor }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm mb-1 opacity-80">SYSTEM: {sampleData.businessName}</div>
                    <h1 className="text-3xl m-0 tracking-wide">INVOICE_DOCUMENT</h1>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-1">#{sampleData.invoiceNumber}</div>
                    <div className="text-xs opacity-80">STATUS: PENDING_PAYMENT</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-gray-300 p-4">
                <div 
                  className="text-xs mb-3 uppercase tracking-widest"
                  style={{ color: brandColor }}
                >CLIENT_DATA</div>
                <div className="font-medium mb-2 text-gray-900">{sampleData.customerName}</div>
                <div className="text-sm text-gray-800 whitespace-pre-line">{sampleData.customerAddress}</div>
              </div>
              <div className="border-2 border-gray-300 p-4">
                <div 
                  className="text-xs mb-3 uppercase tracking-widest"
                  style={{ color: accentColor }}
                >TEMPORAL_INFO</div>
                <div className="text-sm mb-2 text-gray-900">
                  <span className="text-gray-700">ISSUED:</span> {sampleData.date}
                </div>
                <div className="text-sm text-gray-900">
                  <span className="text-gray-700">DUE_BY:</span> {sampleData.dueDate}
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 mb-8">
              <div className="bg-gray-100 p-3 border-b-2 border-gray-300">
                <div className="text-xs uppercase tracking-widest text-gray-900">LINE_ITEMS</div>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left p-3 text-gray-900">DESCRIPTION</th>
                    <th className="text-center p-3 text-gray-900">QTY</th>
                    <th className="text-right p-3 text-gray-900">RATE</th>
                    <th className="text-right p-3 text-gray-900">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-300">
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="text-center text-black">{item.qty}</td>
                      <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                      <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-96 border-2 border-gray-300">
                <div className="p-4 border-b border-gray-300">
                  <div className="flex justify-between text-sm mb-2">
                    <span>SUBTOTAL:</span>
                    <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TAX_AMOUNT:</span>
                    <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                  </div>
                </div>
                <div 
                  className="p-4 text-xl text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  <div className="flex justify-between">
                    <span>TOTAL_DUE:</span>
                    <span className="tracking-wide">${sampleData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-2 border-gray-300 p-4">
              <div 
                className="text-xs mb-2 uppercase tracking-widest"
                style={{ color: brandColor }}
              >ADDITIONAL_INFO</div>
              <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 11: STARTUP
      case 'startup':
        return (
          <div className="p-10">
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-4">
                {/* Logo (64px circle with accent color) */}
                <LogoCircle size={64} fontSize={20} bgColor={accentColor} />
                <div>
                  <h1 className="text-4xl m-0 mb-2" style={{ color: brandColor }}>{sampleData.businessName}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{sampleData.email}</span>
                    <span>•</span>
                    <span>{sampleData.phone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div 
                  className="inline-block px-6 py-2 rounded-full mb-2 text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="text-2xl">INVOICE</div>
                </div>
                <div className="text-sm text-gray-600">#{sampleData.invoiceNumber}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div 
                className="rounded-2xl p-6 border-l-4"
                style={{ 
                  backgroundColor: `rgba(${primaryColorRgb}, 0.03)`,
                  borderColor: brandColor
                }}
              >
                <div 
                  className="text-xs uppercase mb-3 tracking-wide"
                  style={{ color: brandColor }}
                >Billing To</div>
                <div className="font-medium text-lg mb-2 text-gray-900">{sampleData.customerName}</div>
                <div className="text-sm text-gray-600 whitespace-pre-line">{sampleData.customerAddress}</div>
              </div>
              <div 
                className="rounded-2xl p-6 border-l-4"
                style={{ 
                  backgroundColor: `rgba(${accentColorRgb}, 0.03)`,
                  borderColor: accentColor
                }}
              >
                <div 
                  className="text-xs uppercase mb-3 tracking-wide"
                  style={{ color: accentColor }}
                >Invoice Info</div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-medium text-gray-900">{sampleData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-gray-900">{sampleData.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-white" style={{ backgroundColor: brandColor }}>
                    <th className="text-left p-4">Service</th>
                    <th className="text-center p-4">Qty</th>
                    <th className="text-right p-4">Rate</th>
                    <th className="text-right p-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200 bg-white">
                      <td className="p-4">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="text-center text-black">{item.qty}</td>
                      <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                      <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-96 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 bg-white">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                  </div>
                </div>
                <div 
                  className="p-6 text-2xl text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="flex justify-between">
                    <span>Amount Due</span>
                    <span>${sampleData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="mt-10 p-6 rounded-2xl"
              style={{ backgroundColor: `rgba(${accentColorRgb}, 0.03)` }}
            >
              <div className="text-xs uppercase mb-2 tracking-wide" style={{ color: accentColor }}>Payment Terms</div>
              <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 12: LUXURY
      case 'luxury':
        return (
          <div className="p-12 bg-[#fafaf8]" style={{ fontFamily: 'Georgia, serif' }}>
            <div 
              className="text-center mb-10 pb-8 border-b-2"
              style={{ borderColor: accentColor }}
            >
              <div className="mb-4 flex justify-center">
                {/* Logo (80px circle) - centered */}
                <LogoCircle size={80} fontSize={28} bgColor={accentColor} />
              </div>
              <h1 
                className="text-4xl m-0 mb-3 tracking-wide"
                style={{ color: brandColor }}
              >{sampleData.businessName}</h1>
              <div className="text-sm" style={{ color: accentColor }}>{sampleData.email} • {sampleData.phone}</div>
            </div>

            <div className="flex justify-between mb-10">
              <div>
                <div 
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: accentColor }}
                >Client</div>
                <div className="text-xl mb-2 text-black">{sampleData.customerName}</div>
                <div className="text-sm text-gray-600 whitespace-pre-line">{sampleData.customerAddress}</div>
              </div>
              <div className="text-right">
                <div 
                  className="text-4xl mb-3 tracking-wide"
                  style={{ color: accentColor }}
                >INVOICE</div>
                <div className="text-sm text-gray-600 mb-2">Number: {sampleData.invoiceNumber}</div>
                <div className="text-sm text-gray-600 mb-1">Date: {sampleData.date}</div>
                <div className="text-sm text-gray-600">Due: {sampleData.dueDate}</div>
              </div>
            </div>

            <table className="w-full mb-10 border-collapse">
              <thead>
                <tr 
                  className="border-t-2 border-b-2"
                  style={{ borderColor: accentColor }}
                >
                  <th 
                    className="text-left py-4 text-sm uppercase tracking-widest"
                    style={{ color: accentColor }}
                  >Description</th>
                  <th 
                    className="text-center px-4 py-4 text-sm uppercase tracking-widest"
                    style={{ color: accentColor }}
                  >Qty</th>
                  <th 
                    className="text-right px-4 py-4 text-sm uppercase tracking-widest"
                    style={{ color: accentColor }}
                  >Rate</th>
                  <th 
                    className="text-right py-4 text-sm uppercase tracking-widest"
                    style={{ color: accentColor }}
                  >Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.items.map((item, idx) => (
                  <tr key={idx} className="border-b" style={{ borderColor: '#e5e5e0' }}>
                    <td className="py-4">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="text-center text-black">{item.qty}</td>
                    <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                    <td className="text-right font-medium text-black">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-96">
                <div 
                  className="border-t-2 border-b-2 py-4"
                  style={{ borderColor: accentColor }}
                >
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Tax</span>
                    <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                  </div>
                </div>
                <div 
                  className="flex justify-between py-5 text-3xl"
                  style={{ color: accentColor }}
                >
                  <span>Total</span>
                  <span>${sampleData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div 
              className="mt-10 pt-8 border-t text-center"
              style={{ borderColor: accentColor }}
            >
              <p className="text-sm text-gray-600 italic m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 13: CONTEMPORARY
      case 'contemporary':
        return (
          <div className="p-10">
            <div className="mb-10">
              <div className="flex items-start gap-8">
                <div className="flex-1">
                  <h1 className="text-5xl m-0 mb-2" style={{ color: brandColor }}>{sampleData.businessName}</h1>
                  <div className="text-sm text-gray-600">{sampleData.email} • {sampleData.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl leading-none mb-2 text-gray-600">INVOICE</div>
                  <div className="text-sm text-gray-600">#{sampleData.invoiceNumber}</div>
                </div>
              </div>
            </div>

            <div className="relative mb-10">
              <div 
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div className="pl-6 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-xs uppercase mb-3 tracking-wide text-gray-500">Client Information</div>
                  <div className="font-medium text-xl mb-2 text-gray-900">{sampleData.customerName}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{sampleData.customerAddress}</div>
                </div>
                <div>
                  <div className="text-xs uppercase mb-3 tracking-wide text-gray-500">Invoice Details</div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Date Issued:</span>
                      <span className="font-medium text-gray-900">{sampleData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Due:</span>
                      <span className="font-medium text-gray-900">{sampleData.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table className="w-full mb-10 border-collapse">
              <thead>
                <tr 
                  className="border-b-2"
                  style={{ borderColor: brandColor }}
                >
                  <th className="text-left py-4 text-gray-900">Item Description</th>
                  <th className="text-center px-4 py-4 text-gray-900">Quantity</th>
                  <th className="text-right px-4 py-4 text-gray-900">Unit Price</th>
                  <th className="text-right py-4 text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-4">
                      <div className="font-medium text-lg">{item.name}</div>
                    </td>
                    <td className="text-center text-black">{item.qty}</td>
                    <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                    <td className="text-right font-medium text-lg text-black">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-96 relative">
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <div className="pr-6">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-lg text-black">${sampleData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="text-lg text-black">${sampleData.tax.toLocaleString()}</span>
                  </div>
                  <div 
                    className="flex justify-between py-4 text-3xl"
                    style={{ color: brandColor }}
                  >
                    <span>Total Due</span>
                    <span>${sampleData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="mt-10 p-6 border-l-4"
              style={{ 
                borderColor: accentColor,
                backgroundColor: `rgba(${accentColorRgb}, 0.03)`
              }}
            >
              <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 14: TRADITIONAL
      case 'traditional':
        return (
          <div className="p-12">
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-400">
              {/* Logo (80px circle) - centered */}
              <div className="mb-4 flex justify-center">
                <LogoCircle size={80} fontSize={30} />
              </div>
              <h1 className="text-4xl m-0 mb-3" style={{ color: brandColor }}>{sampleData.businessName}</h1>
              <div className="text-sm text-gray-800">
                <div>{sampleData.address}</div>
                <div className="mt-1">Tel: {sampleData.phone} | Email: {sampleData.email}</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl m-0" style={{ color: brandColor }}>INVOICE</h2>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="bg-gray-100 p-4">
                  <div className="text-xs uppercase mb-2" style={{ color: brandColor }}>Invoice To:</div>
                  <div className="font-medium text-lg mb-1 text-gray-900">{sampleData.customerName}</div>
                  <div className="text-sm text-gray-800 whitespace-pre-line">{sampleData.customerAddress}</div>
                </div>
              </div>
              <div>
                <div className="bg-gray-100 p-4">
                  <div className="text-xs uppercase mb-2" style={{ color: brandColor }}>Invoice Details:</div>
                  <div className="text-sm text-gray-900">
                    <div className="mb-1"><strong>Invoice Number:</strong> {sampleData.invoiceNumber}</div>
                    <div className="mb-1"><strong>Invoice Date:</strong> {sampleData.date}</div>
                    <div><strong>Due Date:</strong> {sampleData.dueDate}</div>
                  </div>
                </div>
              </div>
            </div>

            <table className="w-full mb-8 border-collapse border border-gray-400">
              <thead>
                <tr style={{ backgroundColor: `rgba(${primaryColorRgb}, 0.08)` }}>
                  <th className="border border-gray-400 p-3 text-left text-gray-800">Description of Services</th>
                  <th className="border border-gray-400 p-3 text-center text-gray-800">Qty</th>
                  <th className="border border-gray-400 p-3 text-right text-gray-800">Unit Price</th>
                  <th className="border border-gray-400 p-3 text-right text-gray-800">Total</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-400 p-3">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="border border-gray-400 p-3 text-center text-black">{item.qty}</td>
                    <td className="border border-gray-400 p-3 text-right text-black">${item.rate.toLocaleString()}</td>
                    <td className="border border-gray-400 p-3 text-right font-medium text-black">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-80 border border-gray-400">
                <div className="flex justify-between p-3 border-b border-gray-400">
                  <span className="font-medium text-gray-800">Subtotal:</span>
                  <span className="text-black">${sampleData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 border-b border-gray-400">
                  <span className="font-medium text-gray-800">Tax (10%):</span>
                  <span className="text-black">${sampleData.tax.toLocaleString()}</span>
                </div>
                <div 
                  className="flex justify-between p-4 text-xl"
                  style={{ backgroundColor: `rgba(${primaryColorRgb}, 0.08)` }}
                >
                  <span className="font-medium">Total Amount Due:</span>
                  <span style={{ color: brandColor }}>${sampleData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-400 p-4">
              <div className="font-medium mb-2" style={{ color: brandColor }}>Terms and Conditions:</div>
              <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
            </div>
          </div>
        );

      // TEMPLATE 15: VIBRANT
      case 'vibrant':
        return (
          <div>
            <div 
              className="relative h-40 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 50%, #F59E0B 100%)` }}
            >
              <div className="absolute inset-0 flex items-center justify-between px-12 text-white">
                <div>
                  <h1 className="text-4xl m-0 mb-2">{sampleData.businessName}</h1>
                  <div className="text-sm opacity-90">{sampleData.email} • {sampleData.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-5xl mb-2">INVOICE</div>
                  <div className="px-4 py-1 bg-white/20 rounded-full inline-block">#{sampleData.invoiceNumber}</div>
                </div>
              </div>
            </div>

            <div className="p-12">
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div 
                  className="p-6 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, rgba(${primaryColorRgb}, 0.08) 0%, rgba(${accentColorRgb}, 0.08) 100%)` }}
                >
                  <div className="text-xs uppercase mb-3 tracking-wide" style={{ color: brandColor }}>Bill To</div>
                  <div className="font-medium text-xl mb-2">{sampleData.customerName}</div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{sampleData.customerAddress}</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#FEF3C7]">
                  <div className="text-xs uppercase mb-3 tracking-wide text-[#92400e]">Invoice Information</div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Date:</span>
                      <span className="font-medium">{sampleData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Due Date:</span>
                      <span className="font-medium">{sampleData.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr 
                      className="text-white"
                      style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)` }}
                    >
                      <th className="text-left p-4">Description</th>
                      <th className="text-center p-4">Qty</th>
                      <th className="text-right p-4">Rate</th>
                      <th className="text-right p-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.items.map((item, idx) => (
                      <tr key={idx} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-4">
                          <div className="font-medium text-lg">{item.name}</div>
                        </td>
                        <td className="text-center text-black">{item.qty}</td>
                        <td className="text-right text-black">${item.rate.toLocaleString()}</td>
                        <td className="text-right font-medium text-lg text-black">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-96 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-6 bg-white">
                    <div className="flex justify-between py-2 text-lg">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-medium text-black">${sampleData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg">
                      <span className="text-gray-700">Tax (10%)</span>
                      <span className="font-medium text-black">${sampleData.tax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div 
                    className="p-6 text-3xl text-white"
                    style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)` }}
                  >
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>${sampleData.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="mt-10 p-6 rounded-2xl"
                style={{ background: `linear-gradient(135deg, rgba(${accentColorRgb}, 0.06) 0%, #FEF3C7 100%)` }}
              >
                <div className="text-xs uppercase mb-2 tracking-wide" style={{ color: accentColor }}>Payment Notes</div>
                <p className="text-sm text-gray-700 m-0">Payment is due within 30 days. Thank you for your business!</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-8 text-center text-gray-500">Template preview not available</div>;
    }
  };

  if (!currentTemplateData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {currentTemplateData.name}
                </h2>
                <p className="text-sm text-gray-600">{currentTemplateData.description}</p>
              </div>
            </div>
            <Button
              onClick={handleSelect}
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Select Template
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Area - Fixed Height */}
        <div className="bg-gray-100 p-6" style={{ height: '600px', overflowY: 'auto' }}>
          <div className="max-w-3xl mx-auto">
            {/* Fixed size preview container */}
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto"
              style={{ 
                width: '420px',
                height: '560px',
                position: 'relative'
              }}
            >
              {/* Scaled down template preview */}
              <div 
                style={{
                  transform: 'scale(0.45)',
                  transformOrigin: 'top left',
                  width: '933px',
                  height: '1244px',
                  overflow: 'hidden'
                }}
              >
                {renderTemplatePreview(currentTemplateData)}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="px-6 py-4 border-t bg-white flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-600">
            {currentIndex + 1} of {filteredTemplates.length} templates
          </div>
          <Button
            variant="outline"
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
