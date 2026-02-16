import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { FileText, Users, Settings, Search, Plus, Mail, Phone, Edit } from "lucide-react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastInvoice?: string;
}

interface CustomersScreenProps {
  customers: Customer[];
  onAddCustomer: (customerData: Omit<Customer, "id">) => void;
  onEditCustomer: (id: string, customerData: Omit<Customer, "id">) => void;
  onViewCustomer: (customer: Customer) => void;
  currentTab: string;
  onTabChange: (tab: string) => void;
  businessLogo?: string;
  businessName?: string;
}

export function CustomersScreen({ customers, onAddCustomer, onEditCustomer, onViewCustomer, currentTab, onTabChange, businessLogo, businessName }: CustomersScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      return;
    }
    onAddCustomer(newCustomer);
    setNewCustomer({ name: "", email: "", phone: "" });
    setIsDialogOpen(false);
  };

  const handleEditCustomer = () => {
    if (!editingCustomer || !editingCustomer.name || !editingCustomer.email) {
      return;
    }
    onEditCustomer(editingCustomer.id, {
      name: editingCustomer.name,
      email: editingCustomer.email,
      phone: editingCustomer.phone,
    });
    setEditingCustomer(null);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

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
          <h1 className="text-2xl">Customers</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="px-4 max-w-4xl mx-auto space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-muted-foreground mb-4">No customers yet</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Customer
            </Button>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewCustomer(customer)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="mb-2">{customer.name}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.lastInvoice && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Last invoice: #{customer.lastInvoice}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => openEditDialog(customer, e)}
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 flex-shrink-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-20 right-4 md:right-8 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your directory. Name and email are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleAddCustomer}
              disabled={!newCustomer.name || !newCustomer.email}
            >
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information. Name and email are required.
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="Customer name"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="customer@example.com"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingCustomer(null);
                    setIsEditDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleEditCustomer}
                  disabled={!editingCustomer.name || !editingCustomer.email}
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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