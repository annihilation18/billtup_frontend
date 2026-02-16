import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { ArrowLeft, Plus, Trash2, FileText, CreditCard } from "lucide-react";

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceBuilderProps {
  onBack: () => void;
  onPreviewPDF: (invoiceData: InvoiceData) => void;
  onProceedToPayment: (invoiceData: InvoiceData) => void;
  onSaveInvoice: (invoiceData: InvoiceData) => void;
  customers: Array<{ name: string; email: string; phone?: string }>;
  chargeTax: boolean;
  defaultTaxRate: number;
  editingInvoice?: any; // When editing an existing invoice
}

export interface InvoiceData {
  customer: string;
  customerEmail: string;
  customerPhone?: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  signature?: string;
}

export function InvoiceBuilder({ onBack, onPreviewPDF, onProceedToPayment, onSaveInvoice, customers, chargeTax, defaultTaxRate, editingInvoice }: InvoiceBuilderProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(editingInvoice?.customer || "");
  const [customerEmail, setCustomerEmail] = useState(editingInvoice?.customerEmail || "");
  const [customerPhone, setCustomerPhone] = useState(editingInvoice?.customerPhone || "");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>(editingInvoice?.lineItems || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [includeSignature, setIncludeSignature] = useState(editingInvoice?.signature ? true : false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCustomerChange = (customerName: string) => {
    setSelectedCustomer(customerName);
    if (customerName === "_add_new") {
      // Clear new customer fields when switching to add new
      setNewCustomerName("");
      setNewCustomerEmail("");
      setNewCustomerPhone("");
    } else {
      const customer = customers.find(c => c.name === customerName);
      if (customer) {
        setCustomerEmail(customer.email);
        setCustomerPhone(customer.phone || "");
      }
    }
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = chargeTax ? subtotal * (defaultTaxRate / 100) : 0;
  const total = subtotal + tax;

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      price: 0,
    }]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const deleteLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // If editing an existing invoice with signature, draw it
    if (editingInvoice?.signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = editingInvoice.signature;
    }
  }, [editingInvoice]);
  
  const handleSaveInvoice = async () => {
    setIsSaving(true);
    try {
      await onSaveInvoice(getInvoiceData());
    } finally {
      setIsSaving(false);
    }
  };

  const getInvoiceData = (): InvoiceData => {
    // Use new customer data if adding new customer
    const finalCustomerName = selectedCustomer === "_add_new" ? newCustomerName : selectedCustomer;
    const finalCustomerEmail = selectedCustomer === "_add_new" ? newCustomerEmail : customerEmail;
    const finalCustomerPhone = selectedCustomer === "_add_new" ? newCustomerPhone : customerPhone;
    
    return {
      customer: finalCustomerName,
      customerEmail: finalCustomerEmail,
      customerPhone: finalCustomerPhone,
      lineItems,
      subtotal,
      tax,
      total,
      signature: includeSignature ? canvasRef.current?.toDataURL() : undefined,
    };
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-primary-foreground hover:bg-primary/80">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl">Create Invoice</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Customer Selection */}
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select value={selectedCustomer === "_add_new" ? "_add_new" : selectedCustomer} onValueChange={handleCustomerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select or Add Customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.name} value={customer.name}>
                    {customer.name}
                  </SelectItem>
                ))}
                <SelectItem value="_add_new">+ Add New Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Show input fields when adding new customer */}
          {selectedCustomer === "_add_new" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newCustomerName">Customer Name *</Label>
                <Input
                  id="newCustomerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newCustomerEmail">Customer Email *</Label>
                <Input
                  id="newCustomerEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newCustomerPhone">Customer Phone (Optional)</Label>
                <Input
                  id="newCustomerPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>
            </>
          )}
          
          {/* Show email and phone fields for existing customers */}
          {selectedCustomer && selectedCustomer !== "_add_new" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone (Optional)</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </>
          )}
        </Card>

        {/* Line Items */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label>Line Items</Label>
            <Button onClick={addLineItem} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {lineItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items added yet</p>
            ) : (
              lineItems.map((item) => (
                <div key={item.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor={`item-name-${item.id}`} className="text-xs text-muted-foreground">Item Description</Label>
                      <Input
                        id={`item-name-${item.id}`}
                        placeholder="e.g., Full Interior Detailing"
                        value={item.name}
                        onChange={(e) => updateLineItem(item.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="space-y-1 w-24">
                        <Label htmlFor={`item-qty-${item.id}`} className="text-xs text-muted-foreground">Quantity</Label>
                        <Input
                          id={`item-qty-${item.id}`}
                          type="number"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                          min="0"
                          step="1"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={`item-price-${item.id}`} className="text-xs text-muted-foreground">Price ($)</Label>
                        <Input
                          id={`item-price-${item.id}`}
                          type="number"
                          placeholder="0.00"
                          value={item.price}
                          onChange={(e) => updateLineItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Total</Label>
                        <div className="flex items-center justify-center h-10 px-3 bg-muted rounded-lg font-mono text-sm">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLineItem(item.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-7"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Totals */}
        <Card className="p-4">
          <Label className="mb-3 block">Summary</Label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            {chargeTax && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({defaultTaxRate}%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Signature Pad */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Label htmlFor="include-signature">Include Signature</Label>
              <Switch 
                id="include-signature"
                checked={includeSignature} 
                onCheckedChange={setIncludeSignature}
              />
            </div>
            {includeSignature && (
              <Button variant="outline" size="sm" onClick={clearSignature}>
                Clear
              </Button>
            )}
          </div>
          {includeSignature && (
            <>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full border border-border rounded-lg bg-white cursor-crosshair touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <p className="text-xs text-muted-foreground mt-2">Sign above</p>
            </>
          )}
          {!includeSignature && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Signature disabled - Enable the toggle to add customer signature
            </p>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onPreviewPDF(getInvoiceData())}
            disabled={
              (!selectedCustomer || 
              (selectedCustomer === "_add_new" && (!newCustomerName || !newCustomerEmail)) ||
              (selectedCustomer !== "_add_new" && !customerEmail)) || 
              lineItems.length === 0
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Preview PDF
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-white"
              onClick={handleSaveInvoice}
              disabled={
                (!selectedCustomer || 
                (selectedCustomer === "_add_new" && (!newCustomerName || !newCustomerEmail)) ||
                (selectedCustomer !== "_add_new" && !customerEmail)) || 
                lineItems.length === 0 || 
                isSaving
              }
            >
              {isSaving ? "Saving..." : editingInvoice ? "Update Invoice" : "Save Invoice"}
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => onProceedToPayment(getInvoiceData())}
              disabled={
                (!selectedCustomer || 
                (selectedCustomer === "_add_new" && (!newCustomerName || !newCustomerEmail)) ||
                (selectedCustomer !== "_add_new" && !customerEmail)) || 
                lineItems.length === 0
              }
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
