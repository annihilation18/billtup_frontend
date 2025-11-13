import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Plus, FileText, Users, Settings, Mail, Phone } from "lucide-react";

export function CustomerListMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#1E3A8A] flex items-center justify-center border-2 border-primary-foreground">
            <span className="text-lg text-white font-bold">B</span>
          </div>
          <h1 className="text-2xl">Customers</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 pb-20">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search customers..."
            className="pl-10 bg-card"
          />
        </div>

        {/* Customer Cards */}
        <div className="space-y-3">
          {/* Customer 1 */}
          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Acme Corporation</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>john@acmecorp.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>(555) 123-4567</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">3 invoices</div>
                <div className="text-sm font-mono text-[#14B8A6]">$6,750.00</div>
              </div>
            </div>
          </Card>

          {/* Customer 2 */}
          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Tech Startup Inc</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>sarah@techstartup.io</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>(555) 987-6543</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">2 invoices</div>
                <div className="text-sm font-mono text-[#14B8A6]">$4,200.00</div>
              </div>
            </div>
          </Card>

          {/* Customer 3 */}
          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Design Studio LLC</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>info@designstudio.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>(555) 555-1234</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">5 invoices</div>
                <div className="text-sm font-mono text-[#14B8A6]">$12,450.00</div>
              </div>
            </div>
          </Card>

          {/* Customer 4 */}
          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Creative Agency Co</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>mike@creativeagency.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>(555) 222-3333</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">1 invoice</div>
                <div className="text-sm font-mono text-[#14B8A6]">$1,800.00</div>
              </div>
            </div>
          </Card>

          {/* Customer 5 */}
          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Global Solutions Ltd</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>contact@globalsolutions.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>(555) 777-8888</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">4 invoices</div>
                <div className="text-sm font-mono text-[#14B8A6]">$9,320.00</div>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="w-[390px] flex items-center justify-around p-2">
          <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 py-2 text-muted-foreground">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Invoices</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 py-2 text-primary">
            <Users className="w-5 h-5" />
            <span className="text-xs">Customers</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 py-2 text-muted-foreground">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
        <div className="text-center pb-1">
          <p className="text-[10px] text-muted-foreground">BilltUp v1.0</p>
        </div>
      </div>
    </div>
  );
}
