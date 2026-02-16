import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Loader2, 
  FileText, 
  Plus, 
  Trash2,
  X
} from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { createInvoice, fetchCustomers } from '../../utils/dashboard-api';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface CreateInvoiceModalProps {
  open?: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateInvoiceModal({ open = true, onClose, onCreated }: CreateInvoiceModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    if (open) {
      loadCustomers();
      generateInvoiceNumber();
      // Set date to today and due date to 30 days from now by default
      const today = new Date().toISOString().split('T')[0];
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setDate(today);
      setDueDate(in30Days);
    }
  }, [open]);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    setInvoiceNumber(`INV-${timestamp}-${random}`);
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const handleCreate = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    if (lineItems.length === 0 || !lineItems[0].description) {
      toast.error('Please add at least one line item');
      return;
    }

    setIsCreating(true);
    try {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      
      await createInvoice({
        number: invoiceNumber,
        customerId: selectedCustomerId,
        customer: selectedCustomer?.name || '',
        customerEmail: selectedCustomer?.email || '',
        items: lineItems,
        total: calculateTotal(),
        status: 'pending',
        date: date || new Date().toISOString(),
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: notes,
        signature: signature || undefined,
        createdAt: new Date().toISOString(),
      });

      toast.success('Invoice created successfully!');
      onCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomerId('');
    setInvoiceNumber('');
    setDate('');
    setDueDate('');
    setNotes('');
    setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
    setSignature('');
    setShowSignature(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Create New Invoice</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Create a new invoice for a customer with line items and optional notes and signature.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">
                Customer <span className="text-red-500">*</span>
              </Label>
              <select
                id="customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Issue Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  {/* Column Headers - only show for first item */}
                  {index === 0 && (
                    <div className="grid grid-cols-12 gap-2 items-start px-3">
                      <div className="col-span-12 sm:col-span-5">
                        {/* Empty space for description, no label needed */}
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Label className="text-xs text-gray-500">Quantity</Label>
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Label className="text-xs text-gray-500">Price</Label>
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        {/* Empty space for amount */}
                      </div>
                      <div className="col-span-12 sm:col-span-1">
                        {/* Empty space for delete button */}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg">
                    <div className="col-span-12 sm:col-span-5">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        className="border-gray-300 bg-white"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="border-gray-300 bg-white"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="border-gray-300 bg-white"
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <Input
                        value={`$${item.amount.toFixed(2)}`}
                        disabled
                        className="border-gray-300 bg-white"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {lineItems.length > 1 && (
                        <button
                          onClick={() => removeLineItem(index)}
                          className="p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="bg-[#1E3A8A]/5 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-xl text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or payment terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300 min-h-[80px]"
            />
          </div>

          {/* Signature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Signature (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSignature(!showSignature)}
                className="h-8"
              >
                {showSignature ? 'Hide' : 'Add'} Signature
              </Button>
            </div>

            {showSignature && (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full border border-gray-200 rounded cursor-crosshair bg-white"
                    style={{ touchAction: 'none' }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Signature
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Invoice'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}