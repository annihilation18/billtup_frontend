import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { stripeOAuthCallback, squareOAuthCallback } from '../../utils/dashboard-api';
import { toast } from 'sonner';

interface OAuthCallbackPageProps {
  provider: 'stripe' | 'square';
}

export function OAuthCallbackPage({ provider }: OAuthCallbackPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter.');
        return;
      }

      try {
        if (provider === 'stripe') {
          const result = await stripeOAuthCallback(code, state);
          if (result.success) {
            setStatus('success');
            setMessage('Stripe account connected successfully!');
            toast.success('Stripe account connected');
          } else {
            throw new Error('Failed to connect Stripe account');
          }
        } else {
          const result = await squareOAuthCallback(code, state);
          if (result.success) {
            setStatus('success');
            setMessage('Square account connected successfully!');
            toast.success('Square account connected');
          } else {
            throw new Error('Failed to connect Square account');
          }
        }

        // Redirect to dashboard after short delay
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      } catch (error: any) {
        console.error(`OAuth callback error (${provider}):`, error);
        setStatus('error');
        setMessage(error.message || `Failed to connect ${provider === 'stripe' ? 'Stripe' : 'Square'} account.`);
        toast.error(`Failed to connect ${provider === 'stripe' ? 'Stripe' : 'Square'}`);
      }
    };

    processCallback();
  }, [provider, searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Connecting {provider === 'stripe' ? 'Stripe' : 'Square'}...
            </h2>
            <p className="text-gray-500">Please wait while we complete the connection.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-[#14B8A6] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Connected!
            </h2>
            <p className="text-gray-500">{message}</p>
            <p className="text-sm text-gray-400 mt-2">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Connection Failed
            </h2>
            <p className="text-gray-500 mb-4">{message}</p>
            <button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
