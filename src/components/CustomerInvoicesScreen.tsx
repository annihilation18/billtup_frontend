import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, FileText, DollarSign } from "lucide-react";
import { Invoice } from "./Dashboard";
import { Customer } from "./CustomersScreen";

interface CustomerInvoicesScreenProps {
  customer: Customer;
  invoices: Invoice[];
  onBack: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  businessLogo?: string;
  businessName?: string;
}

export function CustomerInvoicesScreen({
  customer,
  invoices,
  onBack,
  onViewInvoice,
  businessLogo,
  businessName,
}: CustomerInvoicesScreenProps) {
  // Filter invoices for this customer
  const customerInvoices = invoices.filter(
    (invoice) => invoice.customer === customer.name
  );

  // Calculate totals
  const totalPaid = customerInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalPending = customerInvoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.total, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "refunded":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {businessLogo && (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground">
                <img
                  src={businessLogo}
                  alt={businessName || "Logo"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl">{customer.name}</h1>
              <p className="text-sm text-primary-foreground/80">{customer.email}</p>
              {customer.phone && (
                <p className="text-sm text-primary-foreground/80">{customer.phone}</p>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 p-3">
              <div className="text-xs text-primary-foreground/70 mb-1">
                Total Invoices
              </div>
              <div className="text-2xl text-primary-foreground">
                {customerInvoices.length}
              </div>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 p-3">
              <div className="text-xs text-primary-foreground/70 mb-1">
                Total Paid
              </div>
              <div className="text-2xl text-primary-foreground">
                ${totalPaid.toFixed(2)}
              </div>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 p-3">
              <div className="text-xs text-primary-foreground/70 mb-1">
                Pending
              </div>
              <div className="text-2xl text-primary-foreground">
                ${totalPending.toFixed(2)}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="px-4 max-w-4xl mx-auto space-y-3">
        {customerInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-muted-foreground">
              No invoices found for this customer
            </p>
          </div>
        ) : (
          customerInvoices
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((invoice) => (
              <Card
                key={invoice.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onViewInvoice(invoice)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">#{invoice.number}</span>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(invoice.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg">
                      <DollarSign className="w-4 h-4" />
                      <span>{invoice.total.toFixed(2)}</span>
                    </div>
                    {invoice.refundedAmount && invoice.refundedAmount > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        -${invoice.refundedAmount.toFixed(2)} refunded
                      </p>
                    )}
                  </div>
                </div>

                {/* Line Items Preview */}
                <div className="text-sm text-muted-foreground">
                  {invoice.lineItems.slice(0, 2).map((item, idx) => (
                    <div key={idx}>
                      {item.description} ({item.quantity}x)
                    </div>
                  ))}
                  {invoice.lineItems.length > 2 && (
                    <div className="text-xs mt-1">
                      +{invoice.lineItems.length - 2} more items
                    </div>
                  )}
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
