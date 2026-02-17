import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { toast } from '../ui/sonner';
import { deleteInvoice } from '../../utils/dashboard-api';

interface DeleteInvoiceModalProps {
  invoice: any;
  /** Called after successful deletion (used by InvoicesTab) */
  onDeleted?: () => void;
  /** Called when the modal is dismissed without deleting (used by InvoicesTab) */
  onClose?: () => void;
  /** Legacy callback (used by InvoiceViewModal inline trigger) */
  onUpdate?: () => void;
  /** When true, the modal shows immediately without a trigger button */
  open?: boolean;
}

export function DeleteInvoiceModal({ invoice, onDeleted, onClose, onUpdate, open: controlledOpen }: DeleteInvoiceModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // If controlledOpen is provided (rendered conditionally by parent), use it.
  // Otherwise use internal state with a trigger button.
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const close = () => {
    if (isDeleting) return;
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInvoice(invoice.id);
      toast.success('Invoice deleted successfully!');
      if (onDeleted) {
        onDeleted();
      } else if (onUpdate) {
        onUpdate();
      }
      if (isControlled) {
        onClose?.();
      } else {
        setInternalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const modal = isOpen ? createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={close} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={close}
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Delete Invoice</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete invoice <strong>{invoice.number || invoice.id}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={close} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Invoice
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  // Controlled mode: no trigger button, parent renders us conditionally
  if (isControlled) {
    return <>{modal}</>;
  }

  // Uncontrolled mode: render trigger button + portal modal
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation();
          setInternalOpen(true);
        }}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
      {modal}
    </>
  );
}
