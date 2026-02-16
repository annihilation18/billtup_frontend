import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Mail,
  DollarSign,
  Trash2,
  CheckCircle,
} from "lucide-react@0.468.0";

export function InvoiceDetailMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-gray-50 flex flex-col">
      {/* Top App Bar */}
      <div className="bg-[#1E3A8A] text-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-6 h-6" />
          <h1 className="text-xl" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>
            Invoice Details
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Header Card */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl text-[#1E3A8A] mb-1" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                INV-006
              </h2>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-inter)' }}>
                Issued: Oct 22, 2025
              </p>
            </div>
            <Badge className="bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-white px-3 py-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Paid
            </Badge>
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-6 bg-white shadow-sm">
          <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.5px' }}>
            BILL TO
          </p>
          <p className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>
            James Wilson
          </p>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-inter)' }}>
            j.wilson@email.com
          </p>
        </Card>

        {/* Line Items */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-base text-gray-900 mb-4" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>
            Items
          </h3>
          
          <div className="space-y-4">
            {/* Item */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <p className="text-base text-gray-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>
                  Home Office Remodeling
                </p>
                <p className="text-base font-mono text-gray-900">
                  $3500.00
                </p>
              </div>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-inter)' }}>
                Qty: 1 × $3500.00
              </p>
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600" style={{ fontFamily: 'var(--font-inter)' }}>
                  Subtotal:
                </span>
                <span className="font-mono text-gray-900">$3500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600" style={{ fontFamily: 'var(--font-inter)' }}>
                  Tax:
                </span>
                <span className="font-mono text-gray-900">$297.50</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-base text-gray-900" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>
                  Total:
                </span>
                <span className="text-2xl font-mono text-[#1E3A8A]" style={{ fontWeight: 600 }}>
                  $3797.50
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
            style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
          >
            <Mail className="w-4 h-4" />
            Send Invoice via Email
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12 border-red-300 text-red-600 hover:bg-red-50"
            style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
          >
            <DollarSign className="w-4 h-4" />
            Issue Refund
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12 border-red-300 text-red-600 hover:bg-red-50"
            style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
          >
            <Trash2 className="w-4 h-4" />
            Delete Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}