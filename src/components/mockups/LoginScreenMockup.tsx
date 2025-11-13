import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";

export function LoginScreenMockup() {
  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col items-center justify-center p-6">
      {/* Logo Area */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-2xl flex items-center justify-center">
          <span className="text-4xl text-white font-bold">B</span>
        </div>
        <h1 className="text-3xl text-[#1E3A8A] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>BilltUp</h1>
        <p className="text-muted-foreground">Invoice. Send. Get Paid.</p>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-md p-6 space-y-4">
        <div>
          <h2 className="text-xl mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>Welcome Back</h2>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm mb-1.5 block">Email</label>
            <Input 
              type="email" 
              placeholder="you@business.com"
              className="bg-input-background"
            />
          </div>

          <div>
            <label className="text-sm mb-1.5 block">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••"
              className="bg-input-background"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <a href="#" className="text-[#14B8A6] hover:underline">Forgot password?</a>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            Sign In
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="text-[#14B8A6] hover:underline">Sign up</a>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground">
        Secure • Encrypted • PCI Compliant
      </p>
    </div>
  );
}
