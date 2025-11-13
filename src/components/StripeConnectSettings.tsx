import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { CreditCard, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, DollarSign, AlertTriangle } from "lucide-react";
import { stripeConnectApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface StripeConnectSettingsProps {
  businessData: any;
  onUpdate?: () => void;
}

export function StripeConnectSettings({ businessData, onUpdate }: StripeConnectSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      setCheckingStatus(true);
      const status = await stripeConnectApi.getAccountStatus();
      setAccountStatus(status);
      console.log('Stripe Connect status:', status);
    } catch (error) {
      console.error('Error checking Stripe status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const result = await stripeConnectApi.getOAuthUrl();
      
      // Redirect to Stripe OAuth
      if (result.oauthUrl) {
        window.location.href = result.oauthUrl;
      }
    } catch (error: any) {
      console.error('Error getting OAuth URL:', error);
      toast.error(error.message || 'Failed to start Stripe connection');
      setLoading(false);
    }
  };

  const handleRefreshOnboarding = async () => {
    setLoading(true);
    try {
      const result = await stripeConnectApi.refreshOnboarding();
      toast.success('Onboarding link refreshed!');
      
      // Redirect to Stripe onboarding
      if (result.onboardingUrl) {
        window.location.href = result.onboardingUrl;
      }
    } catch (error: any) {
      console.error('Error refreshing onboarding:', error);
      toast.error(error.message || 'Failed to refresh onboarding link');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await stripeConnectApi.disconnect();
      toast.success('Stripe account disconnected successfully');
      setShowDisconnectConfirm(false);
      
      // Refresh account status
      await checkAccountStatus();
      
      // Notify parent component to refresh
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error('Error disconnecting Stripe:', error);
      toast.error(error.message || 'Failed to disconnect Stripe account');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Checking Stripe Connect status...</span>
        </div>
      </Card>
    );
  }

  // Not connected yet
  if (!accountStatus?.connected) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">Stripe Payment Processing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Stripe account to accept payments from customers. Stripe will handle all payment processing securely.
            </p>
            
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <DollarSign className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-900">
                <strong>Platform Fee:</strong> 0.6% + $0.20 per transaction
                <br />
                <strong>Stripe Fee:</strong> 2.9% + $0.30 per transaction
                <br />
                <strong>Total:</strong> 3.5% + $0.50 per transaction
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleCreateAccount}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Creating Account...' : 'Connect Stripe Account'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Connected but needs onboarding
  if (accountStatus.connected && !accountStatus.onboardingComplete) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3>Complete Stripe Onboarding</h3>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Pending
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your Stripe account has been created, but you need to complete the onboarding process to start accepting payments.
            </p>
            
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-900">
                During onboarding, Stripe will collect:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Business information</li>
                  <li>Bank account details for payouts</li>
                  <li>Identity verification</li>
                  <li>Tax information</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button 
                onClick={handleRefreshOnboarding}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Continue Onboarding'}
              </Button>
              <Button 
                variant="outline"
                onClick={checkAccountStatus}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Fully connected and charges enabled
  if (accountStatus.connected && accountStatus.chargesEnabled) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3>Stripe Connected</h3>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your Stripe account is fully set up and ready to accept payments.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Account ID:</span>
                  <div className="font-mono text-xs mt-1">{accountStatus.accountId}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Charges Enabled
                    </Badge>
                  </div>
                </div>
                {accountStatus.payoutsEnabled && (
                  <div>
                    <span className="text-muted-foreground">Payouts:</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        Enabled
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                <strong>Fee Breakdown:</strong>
                <div className="mt-2 space-y-1">
                  <div>Platform Fee: 0.6% + $0.20</div>
                  <div>Stripe Processing: 2.9% + $0.30</div>
                  <div className="font-semibold pt-1 border-t border-blue-200 mt-2">Total: 3.5% + $0.50</div>
                </div>
                <div className="mt-2 text-xs">
                  Example: On a $100 payment, you receive $96.50
                </div>
              </AlertDescription>
            </Alert>

            {!showDisconnectConfirm ? (
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline"
                  onClick={checkAccountStatus}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
                <Button 
                  variant="outline"
                  asChild
                >
                  <a 
                    href="https://dashboard.stripe.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Stripe Dashboard
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowDisconnectConfirm(true)}
                  disabled={loading}
                  className="text-destructive hover:text-destructive"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Alert className="border-destructive bg-red-50">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription>
                  <p className="text-sm text-destructive mb-3">
                    <strong>Are you sure?</strong> Disconnecting will prevent you from accepting payments. 
                    You can reconnect anytime.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={handleDisconnect}
                      disabled={loading}
                    >
                      {loading ? 'Disconnecting...' : 'Yes, Disconnect'}
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDisconnectConfirm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Connected but charges not yet enabled
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-50 rounded-lg">
          <AlertCircle className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3>Stripe Account Review</h3>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Under Review
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your Stripe account is being reviewed. This typically takes a few minutes to a few hours. You'll be able to accept payments once approved.
          </p>

          <Button 
            variant="outline"
            onClick={checkAccountStatus}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Status
          </Button>
        </div>
      </div>
    </Card>
  );
}