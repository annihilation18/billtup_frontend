import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, X, Check, Package, Tag, List } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { savedLineItemsApi } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface SavedLineItem {
  id: string;
  name: string;
  notes?: string;
  price: number;
  quantity: number;
  usageCount: number;
}

interface SavedDiscount {
  label: string;
  type: 'dollar' | 'percent';
  value: number;
}

interface SavedItemsModalProps {
  open: boolean;
  onClose: () => void;
}

const DISCOUNTS_KEY = 'billtup_saved_discounts';

function getSavedDiscounts(): SavedDiscount[] {
  try {
    const raw = localStorage.getItem(DISCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        return (parsed as string[]).map(label => ({ label, type: 'dollar' as const, value: 0 }));
      }
      return parsed;
    }
    return [];
  } catch { return []; }
}

function saveDiscountsToStorage(discounts: SavedDiscount[]) {
  localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(discounts));
}

export function SavedItemsModal({ open, onClose }: SavedItemsModalProps) {
  const [activeTab, setActiveTab] = useState<'line-items' | 'discounts'>('line-items');

  const [lineItems, setLineItems] = useState<SavedLineItem[]>([]);
  const [lineItemsLoading, setLineItemsLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<SavedLineItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [itemName, setItemName] = useState('');
  const [itemNotes, setItemNotes] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [bulletMode, setBulletMode] = useState(false);

  const [discounts, setDiscounts] = useState<SavedDiscount[]>([]);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<SavedDiscount | null>(null);
  const [deleteDiscountLabel, setDeleteDiscountLabel] = useState<string | null>(null);

  const [discLabel, setDiscLabel] = useState('');
  const [discType, setDiscType] = useState<'dollar' | 'percent'>('percent');
  const [discValue, setDiscValue] = useState('');

  const loadLineItems = useCallback(async () => {
    setLineItemsLoading(true);
    try {
      const result = await savedLineItemsApi.list();
      setLineItems(Array.isArray(result) ? result : result.items || []);
    } catch {
      toast.error('Failed to load saved items');
    } finally {
      setLineItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadLineItems();
      setDiscounts(getSavedDiscounts());
    }
  }, [open, loadLineItems]);

  const resetItemForm = () => {
    setItemName(''); setItemNotes(''); setItemPrice(''); setItemQuantity('1');
    setEditingItem(null); setShowAddItem(false); setBulletMode(false);
  };

  const openEditItem = (item: SavedLineItem) => {
    setItemName(item.name); setItemNotes(item.notes || '');
    setItemPrice(item.price > 0 ? item.price.toString() : '');
    setItemQuantity(item.quantity.toString());
    setEditingItem(item); setShowAddItem(true);
  };

  const handleSaveItem = async () => {
    if (!itemName.trim()) { toast.error('Name is required'); return; }
    try {
      await savedLineItemsApi.save({
        name: itemName.trim(), notes: itemNotes.trim() || undefined,
        price: parseFloat(itemPrice) || 0, quantity: parseInt(itemQuantity) || 1,
      });
      toast.success(editingItem ? 'Item updated' : 'Item added');
      resetItemForm(); await loadLineItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save item');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    try {
      await savedLineItemsApi.delete(deleteItemId);
      setLineItems(prev => prev.filter(i => i.id !== deleteItemId));
      toast.success('Item deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
    } finally { setDeleteItemId(null); }
  };

  const resetDiscountForm = () => {
    setDiscLabel(''); setDiscType('percent'); setDiscValue('');
    setEditingDiscount(null); setShowAddDiscount(false);
  };

  const openEditDiscount = (disc: SavedDiscount) => {
    setDiscLabel(disc.label); setDiscType(disc.type);
    setDiscValue(disc.value > 0 ? disc.value.toString() : '');
    setEditingDiscount(disc); setShowAddDiscount(true);
  };

  const handleSaveDiscount = () => {
    if (!discLabel.trim()) { toast.error('Label is required'); return; }
    const updated = [...discounts];
    const lower = discLabel.trim().toLowerCase();
    const entry: SavedDiscount = { label: discLabel.trim(), type: discType, value: parseFloat(discValue) || 0 };
    if (editingDiscount) {
      const oldIdx = updated.findIndex(d => d.label === editingDiscount.label);
      if (oldIdx !== -1) updated.splice(oldIdx, 1);
    }
    const idx = updated.findIndex(d => d.label.toLowerCase() === lower);
    if (idx !== -1 && !editingDiscount) { updated[idx] = entry; } else { updated.unshift(entry); }
    const sliced = updated.slice(0, 20);
    setDiscounts(sliced); saveDiscountsToStorage(sliced);
    toast.success(editingDiscount ? 'Discount updated' : 'Discount added');
    resetDiscountForm();
  };

  const handleDeleteDiscount = () => {
    if (!deleteDiscountLabel) return;
    const updated = discounts.filter(d => d.label !== deleteDiscountLabel);
    setDiscounts(updated); saveDiscountsToStorage(updated);
    toast.success('Discount deleted'); setDeleteDiscountLabel(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Saved Items & Discounts</DialogTitle>
            <DialogDescription>Manage reusable line items and discounts for invoices and estimates.</DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'line-items' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('line-items')}
            >
              <Package className="w-4 h-4" /> Line Items ({lineItems.length})
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'discounts' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('discounts')}
            >
              <Tag className="w-4 h-4" /> Discounts ({discounts.length})
            </button>
          </div>

          {/* LINE ITEMS TAB */}
          {activeTab === 'line-items' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">These items appear as suggestions when creating invoices and estimates.</p>
                <Button size="sm" onClick={() => { resetItemForm(); setShowAddItem(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              {showAddItem && (
                <Card className="p-4 space-y-3 border-blue-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">{editingItem ? 'Edit Item' : 'New Item'}</Label>
                    <Button variant="ghost" size="icon" onClick={resetItemForm} className="h-7 w-7"><X className="w-4 h-4" /></Button>
                  </div>
                  <Input placeholder="Item name *" value={itemName} onChange={e => setItemName(e.target.value)} autoFocus />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-gray-500">Notes (optional)</Label>
                      <button
                        type="button"
                        onClick={() => {
                          const newMode = !bulletMode;
                          setBulletMode(newMode);
                          if (newMode && !itemNotes) {
                            setItemNotes('• ');
                            setTimeout(() => {
                              const ta = document.getElementById('web-item-notes') as HTMLTextAreaElement;
                              if (ta) { ta.selectionStart = ta.selectionEnd = 2; ta.focus(); }
                            }, 0);
                          } else if (newMode && itemNotes) {
                            // Convert existing lines to bullets
                            const converted = itemNotes.split('\n').map(line => {
                              const trimmed = line.replace(/^[•\-*]\s*/, '').trim();
                              return trimmed ? `• ${trimmed}` : '';
                            }).filter(Boolean).join('\n');
                            setItemNotes(converted);
                          } else if (!newMode && itemNotes) {
                            // Remove bullets from all lines
                            const plain = itemNotes.split('\n').map(line => line.replace(/^[•]\s*/, '')).join('\n');
                            setItemNotes(plain);
                          }
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${bulletMode ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'text-gray-500 hover:bg-gray-100 border border-transparent'}`}
                      >
                        <List className="w-3 h-3" />
                        {bulletMode ? 'Bullets On' : 'Bullets Off'}
                      </button>
                    </div>
                    <Textarea
                      id="web-item-notes"
                      placeholder={bulletMode ? 'Type your first item...' : 'Add notes, bullet lists, or descriptions...'}
                      value={itemNotes}
                      onChange={e => setItemNotes(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && bulletMode) {
                          const ta = e.target as HTMLTextAreaElement;
                          const pos = ta.selectionStart;
                          const textBefore = itemNotes.substring(0, pos);
                          const currentLine = textBefore.split('\n').pop() || '';
                          if (currentLine.trim() === '•' || currentLine.trim() === '') {
                            // Empty bullet — remove it and exit
                            e.preventDefault();
                            const before = textBefore.substring(0, textBefore.length - currentLine.length);
                            const after = itemNotes.substring(pos);
                            setItemNotes(before + after);
                            setBulletMode(false);
                            setTimeout(() => { ta.selectionStart = ta.selectionEnd = before.length; }, 0);
                          } else {
                            // Continue with next bullet
                            e.preventDefault();
                            const after = itemNotes.substring(pos);
                            setItemNotes(textBefore + '\n• ' + after);
                            setTimeout(() => { ta.selectionStart = ta.selectionEnd = pos + 3; }, 0);
                          }
                        }
                      }}
                      rows={3}
                      className="text-sm resize-y"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-500">Price ($)</Label>
                      <Input type="number" placeholder="0.00" min="0" step="0.01" value={itemPrice} onChange={e => setItemPrice(e.target.value)} />
                    </div>
                    <div className="w-24">
                      <Label className="text-xs text-gray-500">Quantity</Label>
                      <Input type="number" placeholder="1" min="1" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleSaveItem}>
                    <Check className="w-4 h-4 mr-1" /> {editingItem ? 'Update' : 'Save'}
                  </Button>
                </Card>
              )}

              {lineItemsLoading ? (
                <div className="text-center py-6 text-gray-500 text-sm">Loading...</div>
              ) : lineItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No saved line items yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Items you create here or in invoices/estimates will appear for quick reuse.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {lineItems.map(item => (
                    <Card key={item.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                          {item.notes && <div className="text-xs text-gray-500 mt-0.5 whitespace-pre-line line-clamp-3">{item.notes}</div>}
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            {item.price > 0 && <span className="font-mono">${item.price.toFixed(2)}</span>}
                            {item.quantity > 1 && <span>Qty: {item.quantity}</span>}
                            <span>Used {item.usageCount || 0}x</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditItem(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeleteItemId(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DISCOUNTS TAB */}
          {activeTab === 'discounts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">These discounts appear as suggestions when adding discounts to invoices and estimates.</p>
                <Button size="sm" onClick={() => { resetDiscountForm(); setShowAddDiscount(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              {showAddDiscount && (
                <Card className="p-4 space-y-3 border-blue-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">{editingDiscount ? 'Edit Discount' : 'New Discount'}</Label>
                    <Button variant="ghost" size="icon" onClick={resetDiscountForm} className="h-7 w-7"><X className="w-4 h-4" /></Button>
                  </div>
                  <Input placeholder="Discount name *" value={discLabel} onChange={e => setDiscLabel(e.target.value)} autoFocus />
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Type</Label>
                    <Select value={discType} onValueChange={v => setDiscType(v as 'dollar' | 'percent')}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent className="z-[200] bg-white border shadow-lg">
                        <SelectItem value="percent">% Percent</SelectItem>
                        <SelectItem value="dollar">$ Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">{discType === 'percent' ? 'Percentage (%)' : 'Amount ($)'}</Label>
                    <Input type="number" placeholder={discType === 'percent' ? 'e.g. 10' : 'e.g. 25.00'} min="0" max={discType === 'percent' ? 100 : undefined} step={discType === 'percent' ? 1 : 0.01} value={discValue} onChange={e => setDiscValue(e.target.value)} className="w-full" />
                  </div>
                  <Button className="w-full" onClick={handleSaveDiscount}>
                    <Check className="w-4 h-4 mr-1" /> {editingDiscount ? 'Update' : 'Save'}
                  </Button>
                </Card>
              )}

              {discounts.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No saved discounts yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Discounts you create here or use in invoices will appear for quick reuse.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {discounts.map(disc => (
                    <Card key={disc.label} className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{disc.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5 font-mono">
                            {disc.type === 'percent' ? `${disc.value}% off` : `$${disc.value.toFixed(2)} off`}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDiscount(disc)}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeleteDiscountLabel(disc.label)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>This will remove the item from your saved list. It won't affect existing invoices or estimates.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteDiscountLabel} onOpenChange={() => setDeleteDiscountLabel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discount</AlertDialogTitle>
            <AlertDialogDescription>This will remove "{deleteDiscountLabel}" from your saved discounts.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDiscount} className="bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
