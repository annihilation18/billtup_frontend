import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { CreditCard, Smartphone, AlertCircle, CheckCircle, Loader2 } from 'lucide-react@0.468.0';
import { getIdToken } from '../../utils/auth/cognito';
import { API_CONFIG } from '../../utils/config';
import { toast } from 'sonner@2.0.3';

interface PaymentSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

type PaymentProvider = 'stripe' | 'square';

export function PaymentSettingsModal({ open, onClose, onDataUpdated }: PaymentSettingsModalProps) {
  const [activeProvider, setActiveProvider] = useState<PaymentProvider>('stripe');
  const [stripeConnected, setStripeConnected] = useState(false);
  const [squareConnected, setSquareConnected] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPaymentSettings();
    }
  }, [open]);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      const token = await getIdToken();

      if (!token) {
        // User not authenticated yet - use default provider
        setLoading(false);
        setActiveProvider('stripe');
        return;
      }

      // Fetch active payment provider
      const response = await fetch(
        `${API_CONFIG.baseUrl}/payment-provider/active`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActiveProvider(data.provider || 'stripe');
      } else {
        console.error('Failed to fetch payment provider:', response.status);
        setActiveProvider('stripe');
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast.error('Failed to load payment settings');
      setActiveProvider('stripe');
    } finally {
      setLoading(false);
    }
  };

  const switchProvider = async (newProvider: PaymentProvider) => {
    console.log('[PaymentSettings] switchProvider called:', { 
      newProvider, 
      activeProvider, 
      switching,
      isSameProvider: newProvider === activeProvider 
    });
    
    if (newProvider === activeProvider) {
      console.log('[PaymentSettings] Already using this provider, skipping...');
      return;
    }
    
    if (switching) {
      console.log('[PaymentSettings] Already switching, skipping...');
      return;
    }

    try {
      setSwitching(true);
      console.log('[PaymentSettings] Getting token...');
      const token = await getIdToken();

      if (!token) {
        console.error('[PaymentSettings] No token found');
        toast.error('Authentication required');
        setSwitching(false);
        return;
      }

      console.log('[PaymentSettings] Making API request to switch provider...');
      const response = await fetch(
        `${API_CONFIG.baseUrl}/payment-provider/set`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ provider: newProvider })
        }
      );

      console.log('[PaymentSettings] API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PaymentSettings] API error:', errorData);
        throw new Error(errorData.error || 'Failed to switch provider');
      }

      const data = await response.json();
      console.log('[PaymentSettings] API response data:', data);
      
      if (data.success) {
        setActiveProvider(data.provider);
        toast.success(`Payment provider switched to ${data.provider === 'stripe' ? 'Stripe' : 'Square'}`);
      }
    } catch (error: any) {
      console.error('[PaymentSettings] Error switching payment provider:', error);
      toast.error(error.message || 'Failed to switch provider');
    } finally {
      setSwitching(false);
    }
  };

  const handleConnectStripe = () => {
    // This would redirect to Stripe Connect OAuth flow
    toast.info('Stripe Connect integration coming soon! This will allow you to accept payments directly through the app.');
  };

  const handleConnectSquare = () => {
    // This would redirect to Square OAuth flow
    toast.info('Square integration coming soon! This will allow you to accept payments with lower fees.');
  };

  const handleNfcToggle = (enabled: boolean) => {
    setNfcEnabled(enabled);
    toast.success(enabled ? 'NFC payments enabled' : 'NFC payments disabled');
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Payment Settings</span>
          </DialogTitle>
          <DialogDescription>
            Stripe Connect & NFC
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Provider Selection */}
          <Card className="p-6 border-gray-200">
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Payment Provider
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Stripe Option */}
              <button
                onClick={() => switchProvider('stripe')}
                disabled={switching}
                className={`relative border-2 rounded-xl p-4 text-left transition-all ${
                  activeProvider === 'stripe'
                    ? 'border-[#635BFF] bg-[#635BFF]/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${switching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-lg font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Stripe
                  </div>
                  <div className="text-xs text-gray-500">
                    Industry standard
                  </div>
                </div>
                {activeProvider === 'stripe' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-full bg-[#635BFF] flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>

              {/* Square Option */}
              <button
                onClick={() => switchProvider('square')}
                disabled={switching}
                className={`relative border-2 rounded-xl p-4 text-left transition-all ${
                  activeProvider === 'square'
                    ? 'border-[#000000] bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${switching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-lg font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Square
                  </div>
                  <div className="text-xs text-gray-500">
                    Lower in-person fees
                  </div>
                </div>
                {activeProvider === 'square' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            </div>

            {switching && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Switching provider...
                </p>
              </div>
            )}

            {/* Fee Comparison Table */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-700">
                Fee Comparison (U.S. Standard)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-200">
                  <span className="text-gray-600">Online Card:</span>
                  <span className="font-mono text-gray-900">
                    {activeProvider === 'stripe' ? '2.9% + 30¢' : '2.6% + 10¢'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-200">
                  <span className="text-gray-600">In-Person:</span>
                  <span className="font-mono text-gray-900">
                    {activeProvider === 'stripe' ? '2.7% + 5¢' : '2.6% + 10¢'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-200">
                  <span className="text-gray-600">Keyed-In:</span>
                  <span className="font-mono text-gray-900">
                    {activeProvider === 'stripe' ? '3.4% + 30¢' : '3.5% + 15¢'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-600">ACH:</span>
                  <span className="font-mono text-gray-900">
                    {activeProvider === 'stripe' ? '0.8% (max $5)' : '1% (min $1)'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Stripe Payment Processing */}
          {activeProvider === 'stripe' && (
            <Card className="p-6 border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#635BFF]/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-[#635BFF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Stripe Payment Processing
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your Stripe account to accept payments from customers. Stripe will handle all payment processing securely.
                  </p>
                  
                  {stripeConnected ? (
                    <div className="flex items-center gap-2 text-sm text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-2 rounded-lg mb-4">
                      <CheckCircle className="w-4 h-4" />
                      <span>Stripe account connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg mb-4">
                      <AlertCircle className="w-4 h-4" />
                      <span>Not connected</span>
                    </div>
                  )}

                  <Button 
                    onClick={handleConnectStripe}
                    className="bg-[#635BFF] hover:bg-[#635BFF]/90 text-white"
                    disabled={stripeConnected}
                  >
                    {stripeConnected ? 'Connected' : 'Connect Stripe Account'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Square Payment Processing */}
          {activeProvider === 'square' && (
            <Card className="p-6 border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Square Payment Processing
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your Square account to accept payments with competitive rates. Square offers lower in-person fees.
                  </p>
                  
                  {squareConnected ? (
                    <div className="flex items-center gap-2 text-sm text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-2 rounded-lg mb-4">
                      <CheckCircle className="w-4 h-4" />
                      <span>Square account connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg mb-4">
                      <AlertCircle className="w-4 h-4" />
                      <span>Not connected</span>
                    </div>
                  )}

                  <Button 
                    onClick={handleConnectSquare}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={squareConnected}
                  >
                    {squareConnected ? 'Connected' : 'Connect Square Account'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Enable NFC Payments */}
          <Card className="p-6 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-[#14B8A6]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Enable NFC Payments
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tap to pay support
                  </p>
                </div>
              </div>
              <Switch
                checked={nfcEnabled}
                onCheckedChange={handleNfcToggle}
                className="data-[state=checked]:bg-[#14B8A6]"
              />
            </div>
            {nfcEnabled && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  📱 NFC payments are enabled. Use the BilltUp mobile app on Android devices with NFC to accept tap-to-pay contactless payments.
                </p>
              </div>
            )}
          </Card>

          {/* Payment Options Info */}
          <Card className="p-6 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Payment Options
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Payment processing is completely optional. You can continue to use BilltUp for invoicing and track payments manually without connecting any payment processor.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#14B8A6]" />
                Send invoices via email
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#14B8A6]" />
                Generate PDF invoices
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#14B8A6]" />
                Track payment status manually
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#14B8A6]" />
                Optional: Accept online payments via {activeProvider === 'stripe' ? 'Stripe' : 'Square'}
              </li>
            </ul>
          </Card>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}