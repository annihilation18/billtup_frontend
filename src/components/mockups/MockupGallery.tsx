import { LoginScreenMockup } from "./LoginScreenMockup";
import { DashboardMockup } from "./DashboardMockup";
import { InvoiceBuilderMockup } from "./InvoiceBuilderMockup";
import { CustomerListMockup } from "./CustomerListMockup";
import { InvoiceDetailMockup } from "./InvoiceDetailMockup";
import { SettingsMockup } from "./SettingsMockup";
import { PaymentScreenMockup } from "./PaymentScreenMockup";

export function MockupGallery() {
  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          BilltUp App Mockups
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          iPhone 16 Size (390×844) - User Guide Screenshots
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Login Screen */}
          <div className="space-y-3">
            <h2 className="font-medium text-center">1. Login Screen</h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <LoginScreenMockup />
            </div>
          </div>

          {/* Dashboard */}
          <div className="space-y-3">
            <h2 className="font-medium text-center">2. Dashboard</h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <DashboardMockup />
            </div>
          </div>

          {/* Invoice Builder */}
          <div className="space-y-3">
            <h2 className="font-medium text-center">3. Invoice Builder</h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <InvoiceBuilderMockup />
            </div>
          </div>

          {/* Customer List */}
          <div className="space-y-3">
            <h2 className="font-medium text-center">4. Customer List</h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <CustomerListMockup />
            </div>
          </div>

          {/* Invoice Detail */}
          <div className="space-y-3">
            <h2 className="font-medium text-center">5. Invoice Detail</h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <InvoiceDetailMockup />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <h2 className="font-medium text-center">6. Settings</h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <SettingsMockup />
            </div>
          </div>

          {/* Payment Screen */}
          <div className="space-y-3">
            <h2 className="font-medium text-center">7. Payment Screen</h2>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <PaymentScreenMockup />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>These mockups use the actual BilltUp design system</p>
          <p>Colors: Deep Blue (#1E3A8A), Teal (#14B8A6), Amber (#F59E0B)</p>
          <p>Fonts: Poppins (headings), Inter (body), Roboto Mono (numbers)</p>
        </div>
      </div>
    </div>
  );
}
