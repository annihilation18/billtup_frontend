import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { ForgotPasswordScreen } from "./components/ForgotPasswordScreen";
import { ResetPasswordScreen } from "./components/ResetPasswordScreen";
import { EmailConfigTest } from "./components/EmailConfigTest";
import { EmailSetupChecklist } from "./components/EmailSetupChecklist";
import { StripeOAuthCallback } from "./components/StripeOAuthCallback";
import {
  OnboardingScreen,
  BusinessData,
} from "./components/OnboardingScreen";
import { Dashboard, Invoice } from "./components/Dashboard";
import {
  InvoiceBuilder,
  InvoiceData,
} from "./components/InvoiceBuilder";
import { PaymentScreen } from "./components/PaymentScreen";
import {
  CustomersScreen,
  Customer,
} from "./components/CustomersScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { ReceiptScreen } from "./components/ReceiptScreen";
import { InvoicePDFPreview } from "./components/InvoicePDFPreview";
import { InvoiceDetailScreen } from "./components/InvoiceDetailScreen";
import { CustomerInvoicesScreen } from "./components/CustomerInvoicesScreen";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import {
  authApi,
  businessApi,
  invoiceApi,
  customerApi,
  paymentApi,
} from "./utils/api";

// ========== IMMEDIATE STARTUP LOG ==========
console.log("=".repeat(80));
console.log(
  "🚀 APP.TSX FILE LOADED - TIMESTAMP:",
  new Date().toISOString(),
);
console.log("=".repeat(80));

// Global error handler for uncaught errors
if (typeof window !== "undefined") {
  console.log("[Setup] Installing global error handlers...");

  window.addEventListener("error", (event) => {
    console.error("[Global Error Handler] Uncaught error:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
    });
  });

  // Global handler for unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    console.error(
      "[Global Error Handler] Unhandled promise rejection:",
      {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
      },
    );
  });

  console.log("[Setup] Global error handlers installed");
}

console.log("[App] BilltUp starting up...", {
  timestamp: new Date().toISOString(),
  userAgent:
    typeof navigator !== "undefined"
      ? navigator.userAgent
      : "N/A",
});

type Screen =
  | "splash"
  | "login"
  | "forgot-password"
  | "reset-password"
  | "email-config-test"
  | "email-setup-checklist"
  | "stripe-oauth-callback"
  | "onboarding"
  | "dashboard"
  | "invoice-builder"
  | "invoice-detail"
  | "customer-invoices"
  | "payment"
  | "receipt"
  | "customers"
  | "settings";

