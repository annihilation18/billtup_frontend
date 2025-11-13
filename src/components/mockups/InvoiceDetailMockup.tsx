import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Download, Eye, Mail, Link2, CheckCircle2 } from "lucide-react";

export function InvoiceDetailMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl">Invoice Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 pb-20">
        {/* Header Card */}
        <Card className="p-4 bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 border-[#14B8A6]/20">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-mono text-primary">INV-003</span>
                <Badge className="bg-[#14B8A6] hover:bg-[#14B8A6]/90 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Paid
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Invoice Date: Nov 8, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-mono text-[#14B8A6]">$2,500.00</p>
            </div>
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Bill To</h3>
          <div className="space-y-1">
            <p className="font-medium">Acme Corporation</p>
            <p className="text-sm text-muted-foreground">john@acmecorp.com</p>
            <p className="text-sm text-muted-foreground">(555) 123-4567</p>
            <p className="text-sm text-muted-foreground mt-2">
              123 Business Ave<br />
              Suite 100<br />
              San Francisco, CA 94105
            </p>
          </div>
        </Card>

        {/* Line Items */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Items</h3>
          <div className="space-y-3">
            {/* Item 1 */}
            <div className="pb-3 border-b border-border">
              <div className="flex justify-between mb-1">
                <p className="font-medium">Web Design Services</p>
                <p className="font-mono">$2,000.00</p>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 × $2,000.00</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="pb-3 border-b border-border">
              <div className="flex justify-between mb-1">
                <p className="font-medium">Consultation</p>
                <p className="font-mono">$500.00</p>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>2 hrs × $250.00</span>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">$2,500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-medium">Total</span>
                <span className="text-xl font-mono text-primary">$2,500.00</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-medium mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">Payment due within 30 days.
Thank you for your business!</p>
        </Card>

        {/* Payment Info */}
        <Card className="p-4 bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 border-[#14B8A6]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#14B8A6] rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#14B8A6]">Payment Received</p>
              <p className="text-sm text-muted-foreground">Nov 10, 2025 at 2:45 PM</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Button>
          <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Get Link
          </Button>
        </div>
      </div>
    </div>
  );
}
