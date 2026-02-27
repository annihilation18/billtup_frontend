import { useState, useEffect } from 'react';
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
  ClipboardList,
  Plus,
  Trash2,
} from 'lucide-react@0.468.0';
import { toast } from '../ui/sonner';
import { createEstimate, fetchCustomers, fetchEstimates } from '../../utils/dashboard-api';
import { savedLineItemsApi } from '../../utils/api';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface CreateEstimateModalProps {
  open?: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateEstimateModal({ open = true, onClose, onCreated }: CreateEstimateModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [estimateNumber, setEstimateNumber] = useState('');
  const [date, setDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [activeAutocomplete, setActiveAutocomplete] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      loadCustomers();
      loadNextEstimateNumber();
      savedLineItemsApi.list().then((items: any[]) => setSavedItems(items || [])).catch(() => {});
      const today = new Date().toISOString().split('T')[0];
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setDate(today);
      setValidUntil(in30Days);
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

  const loadNextEstimateNumber = async () => {
    try {
      const estimates = await fetchEstimates();
      const existing = Array.isArray(estimates) ? estimates : [];
      let maxNum = 0;
      for (const est of existing) {
        const match = String(est.number || '').match(/^EST-(\d+)$/);
        if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10));
      }
      setEstimateNumber(`EST-${String(maxNum + 1).padStart(3, '0')}`);
    } catch {
      setEstimateNumber(`EST-${String(1).padStart(3, '0')}`);
    }
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
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

  const getFilteredSuggestions = (query: string) => {
    if (query.length < 2 || savedItems.length === 0) return [];
    const lower = query.toLowerCase();
    return savedItems
      .filter((s: any) => s.name.toLowerCase().includes(lower))
      .sort((a: any, b: any) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 8);
  };

  const handleSelectSuggestion = (index: number, suggestion: any) => {
    const newItems = [...lineItems];
    newItems[index] = {
      ...newItems[index],
      description: suggestion.name,
      rate: suggestion.price || 0,
      quantity: suggestion.quantity || 1,
      amount: (suggestion.quantity || 1) * (suggestion.price || 0),
    };
    setLineItems(newItems);
    setActiveAutocomplete(null);
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

      await createEstimate({
        number: estimateNumber,
        customerId: selectedCustomerId,
        customer: selectedCustomer?.name || '',
        customerEmail: selectedCustomer?.email || '',
        items: lineItems,
        total: calculateTotal(),
        status: 'draft',
        date: date || new Date().toISOString(),
        validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: notes,
        createdAt: new Date().toISOString(),
      });

      // Save line items for autocomplete
      Promise.all(
        lineItems
          .filter((item) => item.description.trim())
          .map((item) => savedLineItemsApi.save({
            name: item.description,
            price: item.rate,
            quantity: item.quantity,
          }).catch(() => {}))
      );

      toast.success('Estimate created successfully!');
      onCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating estimate:', error);
      toast.error('Failed to create estimate. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomerId('');
    setEstimateNumber('');
    setDate('');
    setValidUntil('');
    setNotes('');
    setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#1E3A8A]" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Create New Estimate</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Create a new estimate to send to a customer for approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Estimate Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimateNumber">Estimate Number</Label>
              <Input
                id="estimateNumber"
                value={estimateNumber}
                onChange={(e) => setEstimateNumber(e.target.value)}
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
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
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
                  {index === 0 && (
                    <div className="grid grid-cols-12 gap-2 items-start px-3">
                      <div className="col-span-12 sm:col-span-5" />
                      <div className="col-span-4 sm:col-span-2">
                        <Label className="text-xs text-gray-500">Quantity</Label>
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Label className="text-xs text-gray-500">Price</Label>
                      </div>
                      <div className="col-span-4 sm:col-span-2" />
                      <div className="col-span-12 sm:col-span-1" />
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg">
                    <div className="col-span-12 sm:col-span-5 relative">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          handleLineItemChange(index, 'description', e.target.value);
                          setActiveAutocomplete(e.target.value.length >= 2 ? index : null);
                        }}
                        onFocus={() => {
                          if (item.description.length >= 2) setActiveAutocomplete(index);
                        }}
                        onBlur={() => {
                          setTimeout(() => setActiveAutocomplete((prev) => prev === index ? null : prev), 150);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setActiveAutocomplete(null);
                        }}
                        className="border-gray-300 bg-white"
                        autoComplete="off"
                      />
                      {activeAutocomplete === index && getFilteredSuggestions(item.description).length > 0 && (
                        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {getFilteredSuggestions(item.description).map((s: any) => (
                            <button
                              key={s.id}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center justify-between gap-2"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectSuggestion(index, s)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{s.name}</div>
                                {s.notes && <div className="text-xs text-gray-500 truncate">{s.notes}</div>}
                              </div>
                              {s.price > 0 && <span className="text-xs font-mono text-gray-500 shrink-0">${s.price.toFixed(2)}</span>}
                            </button>
                          ))}
                        </div>
                      )}
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
                  <span className="text-gray-700">Estimated Total:</span>
                  <span className="text-xl text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Terms (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any terms, conditions, or additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300 min-h-[80px]"
            />
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
              'Create Estimate'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
