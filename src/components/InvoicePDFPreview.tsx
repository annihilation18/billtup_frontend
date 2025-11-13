import { useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Image as ImageIcon } from "lucide-react";
import { InvoiceData } from "./InvoiceBuilder";
import { formatPhoneNumber } from "../utils/formatters";

interface InvoicePDFPreviewProps {
  invoiceData: InvoiceData;
  businessName: string;
  businessLogo?: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  invoiceNumber: string;
  brandColor?: string;
  accentColor?: string;
  invoiceTemplate?: string;
  contactEmail?: string; // Contact email for "Contact At" section
  onClose: () => void;
}

export function InvoicePDFPreview({
  invoiceData,
  businessName,
  businessLogo,
  businessEmail,
  businessPhone,
  businessAddress,
  invoiceNumber,
  brandColor = '#1E3A8A',
  accentColor = '#14B8A6',
  invoiceTemplate = 'modern',
  contactEmail,
  onClose,
}: InvoicePDFPreviewProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto bg-white relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10 shadow-sm">
          <h2 className="text-lg font-semibold">Invoice Preview</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* PDF Content - White background to match email */}
        <div className="p-8 bg-white">
          {/* Modern Template */}
          {invoiceTemplate === 'modern' && (
            <div className="space-y-6">
              {/* Header with colored accent bar */}
              <div className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {businessLogo ? (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: brandColor }}>
                        <img src={businessLogo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: brandColor }}>
                        <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-700 truncate">{businessName}</div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                    <div className="font-semibold text-base sm:text-lg" style={{ color: brandColor }}>INVOICE</div>
                    <div className="text-xs sm:text-sm text-gray-600">{invoiceNumber}</div>
                    <div className="text-xs text-gray-400 mt-1">{invoiceData.dueDate || new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: accentColor }}>Bill To</div>
                <div className="text-sm text-gray-700">{invoiceData.customerName}</div>
                {invoiceData.customerEmail && (
                  <div className="text-xs text-gray-500">{invoiceData.customerEmail}</div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wider pb-2 border-b" style={{ color: brandColor }}>
                  <div className="col-span-7">Description</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-3 text-right">Amount</div>
                </div>
                {invoiceData.lineItems && invoiceData.lineItems.length > 0 ? (
                  invoiceData.lineItems.map((item, index) => (
                    <div key={item.id || index} className="grid grid-cols-12 gap-2 text-sm py-2">
                      <div className="col-span-7 text-gray-700">{item.name || 'Unnamed Item'}</div>
                      <div className="col-span-2 text-center text-gray-600">{item.quantity || 0}</div>
                      <div className="col-span-3 text-right text-gray-700">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">No line items added</div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-mono text-gray-700">${invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    {invoiceData.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-mono text-gray-700">${invoiceData.tax.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t-2 pt-3" style={{ borderColor: accentColor }}>
                  <div className="flex justify-end">
                    <div className="w-64 flex justify-between items-center">
                      <span className="font-semibold" style={{ color: brandColor }}>TOTAL DUE</span>
                      <span className="text-xl font-bold" style={{ color: brandColor }}>${invoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature */}
              {invoiceData.signature && (
                <div className="pt-6 border-t">
                  <h3 className="text-xs uppercase tracking-wider mb-2 text-gray-500">Customer Signature</h3>
                  <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                    <img src={invoiceData.signature} alt="Signature" className="max-w-full h-auto" />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold" style={{ color: brandColor }}>Thank you for your business!</p>
                </div>
                
                <div className="bg-gray-50 border-2 rounded-xl p-4" style={{ borderColor: brandColor }}>
                  <h3 className="font-semibold mb-2" style={{ color: brandColor }}>Questions or Need Support?</h3>
                  <p className="text-sm text-gray-600 mb-2">Contact {businessName} at:</p>
                  <p className="text-sm" style={{ color: brandColor }}>📧 {contactEmail || businessEmail}</p>
                  <p className="text-sm" style={{ color: brandColor }}>📞 {formatPhoneNumber(businessPhone)}</p>
                </div>
                
                <p className="text-center text-gray-400 text-xs mt-4">Powered by BilltUp Invoicing</p>
              </div>
            </div>
          )}

          {/* Classic Template */}
          {invoiceTemplate === 'classic' && (
            <div className="space-y-6">
              {/* Header with colored background box */}
              <div className="rounded-lg p-6" style={{ backgroundColor: brandColor }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {businessLogo ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white flex-shrink-0">
                        <img src={businessLogo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="text-white min-w-0 flex-1">
                      <div className="font-semibold truncate">{businessName}</div>
                      <div className="text-xs opacity-90 truncate">{businessAddress}</div>
                      <div className="text-xs opacity-90 truncate">{businessEmail}</div>
                      <div className="text-xs opacity-90">{formatPhoneNumber(businessPhone)}</div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-white flex-shrink-0">
                    <div className="text-2xl font-bold">INVOICE</div>
                    <div className="text-sm opacity-90">{invoiceNumber}</div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold mb-1 text-gray-500">BILL TO</div>
                  <div className="text-sm text-gray-700 font-semibold">{invoiceData.customer}</div>
                  {invoiceData.customerEmail && (
                    <div className="text-xs text-gray-500">{invoiceData.customerEmail}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold mb-1 text-gray-500">DATE</div>
                  <div className="text-sm text-gray-700">{new Date().toLocaleDateString()}</div>
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
                  {invoiceData.lineItems && invoiceData.lineItems.length > 0 ? (
                    invoiceData.lineItems.map((item, index) => (
                      <tr key={item.id || index} className="border-b border-gray-200">
                        <td className="py-3 text-sm text-gray-700">{item.name || 'Unnamed Item'}</td>
                        <td className="py-3 text-center text-sm text-gray-600">{item.quantity || 0}</td>
                        <td className="py-3 text-right text-sm text-gray-700">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-sm text-gray-500">No line items added</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Subtotal */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-mono text-gray-700">${invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  {invoiceData.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-mono text-gray-700">${invoiceData.tax.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="w-full sm:w-64 rounded-lg p-4" style={{ backgroundColor: accentColor + '20', borderLeft: `4px solid ${accentColor}` }}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">TOTAL DUE</span>
                    <span className="text-2xl font-bold" style={{ color: brandColor }}>${invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              {invoiceData.signature && (
                <div className="pt-6 border-t">
                  <h3 className="text-xs font-semibold mb-2 text-gray-500">CUSTOMER SIGNATURE</h3>
                  <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                    <img src={invoiceData.signature} alt="Signature" className="max-w-full h-auto" />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-lg font-bold" style={{ color: brandColor }}>Thank you for your business!</p>
                </div>
                
                <div className="rounded-xl p-4" style={{ backgroundColor: accentColor + '20', borderLeft: `4px solid ${accentColor}` }}>
                  <h3 className="font-bold mb-2 text-gray-700">Questions or Need Support?</h3>
                  <p className="text-sm text-gray-600 mb-2">Contact {businessName} at:</p>
                  <p className="text-sm text-gray-700">📧 {contactEmail || businessEmail}</p>
                  <p className="text-sm text-gray-700">📞 {formatPhoneNumber(businessPhone)}</p>
                </div>
                
                <p className="text-center text-gray-400 text-xs mt-4">Powered by BilltUp Invoicing</p>
              </div>
            </div>
          )}

          {/* Minimal Template */}
          {invoiceTemplate === 'minimal' && (
            <div className="space-y-8">
              {/* Minimal Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {businessLogo ? (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: brandColor }}>
                      <img src={businessLogo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-50 border flex items-center justify-center flex-shrink-0" style={{ borderColor: brandColor }}>
                      <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-300" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400">FROM</div>
                    <div className="text-sm text-gray-700 truncate">{businessName}</div>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                  <div className="text-2xl sm:text-3xl font-light tracking-tight" style={{ color: brandColor }}>Invoice</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{invoiceNumber} • {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Bill To */}
              <div>
                <div className="text-xs text-gray-400 mb-2">TO</div>
                <div className="text-sm text-gray-700">{invoiceData.customerName}</div>
                {invoiceData.customerEmail && (
                  <div className="text-xs text-gray-500 mt-1">{invoiceData.customerEmail}</div>
                )}
              </div>

              {/* Minimal Items */}
              <div className="space-y-4">
                {invoiceData.lineItems && invoiceData.lineItems.length > 0 ? (
                  invoiceData.lineItems.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <div className="text-sm text-gray-700">{item.name || 'Unnamed Item'}</div>
                        <div className="text-xs text-gray-400 mt-1">Qty: {item.quantity || 0}</div>
                      </div>
                      <div className="text-sm text-gray-700">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">No line items added</div>
                )}
              </div>

              {/* Subtotal */}
              {invoiceData.tax > 0 && (
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="text-gray-700">${invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax:</span>
                      <span className="text-gray-700">${invoiceData.tax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Minimal Total */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">Total Due</span>
                <span className="text-3xl font-light tracking-tight" style={{ color: brandColor }}>${invoiceData.total.toFixed(2)}</span>
              </div>

              {/* Signature */}
              {invoiceData.signature && (
                <div className="pt-6 border-t">
                  <h3 className="text-xs text-gray-400 mb-2">SIGNATURE</h3>
                  <div className="border border-gray-200 rounded-lg p-2">
                    <img src={invoiceData.signature} alt="Signature" className="max-w-full h-auto" />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-lg font-light tracking-tight" style={{ color: brandColor }}>Thank you for your business!</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Questions or Need Support?</h3>
                  <p className="text-xs text-gray-600 mb-2">Contact {businessName} at:</p>
                  <p className="text-xs text-gray-700">📧 {contactEmail || businessEmail}</p>
                  <p className="text-xs text-gray-700">📞 {formatPhoneNumber(businessPhone)}</p>
                </div>
                
                <p className="text-center text-gray-400 text-xs mt-4">Powered by BilltUp Invoicing</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg z-10">
          <Button 
            onClick={onClose} 
            style={{ backgroundColor: brandColor }}
            className="w-full hover:opacity-90"
          >
            Close Preview
          </Button>
        </div>
      </Card>
    </div>
  );
}