import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Search,
  Plus,
  Mail,
  Phone,
  FileText,
  Users,
  Settings,
  SquarePen,
} from "lucide-react@0.468.0";
import { BilltUpLogo } from "../BilltUpLogo";

export function CustomerListMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-gray-50 flex flex-col">
      {/* Top App Bar */}
      <div className="bg-[#1E3A8A] text-white p-4 shadow-md rounded-b-3xl">
        <div className="flex items-center gap-3">
          <BilltUpLogo size={40} />
          <h1 className="text-xl" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>
            Customers
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 pb-24">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search customers..."
            className="pl-10 bg-white border-gray-200"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
        </div>

        {/* Customer Card */}
        <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-gray-900 mb-3" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500, fontSize: '16px' }}>
                John doe
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span style={{ fontFamily: 'var(--font-inter)' }}>annihiliation18@yahoo.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span style={{ fontFamily: 'var(--font-inter)' }}>4802704874</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <SquarePen className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}