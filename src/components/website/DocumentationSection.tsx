import { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  CreditCard, 
  Users, 
  Settings,
  ChevronRight,
  Play,
  Download,
  Search,
  DollarSign,
  Mail,
  FileSignature,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Home,
  Edit,
  Trash2,
  Eye,
  Plus,
  LogIn,
  Send
} from 'lucide-react@0.468.0';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AppMockup } from './AppMockup';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function DocumentationSection() {
  const [selectedCategory, setSelectedCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Play },
    { id: 'invoicing', label: 'Creating Invoices', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const documentation = {
    'getting-started': [
      {
        title: 'Quick Start Guide',
        content: `Welcome to BilltUp! Get started in 3 simple steps:

**Step 1: Create Your Account**
Sign up for BilltUp using your business email. Start with a 14-day free trial—no credit card required. You'll be asked to choose a plan:
- Basic ($4.99/month): Core invoicing features, up to 25 invoices/month
- Premium ($9.99/month): Unlimited invoices, advanced reporting, priority support

**Step 2: Set Up Your Business Profile**
Navigate to Settings and complete your profile:
- Add your business name and logo (appears on all invoices)
- Enter your contact information (email, phone, address)
- Configure tax settings (optional - set your default tax rate)
- Add your business bank details (optional - appears on invoices for wire transfers)

**Step 3: Create Your First Invoice**
From the dashboard, click "+ New Invoice":
- Select or create a customer
- Add line items (description, quantity, price)
- Review calculated subtotal, tax, and total
- Save as draft or send to customer

**Optional: Enable Stripe Payments**
To accept online card payments:
- Connect your Stripe account in Settings
- Transaction fees: 3.5% + $0.50 (includes Stripe fee + platform fee)
- Customers can pay directly from invoice emails
- Money deposits to your Stripe account automatically

That's it! Your invoices are automatically saved to the cloud and accessible from any device.`,
        mockup: 'dashboard',
      },
      {
        title: 'Understanding the Dashboard',
        content: `Your dashboard provides real-time insights into your business:

**Sales Statistics (Top Section)**
Two prominent cards display your key metrics:
- This Month: Total revenue from paid invoices in the current month
- Year to Date: Cumulative revenue for the current calendar year
These stats update automatically when invoices are marked as paid

**Recent Invoices Table**
View your latest invoices at a glance:
- Invoice number (automatically assigned: INV-001, INV-002, etc.)
- Customer name
- Invoice amount
- Status badge (Paid = green checkmark, Pending = yellow clock icon)
- Click any invoice to view full details, send email, or process refunds

**Quick Actions**
- "+ New Invoice" button: Create a new invoice instantly
- "View All Invoices" button: See complete invoice history
- "Manage Customers" button: Access customer database

**Analytics Tab**
Switch to the Analytics tab for detailed insights:
- Monthly revenue chart
- Customer breakdown
- Payment method analysis
- Export data as CSV

All data is saved automatically to your secure cloud database—no manual saving required!`,
        mockup: 'dashboard',
      },
      {
        title: 'Complete Invoice Workflow',
        content: `Follow this end-to-end process to create, send, and track invoices:

**1. Create Invoice**
- Click "+ New Invoice" from dashboard
- Select existing customer or create new one (name, email, phone)
- Add line items—each with description, quantity, and unit price
- Toggle tax on/off (uses your default tax rate from settings)
- Subtotal, tax, and total calculate automatically

**2. Capture Signature (Optional)**
- Ask customer to sign on the signature pad
- Signature is embedded in PDF invoice
- Adds professional touch and proof of agreement

**3. Review PDF Preview**
- Preview exactly how the invoice will look
- Shows your business logo, contact info, and branding
- Displays all line items, tax breakdown, and total
- Includes customer signature if captured

**4. Process Payment (Optional)**
If you have Stripe connected:
- Choose payment method: Card or NFC/Tap to Pay
- For card: Enter cardholder name, card number, expiry, CVV
- For NFC: Simulate contactless payment (production uses NFC hardware)
- Payment processes through Stripe Payment Intent API
- Both you and customer receive instant confirmation

**5. Save & Email**
- Invoice automatically saves to database with unique number
- Status updates to "Paid" or "Pending"
- Send beautiful HTML email to customer with:
  - Professional invoice layout
  - Your business logo
  - Complete line items and totals
  - Customer signature (if captured)
  - Payment confirmation (if paid)

**6. Track & Manage**
- View invoice anytime from dashboard
- Send reminder emails for pending invoices
- Process full or partial refunds for paid invoices
- Delete invoices if needed (permanent)
- Export invoice data for accounting`,
        mockup: 'invoice',
      },
    ],
    'invoicing': [
      {
        title: 'Creating Your First Invoice',
        content: `Follow these steps to create an invoice:

**1. Click "Create Invoice"**
Tap the + button on your dashboard

**2. Select a Customer**
- Choose from existing customers
- Or create a new customer by clicking "Add New Customer"

**3. Add Items/Services**
For each item, enter:
- Description (e.g., "Auto Detail - Full Service")
- Quantity
- Unit price
The total calculates automatically

**4. Add Tax (Optional)**
- Toggle tax on/off
- Set your tax rate percentage

**5. Review & Send**
Double-check all details and click "Proceed to Payment" to send to your customer.`,
      },
      {
        title: 'Invoice Templates & Customization',
        content: `Make invoices match your brand:

**Business Information**
- Add your business logo in Settings
- Update business name and contact info
- This appears on every invoice automatically

**Item Management**
- Save frequently used items for quick access
- Set default prices for common services
- Use templates for recurring invoices

**Professional Touch**
- All invoices include your logo
- Clean, professional layout
- Automatic invoice numbering
- PDF generation for records`,
      },
      {
        title: 'Managing Invoice Status',
        content: `Track invoice states:

**Paid**
- Invoice successfully paid
- Green indicator
- Payment details recorded

**Pending**
- Sent but not yet paid
- Yellow indicator
- Customer can still pay

**View & Actions**
- Click any invoice to view full details
- See payment history
- Process refunds if needed
- Resend invoice to customer`,
      },
    ],
    'payments': [
      {
        title: 'How Payment Processing Works',
        content: `BilltUp offers optional payment processing through Stripe:

**For You:**
- You can use BilltUp as an invoicing-only tool (no payment processing)
- Or optionally connect your own Stripe account to accept online payments
- Enable/disable payment features in Settings at any time
- Complete control over your payment settings

**If You Enable Payments:**
1. Your customer clicks the payment link on their invoice
2. They enter their card details (credit/debit card or Apple Pay/Google Pay)
3. Payment is processed securely through Stripe
4. Money goes directly to your Stripe account
5. Both you and your customer receive instant email confirmation

**Transaction Fees (when payments enabled):**
- 3.5% + $0.50 per transaction

This includes:
- Stripe processing fee: 2.9% + $0.30
- BilltUp platform fee: 0.6% + $0.20

**Example:** On a $500 invoice, you pay $18.00 in fees and receive $482.00.

If you don't enable payments, you only pay your monthly subscription ($4.99 or $9.99).`,
        mockup: 'payment',
      },
      {
        title: 'Stripe Integration Setup',
        content: `Connect your Stripe account to accept online payments:

**Step 1: Create Stripe Account**
Visit https://dashboard.stripe.com and create a free account
- Use the same email as your BilltUp account
- Complete business verification
- Add your bank account for payouts

**Step 2: Get API Keys**
Navigate to Developers → API Keys in Stripe Dashboard
- Copy your Secret Key (starts with sk_test_ or sk_live_)
- Keep this secure—never share it publicly

**Step 3: Connect to BilltUp**
In BilltUp Settings → Payment Settings:
- Paste your Stripe Secret Key
- Click "Connect Stripe Account"
- Test with a sample payment

**Step 4: Configure Payouts**
In Stripe Dashboard → Balance → Payouts:
- Add your bank account details
- Set payout schedule (daily, weekly, or monthly)
- Stripe automatically deposits payments to your bank

**Important Notes:**
- Bank account details in BilltUp are for invoice display only
- Actual payouts are configured entirely in Stripe Dashboard
- Use test mode (sk_test_) during development
- Switch to live mode (sk_live_) when ready for real payments

**Test Cards (for testing):**
- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002
- Use any future expiry date and any CVV`,
        mockup: 'payment',
      },
      {
        title: 'Refund Process',
        content: `How to process refunds:

**Full Refunds:**
1. Open the paid invoice
2. Click "Refund"
3. Confirm full refund
4. Customer receives refund in 5-10 business days

**Partial Refunds:**
1. Open the paid invoice
2. Click "Refund"
3. Select "Partial Refund"
4. Enter refund amount
5. Confirm

**Important Notes:**
- Refunds are processed to the original payment method
- Platform fees are not refunded
- Customer will receive email notification
- Refund appears in your sales analytics`,
      },
    ],
    'customers': [
      {
        title: 'Adding & Managing Customers',
        content: `Keep track of your clients:

**Adding a New Customer:**
1. Go to Customers tab
2. Click "Add Customer"
3. Enter details:
   - Name
   - Email address
   - Phone number (optional)
4. Save

**Customer Benefits:**
- Quick invoice creation for repeat clients
- View all invoices for each customer
- Track payment history
- Customers can view their invoice history

**Customer Portal:**
Your customers can:
- View all their invoices
- See payment history
- Access receipts
- No login required (accessed via email links)`,
        mockup: 'customers',
      },
      {
        title: 'Customer Invoice History',
        content: `Track customer relationships:

**Viewing Customer Details:**
Click any customer to see:
- Total amount invoiced
- Number of invoices
- Payment status of each invoice
- Contact information

**Customer Insights:**
- Identify your best customers
- Track payment patterns
- See outstanding balances
- Export customer data

**Managing Relationships:**
- Add notes to customer profiles
- Update contact information
- Delete inactive customers
- Merge duplicate entries`,
        mockup: 'customers',
      },
    ],
    'settings': [
      {
        title: 'Account Settings',
        content: `Customize your BilltUp account:

**Business Profile:**
- Business name
- Contact email
- Phone number
- Business logo upload

**Tax Settings:**
- Enable/disable tax
- Set default tax rate
- Tax is calculated automatically on invoices

**Notification Preferences:**
- Email alerts for payments
- Invoice status updates
- Weekly summary reports

**Security:**
- Change password
- Enable two-factor authentication (coming soon)
- Review login activity`,
      },
      {
        title: 'Email Configuration',
        content: `Email settings for receipts:

**Automatic Receipts:**
After each successful payment:
- Customer receives PDF receipt via email
- You receive payment confirmation
- Receipt includes full invoice details

**Email Templates:**
Professional emails include:
- Your business logo
- Invoice details
- Payment information
- BilltUp branding

**Customization:**
- Set reply-to email address
- Add custom footer message (coming soon)
- Choose email send time`,
      },
      {
        title: 'Data Export & Backup',
        content: `Export your business data:

**Sales Reports:**
- Export as CSV or PDF
- Filter by date range
- Include tax breakdowns
- Payment method details

**Customer Data:**
- Export customer list
- Include invoice history
- Payment summaries

**Invoice Archive:**
- Download all invoices as PDFs
- Batch export for accounting
- Monthly statement generation

**Data Security:**
- All data encrypted
- Regular automated backups
- GDPR compliant
- Data retention policies`,
      },
    ],
  };

  const currentDocs = documentation[selectedCategory as keyof typeof documentation] || [];

  const filteredDocs = currentDocs.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">Documentation</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How to Use BilltUp
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            Everything you need to know to get started and master BilltUp
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-2"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="flex-1 text-left text-sm">{category.label}</span>
                    {selectedCategory === category.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Download className="w-4 h-4" />
                  Download PDF Guide
                </Button>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredDocs.length === 0 ? (
                <Card className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documentation found matching your search.</p>
                </Card>
              ) : (
                filteredDocs.map((doc, index) => (
                  <Card key={index} className="p-8">
                    <h2 className="text-2xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {doc.title}
                    </h2>
                    
                    {/* Visual Mockup */}
                    {(doc as any).mockup && (
                      <div className="mb-6">
                        <AppMockup type={(doc as any).mockup} />
                      </div>
                    )}
                    
                    <div 
                      className="prose prose-blue max-w-none text-gray-700"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {doc.content.split('\\n\\n').map((paragraph, pIndex) => {
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return (
                            <h3 key={pIndex} className="text-lg mt-6 mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {paragraph.replace(/\\*\\*/g, '')}
                            </h3>
                          );
                        }
                        
                        if (paragraph.includes('- ')) {
                          const items = paragraph.split('\\n').filter(line => line.trim().startsWith('-'));
                          return (
                            <ul key={pIndex} className="list-disc list-inside space-y-2 mb-4">
                              {items.map((item, iIndex) => (
                                <li key={iIndex}>{item.replace('- ', '').replace(/\\*\\*/g, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        
                        return (
                          <p key={pIndex} className="mb-4 leading-relaxed">
                            {paragraph.replace(/\\*\\*/g, '')}
                          </p>
                        );
                      })}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}