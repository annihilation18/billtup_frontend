import { Button } from '../ui/button';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { useState } from 'react';

interface FAQSectionProps {
  onNavigate?: (section: string) => void;
}

export function FAQSection({ onNavigate }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'Do I need a payment processor to use BilltUp?',
          answer: 'No! BilltUp can be used as a simple invoicing tool without any payment processing. If you want to accept online payments through your invoices, you can optionally connect Stripe or Square. This is completely optional - many users simply use BilltUp to create and send professional invoices.',
        },
        {
          question: 'Is there a monthly subscription fee?',
          answer: 'Yes! BilltUp offers two subscription plans: Basic ($4.99/month or $49.99/year) with up to 10 invoices per month, and Premium ($9.99/month or $99.99/year) with unlimited invoices and priority support. If you choose to accept online payments, competitive transaction fees also apply and vary by payment method. Choose the plan that fits your business needs!',
        },
        {
          question: 'How long does it take to get started?',
          answer: 'You can create your account and send your first invoice in under 5 minutes. Simply sign up with your email, add your business information, and you\'re ready to start invoicing. If you want to accept online payments, you can connect Stripe or Square later. We\'ve designed the onboarding process to be as smooth as possible.',
        },
        {
          question: 'What types of businesses is BilltUp designed for?',
          answer: 'BilltUp is perfect for service-based businesses that need mobile invoicing, including auto detailers, remodelers, photographers, contractors, consultants, personal trainers, landscapers, and any other service professional who needs to get paid on the go.',
        },
      ],
    },
    {
      category: 'Payments & Fees',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'If you choose to enable online payments, customers can pay using all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and digital wallets like Apple Pay and Google Pay. Payments are processed securely through Stripe or Square, depending on which processor you connect. You can also use BilltUp as an invoicing-only tool and collect payments through your own preferred methods.',
        },
        {
          question: 'How much are the fees?',
          answer: 'BilltUp charges a monthly subscription (Basic: $4.99/month or Premium: $9.99/month). If you choose to accept online payments, transaction fees apply and vary based on payment method (e.g., card, ACH, digital wallet) and processor. You can compare rates in your payment settings. If you only use BilltUp for invoicing without online payments, you only pay the monthly subscription.',
        },
        {
          question: 'When do I receive my money?',
          answer: 'If you enable online payments, funds are deposited to your bank account through your connected payment processor (Stripe or Square). The first payout typically takes 7 to 14 business days due to a one-time verification process. After that, funds usually arrive in 1 to 2 business days. Instant payouts may also be available depending on your processor and account type. If you\'re using BilltUp as invoicing-only, you collect payments directly from your customers through your preferred method.',
        },
        {
          question: 'Are there any refund fees?',
          answer: 'When you process a refund, the original payment is returned to your customer, but the transaction fee is not refunded. This is standard practice as processing costs have already been incurred.',
        },
        {
          question: 'Is there a minimum or maximum invoice amount?',
          answer: 'There is no maximum invoice amount. The minimum is $1.00, though we recommend keeping invoices above $10 to ensure fees remain proportional to the transaction value.',
        },
      ],
    },
    {
      category: 'Features & Functionality',
      questions: [
        {
          question: 'Can I add my business logo to invoices?',
          answer: 'Yes! You can upload your business logo in the Settings section. Your logo will automatically appear on all invoices and customer receipts, giving them a professional, branded appearance.',
        },
        {
          question: 'How do customers receive their invoices?',
          answer: 'Invoices are sent after payment is completed. When a customer pays through the app, they immediately receive a professional PDF invoice via email. You can also manually send invoices to customers from within the app for record-keeping purposes.',
        },
        {
          question: 'Can I track my sales and revenue?',
          answer: 'Absolutely! BilltUp includes built-in analytics showing your total revenue, monthly earnings, number of invoices, and customer count. You can view sales trends and export data for your accounting needs.',
        },
        {
          question: 'Does BilltUp support tax calculation?',
          answer: 'Yes! You can enable tax in your settings and set your tax rate. When creating invoices, you can toggle tax on or off, and the total is calculated automatically. This is perfect for businesses that need to collect sales tax.',
        },
        {
          question: 'Can I process refunds?',
          answer: 'Yes, you can process full or partial refunds directly from any paid invoice. Simply open the invoice, click the Refund button, choose full or partial refund, and confirm. The customer will be notified and receive their refund within 5-10 business days.',
        },
      ],
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          question: 'Is my data secure?',
          answer: 'Yes! We take security seriously. All data is encrypted in transit and at rest. We use bank-level security measures. If you choose to enable online payments, customer payment information is processed through your connected payment processor (Stripe or Square) and never stored on our servers.',
        },
        {
          question: 'What happens to customer payment information?',
          answer: 'If you enable online payments, customer payment information is processed directly by your connected payment processor (Stripe or Square). We never see or store credit card numbers. All payment data is handled according to PCI DSS standards.',
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can delete your account at any time from the Settings page. Upon deletion, all your data (except legally required payment records) will be permanently removed from our servers within 30 days.',
        },
      ],
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'What if I need help?',
          answer: 'We offer email support for all users. Simply contact us at support@billtup.com and we\'ll respond within 24 hours. We also have comprehensive documentation covering all features and common questions.',
        },
        {
          question: 'Is BilltUp available on mobile?',
          answer: 'Yes! BilltUp is available as a native mobile app for both iOS (iPhone/iPad) and Android devices. Download it from the App Store or Google Play Store. The app is designed mobile-first, making it perfect for service professionals who need to invoice customers on the go.',
        },
        {
          question: 'What devices are supported?',
          answer: 'BilltUp works on iOS devices (iPhone and iPad running iOS 14 or later) and Android devices (running Android 8.0 or later). The app is optimized for both phone and tablet screens.',
        },
        {
          question: 'Can I use BilltUp offline?',
          answer: 'While BilltUp requires an internet connection to sync data and process payments, you can view previously loaded invoices and customer information offline. Any changes made offline will sync automatically when you reconnect to the internet.',
        },
      ],
    },
  ];

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm text-[#F59E0B]">Frequently Asked Questions</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Got Questions?
            <br />
            <span className="text-[#1E3A8A]">We've Got Answers</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Find answers to common questions about BilltUp
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {category.category}
              </h2>
              
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <Card
                      key={faqIndex}
                      className={`overflow-hidden transition-all ${
                        isOpen ? 'border-[#14B8A6]' : 'border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isOpen ? 'bg-[#14B8A6]' : 'bg-gray-200'
                        }`}>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isOpen ? 'rotate-180 text-white' : 'text-gray-600'
                            }`}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3
                            className={`text-lg transition-colors ${
                              isOpen ? 'text-[#1E3A8A]' : 'text-gray-900'
                            }`}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {faq.question}
                          </h3>
                          
                          {isOpen && (
                            <p
                              className="mt-3 text-gray-700 leading-relaxed"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      </button>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Still Have Questions?
          </h3>
          <p className="mb-6 text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
            We're here to help! Send us an email and we'll get back to you within 24 hours.
          </p>
          <Button className="bg-white !text-black hover:bg-gray-100" onClick={() => onNavigate?.('contact')}>
            Contact Support
          </Button>
        </Card>
      </div>
    </section>
  );
}