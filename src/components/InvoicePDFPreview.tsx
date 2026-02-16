import { useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { InvoiceData } from "./InvoiceBuilder";

interface InvoicePDFPreviewProps {
  invoiceData: InvoiceData;
  businessName: string;
  businessLogo?: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  invoiceNumber: string;
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

        {/* PDF Content */}
        <div className="p-8 space-y-6" style={{ fontFamily: 'var(--font-inter)' }}>
          {/* Business Header */}
          <div className="pb-6 border-b-2 border-[#1E3A8A]">
            {/* Desktop/Tablet Layout - Side by side */}
            <div className="hidden md:flex items-start justify-between gap-6">
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                {businessLogo && (
                  <img src={businessLogo} alt={businessName} className="w-16 h-16 rounded-full object-cover border-2 border-[#1E3A8A] flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h1 style={{ fontFamily: 'var(--font-poppins)' }} className="text-2xl text-[#1E3A8A] mb-1 break-words">{businessName}</h1>
                  <p className="text-sm text-gray-600 break-all">{businessEmail}</p>
                  <p className="text-sm text-gray-600">{businessPhone}</p>
                  <p className="text-sm text-gray-600">{businessAddress}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 min-w-[150px]">
                <h2 style={{ fontFamily: 'var(--font-poppins)' }} className="text-3xl text-[#1E3A8A] mb-1 whitespace-nowrap">INVOICE</h2>
                <p className="text-sm font-mono text-gray-600 whitespace-nowrap">{invoiceNumber}</p>
                <p className="text-sm text-gray-600 whitespace-nowrap">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Mobile Layout - Stacked */}
            <div className="md:hidden space-y-4">
              {/* Business Info */}
              <div className="flex items-center gap-4">
                {businessLogo && (
                  <img src={businessLogo} alt={businessName} className="w-16 h-16 rounded-full object-cover border-2 border-[#1E3A8A] flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h1 style={{ fontFamily: 'var(--font-poppins)' }} className="text-xl text-[#1E3A8A] mb-1 break-words">{businessName}</h1>
                  <p className="text-xs text-gray-600 break-all">{businessEmail}</p>
                  <p className="text-xs text-gray-600">{businessPhone}</p>
                  <p className="text-xs text-gray-600">{businessAddress}</p>
                </div>
              </div>
              
              {/* Invoice Info - Single Line */}
              <div className="flex items-center gap-3 text-sm">
                <h2 style={{ fontFamily: 'var(--font-poppins)' }} className="text-lg text-[#1E3A8A] whitespace-nowrap">INVOICE</h2>
                <span className="text-gray-400">|</span>
                <p className="font-mono text-gray-600 whitespace-nowrap">{invoiceNumber}</p>
                <span className="text-gray-400">|</span>
                <p className="text-gray-600 whitespace-nowrap">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-poppins)' }} className="text-sm uppercase text-gray-500 mb-2">Bill To</h3>
            <p className="font-medium">{invoiceData.customer}</p>
          </div>

          {/* Line Items */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-poppins)' }} className="text-sm uppercase text-gray-500 mb-3">Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1E3A8A]/10 text-left">
                    <th className="p-3 text-sm font-medium text-[#1E3A8A]">Item</th>
                    <th className="p-3 text-sm font-medium text-[#1E3A8A] text-center">Qty</th>
                    <th className="p-3 text-sm font-medium text-[#1E3A8A] text-right">Price</th>
                    <th className="p-3 text-sm font-medium text-[#1E3A8A] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.lineItems && invoiceData.lineItems.length > 0 ? (
                    invoiceData.lineItems.map((item, index) => (
                      <tr key={item.id || index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="p-3 text-sm border-t">{item.name || 'Unnamed Item'}</td>
                        <td className="p-3 text-sm text-center font-mono border-t">{item.quantity || 0}</td>
                        <td className="p-3 text-sm text-right font-mono border-t">${(item.price || 0).toFixed(2)}</td>
                        <td className="p-3 text-sm text-right font-mono border-t">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-sm text-gray-500">
                        No line items added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-mono">${invoiceData.subtotal.toFixed(2)}</span>
              </div>
              {invoiceData.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-mono">${invoiceData.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t-2 border-[#1E3A8A]">
                <span style={{ fontFamily: 'var(--font-poppins)' }} className="font-medium text-[#1E3A8A]">Total:</span>
                <span style={{ fontFamily: 'var(--font-roboto-mono)' }} className="text-xl text-[#1E3A8A]">${invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          {invoiceData.signature && (
            <div className="pt-6">
              <h3 style={{ fontFamily: 'var(--font-poppins)' }} className="text-sm uppercase text-gray-500 mb-2">Customer Signature</h3>
              <div className="border border-gray-300 rounded-lg p-2">
                <img src={invoiceData.signature} alt="Signature" className="max-w-full h-auto" />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="text-center mb-4">
              <p className="text-[#1E3A8A] text-lg">Thank you for your business!</p>
            </div>
            
            <div className="bg-gray-50 border-2 border-[#1E3A8A] rounded-xl p-4">
              <h3 className="text-[#1E3A8A] mb-2">Questions or Need Support?</h3>
              <p className="text-sm text-gray-600 mb-2">Contact {businessName} at:</p>
              <p className="text-sm text-[#1E3A8A]">📧 Email: {businessEmail}</p>
              <p className="text-sm text-[#1E3A8A]">📞 Phone: {businessPhone}</p>
            </div>
            
            <p className="text-center text-gray-400 text-xs mt-4">
              Powered by BilltUp Invoicing
            </p>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg z-10">
          <Button 
            onClick={onClose} 
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            Close Preview
          </Button>
        </div>
      </Card>
    </div>
  );
}