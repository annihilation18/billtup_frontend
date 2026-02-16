import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
} from "lucide-react@0.468.0";

export function InvoiceBuilderMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl">Create Invoice</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 pb-20">
        {/* Customer Selection */}
        <Card className="p-4">
          <label className="text-sm mb-2 block">Customer</label>
          <select className="w-full p-2 rounded-lg border border-border bg-input-background" defaultValue="Acme Corporation">
            <option>Select customer...</option>
            <option>Acme Corporation</option>
            <option>Tech Startup Inc</option>
            <option>Design Studio LLC</option>
          </select>
          <Button
            variant="ghost"
            className="w-full mt-2 text-[#14B8A6]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>
        </Card>

        {/* Invoice Details */}
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-1.5 block">
                Invoice #
              </label>
              <Input
                value="INV-004"
                className="bg-input-background"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block">
                Date
              </label>
              <Input
                type="date"
                value="2025-11-11"
                className="bg-input-background"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="text-sm mb-1.5 block">
              Due Date (Optional)
            </label>
            <Input
              type="date"
              className="bg-input-background"
            />
          </div>
        </Card>

        {/* Line Items */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Line Items</h3>
          </div>

          {/* Item 1 */}
          <div className="space-y-2 mb-3 pb-3 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <Input
                  placeholder="Description"
                  value="Web Design Services"
                  className="mb-2 bg-input-background"
                  readOnly
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Qty
                    </label>
                    <Input
                      value="1"
                      className="bg-input-background"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Rate
                    </label>
                    <Input
                      value="2500.00"
                      className="bg-input-background"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Amount
                    </label>
                    <Input
                      value="2500.00"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Item 2 */}
          <div className="space-y-2 mb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <Input
                  placeholder="Description"
                  value="Logo Design"
                  className="mb-2 bg-input-background"
                  readOnly
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Qty
                    </label>
                    <Input
                      value="1"
                      className="bg-input-background"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Rate
                    </label>
                    <Input
                      value="750.00"
                      className="bg-input-background"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Amount
                    </label>
                    <Input
                      value="750.00"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </Card>

        {/* Totals */}
        <Card className="p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>
              <span className="font-mono">$3,250.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Tax (8.5%)
              </span>
              <span className="font-mono">$276.25</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-medium">Total</span>
              <span className="text-xl font-mono text-primary">
                $3,526.25
              </span>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-4">
          <label className="text-sm mb-2 block">
            Notes (Optional)
          </label>
          <Textarea
            placeholder="Payment terms, thank you message, etc."
            className="bg-input-background min-h-[80px]"
            value="Payment due within 30 days.&#10;Thank you for your business!"
            readOnly
          />
        </Card>

        {/* Signature Toggle */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Include Signature</p>
              <p className="text-xs text-muted-foreground">
                Add your signature to the invoice
              </p>
            </div>
            <div className="relative inline-block w-11 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
                readOnly
              />
              <div className="w-11 h-6 bg-[#14B8A6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}