import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Plus,
  Clock,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Search,
} from "lucide-react@0.468.0";
import { BilltUpLogo } from "../BilltUpLogo";

export function DashboardMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <BilltUpLogo size={40} />
          <h1 className="text-2xl">Invoices</h1>
        </div>
      </div>

      {/* Sales Statistics */}
      <div className="p-4 flex-1 overflow-auto pb-20">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* November Sales */}
          <Card className="p-3 bg-gradient-to-br from-[#1E3A8A]/10 to-[#1E3A8A]/5 border-[#1E3A8A]/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-[#1E3A8A] rounded-md">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                November Sales
              </p>
            </div>
            <p className="text-lg font-mono text-[#1E3A8A]">
              $5,432.50
            </p>
          </Card>

          {/* YTD Total */}
          <Card className="p-3 bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 border-[#14B8A6]/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-[#14B8A6] rounded-md">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Year-to-Date
              </p>
            </div>
            <p className="text-lg font-mono text-[#14B8A6]">
              $42,890.75
            </p>
          </Card>

          {/* Pending Payment */}
          <Card className="p-3 bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 border-[#F59E0B]/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-[#F59E0B] rounded-md">
                <DollarSign className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Pending Payment
              </p>
            </div>
            <p className="text-lg font-mono text-[#F59E0B]">
              $1,250.00
            </p>
          </Card>

          {/* Invoices This Cycle */}
          <Card className="p-3 bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/5 border-[#8B5CF6]/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-[#8B5CF6] rounded-md">
                <Plus className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Invoices This Cycle
              </p>
            </div>
            <p className="text-lg font-mono text-[#8B5CF6]">
              12
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">
              15 days left
            </p>
          </Card>
        </div>

        {/* Billing Period */}
        <Card className="p-2 bg-muted/50 border-muted mb-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">
              Current billing period:
            </span>
            <span className="font-mono">Nov 1 – Nov 30</span>
          </div>
        </Card>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search invoices..."
            className="pl-10 bg-card"
          />
        </div>

        {/* Invoice List */}
        <div className="space-y-3">
          {/* Paid Invoice */}
          <Card className="p-4 border-l-4 border-l-[#14B8A6] bg-[#14B8A6]/5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-primary">
                    INV-003
                  </span>
                  <Badge className="bg-[#14B8A6] hover:bg-[#14B8A6]/90 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid
                  </Badge>
                </div>
                <p className="font-medium">Acme Corporation</p>
                <p className="text-sm text-muted-foreground">
                  Nov 8, 2025
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono">$2,500.00</p>
              </div>
            </div>
          </Card>

          {/* Pending Invoice */}
          <Card className="p-4 border-l-4 border-l-[#F59E0B] bg-[#F59E0B]/5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-primary">
                    INV-002
                  </span>
                  <Badge className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </Badge>
                </div>
                <p className="font-medium">Tech Startup Inc</p>
                <p className="text-sm text-muted-foreground">
                  Nov 5, 2025
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono">$1,250.00</p>
                <p className="text-xs text-[#F59E0B] mt-1">
                  Awaiting Payment
                </p>
              </div>
            </div>
          </Card>

          {/* Paid Invoice */}
          <Card className="p-4 border-l-4 border-l-[#14B8A6] bg-[#14B8A6]/5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-primary">
                    INV-001
                  </span>
                  <Badge className="bg-[#14B8A6] hover:bg-[#14B8A6]/90 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid
                  </Badge>
                </div>
                <p className="font-medium">Design Studio LLC</p>
                <p className="text-sm text-muted-foreground">
                  Nov 1, 2025
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono">$3,750.00</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation - Removed for documentation */}
    </div>
  );
}