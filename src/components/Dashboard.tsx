import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Plus, FileText, Users, Settings, Clock, CheckCircle2, DollarSign, Calendar, TrendingUp } from "lucide-react";

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  total: number;
  date: string;
  status: "paid" | "pending" | "refunded" | "partially_refunded";
  refundedAmount?: number;
  refundDate?: string;
}

interface DashboardProps {
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  currentTab: string;
  onTabChange: (tab: string) => void;
  businessLogo?: string;
  businessName?: string;
}

export function Dashboard({ invoices, onCreateInvoice, onViewInvoice, currentTab, onTabChange, businessLogo, businessName }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");

  // Calculate sales statistics
  const salesStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let monthlyTotal = 0;
    let ytdTotal = 0;
    let pendingTotal = 0;
    
    invoices.forEach(invoice => {
      if (invoice.status === "paid") {
        // Parse the date (format: "Oct 28, 2025")
        const invoiceDate = new Date(invoice.date);
        const invoiceMonth = invoiceDate.getMonth();
        const invoiceYear = invoiceDate.getFullYear();
        
        // Add to monthly total if in current month
        if (invoiceMonth === currentMonth && invoiceYear === currentYear) {
          monthlyTotal += invoice.total;
        }
        
        // Add to YTD total if in current year
        if (invoiceYear === currentYear) {
          ytdTotal += invoice.total;
        }
      } else if (invoice.status === "pending") {
        pendingTotal += invoice.total;
      }
    });
    
    return { monthlyTotal, ytdTotal, pendingTotal };
  }, [invoices]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const pendingCount = invoices.filter(inv => inv.status === "pending").length;
  const paidCount = invoices.filter(inv => inv.status === "paid").length;
  
  // Get current month name
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {businessLogo && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground">
              <img src={businessLogo} alt={businessName || "Logo"} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl">Invoices</h1>
        </div>
      </div>

      {/* Sales Statistics */}
      <div className="p-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Monthly Total */}
          <Card className="p-4 bg-gradient-to-br from-[#1E3A8A]/10 to-[#1E3A8A]/5 border-[#1E3A8A]/20">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-[#1E3A8A] rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{currentMonthName} Sales</p>
            <p className="text-2xl font-mono text-[#1E3A8A]">
              ${salesStats.monthlyTotal.toFixed(2)}
            </p>
          </Card>

          {/* YTD Total */}
          <Card className="p-4 bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 border-[#14B8A6]/20">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-[#14B8A6] rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Year-to-Date</p>
            <p className="text-2xl font-mono text-[#14B8A6]">
              ${salesStats.ytdTotal.toFixed(2)}
            </p>
          </Card>

          {/* Pending Amount */}
          <Card className="p-4 bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 border-[#F59E0B]/20">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-[#F59E0B] rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Pending Payment</p>
            <p className="text-2xl font-mono text-[#F59E0B]">
              ${salesStats.pendingTotal.toFixed(2)}
            </p>
          </Card>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 max-w-4xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        
        {/* Status Filter Tabs */}
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="paid" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Paid ({paidCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Invoice List */}
      <div className="px-4 max-w-4xl mx-auto space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-muted-foreground mb-4">No invoices yet</p>
            <Button onClick={onCreateInvoice} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Invoice
            </Button>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card 
              key={invoice.id}
              className={`p-4 cursor-pointer hover:shadow-lg transition-all border-l-4 ${
                invoice.status === "paid" 
                  ? "border-l-[#14B8A6] bg-[#14B8A6]/5" 
                  : invoice.status === "refunded"
                  ? "border-l-red-500 bg-red-50"
                  : invoice.status === "partially_refunded"
                  ? "border-l-orange-500 bg-orange-50"
                  : "border-l-[#F59E0B] bg-[#F59E0B]/5"
              }`}
              onClick={() => onViewInvoice(invoice)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-primary">{invoice.number}</span>
                    <Badge 
                      variant={invoice.status === "paid" ? "default" : "secondary"} 
                      className={`${
                        invoice.status === "paid" 
                          ? "bg-[#14B8A6] hover:bg-[#14B8A6]/90" 
                          : invoice.status === "refunded"
                          ? "bg-red-500 hover:bg-red-500/90"
                          : invoice.status === "partially_refunded"
                          ? "bg-orange-500 hover:bg-orange-500/90"
                          : "bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white"
                      } flex items-center gap-1`}
                    >
                      {invoice.status === "paid" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </>
                      ) : invoice.status === "refunded" ? (
                        "Refunded"
                      ) : invoice.status === "partially_refunded" ? (
                        "Partial Refund"
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="font-medium">{invoice.customer}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  {(invoice.status === "refunded" || invoice.status === "partially_refunded") && invoice.refundedAmount && (
                    <p className="text-xs text-red-600 mt-1">
                      Refunded: ${invoice.refundedAmount.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-mono">${invoice.total.toFixed(2)}</p>
                  {invoice.status === "pending" && (
                    <p className="text-xs text-[#F59E0B] mt-1">Awaiting Payment</p>
                  )}
                  {(invoice.status === "refunded" || invoice.status === "partially_refunded") && invoice.refundedAmount && (
                    <p className="text-sm font-mono text-muted-foreground line-through mt-1">
                      Net: ${(invoice.total - invoice.refundedAmount).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={onCreateInvoice}
        className="fixed bottom-20 right-4 md:right-8 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-around p-2">
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "invoices" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("invoices")}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Invoices</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "customers" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("customers")}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Customers</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 py-2 ${currentTab === "settings" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onTabChange("settings")}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
        <div className="text-center pb-1">
          <p className="text-[10px] text-muted-foreground">BilltUp v1.0</p>
        </div>
      </div>
    </div>
  );
}