import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { ArrowLeft, FileText, Mail, DollarSign, AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";

interface InvoiceDetailScreenProps {
  invoice: any;
  businessData: any;
  onBack: () => void;
  onRefund: (invoiceId: string, amount: number) => Promise<void>;
  onEditInvoice?: () => void;
  onSendEmail: (email: string) => Promise<void>;
  onDelete: (invoiceId: string) => Promise<void>;
}

export function InvoiceDetailScreen({
  invoice,
  businessData,
  onBack,
  onRefund,
  onEditInvoice,
  onSendEmail,
  onDelete,
}: InvoiceDetailScreenProps) {
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundAmount, setRefundAmount] = useState(invoice.total.toString());
  const [isRefunding, setIsRefunding] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState(invoice.customerEmail || "");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPaid = invoice.status === "paid";
  const isPending = invoice.status === "pending";
  const isRefunded = invoice.status === "refunded";
  const isPartiallyRefunded = invoice.status === "partially_refunded";

  const maxRefundAmount = invoice.total - (invoice.refundedAmount || 0);

  const handleRefund = async () => {
    const amount = parseFloat(refundAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid refund amount");
      return;
    }

    if (amount > maxRefundAmount) {
      alert(`Refund amount cannot exceed $${maxRefundAmount.toFixed(2)}`);
      return;
    }

    setIsRefunding(true);
    try {
      await onRefund(invoice.id, amount);
      setShowRefundDialog(false);
    } catch (error) {
      console.error("Refund error:", error);
    } finally {
      setIsRefunding(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      alert("Please enter an email address");
      return;
    }

    setIsSendingEmail(true);
    try {
      await onSendEmail(emailAddress);
      setShowEmailDialog(false);
    } catch (error) {
      console.error("Email error:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(invoice.id);
      onBack();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-primary-foreground hover:bg-primary/80">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl">Invoice Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Invoice Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-mono text-primary mb-2">{invoice.number}</h2>
              <p className="text-sm text-muted-foreground">Issued: {invoice.date}</p>
            </div>
            <Badge 
              variant={isPaid ? "default" : "secondary"}
              className={`${
                isPaid 
                  ? "bg-[#14B8A6] hover:bg-[#14B8A6]/90" 
                  : isRefunded
                  ? "bg-red-500 hover:bg-red-500/90"
                  : isPartiallyRefunded
                  ? "bg-orange-500 hover:bg-orange-500/90"
                  : "bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white"
              } flex items-center gap-1 text-base px-4 py-2`}
            >
              {isPaid ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Paid
                </>
              ) : isRefunded ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Refunded
                </>
              ) : isPartiallyRefunded ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Partially Refunded
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Pending
                </>
              )}
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm uppercase text-muted-foreground mb-2">Bill To</h3>
            <p className="font-medium text-lg">{invoice.customer}</p>
            {invoice.customerEmail && (
              <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
            )}
          </div>
        </Card>

        {/* Line Items */}
        <Card className="p-6">
          <h3 className="mb-4">Items</h3>
          <div className="space-y-3">
            {invoice.lineItems?.map((item: any, index: number) => (
              <div 
                key={item.id || index} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-mono text-lg">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-mono">${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-mono">${invoice.tax.toFixed(2)}</span>
              </div>
            )}
            {(isRefunded || isPartiallyRefunded) && invoice.refundedAmount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Refunded:</span>
                <span className="font-mono">-${invoice.refundedAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t-2 border-primary">
              <span className="text-lg text-primary">Total:</span>
              <span className="font-mono text-2xl text-primary">
                ${invoice.total.toFixed(2)}
              </span>
            </div>
            {(isRefunded || isPartiallyRefunded) && invoice.refundedAmount > 0 && (
              <div className="flex justify-between font-medium">
                <span>Net Amount:</span>
                <span className="font-mono text-lg">
                  ${(invoice.total - invoice.refundedAmount).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Signature */}
        {invoice.signature && (
          <Card className="p-6">
            <h3 className="mb-3">Customer Signature</h3>
            <div className="border border-border rounded-lg p-3 bg-muted/30">
              <img src={invoice.signature} alt="Signature" className="max-w-full h-auto" />
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowEmailDialog(true)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Invoice via Email
          </Button>

          {isPending && onEditInvoice && (
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={onEditInvoice}
            >
              <FileText className="w-4 h-4 mr-2" />
              Edit Invoice
            </Button>
          )}

          {isPaid && maxRefundAmount > 0 && (
            <Button
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => setShowRefundDialog(true)}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Issue Refund
            </Button>
          )}

          {(isRefunded || isPartiallyRefunded) && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">
                    {isRefunded ? "Full Refund Issued" : "Partial Refund Issued"}
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Refunded Amount: ${invoice.refundedAmount.toFixed(2)}
                  </p>
                  {invoice.refundDate && (
                    <p className="text-xs text-red-600 mt-1">
                      Refund Date: {invoice.refundDate}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          <Button
            variant="outline"
            className="w-full border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Invoice
          </Button>
        </div>
      </div>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
            <DialogDescription>
              Issue a full or partial refund for this invoice. The refund will be processed through Stripe.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Invoice Total</Label>
              <div className="font-mono text-2xl text-primary">
                ${invoice.total.toFixed(2)}
              </div>
            </div>

            {invoice.refundedAmount > 0 && (
              <div className="space-y-2">
                <Label>Already Refunded</Label>
                <div className="font-mono text-lg text-red-600">
                  -${invoice.refundedAmount.toFixed(2)}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="refundAmount">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="refundAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={maxRefundAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum refundable: ${maxRefundAmount.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundAmount((maxRefundAmount / 2).toFixed(2))}
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundAmount(maxRefundAmount.toFixed(2))}
              >
                Full Amount
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRefund}
              disabled={isRefunding}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRefunding ? "Processing..." : "Issue Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invoice via Email</DialogTitle>
            <DialogDescription>
              Send this invoice to the customer via email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="customer@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="bg-primary hover:bg-primary/90"
            >
              {isSendingEmail ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}