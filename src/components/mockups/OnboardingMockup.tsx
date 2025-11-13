import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Building2, Mail, Phone, MapPin, Briefcase, Percent } from "lucide-react";

export function OnboardingMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6] text-white p-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-center text-2xl mb-2">Tell us about your business</h1>
        <p className="text-center text-white/80 text-sm">This helps us create professional invoices for you</p>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Business Name *
            </label>
            <Input 
              type="text" 
              placeholder="Acme Corporation"
              className="bg-input-background"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Business Email *
            </label>
            <Input 
              type="email" 
              placeholder="contact@acme.com"
              className="bg-input-background"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Phone Number
            </label>
            <Input 
              type="tel" 
              placeholder="(555) 123-4567"
              className="bg-input-background"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Business Address
            </label>
            <Input 
              type="text" 
              placeholder="123 Main St, City, State 12345"
              className="bg-input-background"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Industry
            </label>
            <Select>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="contracting">Contracting</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tax Rate */}
          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              Default Tax Rate (%)
            </label>
            <Input 
              type="number" 
              placeholder="8.5"
              className="bg-input-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Leave blank if you don't charge tax</p>
          </div>
        </div>

        {/* Continue Button */}
        <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
}
