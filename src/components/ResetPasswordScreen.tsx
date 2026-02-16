import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Label } from "./ui/label";
import { BilltUpLogo } from "./BilltUpLogo";
import { API_CONFIG } from "../utils/config";

interface ResetPasswordScreenProps {
  resetToken: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ResetPasswordScreen({ resetToken, onSuccess, onCancel }: ResetPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      const errorMsg = error.message || "";

      if (errorMsg.includes("expired")) {
        setErrorMessage("This reset link has expired. Please request a new one.");
      } else if (errorMsg.includes("invalid") || errorMsg.includes("Invalid")) {
        setErrorMessage("This reset link is invalid. Please request a new one.");
      } else if (errorMsg.includes("already been used")) {
        setErrorMessage("This reset link has already been used. Please request a new password reset.");
      } else if (errorMsg.includes("breached") || errorMsg.includes("weak")) {
        setErrorMessage("This password has been found in a data breach. Please choose a different password.");
      } else {
        setErrorMessage(errorMsg || "Unable to reset password. Please try again or request a new reset link.");
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

            <h1 className="text-2xl mb-2">Password Reset Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Your password has been updated successfully.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-900 text-sm">
                ✅ You can now sign in with your new password
              </p>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Redirecting to login...
            </p>

            <Button
              onClick={onSuccess}
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              Go to Sign In
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
          <h1 className="text-3xl mb-2">Create New Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                autoFocus
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="text-blue-900 mb-2">
              <strong>Password requirements:</strong>
            </p>
            <ul className="text-blue-800 space-y-1 ml-4 list-disc text-xs">
              <li>At least 8 characters long</li>
              <li>Include letters and numbers</li>
              <li>Use a strong, unique password</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
            >
              Cancel and return to login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}