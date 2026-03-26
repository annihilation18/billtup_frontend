import { UserX, AlertTriangle, Trash2, Mail } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

export function DeleteAccountSection() {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4">
            <UserX className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">Account Deletion</span>
          </div>

          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Delete Your Account
          </h1>

          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Learn how to permanently delete your BilltUp account and associated data.
          </p>
        </div>

        <Card className="p-8 mb-8 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Before You Delete
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Deleting your account is permanent and cannot be undone. All of your data — including invoices, estimates, customer records, business profile, and payment settings — will be permanently removed.
              </p>
            </div>
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8" style={{ fontFamily: 'Inter, sans-serif' }}>
          {/* Option 1: In-App */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Option 1: Delete from the App
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>You can delete your account directly from the BilltUp app:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Open the BilltUp app and sign in</li>
                <li>Tap <strong>Settings</strong> in the bottom navigation bar</li>
                <li>Scroll to the bottom and tap <strong>Delete Account</strong></li>
                <li>Confirm the deletion when prompted</li>
              </ol>
              <p className="mt-3">Your account and all associated data will be deleted immediately.</p>
            </div>
          </section>

          <Separator />

          {/* Option 2: Email */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Option 2: Request via Email
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>If you cannot access the app, you can request account deletion by emailing us:</p>
              <Card className="p-6 bg-gray-50 border-gray-200 mt-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#1E3A8A]" />
                  <a href="mailto:support@billtup.com?subject=Account%20Deletion%20Request" className="text-[#1E3A8A] font-semibold hover:underline">
                    support@billtup.com
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Please include the email address associated with your BilltUp account. We will process your request within 3 business days.
                </p>
              </Card>
            </div>
          </section>

          <Separator />

          {/* What Gets Deleted */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What Gets Deleted
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>When you delete your account, the following data is permanently removed:</p>
              <ul className="space-y-2 mt-2">
                {[
                  'Your login credentials and profile information',
                  'Business profile (name, address, logo, branding)',
                  'All invoices and estimates',
                  'Customer records and contact information',
                  'Payment provider connections (Stripe, Square)',
                  'Subscription and billing history',
                  'Uploaded files (logos, photos, signatures)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Trash2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Data Retention
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                After deletion, your data is removed from our systems immediately. However, please note:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Payment transactions processed through Stripe or Square are retained by those providers per their own data retention policies.</li>
                <li>We may retain anonymized, aggregated data that cannot be used to identify you.</li>
                <li>If you previously used a free trial, a minimal record is kept to prevent trial abuse (email hash only, no personal data).</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p>
            Questions? Contact us at{' '}
            <a href="mailto:support@billtup.com" className="text-[#1E3A8A] hover:underline">
              support@billtup.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