function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("splash");
  const [currentTab, setCurrentTab] =
    useState<string>("invoices");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resetToken, setResetToken] = useState<string>("");
  const [businessData, setBusinessData] =
    useState<BusinessData>({
      businessName: "",
      email: "",
      phone: "",
      address: "",
      industry: "",
      defaultTaxRate: "8.5",
    });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentInvoiceData, setCurrentInvoiceData] =
    useState<InvoiceData | null>(null);
  const [savedInvoice, setSavedInvoice] = useState<any>(null); // Stores the complete saved invoice with number
  const [editingInvoice, setEditingInvoice] =
    useState<any>(null); // Invoice being edited
  const [viewingInvoice, setViewingInvoice] =
    useState<any>(null); // Invoice being viewed in detail
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null); // Customer being viewed
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [previewInvoiceData, setPreviewInvoiceData] =
    useState<InvoiceData | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    // Check for special URL params first - don't run auth check if these exist
    const urlParams = new URLSearchParams(
      window.location.search,
    );
    console.log(
      "[App] Checking URL params on mount:",
      window.location.href,
    );
    console.log(
      "[App] URL params:",
      Object.fromEntries(urlParams.entries()),
    );

    // Check for password reset token FIRST
    const resetTokenParam = urlParams.get("reset-token");
    if (resetTokenParam) {
      console.log(
        "[App] Reset token found in URL, skipping auth check",
      );
      console.log("[App] Reset token value:", resetTokenParam);
      setResetToken(resetTokenParam);
      setCurrentScreen("reset-password");
      setIsLoading(false);
      // Clean up URL
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname,
      );
      return; // Don't run auth check
    }

    // Check for email setup checklist
    if (urlParams.has("email-setup")) {
      console.log(
        "[App] Email setup param found, skipping auth check",
      );
      setCurrentScreen("email-setup-checklist");
      setIsLoading(false);
      return; // Don't run auth check
    }

    // Check for email config test
    if (urlParams.has("email-test")) {
      console.log(
        "[App] Email test param found, skipping auth check",
      );
      setCurrentScreen("email-config-test");
      setIsLoading(false);
      return; // Don't run auth check
    }

    // Check for Stripe OAuth callback
    if (urlParams.has("code") && urlParams.has("state")) {
      console.log("[App] Stripe OAuth callback detected");
      setCurrentScreen("stripe-oauth-callback");
      setIsLoading(false);
      return; // Don't run auth check
    }

    // No special params, run normal auth check
    checkAuth();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && currentScreen === "dashboard") {
      loadAppData();
    }
  }, [isAuthenticated, currentScreen]);

  const checkAuth = async () => {
    try {
      console.log(
        "[App] Starting auth check...",
        new Date().toISOString(),
      );
      const session = await authApi.getSession();
      console.log(
        "[App] Session retrieved:",
        session ? "Session exists" : "No session",
      );

      if (session) {
        setIsAuthenticated(true);
        console.log("[App] Loading business data...");
        await loadBusinessData();
        console.log(
          "[App] Business data loaded, navigating to dashboard",
        );
        setCurrentScreen("dashboard");
      } else {
        console.log(
          "[App] No session found, showing splash screen",
        );
        setCurrentScreen("splash");
      }
    } catch (error) {
      console.error("[App] Auth check error:", {
        error:
          error instanceof Error
            ? error.message
            : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      setCurrentScreen("splash");
    } finally {
      console.log(
        "[App] Auth check complete, setting isLoading to false",
      );
      setIsLoading(false);
    }
  };

  const loadBusinessData = async () => {
    try {
      const data = await businessApi.get();
      if (data) {
        setBusinessData(data);
      }
    } catch (error) {
      console.error("Error loading business data:", error);
      // If no business data exists, user needs to complete onboarding
    }
  };

  const loadAppData = async () => {
    try {
      const [invoicesData, customersData] = await Promise.all([
        invoiceApi.getAll(),
        customerApi.getAll(),
      ]);
      setInvoices(invoicesData || []);
      setCustomers(customersData || []);

      // Create dummy invoices if none exist (for demonstration)
      if (!invoicesData || invoicesData.length === 0) {
        await createDummyInvoices();
      }
    } catch (error) {
      console.error("Error loading app data:", error);
      toast.error("Failed to load data");
    }
  };

  const createDummyInvoices = async () => {
    const dummyInvoices = [
      // January invoices
      {
        number: "INV-001",
        customer: "Sarah Johnson",
        customerEmail: "sarah.j@email.com",
        lineItems: [
          {
            id: "1",
            name: "Auto Detailing - Premium Package",
            quantity: 1,
            price: 299.99,
          },
        ],
        subtotal: 299.99,
        tax: 25.5,
        total: 325.49,
        date: "Jan 15, 2025",
        status: "paid",
      },
      {
        number: "INV-002",
        customer: "Michael Chen",
        customerEmail: "m.chen@email.com",
        lineItems: [
          {
            id: "1",
            name: "Kitchen Remodeling Consultation",
            quantity: 2,
            price: 150.0,
          },
        ],
        subtotal: 300.0,
        tax: 25.5,
        total: 325.5,
        date: "Jan 28, 2025",
        status: "paid",
      },
      // March invoices
      {
        number: "INV-003",
        customer: "Emily Rodriguez",
        customerEmail: "emily.r@email.com",
        lineItems: [
          {
            id: "1",
            name: "Wedding Photography - 8 Hour Package",
            quantity: 1,
            price: 1800.0,
          },
          {
            id: "2",
            name: "Photo Album (Premium)",
            quantity: 1,
            price: 200.0,
          },
        ],
        subtotal: 2000.0,
        tax: 170.0,
        total: 2170.0,
        date: "Mar 15, 2025",
        status: "paid",
      },
      // September invoices
      {
        number: "INV-004",
        customer: "David Thompson",
        customerEmail: "d.thompson@email.com",
        lineItems: [
          {
            id: "1",
            name: "Bathroom Tile Installation",
            quantity: 1,
            price: 1200.0,
          },
        ],
        subtotal: 1200.0,
        tax: 102.0,
        total: 1302.0,
        date: "Sep 10, 2025",
        status: "paid",
      },
      // October (current month) invoices
      {
        number: "INV-005",
        customer: "Lisa Martinez",
        customerEmail: "lisa.m@email.com",
        lineItems: [
          {
            id: "1",
            name: "Car Interior Detailing",
            quantity: 1,
            price: 180.0,
          },
          {
            id: "2",
            name: "Paint Protection Coating",
            quantity: 1,
            price: 450.0,
          },
        ],
        subtotal: 630.0,
        tax: 53.55,
        total: 683.55,
        date: "Oct 15, 2025",
        status: "paid",
      },
      {
        number: "INV-006",
        customer: "James Wilson",
        customerEmail: "j.wilson@email.com",
        lineItems: [
          {
            id: "1",
            name: "Home Office Remodeling",
            quantity: 1,
            price: 3500.0,
          },
        ],
        subtotal: 3500.0,
        tax: 297.5,
        total: 3797.5,
        date: "Oct 22, 2025",
        status: "paid",
      },
      {
        number: "INV-007",
        customer: "Rachel Green",
        customerEmail: "r.green@email.com",
        lineItems: [
          {
            id: "1",
            name: "Portrait Session",
            quantity: 1,
            price: 350.0,
          },
        ],
        subtotal: 350.0,
        tax: 29.75,
        total: 379.75,
        date: "Oct 28, 2025",
        status: "pending",
      },
      {
        number: "INV-008",
        customer: "Tom Anderson",
        customerEmail: "t.anderson@email.com",
        lineItems: [
          {
            id: "1",
            name: "Kitchen Cabinet Refinishing",
            quantity: 1,
            price: 1800.0,
          },
        ],
        subtotal: 1800.0,
        tax: 153.0,
        total: 1953.0,
        date: "Oct 30, 2025",
        status: "pending",
      },
    ];

    try {
      for (const invoice of dummyInvoices) {
        await invoiceApi.create(invoice);
      }

      // Reload invoices after creating dummies
      const invoicesData = await invoiceApi.getAll();
      setInvoices(invoicesData || []);

      console.log("Dummy invoices created successfully");
    } catch (error) {
      console.error("Error creating dummy invoices:", error);
    }
  };

  const handleGetStarted = () => {
    setCurrentScreen("login");
  };

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);

    try {
      // Check if business data exists
      const data = await businessApi.get();
      if (data && data.businessName) {
        setBusinessData(data);
        setCurrentScreen("dashboard");
      } else {
        // No business data, go to onboarding
        setCurrentScreen("onboarding");
      }
    } catch (error) {
      // No business data found, go to onboarding
      setCurrentScreen("onboarding");
    }
  };

  const handleOnboardingComplete = async (
    data: BusinessData,
  ) => {
    try {
      // Save business data to backend
      await businessApi.save(data);
      setBusinessData(data);
      setCurrentScreen("dashboard");
      toast.success("Setup complete! Welcome to BilltUp");
    } catch (error) {
      console.error("Error saving business data:", error);
      toast.error("Failed to save business data");
    }
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setCurrentScreen("invoice-builder");
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    try {
      // Fetch full invoice data from backend
      const fullInvoice = await invoiceApi.getById(invoice.id);
      setViewingInvoice(fullInvoice);
      setCurrentScreen("invoice-detail");
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast.error("Failed to load invoice");
    }
  };

  const handleEditInvoiceFromDetail = () => {
    if (viewingInvoice) {
      setEditingInvoice(viewingInvoice);
      setCurrentScreen("invoice-builder");
    }
  };

  const handleBackToDashboard = () => {
    setCurrentTab("invoices");
    setCurrentScreen("dashboard");
  };

  const handlePreviewPDF = (invoiceData: InvoiceData) => {
    setPreviewInvoiceData(invoiceData);
    setShowPDFPreview(true);
  };

  const handleSaveInvoice = async (
    invoiceData: InvoiceData,
  ) => {
    try {
      // Check if customer exists, if not create them
      const existingCustomer = customers.find(
        (c) => c.email === invoiceData.customerEmail,
      );
      if (!existingCustomer) {
        try {
          const newCustomerData = {
            name: invoiceData.customer,
            email: invoiceData.customerEmail,
            phone: invoiceData.customerPhone || "",
          };
          const result =
            await customerApi.create(newCustomerData);
          setCustomers([...customers, result.customer]);
          toast.success(
            `Customer "${invoiceData.customer}" added automatically`,
          );
        } catch (customerError) {
          console.error(
            "Error creating customer:",
            customerError,
          );
          // Continue with invoice creation even if customer creation fails
        }
      }

      const invoiceNumber =
        editingInvoice?.number ||
        `INV-${String(invoices.length + 1).padStart(3, "0")}`;
      const invoicePayload = {
        number: invoiceNumber,
        customer: invoiceData.customer,
        customerEmail: invoiceData.customerEmail,
        customerPhone: invoiceData.customerPhone,
        lineItems: invoiceData.lineItems,
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        total: invoiceData.total,
        signature: invoiceData.signature,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "pending",
      };

      if (editingInvoice) {
        // Update existing invoice
        const result = await invoiceApi.update(
          editingInvoice.id,
          invoicePayload,
        );

        // Update local state
        setInvoices(
          invoices.map((inv) =>
            inv.id === editingInvoice.id
              ? { ...inv, ...invoicePayload }
              : inv,
          ),
        );

        toast.success("Invoice updated successfully!");
      } else {
        // Create new invoice
        const result = await invoiceApi.create(invoicePayload);

        // Update local state
        const newInvoice: Invoice = {
          id: result.invoice.id,
          number: invoiceNumber,
          customer: invoiceData.customer,
          total: invoiceData.total,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: "pending",
        };
        setInvoices([newInvoice, ...invoices]);

        toast.success("Invoice saved successfully!");
      }

      // Return to dashboard
      handleBackToDashboard();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
    }
  };

  const handleProceedToPayment = async (
    invoiceData: InvoiceData,
  ) => {
    // Check if customer exists, if not create them
    const existingCustomer = customers.find(
      (c) => c.email === invoiceData.customerEmail,
    );
    if (!existingCustomer) {
      try {
        const newCustomerData = {
          name: invoiceData.customer,
          email: invoiceData.customerEmail,
          phone: invoiceData.customerPhone || "",
        };
        const result =
          await customerApi.create(newCustomerData);
        setCustomers([...customers, result.customer]);
        toast.success(
          `Customer "${invoiceData.customer}" added automatically`,
        );
      } catch (customerError) {
        console.error(
          "Error creating customer:",
          customerError,
        );
        // Continue with invoice creation even if customer creation fails
      }
    }

    // If not already saved, save the invoice first
    if (!editingInvoice) {
      try {
        const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
        const invoicePayload = {
          number: invoiceNumber,
          customer: invoiceData.customer,
          customerEmail: invoiceData.customerEmail,
          customerPhone: invoiceData.customerPhone,
          lineItems: invoiceData.lineItems,
          subtotal: invoiceData.subtotal,
          tax: invoiceData.tax,
          total: invoiceData.total,
          signature: invoiceData.signature,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: "pending",
        };

        const result = await invoiceApi.create(invoicePayload);
        setSavedInvoice(result.invoice);
        setEditingInvoice(result.invoice);
      } catch (error) {
        console.error(
          "Error saving invoice before payment:",
          error,
        );
        toast.error("Failed to save invoice");
        return;
      }
    } else {
      setSavedInvoice(editingInvoice);
    }

    setCurrentInvoiceData(invoiceData);
    setCurrentScreen("payment");
  };

  const handlePaymentSuccess = async (
    paymentIntentId?: string,
  ) => {
    // Update invoice status to paid
    if (savedInvoice) {
      try {
        const updates: any = { status: "paid" };
        if (paymentIntentId) {
          updates.paymentIntentId = paymentIntentId;
        }

        await invoiceApi.update(savedInvoice.id, updates);

        // Update local state
        setInvoices(
          invoices.map((inv) =>
            inv.id === savedInvoice.id
              ? { ...inv, status: "paid" }
              : inv,
          ),
        );

        // Move to receipt screen
        setCurrentScreen("receipt");
      } catch (error) {
        console.error("Error updating invoice status:", error);
        toast.error(
          "Payment successful but failed to update invoice status",
        );
        // Still show receipt screen even if update fails
        setCurrentScreen("receipt");
      }
    } else {
      setCurrentScreen("receipt");
    }
  };

  const handleSendReceipt = async (email: string) => {
    try {
      if (!savedInvoice) {
        toast.error("No invoice data available");
        return;
      }

      // Use the saved invoice which has the invoice number
      await invoiceApi.sendEmail(
        savedInvoice,
        email,
        businessData,
      );
      toast.success(`Invoice emailed to ${email}`, {
        description:
          "The customer will receive the invoice PDF shortly",
      });
    } catch (error: any) {
      console.error("Error sending invoice email:", error);
      toast.error(
        error.message || "Failed to send invoice email",
      );
    }
  };

  const handleReturnToDashboard = () => {
    setCurrentInvoiceData(null);
    setSavedInvoice(null);
    setEditingInvoice(null);
    setViewingInvoice(null);
    handleBackToDashboard();
  };

  const handleRefund = async (
    invoiceId: string,
    amount: number,
  ) => {
    try {
      await paymentApi.refundPayment(invoiceId, amount);

      // Reload invoice data
      const updatedInvoice =
        await invoiceApi.getById(invoiceId);
      setViewingInvoice(updatedInvoice);

      // Reload invoices list
      await loadAppData();

      toast.success(
        `Refund of $${amount.toFixed(2)} processed successfully`,
        {
          description:
            "The refund has been issued to the customer's payment method",
        },
      );
    } catch (error: any) {
      console.error("Error processing refund:", error);
      toast.error(error.message || "Failed to process refund");
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await invoiceApi.delete(invoiceId);

      // Reload invoices list
      await loadAppData();

      toast.success("Invoice deleted successfully", {
        description: "The invoice has been permanently deleted",
      });
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
      toast.error(error.message || "Failed to delete invoice");
    }
  };

  const handleSendInvoiceEmail = async (email: string) => {
    try {
      if (!viewingInvoice) {
        toast.error("No invoice data available");
        return;
      }

      await invoiceApi.sendEmail(
        viewingInvoice,
        email,
        businessData,
      );
      toast.success(`Invoice emailed to ${email}`, {
        description:
          "The customer will receive the invoice PDF shortly",
      });
    } catch (error: any) {
      console.error("Error sending invoice email:", error);
      toast.error(
        error.message || "Failed to send invoice email",
      );
      throw error;
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (tab === "invoices") {
      setCurrentScreen("dashboard");
    } else if (tab === "customers") {
      setCurrentScreen("customers");
    } else if (tab === "settings") {
      setCurrentScreen("settings");
    }
  };

  const handleAddCustomer = async (
    customerData: Omit<Customer, "id">,
  ) => {
    try {
      const result = await customerApi.create(customerData);
      setCustomers([...customers, result.customer]);
      toast.success("Customer added successfully!");
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer");
    }
  };

  const handleEditCustomer = async (
    id: string,
    customerData: Omit<Customer, "id">,
  ) => {
    try {
      const result = await customerApi.update(id, customerData);
      setCustomers(
        customers.map((c) =>
          c.id === id ? result.customer : c,
        ),
      );
      toast.success("Customer updated successfully!");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      setIsAuthenticated(false);
      setBusinessData({
        businessName: "",
        email: "",
        phone: "",
        address: "",
        industry: "",
        defaultTaxRate: "8.5",
      });
      setInvoices([]);
      setCustomers([]);
      setCurrentScreen("splash");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentScreen === "splash" && (
        <SplashScreen
          onGetStarted={handleGetStarted}
          businessLogo={businessData.logo}
          businessName={businessData.businessName}
        />
      )}

      {currentScreen === "login" && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={() =>
            setCurrentScreen("forgot-password")
          }
        />
      )}

      {currentScreen === "forgot-password" && (
        <ForgotPasswordScreen
          onBack={() => setCurrentScreen("login")}
        />
      )}

      {currentScreen === "reset-password" && resetToken && (
        <ResetPasswordScreen
          resetToken={resetToken}
          onSuccess={() => {
            toast.success("Password reset successfully!");
            setCurrentScreen("login");
          }}
          onCancel={() => setCurrentScreen("login")}
        />
      )}

      {currentScreen === "email-config-test" && (
        <EmailConfigTest
          onBack={() => setCurrentScreen("settings")}
        />
      )}

      {currentScreen === "email-setup-checklist" && (
        <EmailSetupChecklist
          onBack={() => setCurrentScreen("settings")}
        />
      )}

      {currentScreen === "stripe-oauth-callback" && (
        <StripeOAuthCallback
          onComplete={() => {
            setCurrentTab("settings");
            setCurrentScreen("settings");
          }}
        />
      )}

      {currentScreen === "onboarding" && (
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
        />
      )}

      {currentScreen === "dashboard" && (
        <Dashboard
          invoices={invoices}
          onCreateInvoice={handleCreateInvoice}
          onViewInvoice={handleViewInvoice}
          currentTab={currentTab}
          onTabChange={handleTabChange}
          businessLogo={businessData.logo}
          businessName={businessData.businessName}
        />
      )}

      {currentScreen === "invoice-builder" && (
        <InvoiceBuilder
          onBack={handleBackToDashboard}
          onPreviewPDF={handlePreviewPDF}
          onProceedToPayment={handleProceedToPayment}
          onSaveInvoice={handleSaveInvoice}
          customers={customers.map((c) => ({
            name: c.name,
            email: c.email,
            phone: c.phone,
          }))}
          chargeTax={businessData.chargeTax}
          defaultTaxRate={parseFloat(
            businessData.defaultTaxRate,
          )}
          editingInvoice={editingInvoice}
        />
      )}

      {currentScreen === "payment" && currentInvoiceData && (
        <PaymentScreen
          invoiceData={currentInvoiceData}
          onBack={() => setCurrentScreen("invoice-builder")}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {currentScreen === "receipt" && currentInvoiceData && (
        <ReceiptScreen
          total={currentInvoiceData.total}
          customerEmail={currentInvoiceData.customerEmail}
          onSendReceipt={handleSendReceipt}
          onReturnToDashboard={handleReturnToDashboard}
        />
      )}

      {currentScreen === "customers" && (
        <CustomersScreen
          customers={customers}
          onAddCustomer={handleAddCustomer}
          onEditCustomer={handleEditCustomer}
          onViewCustomer={(customer) => {
            setSelectedCustomer(customer);
            setCurrentScreen("customer-invoices");
          }}
          currentTab={currentTab}
          onTabChange={handleTabChange}
          businessLogo={businessData.logo}
          businessName={businessData.businessName}
        />
      )}

      {currentScreen === "customer-invoices" &&
        selectedCustomer && (
          <CustomerInvoicesScreen
            customer={selectedCustomer}
            invoices={invoices}
            onBack={() => {
              setSelectedCustomer(null);
              setCurrentScreen("customers");
            }}
            onViewInvoice={(invoice) => {
              setViewingInvoice(invoice);
              setCurrentScreen("invoice-detail");
            }}
            businessLogo={businessData.logo}
            businessName={businessData.businessName}
          />
        )}

      {currentScreen === "settings" && (
        <SettingsScreen
          businessData={businessData}
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          onUpdateBusinessData={setBusinessData}
        />
      )}

      {currentScreen === "invoice-detail" && viewingInvoice && (
        <InvoiceDetailScreen
          invoice={viewingInvoice}
          businessData={businessData}
          onBack={handleBackToDashboard}
          onRefund={handleRefund}
          onDelete={handleDeleteInvoice}
          onEditInvoice={
            viewingInvoice.status === "pending"
              ? handleEditInvoiceFromDetail
              : undefined
          }
          onSendEmail={handleSendInvoiceEmail}
        />
      )}

      {/* PDF Preview Modal */}
      {showPDFPreview && previewInvoiceData && (
        <InvoicePDFPreview
          invoiceData={previewInvoiceData}
          businessName={businessData.businessName}
          businessLogo={businessData.logo}
          businessEmail={businessData.email}
          businessPhone={businessData.phone}
          businessAddress={businessData.address}
          invoiceNumber={`INV-${String(invoices.length + 1).padStart(3, "0")}`}
          onClose={() => setShowPDFPreview(false)}
        />
      )}

      <Toaster />
    </>
  );
}

export default App;