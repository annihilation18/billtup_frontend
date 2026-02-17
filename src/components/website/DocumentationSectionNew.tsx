import { IPhone16ProMaxFrame } from "../mockups/IPhone16ProMaxFrame";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Home,
  FileText,
  CreditCard,
  Users,
  Settings,
  ArrowRight,
  BookOpen,
  Zap
} from "lucide-react@0.468.0";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import type { SectionType } from "../../App";

// Import mockup components
import { SplashScreenMockup } from "../mockups/SplashScreenMockup";
import { LoginScreenMockup } from "../mockups/LoginScreenMockup";
import { OnboardingMockup } from "../mockups/OnboardingMockup";
import { DashboardMockup } from "../mockups/DashboardMockup";
import { InvoiceBuilderMockup } from "../mockups/InvoiceBuilderMockup";
import { PaymentScreenMockup } from "../mockups/PaymentScreenMockup";
import { ReceiptMockup } from "../mockups/ReceiptMockup";
import { InvoiceDetailMockup } from "../mockups/InvoiceDetailMockup";
import { CustomerListMockup } from "../mockups/CustomerListMockup";
import { SettingsMockup } from "../mockups/SettingsMockup";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  steps: GuideStep[];
}

interface GuideStep {
  title: string;
  description: string;
  mockup: React.ReactNode;
  details: string[];
  tips?: string[];
}

