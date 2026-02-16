import { useState, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react@0.468.0';
import { API_CONFIG } from './utils/config';

interface ResetPasswordProps {
  onBackToSignIn: () => void;
}

export default function ResetPassword({ onBackToSignIn }: ResetPasswordProps) {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Extract token from URL query parameters (look for both 'token' and 'reset-token')
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token') || urlParams.get('reset-token');
    
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, []);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsResetting(true);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      setSuccess(true);

      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        onBackToSignIn();
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset password. The link may have expired.');
    } finally {
      setIsResetting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Password Reset Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You will be redirected to the sign in page in a few seconds.
          </p>
          <Button
            onClick={onBackToSignIn}
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            Go to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#1E3A8A]" />
            </div>
          </div>
          <h1 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative mt-2">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isResetting || !token}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              At least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isResetting || !token}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isResetting || !token || !newPassword || !confirmPassword}
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            {isResetting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

        {/* Back to Sign In */}
        <div className="mt-6 text-center">
          <button
            onClick={onBackToSignIn}
            className="text-sm text-[#1E3A8A] hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </Card>
    </div>
  );
}