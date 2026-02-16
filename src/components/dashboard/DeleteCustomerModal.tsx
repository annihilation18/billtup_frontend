import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '../ui/alert-dialog';
import { toast } from '../ui/sonner';
import { deleteCustomer } from '../../utils/dashboard-api';

interface DeleteCustomerModalProps {
  customer: any;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteCustomerModal({ customer, open, onClose, onDeleted }: DeleteCustomerModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCustomer(customer.id);
      toast.success('Customer deleted successfully');
      onDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!customer) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Customer
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to delete this customer? This action cannot be undone and will remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 my-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Name:</span>
              <span className="text-sm text-gray-900">{customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm text-gray-900">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm text-gray-900">{customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Customer'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}