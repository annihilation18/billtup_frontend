import { Trash2, AlertTriangle, Loader2 } from 'lucide-react@0.468.0';
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
      // Wait a moment for the parent modal to close
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Invoice
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete invoice <strong>{invoice.number || invoice.id}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
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
      </DialogContent>
    </Dialog>
  );
}