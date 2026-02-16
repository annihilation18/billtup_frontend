import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Label } from "./ui/label";
import { BilltUpLogo } from "./BilltUpLogo";
import { API_CONFIG } from "../utils/config";

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Send password reset request to our backend
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      const errorMsg = error.message || '';
      
      if (errorMsg.includes('Invalid email')) {
        setErrorMessage("Please enter a valid email address.");
      } else if (errorMsg.includes('rate limit')) {
        setErrorMessage("Too many attempts. Please try again in a few minutes.");
      } else if (errorMsg.includes('not configured')) {
        setErrorMessage("Email service is not configured. Please contact support.");
      } else {
        setErrorMessage("Unable to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to:
            </p>
            <p className="font-medium text-[#1E3A8A] mb-6">{email}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-left">
              <p className="text-blue-900 mb-2">
                <strong>📧 Next steps:</strong>
              </p>
              <ol className="text-blue-800 space-y-1 ml-4 list-decimal text-xs">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the "Reset Password" link</li>
                <li>Create a new password</li>
                <li>Sign in with your new password</li>
              </ol>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              The reset link will expire in 1 hour.
            </p>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BilltUpLogo size={64} />
          </div>
          <h1 className="text-3xl mb-2">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
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
                autoFocus
              />
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="text-blue-900">
              💡 We'll send you a secure link to reset your password. The link expires in 1 hour.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <Button
            type="button"
            onClick={onBack}
            variant="ghost"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}