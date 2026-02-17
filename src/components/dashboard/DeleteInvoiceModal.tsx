import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { toast } from '../ui/sonner';
import { deleteInvoice } from '../../utils/dashboard-api';

interface DeleteInvoiceModalProps {
  invoice: any;
  onUpdate?: () => void;
}

export function DeleteInvoiceModal({ invoice, onUpdate }: DeleteInvoiceModalProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInvoice(invoice.id);
      toast.success('Invoice deleted successfully!');
      setOpen(false);
      if (onUpdate) {
        onUpdate();
      }
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>

      {open && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => !isDeleting && setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => !isDeleting && setOpen(false)}
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
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
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
      )}
    </>
  );
}
