import { Button } from "../ui/button";
import {
  Building2,
  Mail,
  Phone,
  Briefcase,
  Percent,
  Lock,
  Shield,
  FileText,
} from "lucide-react@0.468.0";
import { BilltUpLogo } from "../BilltUpLogo";

export function OnboardingMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#FCD34D] flex flex-col items-center justify-start p-4 overflow-hidden">
      {/* White Card Container */}
      <div className="w-full max-w-[360px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col my-4">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 bg-white rounded-2xl border-2 border-[#14B8A6] flex items-center justify-center">
            <FileText className="w-7 h-7 text-[#14B8A6]" />
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-2xl text-center text-gray-900 mb-1"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}
        >
          BilltUp
        </h1>
        <p
          className="text-center text-gray-500 mb-4 text-sm"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Create your account
        </p>

        {/* Business Name Field */}
        <div className="mb-3">
          <label
            className="block text-xs text-gray-900 mb-1.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Business Name
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter your business name"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: "var(--font-inter)" }}
              disabled
            />
          </div>
        </div>

        {/* Phone Number Field */}
        <div className="mb-3">
          <label
            className="block text-xs text-gray-900 mb-1.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: "var(--font-inter)" }}
              disabled
            />
          </div>
        </div>

        {/* Industry Field */}
        <div className="mb-3">
          <label
            className="block text-xs text-gray-900 mb-1.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Industry
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="E.g., Consulting, Retail, etc."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: "var(--font-inter)" }}
              disabled
            />
          </div>
        </div>

        {/* Default Tax Rate Field */}
        <div className="mb-1.5">
          <label
            className="block text-xs text-gray-900 mb-1.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Default Tax Rate (%)
          </label>
          <div className="relative">
            <Percent className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="0.00"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: "var(--font-inter)" }}
              disabled
            />
          </div>
        </div>
        <p
          className="text-xs text-gray-500 mb-3"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Leave blank if you don't want to charge taxes
        </p>

        {/* Email Field */}
        <div className="mb-3">
          <label
            className="block text-xs text-gray-900 mb-1.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: "var(--font-inter)" }}
              disabled
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label
            className="block text-xs text-gray-900 mb-1.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: "var(--font-inter)" }}
              disabled
            />
          </div>
        </div>

        {/* Create Account Button */}
        <Button
          className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-11 text-sm rounded-xl mb-3"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 500 }}
          disabled
        >
          Create Account
        </Button>

        {/* Sign In Link */}
        <p
          className="text-center text-xs text-gray-600 mb-4"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Already have an account? <span className="text-[#1E3A8A]" style={{ fontWeight: 500 }}>Sign in</span>
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#14B8A6]/10 rounded-full mx-auto">
          <Shield className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span
            className="text-xs text-[#14B8A6]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Secure & PCI Compliant
          </span>
        </div>
      </div>
    </div>
  );
}