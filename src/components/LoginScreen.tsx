import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Building2, Mail, Lock, AlertCircle } from "lucide-react";
import { Label } from "./ui/label";
import { authApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { BilltUpLogo } from "./BilltUpLogo";

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLoginSuccess, onForgotPassword }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      if (isSignUp) {
        if (!businessName.trim()) {
          setErrorMessage("Please enter your business name.");
          setLoading(false);
          return;
        }
        await authApi.signUp(email, password, businessName);
        toast.success("Account created successfully! Please complete setup.");
      } else {
        await authApi.signIn(email, password);
        toast.success("Welcome back!");
      }
      onLoginSuccess();
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific error messages with industry-standard verbiage
      const errorMsg = error.message || '';
      
      if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('Invalid email or password')) {
        setErrorMessage("The email or password you entered is incorrect. Please try again.");
      } else if (errorMsg.includes('Email not confirmed')) {
        setErrorMessage("Please verify your email address before signing in.");
      } else if (errorMsg.includes('User already registered')) {
        setErrorMessage("An account with this email already exists. Please sign in instead.");
      } else if (errorMsg.includes('Password should be at least')) {
        setErrorMessage("Password must be at least 6 characters long.");
      } else if (errorMsg.includes('Unable to validate email')) {
        setErrorMessage("Please enter a valid email address.");
      } else if (errorMsg.includes('Network')) {
        setErrorMessage("Unable to connect. Please check your internet connection and try again.");
      } else {
        setErrorMessage(errorMsg || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BilltUpLogo size={64} />
          </div>
          <h1 className="text-3xl mb-2">BilltUp</h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12"
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-[#1E3A8A] hover:underline"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Need help accessing your account?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-[#1E3A8A] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}