const guideSections: GuideSection[] = [
  {
    id: "getting-started",
    title: "Getting Started with BilltUp",
    icon: <Home className="w-5 h-5" />,
    steps: [
      {
        title: "Welcome to BilltUp",
        description:
          "Your journey to effortless invoicing starts here",
        mockup: <SplashScreenMockup />,
        details: [
          "When you first open BilltUp, you'll see the welcome splash screen",
          "Review the three core features: Create Invoices, Accept Payments, and Manage Customers",
          "Notice the security badge at the bottom - all your data is encrypted and PCI compliant",
          "Tap the 'Get Started' button to create your account",
        ],
        tips: [
          "BilltUp works on any device - phone, tablet, or computer",
          "You can install it as an app on your phone for quick access",
        ],
      },
      {
        title: "Sign In or Create Account",
        description: "Access your BilltUp account",
        mockup: <LoginScreenMockup />,
        details: [
          "Enter your email address in the first field",
          "Create a secure password (or enter existing password if you already have an account)",
          "Check 'Remember me' to stay signed in on this device",
          "Tap 'Sign In' to access your account",
          "New users will automatically create an account on first sign in",
          "Use 'Forgot password?' link if you need to reset your password",
        ],
        tips: [
          "Use a strong password with letters, numbers, and special characters",
          "Your password is encrypted and never stored in plain text",
        ],
      },
      {
        title: "Set Up Your Business Profile",
        description:
          "Add your business information for professional invoices",
        mockup: <OnboardingMockup />,
        details: [
          "Enter your Business Name (required) - this appears on all invoices",
          "Add your Business Email (required) - used for sending invoices",
          "Enter your Phone Number (optional) - appears on invoices",
          "Add your Business Address (optional) - shown on invoice PDFs",
          "Select your Industry from the dropdown menu",
          "Set your Default Tax Rate if you charge sales tax (e.g., 8.5 for 8.5%)",
          "Tap 'Continue to Dashboard' when done",
        ],
        tips: [
          "All this information can be updated later in Settings",
          "Tax rate can be adjusted per invoice if needed",
          "Upload your logo later in Settings for branded invoices",
        ],
      },
    ],
  },
  {
    id: "dashboard",
    title: "Understanding Your Dashboard",
    icon: <Home className="w-5 h-5" />,
    steps: [
      {
        title: "Dashboard Overview",
        description:
          "Your central hub for managing invoices and business",
        mockup: <DashboardMockup />,
        details: [
          "At the top: Your business logo and the 'Invoices' title",
          "Four stat cards show: November Sales, Year-to-Date Total, Pending Payment, and Invoice Count",
          "The billing period card shows your current billing cycle dates",
          "Search bar lets you find invoices quickly by customer name or invoice number",
          "Below are your recent invoices, color-coded by status:",
          "  • Green border with checkmark = Paid invoices",
          "  • Orange border with clock = Pending invoices awaiting payment",
          "Floating '+' button in bottom-right creates new invoices",
          "Bottom navigation switches between Invoices, Customers, and Settings",
        ],
        tips: [
          "Tap any invoice card to view full details",
          "Pull down to refresh the invoice list",
          "Stats update in real-time as you create and receive payments",
        ],
      },
    ],
  },
  {
    id: "creating-invoices",
    title: "Creating & Managing Invoices",
    icon: <FileText className="w-5 h-5" />,
    steps: [
      {
        title: "Create a New Invoice",
        description:
          "Build professional invoices in under 2 minutes",
        mockup: <InvoiceBuilderMockup />,
        details: [
          "From Dashboard, tap the blue '+' button in bottom-right corner",
          "The Invoice Builder screen opens",
          "Step 1: Select or add customer:",
          "  • Tap the customer dropdown to select an existing customer",
          "  • Or type a new name to create a customer on the fly",
          "  • Enter customer email (required for sending invoices)",
          "  • Add phone number (optional)",
          "Step 2: Add line items:",
          "  • Tap 'Add Item' button",
          "  • Enter item description (e.g., 'Web Design Services')",
          "  • Enter quantity",
          "  • Enter price per unit",
          "  • Tap '+' to add more items, or trash icon to remove",
          "Step 3: Review totals:",
          "  • Subtotal calculates automatically",
          "  • Tax is calculated if enabled in your settings",
          "  • Total amount shown at bottom",
          "Use the three action buttons at bottom:",
          "  • 'Preview PDF' - See how invoice looks as PDF",
          "  • 'Save Invoice' - Save as pending invoice",
          "  • 'Proceed to Payment' - Collect payment immediately",
        ],
        tips: [
          "New customers are automatically saved to your database",
          "You can edit pending invoices anytime",
          "Invoice numbers are assigned automatically (INV-001, INV-002, etc.)",
        ],
      },
      {
        title: "View Invoice Details",
        description:
          "Access complete invoice information and actions",
        mockup: <InvoiceDetailMockup />,
        details: [
          "From Dashboard, tap any invoice to view details",
          "Or go to Invoices tab and click 'View'",
          "Invoice details modal opens",
          "Top section shows invoice number and status badge",
          "Customer information displayed with email and phone",
          "All line items listed with quantities, prices, and totals",
          "Subtotal, tax, and total amount shown at bottom",
          "Payment information shown if invoice is paid",
          "Action buttons at bottom:",
          "  • 'Send Email' - Email invoice PDF to customer",
          "  • 'Download PDF' - Save invoice as PDF file",
          "  • 'Edit Invoice' - Modify invoice (only for pending invoices)",
          "  • 'Issue Refund' - Process refund (only for paid invoices)",
          "  • 'Delete Invoice' - Remove invoice permanently",
        ],
        tips: [
          "Paid invoices cannot be edited (only refunded or deleted)",
          "PDF invoices include your business logo and information",
          "Email sending requires internet connection",
        ],
      },
    ],
  },
  {
    id: "payments",
    title: "Processing Payments",
    icon: <CreditCard className="w-5 h-5" />,
    steps: [
      {
        title: "Collect Payment",
        description:
          "Accept credit card payments securely through Stripe or Square",
        mockup: <PaymentScreenMockup />,
        details: [
          "From Invoice Builder or Invoice Detail, tap 'Proceed to Payment'",
          "Payment screen shows invoice details at top:",
          "  • Invoice number",
          "  • Customer name",
          "  • Total amount to collect",
          "Secure payment form powered by your connected processor:",
          "  • Card number field",
          "  • Expiration date (MM/YY)",
          "  • CVC security code",
          "  • Cardholder name",
          "All card information is encrypted end-to-end",
          "Hand device to customer OR share screen for remote payment",
          "Customer enters their card details",
          "Tap 'Pay Now' to process the payment",
          "Payment processes instantly through your connected processor",
        ],
        tips: [
          "Card data never touches your device - processed directly by your payment provider",
          "Transaction fees vary by payment method and processor",
          "Funds deposited to your bank account within 2-7 days",
          "You must connect Stripe or Square in Settings before accepting payments",
        ],
      },
      {
        title: "Payment Confirmation & Receipt",
        description: "Send receipt after successful payment",
        mockup: <ReceiptMockup />,
        details: [
          "After payment processes, success screen appears with green checkmark",
          "Payment details displayed:",
          "  • Amount paid",
          "  • Invoice number",
          "  • Payment method (last 4 digits of card)",
          "  • Date and time of payment",
          "Send receipt to customer:",
          "  • Customer email is pre-filled from invoice",
          "  • Edit email if needed",
          "  • Tap 'Send' button to email PDF receipt",
          "Customer receives professional PDF receipt via email",
          "Tap 'Return to Dashboard' to go back to main screen",
          "Invoice status automatically updates to 'Paid' on Dashboard",
        ],
        tips: [
          "Receipt emails are sent automatically with invoice PDF attached",
          "Customers can save PDF for their tax records",
          "Payment confirmation emails go to both you and the customer",
        ],
      },
    ],
  },
  {
    id: "customers",
    title: "Managing Customers",
    icon: <Users className="w-5 h-5" />,
    steps: [
      {
        title: "Customer Database",
        description:
          "View and manage all your customers in one place",
        mockup: <CustomerListMockup />,
        details: [
          "Tap 'Customers' in bottom navigation bar",
          "Customer list shows:",
          "  • Customer name",
          "  • Email address",
          "  • Total number of invoices for this customer",
          "  • Total amount invoiced (all-time)",
          "Use search bar at top to find specific customers",
          "Tap '+' button to add new customer manually",
          "Tap edit icon (pencil) to modify customer details",
          "Tap customer name to view their complete invoice history",
        ],
        tips: [
          "Customers are automatically added when you create invoices",
          "You can manually add customers before creating invoices",
          "Customer email is required for sending invoices",
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings & Configuration",
    icon: <Settings className="w-5 h-5" />,
    steps: [
      {
        title: "App Settings",
        description:
          "Configure your business information and payment settings",
        mockup: <SettingsMockup />,
        details: [
          "Tap 'Settings' in bottom navigation bar",
          "Business Information section:",
          "  • Update business name, email, phone, address",
          "  • Upload or change your business logo",
          "  • Logo appears on all invoices and in app header",
          "Tax Configuration:",
          "  • Toggle 'Charge Tax' on/off",
          "  • Set default tax rate percentage",
          "  • Tax automatically calculated on invoices",
          "Payment Settings (Stripe or Square):",
          "  • View connection status",
          "  • Connect your Stripe or Square account to accept payments",
          "  • One-time setup required before accepting payments",
          "  • Access your payment processor dashboard for reports",
          "Email Settings:",
          "  • Configure email delivery (uses default SMTP)",
          "  • Test email sending functionality",
          "Security:",
          "  • Change your password",
          "  • View security features (encryption, PCI compliance)",
          "Tap 'Logout' button at bottom to sign out",
        ],
        tips: [
          "Changes to business info update all future invoices",
          "Logo should be square (PNG or JPG), minimum 200x200 pixels",
          "Payment processor setup only needed once - follow on-screen instructions",
        ],
      },
    ],
  },
];

interface DocumentationSectionNewProps {
  onNavigate?: (section: SectionType) => void;
}

export function DocumentationSectionNew({ onNavigate }: DocumentationSectionNewProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionIndex: number) => {
    setExpandedSection(
      expandedSection === sectionIndex ? null : sectionIndex,
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                BilltUp Visual User Guide
              </h1>
              <p className="text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                Step-by-step instructions with iPhone mockups
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              Welcome to BilltUp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p className="text-lg">
              This visual guide walks you through every feature
              of BilltUp using actual iPhone screen mockups.
              Each section shows you exactly what you'll see on
              your device.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-[#1E3A8A]/10 to-[#1E3A8A]/5 rounded-lg border border-[#1E3A8A]/20">
                <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-foreground mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Create Invoices
                </h3>
                <p className="text-sm text-muted-foreground">
                  Professional PDF invoices with your business
                  branding
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 rounded-lg border border-[#14B8A6]/20">
                <div className="w-10 h-10 bg-[#14B8A6] rounded-lg flex items-center justify-center mb-3">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-foreground mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Accept Payments
                </h3>
                <p className="text-sm text-muted-foreground">
                  Secure credit card processing through Stripe or Square
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20">
                <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-foreground mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Manage Customers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track customer info and complete invoice
                  history
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>💡 How to use this guide:</strong> Click
                on any section below to expand it and see
                detailed step-by-step instructions with iPhone
                mockups showing exactly what you'll see in the
                app.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Guide Sections */}
        <div className="space-y-6">
          {guideSections.map((section, sectionIndex) => (
            <Card
              key={section.id}
              className="bg-white/95 backdrop-blur-sm border-white/20 overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-[#1E3A8A]/5 to-[#14B8A6]/5">
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-xl flex items-center justify-center text-white">
                      {section.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-white"
                        >
                          Part {sectionIndex + 1}
                        </Badge>
                        <CardTitle className="group-hover:text-primary transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {section.title}
                        </CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {section.steps.length} step
                        {section.steps.length > 1 ? "s" : ""}{" "}
                        with iPhone mockups
                      </p>
                    </div>
                  </div>
                  {expandedSection === sectionIndex ? (
                    <ChevronUp className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
              </CardHeader>

              {expandedSection === sectionIndex && (
                <CardContent className="pt-8">
                  {section.steps.map((step, stepIndex) => (
                    <div key={stepIndex}>
                      {stepIndex > 0 && (
                        <Separator className="my-12" />
                      )}

                      <div className="space-y-6">
                        {/* Step Header */}
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {stepIndex + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-foreground text-2xl mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {step.title}
                            </h3>
                            <p className="text-muted-foreground text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {step.description}
                            </p>
                          </div>
                        </div>

                        {/* iPhone Mockup */}
                        <IPhone16ProMaxFrame>{step.mockup}</IPhone16ProMaxFrame>

                        {/* Detailed Instructions */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-4">
                            <ArrowRight className="w-5 h-5 text-primary" />
                            <h4 className="text-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              What You'll See & Do:
                            </h4>
                          </div>
                          <ul className="space-y-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {step.details.map(
                              (detail, detailIndex) => {
                                // Check if this is a sub-bullet (starts with spaces and bullet)
                                const isSubBullet = detail.trim().startsWith('•');
                                const cleanDetail = detail.trim().replace(/^•\s*/, '');
                                
                                return isSubBullet ? (
                                  <li
                                    key={detailIndex}
                                    className="flex items-start gap-3 text-foreground ml-6"
                                  >
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="flex-1">
                                      {cleanDetail}
                                    </span>
                                  </li>
                                ) : (
                                  <li
                                    key={detailIndex}
                                    className="flex items-start gap-3 text-foreground"
                                  >
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="flex-1">
                                      {detail}
                                    </span>
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        </div>

                        {/* Tips */}
                        {step.tips && step.tips.length > 0 && (
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                <span className="text-white">
                                  💡
                                </span>
                              </div>
                              <h4 className="text-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Pro Tips
                              </h4>
                            </div>
                            <ul className="space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {step.tips.map(
                                (tip, tipIndex) => (
                                  <li
                                    key={tipIndex}
                                    className="flex items-start gap-3 text-amber-900 dark:text-amber-100"
                                  >
                                    <span className="text-amber-500 font-bold mt-0.5">
                                      •
                                    </span>
                                    <span className="flex-1">
                                      {tip}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Reference */}
        <Card className="mt-8 bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Transaction Fees */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-foreground text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Transaction Fees
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="mt-2 p-3 bg-white dark:bg-gray-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-muted-foreground">Fees vary based on payment method (card, ACH, digital wallet, etc.) and processor (Stripe or Square). No fees if you use BilltUp for invoicing only. See our <button onClick={() => onNavigate?.('pricing')} className="text-[#14B8A6] hover:underline">pricing page</button> for details.</p>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#14B8A6] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="text-foreground text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Security Features
                  </h4>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-5 h-5 bg-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground">Bank-level encryption for all data</span>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-5 h-5 bg-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground">PCI DSS compliant payment processing</span>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-5 h-5 bg-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground">Payment info processed by your payment provider only</span>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-5 h-5 bg-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground">No sensitive data stored on our servers</span>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-5 h-5 bg-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground">DDoS protection enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-white/70 text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Need more help?
          </p>
          <p className="text-white/50 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Check the FAQ section for common questions
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => onNavigate?.('faq')}
            >
              View FAQ
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6]"
              onClick={() => onNavigate?.('contact')}
            >
              Contact Support
            </Button>
          </div>
          <p className="text-white/50 mt-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            BilltUp v1.0.0 • © 2025 BilltUp. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}