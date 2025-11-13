import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { BilltUpLogo } from "./BilltUpLogo";
import { Lock, Fingerprint, Clock, AlertCircle } from "lucide-react";
import { authApi } from "../utils/api";
import { biometricAuth } from "../utils/sessionManager";
import { toast } from "sonner@2.0.3";

interface ReAuthScreenProps {
  onUnlock: () => void;
  userEmail?: string;
  isBiometricEnabled?: boolean;
}

export function ReAuthScreen({ onUnlock, userEmail, isBiometricEnabled = false }: ReAuthScreenProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  useEffect(() => {
    // Check if biometric is supported (for mobile apps)
    checkBiometricSupport();
    
    // Auto-prompt biometric if enabled and supported
    if (isBiometricEnabled) {
      handleBiometricAuth();
    }
  }, []);

  const checkBiometricSupport = async () => {
    const supported = await biometricAuth.isSupported();
    setBiometricSupported(supported);
  };

  const handleBiometricAuth = async () => {
    setShowBiometricPrompt(true);
    setLoading(true);
    
    try {
      const success = await biometricAuth.authenticate();
      
      if (success) {
        toast.success("Biometric authentication successful!");
        onUnlock();
      } else {
        setError("Biometric authentication failed. Please use your password.");
        setShowBiometricPrompt(false);
      }
    } catch (err) {
      console.error("Biometric auth error:", err);
      setError("Biometric authentication failed. Please use your password.");
      setShowBiometricPrompt(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Attempt to re-authenticate
      const result = await authApi.login(userEmail || "", password);
      
      if (result.token) {
        toast.success("Welcome back!");
        onUnlock();
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (err: any) {
      console.error("Re-auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <BilltUpLogo variant="white" size="lg" />
          </div>
        </div>

        {/* Lock Card */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="mb-2">Session Locked</h2>
            <p className="text-sm text-muted-foreground">
              Your session has been locked due to inactivity. Please re-authenticate to continue.
            </p>
          </div>

          {/* Session Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-900">
              <Clock className="w-4 h-4" />
              <span>Sessions automatically lock after 3 hours of inactivity</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-4 border-destructive bg-red-50">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Biometric Prompt (Mobile) */}
          {showBiometricPrompt && biometricSupported && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 animate-pulse">
                <Fingerprint className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">
                Touch the fingerprint sensor to unlock
              </p>
            </div>
          )}

          {/* Password Form */}
          {!showBiometricPrompt && (
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              {userEmail && (
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <Input
                    type="email"
                    value={userEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoFocus
                  className="bg-input-background"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Unlocking..." : "Unlock Session"}
              </Button>

              {/* Biometric Option (if supported) */}
              {biometricSupported && isBiometricEnabled && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBiometricAuth}
                  disabled={loading}
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Use Biometric Authentication
                </Button>
              )}
            </form>
          )}

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              This security feature protects your sensitive business data
            </p>
          </div>
        </Card>

        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/60">
            🔒 Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
