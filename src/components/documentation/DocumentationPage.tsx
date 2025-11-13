import { VisualGuideStep } from "./VisualGuideStep";
import { LoginScreenMockup } from "../mockups/LoginScreenMockup";
import { DashboardMockup } from "../mockups/DashboardMockup";
import { InvoiceBuilderMockup } from "../mockups/InvoiceBuilderMockup";
import { CustomerListMockup } from "../mockups/CustomerListMockup";
import { InvoiceDetailMockup } from "../mockups/InvoiceDetailMockup";
import { SettingsMockup } from "../mockups/SettingsMockup";
import { PaymentScreenMockup } from "../mockups/PaymentScreenMockup";
import { Card } from "../ui/card";

export function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-4xl font-bold">B</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                BilltUp User Guide
              </h1>
              <p className="text-white/90">Complete visual walkthrough for using BilltUp</p>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl">
            This guide provides step-by-step visual instructions for every feature in BilltUp. 
            Follow along with screenshots and detailed instructions to master invoice management.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <Card className="p-6 shadow-xl">
          <h2 className="font-medium mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <a href="#step-1" className="p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-primary font-medium">1.</span> Sign In
            </a>
            <a href="#step-2" className="p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-primary font-medium">2.</span> View Dashboard
            </a>
            <a href="#step-3" className="p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-primary font-medium">3.</span> Create Invoice
            </a>
            <a href="#step-4" className="p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-primary font-medium">4.</span> Manage Customers
            </a>
            <a href="#step-5" className="p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-primary font-medium">5.</span> View Invoice Details
            </a>
            <a href="#step-6" className="p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-primary font-medium">6.</span> Configure Settings
            </a>
            <a href="#step-7" className="p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-primary font-medium">7.</span> Process Payments
            </a>
          </div>
        </Card>
      </div>

      {/* Visual Guide Steps */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Step 1: Sign In */}
        <div id="step-1">
          <VisualGuideStep
            stepNumber={1}
            title="Sign In"
            description="Access your BilltUp account with your email and password"
            screenshot={<LoginScreenMockup />}
            instructions={[
              "Open BilltUp in your web browser or mobile app",
              "Enter your email address in the Email field",
              "Enter your password in the Password field",
              "Optional: Check 'Remember me' to stay signed in",
              "Click the 'Sign In' button",
              "You'll be redirected to the Dashboard"
            ]}
            tips={[
              "Use a strong password with at least 8 characters",
              "Click 'Forgot password?' if you need to reset your password",
              "Don't have an account? Click 'Sign up' to create one"
            ]}
          />
        </div>

        {/* Step 2: View Dashboard */}
        <div id="step-2">
          <VisualGuideStep
            stepNumber={2}
            title="View Dashboard"
            description="Your dashboard shows key business metrics and recent invoices"
            screenshot={<DashboardMockup />}
            instructions={[
              "View your current month's sales in the first stats card (Deep Blue)",
              "Check your year-to-date total in the second card (Teal)",
              "Monitor pending payments in the third card (Amber)",
              "Track invoices created this billing cycle in the fourth card (Purple)",
              "Use the search bar to find specific invoices",
              "Click on any invoice card to view full details",
              "Use the blue + button (bottom-right) to create a new invoice"
            ]}
            tips={[
              "Billing cycle is based on your account creation date, not calendar months",
              "Filter invoices by status: All, Pending, or Paid",
              "Green badges indicate paid invoices, amber badges show pending payments"
            ]}
          />
        </div>

        {/* Step 3: Create Invoice */}
        <div id="step-3">
          <VisualGuideStep
            stepNumber={3}
            title="Create Invoice"
            description="Build professional invoices with line items, tax, and payment terms"
            screenshot={<InvoiceBuilderMockup />}
            instructions={[
              "Click the blue + button from any screen",
              "Select an existing customer from the dropdown or add a new one",
              "Invoice number is auto-generated (e.g., INV-004)",
              "Set the invoice date and optional due date",
              "Click '+ Add Item' to add line items",
              "Enter description, quantity, and rate for each item",
              "Review the automatically calculated subtotal, tax, and total",
              "Add optional notes (payment terms, thank you message)",
              "Toggle 'Include Signature' if needed",
              "Click 'Preview PDF' to review, then 'Save Invoice'"
            ]}
            tips={[
              "Tax is automatically calculated based on your default rate",
              "You can add multiple line items to one invoice",
              "Use the trash icon to remove unwanted items",
              "Notes section is great for payment terms like 'Net 30'"
            ]}
          />
        </div>

        {/* Step 4: Manage Customers */}
        <div id="step-4">
          <VisualGuideStep
            stepNumber={4}
            title="Manage Customers"
            description="View and organize all your customer contacts in one place"
            screenshot={<CustomerListMockup />}
            instructions={[
              "Tap the 'Customers' tab in the bottom navigation",
              "Browse your list of customers alphabetically",
              "View customer email and phone number at a glance",
              "See total invoice count and amount for each customer",
              "Use the search bar to find specific customers quickly",
              "Click the blue + button to add a new customer",
              "Tap any customer card to view their full details and invoice history"
            ]}
            tips={[
              "Each customer card shows their total invoiced amount in teal",
              "Keep customer information up-to-date for accurate invoices",
              "Add customers during invoice creation or from the Customers tab"
            ]}
          />
        </div>

        {/* Step 5: View Invoice Details */}
        <div id="step-5">
          <VisualGuideStep
            stepNumber={5}
            title="View Invoice Details"
            description="Access complete invoice information and available actions"
            screenshot={<InvoiceDetailMockup />}
            instructions={[
              "Tap any invoice from the Dashboard or Customer screen",
              "View the invoice number, status badge, and total amount at the top",
              "Review complete customer billing information",
              "Check all line items with quantities, rates, and amounts",
              "See subtotal, tax, and final total calculations",
              "Read any notes or payment terms included",
              "Click 'Download' to save PDF, or 'Preview' to view",
              "Use 'Email' to send to customer, or 'Get Link' to share payment URL"
            ]}
            tips={[
              "Green status badge with checkmark means invoice is paid",
              "Payment received date and time shown for paid invoices",
              "Download PDF for your records or to send manually",
              "Payment links only work if Stripe Connect is enabled"
            ]}
          />
        </div>

        {/* Step 6: Configure Settings */}
        <div id="step-6">
          <VisualGuideStep
            stepNumber={6}
            title="Configure Settings"
            description="Customize your account, business profile, and app preferences"
            screenshot={<SettingsMockup />}
            instructions={[
              "Tap the 'Settings' tab in the bottom navigation",
              "Click 'Profile' to update your account email and password",
              "Select 'Business Profile' to edit your company information",
              "Upload your business logo (shows on invoices and app header)",
              "Configure invoice settings: number prefix, tax rate, currency",
              "Manage Stripe Connect for payment processing",
              "Toggle notification preferences for payments and invoices",
              "Review app version and information at the bottom"
            ]}
            tips={[
              "Complete your business profile for more professional invoices",
              "Upload a square logo (500×500px or larger) for best results",
              "Set default tax rate to automatically apply to new invoices",
              "Enable email notifications to get instant payment alerts"
            ]}
          />
        </div>

        {/* Step 7: Process Payments */}
        <div id="step-7">
          <VisualGuideStep
            stepNumber={7}
            title="Process Payments"
            description="Secure payment processing powered by Stripe"
            screenshot={<PaymentScreenMockup />}
            instructions={[
              "Customer receives email with payment link or clicks shared link",
              "Payment screen shows your business name and invoice details",
              "Customer enters card number, expiry date, and CVC code",
              "Customer fills in name on card, email, and billing ZIP code",
              "Reviews total amount including processing fees (3.5% + $0.50)",
              "Clicks 'Pay' button to process secure payment",
              "Both parties receive email confirmation",
              "Invoice status automatically updates to 'Paid' in your dashboard"
            ]}
            tips={[
              "All payment data is encrypted and handled by Stripe, not BilltUp",
              "Funds deposit to your Stripe account within 2-7 business days",
              "Customers can pay with major credit cards, Google Pay, or Apple Pay",
              "You must have Stripe Connect enabled to accept online payments"
            ]}
          />
        </div>

        {/* Additional Resources */}
        <Card className="p-8 bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5 border-[#14B8A6]/20 mt-16">
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
            Need More Help?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">📧 Email Support</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Get help from our support team
              </p>
              <a href="mailto:support@billtup.com" className="text-sm text-[#14B8A6] hover:underline">
                support@billtup.com
              </a>
            </div>
            <div>
              <h3 className="font-medium mb-2">📚 Documentation</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Explore detailed technical docs
              </p>
              <a href="/docs" className="text-sm text-[#14B8A6] hover:underline">
                View all documentation
              </a>
            </div>
            <div>
              <h3 className="font-medium mb-2">💬 Community</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Join other BilltUp users
              </p>
              <a href="#" className="text-sm text-[#14B8A6] hover:underline">
                Community forums
              </a>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            BilltUp User Guide v1.4.0 • Last Updated: November 11, 2025
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 BilltUp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
