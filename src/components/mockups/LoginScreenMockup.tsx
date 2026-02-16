import { Mail, Lock, Shield } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { BilltUpLogo } from '../BilltUpLogo';

export function LoginScreenMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#FCD34D] flex flex-col items-center justify-center p-4">
      {/* White Card Container */}
      <div className="w-full max-w-[360px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 flex items-center justify-center">
            <BilltUpLogo size={40} />
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-3xl text-center text-gray-900 mb-1" 
          style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}
        >
          BilltUp
        </h1>
        <p className="text-center text-gray-500 mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
          Sign in to your account
        </p>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm text-gray-900 mb-2" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
            Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: 'var(--font-inter)' }}
              disabled
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm text-gray-900 mb-2" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              style={{ fontFamily: 'var(--font-inter)' }}
              disabled
            />
          </div>
        </div>

        {/* Sign In Button */}
        <Button 
          className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-12 text-base rounded-xl mb-4" 
          style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
          disabled
        >
          Sign In
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
          Don't have an account? <span className="text-[#1E3A8A]" style={{ fontWeight: 500 }}>Sign up</span>
        </p>

        {/* Help Text */}
        <p className="text-center text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
          Need help accessing your account?
        </p>
        <p className="text-center text-sm text-[#1E3A8A] mb-6" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
          Forgot password?
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#14B8A6]/10 rounded-full mx-auto">
          <Shield className="w-4 h-4 text-[#14B8A6]" />
          <span className="text-xs text-[#14B8A6]" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
            Secure & PCI Compliant
          </span>
        </div>
      </div>
    </div>
  );
}