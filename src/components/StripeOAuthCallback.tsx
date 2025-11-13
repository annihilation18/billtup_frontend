import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { stripeConnectApi } from "../utils/api";

interface StripeOAuthCallbackProps {
  onComplete: () => void;
}

export function StripeOAuthCallback({ onComplete }: StripeOAuthCallbackProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get URL parameters
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      // Check for Stripe errors
      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || 'Stripe connection was cancelled or failed');
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setErrorMessage('Missing authorization code. Please try again.');
        return;
      }

      // Process the callback
      const result = await stripeConnectApi.handleOAuthCallback(code, state);

      if (result.success) {
        setStatus('success');
        
        // Redirect to settings after 2 seconds
        setTimeout(() => {
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
          onComplete();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to connect Stripe account. Please try again.');
      }
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred');
    }
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h2>Connecting Stripe Account</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we complete the connection...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2>Successfully Connected!</h2>
            <p className="text-sm text-muted-foreground">
              Your Stripe account has been connected successfully. Redirecting you back to settings...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2>Connection Failed</h2>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Button onClick={onComplete} className="mt-4">
            Return to Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}