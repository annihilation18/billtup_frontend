import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Edit, 
  Loader2, 
  Plus, 
  Trash2
} from 'lucide-react';
import { toast } from '../ui/sonner';
import { updateInvoice, fetchCustomers } from '../../utils/dashboard-api';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface EditInvoiceModalProps {
  invoice: any;
  onUpdate?: () => void;
}

export function EditInvoiceModal({ invoice, onUpdate }: EditInvoiceModalProps) {
  const [open, setOpen] = useState(false);

  if (invoice.status !== 'pending') return null;
  const [isUpdating, setIsUpdating] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('pending');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  useEffect(() => {
    if (open && invoice) {
      // Load invoice data when modal opens
      setSelectedCustomerId(invoice.customerId || '');
      setInvoiceNumber(invoice.number || invoice.id);
      setDueDate(
        invoice.dueDate 
          ? new Date(invoice.dueDate).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0]
      );
      setNotes(invoice.notes || '');
      setStatus(invoice.status || 'pending');
      
      // Load line items - map from database schema to edit format
      if (invoice.lineItems && invoice.lineItems.length > 0) {
        const items = invoice.lineItems.map((item: any) => ({
          description: item.name || '',
          quantity: item.quantity || 1,
          rate: item.price || 0,
          amount: (item.quantity || 1) * (item.price || 0)
        }));
        setLineItems(items);
      } else {
        setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
      }
      
      loadCustomers();
    }
  }, [open, invoice]);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
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

  const handleSubmit = async () => {
    // Validation
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    if (!invoiceNumber) {
      toast.error('Please enter an invoice number');
      return;
    }

    const hasValidItems = lineItems.some(item => 
      item.description.trim() && item.quantity > 0 && item.rate > 0
    );

    if (!hasValidItems) {
      toast.error('Please add at least one valid line item');
      return;
    }

    setIsUpdating(true);
    try {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      
      // Map line items back to database schema
      const dbLineItems = lineItems.map((item, index) => ({
        id: invoice.lineItems?.[index]?.id || `item-${Date.now()}-${index}`,
        name: item.description,
        quantity: item.quantity,
        price: item.rate
      }));

      const subtotal = calculateTotal();
      
      const updatedInvoice = {
        ...invoice,
        number: invoiceNumber,
        customerId: selectedCustomerId,
        customer: selectedCustomer?.name || invoice.customer,
        customerEmail: selectedCustomer?.email || invoice.customerEmail,
        dueDate,
        notes,
        status,
        lineItems: dbLineItems,
        subtotal: subtotal,
        tax: invoice.tax || 0,
        total: subtotal + (invoice.tax || 0),
        updatedAt: new Date().toISOString(),
      };

      await updateInvoice(invoice.id, updatedInvoice);
      
      toast.success('Invoice updated successfully!');
      setOpen(false);
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
            Edit Invoice
          </DialogTitle>
          <DialogDescription>
            Update invoice details and line items.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-001"
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <select
                id="customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                disabled={isUpdating}
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                disabled={isUpdating}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="refunded">Refunded</option>
                <option value="partially_refunded">Partially Refunded</option>
              </select>
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
                disabled={isUpdating}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  {/* Column Headers - only show for first item */}
                  {index === 0 && (
                    <div className="flex gap-2 items-start px-3">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div className="md:col-span-2">
                          {/* Empty space for description, no label needed */}
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Quantity</Label>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Price</Label>
                        </div>
                      </div>
                      <div className="w-20">
                        {/* Empty space for amount */}
                      </div>
                      <div className="w-9">
                        {/* Empty space for delete button */}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Qty"
                          min="0"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          disabled={isUpdating}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Rate"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          disabled={isUpdating}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-20 text-right" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        ${item.amount.toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1 || isUpdating}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-end items-center pt-3 border-t-2 border-gray-300">
              <div className="flex items-center gap-4">
                <span className="text-lg text-gray-700">Total:</span>
                <span className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              disabled={isUpdating}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Invoice
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}