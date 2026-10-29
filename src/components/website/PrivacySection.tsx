import { Shield, Lock } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

export function PrivacySection() {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">Privacy Policy</span>
          </div>

          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Privacy Policy
          </h1>

          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Last updated: October 28, 2026
          </p>
        </div>

        <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Your Privacy Matters
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                BilltUp is operated by Omniforge Technologies LLC. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our mobile apps for Android and iOS and our website (billtup.com). By using BilltUp, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8" style={{ fontFamily: 'Inter, sans-serif' }}>
          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.1 Account Information</h3>
                <p>When you create an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Your name and email address</li>
                  <li>Password (stored securely via AWS Cognito, never in plaintext)</li>
                  <li>Business name and contact information you provide during onboarding</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.2 Business Data</h3>
                <p>When you use BilltUp, you may provide:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Business profile information (name, address, phone, logo)</li>
                  <li>Customer names, email addresses, and contact details</li>
                  <li>Invoice and estimate details (items, amounts, dates, notes) and photos you attach</li>
                  <li>Signatures and approvals your customers give on invoices and estimates</li>
                  <li>Payment transaction records</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.3 Payment and Subscription Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>We do not store credit card numbers, bank account numbers, or other payment credentials on our servers.</li>
                  <li>Payments from your customers are processed by the provider you connect (Stripe or Square). Card subscriptions to BilltUp are processed by Stripe. Payment information is collected and processed directly by these providers under their respective privacy policies.</li>
                  <li>Subscriptions bought through the Apple App Store are processed by Apple. We receive the subscription's status (for example, active, renewed or expired), not your payment details.</li>
                  <li>We store transaction metadata (amount, date, payment method type, last 4 digits of card) and provider account and customer IDs for your records, billing and analytics.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.4 Device and Diagnostic Information</h3>
                <p>We automatically collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Device type, operating system, and version</li>
                  <li>App version</li>
                  <li>Error reports and server logs (for debugging), which can include your user ID and email address</li>
                </ul>
                <p className="mt-2">We do not use advertising or third-party analytics trackers.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.5 Camera, Photos and Biometric Data</h3>
                <p>
                  The app asks for camera or photo access only when you choose to add a photo or logo. If you enable biometric authentication (fingerprint or Face ID), biometric data is processed entirely on your device by the operating system. We never receive, store, or transmit your biometric data. Only a success/failure result is communicated to our app.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.6 Information on the Website and in Your Browser</h3>
                <p>
                  The website stores your sign-in session and preferences in your browser's local storage so you stay signed in. Our payment processor, Stripe, may set cookies on payment pages to prevent fraud. The website loads fonts from Google Fonts, which receives your IP address when the fonts load.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              2. How We Use Your Information
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain the Service</li>
                <li>Process invoices, estimates, and facilitate payments</li>
                <li>Send invoice and estimate emails to your customers on your behalf</li>
                <li>Generate payment links and QR codes for customer payments</li>
                <li>Provide business analytics and reporting</li>
                <li>Manage your free trial and subscription</li>
                <li>Send you service-related communications (account verification, trial reminders, subscription updates, payment confirmations)</li>
                <li>Send optional notification emails (which you can disable in Settings)</li>
                <li>Diagnose errors and improve and optimize the Service</li>
                <li>Detect and prevent fraud or abuse, including repeat use of the free trial</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* 3. How We Share Your Information */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              3. How We Share Your Information
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>We do not sell your personal information or share it for advertising. We share information only with the service providers below, to run the Service, and in the circumstances described in this section:</p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.1 Payment Processors</h3>
                <p>We share necessary transaction details with Stripe and/or Square to process payments, and with Stripe to bill card subscriptions. These providers have their own privacy policies:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Stripe: <a href="https://stripe.com/privacy" className="text-[#1E3A8A] hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></li>
                  <li>Square: <a href="https://squareup.com/legal/privacy" className="text-[#1E3A8A] hover:underline" target="_blank" rel="noopener noreferrer">squareup.com/legal/privacy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.2 App Stores and Subscriptions</h3>
                <p>
                  App Store subscriptions are sold by Apple. We use RevenueCat to confirm App Store purchases and keep your subscription status up to date; RevenueCat receives your BilltUp user ID and your purchase and subscription records from Apple. The apps are distributed through the Apple App Store and Google Play, which handle your downloads under their own privacy policies.
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Apple: <a href="https://www.apple.com/legal/privacy/" className="text-[#1E3A8A] hover:underline" target="_blank" rel="noopener noreferrer">apple.com/legal/privacy</a></li>
                  <li>RevenueCat: <a href="https://www.revenuecat.com/privacy" className="text-[#1E3A8A] hover:underline" target="_blank" rel="noopener noreferrer">revenuecat.com/privacy</a></li>
                  <li>Google: <a href="https://policies.google.com/privacy" className="text-[#1E3A8A] hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.3 Email</h3>
                <p>We use Resend to deliver invoice emails and notifications. Email addresses and email content are shared with Resend for delivery purposes only. When you email us, your message is handled by our email provider, Zoho Mail.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.4 Error Monitoring</h3>
                <p>To find and fix problems, error reports and server logs are sent to Axiom (log storage) and error alerts to Slack (our team's messaging). These can include your user ID, email address and device details, but never your password or payment details.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.5 Cloud Infrastructure</h3>
                <p>Your data is stored in the United States on Amazon Web Services (AWS) infrastructure, including:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>AWS DynamoDB (database)</li>
                  <li>AWS S3 (file storage for logos, photos and documents)</li>
                  <li>AWS Cognito (authentication)</li>
                  <li>AWS Lambda (application processing)</li>
                  <li>AWS CloudWatch (server logs)</li>
                </ul>
                <p className="mt-2">All data is encrypted in transit (TLS) and at rest.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.6 Legal Requirements and Business Transfers</h3>
                <p>We may disclose your information if required by law, legal process, or governmental request. If BilltUp is sold or merged, your information may be transferred to the new owner, who will remain bound by this policy for the information we transfer.</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* 4. Your Customers' Information */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              4. Your Customers' Information
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                When you add your customers to BilltUp, send them invoices or estimates, or receive their payments and signatures, we process their information on your behalf and only to provide the Service to you. You are responsible for having the right to share it with us. If your customer asks us about their information, we will refer them to you.
              </p>
            </div>
          </section>

          <Separator />

          {/* 5. Data Security */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              5. Data Security
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All data transmitted between your device and our servers is encrypted using TLS/HTTPS</li>
                <li>Data at rest is encrypted on AWS infrastructure</li>
                <li>Authentication is handled by AWS Cognito with secure token management</li>
                <li>Passwords are hashed and never stored in plaintext</li>
                <li>Payment credentials are handled exclusively by PCI-compliant processors (Stripe/Square) and, for App Store subscriptions, by Apple</li>
                <li>Biometric credentials are stored in your device's secure enclave (Android Keystore / iOS Secure Enclave)</li>
                <li>API endpoints are protected with rate limiting and input validation</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              6. Data Retention
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account data is retained for as long as your account exists.</li>
                <li>When you delete your account, we immediately and permanently delete your business profile, customers, invoices, estimates, saved items, photos, logos and documents, cancel any card subscription, and disconnect your Stripe or Square account.</li>
                <li>After deletion we keep one small record: your email address, whether you used the free trial and when it started, your former user ID and the deletion date. We keep it to prevent repeat free trials and do not use it for anything else.</li>
                <li>If your paid subscription ends and you do not subscribe again, we delete your account data one year after the subscription ended.</li>
                <li>Server logs are kept for 90 days.</li>
                <li>Payment and subscription records held by Stripe, Square, Apple and RevenueCat are subject to their respective retention policies.</li>
                <li>We may retain anonymized, aggregated data that cannot identify you for analytics purposes.</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* 7. Your Rights */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              7. Your Rights
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>Depending on where you live (for example, California and other U.S. states with privacy laws), you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access</strong> the personal data we hold about you</li>
                <li><strong>Correct</strong> inaccurate personal data</li>
                <li><strong>Delete</strong> your account and associated data</li>
                <li><strong>Export</strong> your data in a portable format</li>
                <li><strong>Opt out</strong> of optional notification emails</li>
              </ul>
              <p>
                You can delete your account in the app's Settings or in your account settings on our website, and turn off optional emails in Settings. For anything else, including a copy of your data, contact us at <a href="mailto:privacy@billtup.com" className="text-[#1E3A8A] hover:underline">privacy@billtup.com</a>. We will respond within 45 days and will not treat you differently for exercising your rights.
              </p>
            </div>
          </section>

          <Separator />

          {/* 8. Children's Privacy */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              8. Children's Privacy
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                BilltUp is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will delete it promptly.
              </p>
            </div>
          </section>

          <Separator />

          {/* 9. Third-Party Links */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              9. Third-Party Links
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Our Service may contain links to third-party websites or services (e.g., Stripe Dashboard, Square Dashboard). We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>
          </section>

          <Separator />

          {/* 10. Changes to This Policy */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              10. Changes to This Policy
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>We may update this Privacy Policy from time to time. We will notify you of material changes by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the updated policy on our website</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending an email notification for significant changes</li>
              </ul>
              <p>Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>
            </div>
          </section>

          <Separator />

          {/* 11. Contact Us */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              11. Contact Us
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>If you have questions about this Privacy Policy, contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Omniforge Technologies LLC (DBA BilltUp)</p>
                <p>Email: <a href="mailto:privacy@billtup.com" className="text-[#1E3A8A] hover:underline">privacy@billtup.com</a></p>
                <p>Website: <a href="https://billtup.com" className="text-[#1E3A8A] hover:underline">billtup.com</a></p>
              </div>
            </div>
          </section>
        </div>

        <Card className="mt-8 p-6 bg-gray-100 border-gray-300">
          <p className="text-sm text-gray-600 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            By creating an account or using BilltUp, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </Card>
      </div>
    </section>
  );
}
