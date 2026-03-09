import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '../../utils/config';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  notes?: string;
}

interface SignData {
  invoiceNumber: string;
  customerName: string;
  businessName: string;
  logo?: string;
  brandColor?: string;
  accentColor?: string;
  alreadySigned: boolean;
  total?: number;
  date?: string;
  dueDate?: string;
  subtotal?: number;
  tax?: number;
  notes?: string;
  lineItems?: LineItem[];
}

type PageState = 'loading' | 'ready' | 'signed' | 'already_signed' | 'not_found' | 'error' | 'submitting';

export function SignPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [data, setData] = useState<SignData | null>(null);
  const [error, setError] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setState('not_found');
      return;
    }

    fetch(`${API_CONFIG.baseUrl}/sign/${token}`)
      .then(async (res) => {
        if (res.status === 404) {
          setState('not_found');
          return;
        }
        if (!res.ok) throw new Error('Failed to load sign page');

        const json = await res.json();
        setData(json);

        if (json.alreadySigned) {
          setState('already_signed');
        } else {
          setState('ready');
        }
      })
      .catch((err) => {
        console.error('Sign page error:', err);
        setError('Something went wrong. Please try again later.');
        setState('error');
      });
  }, [token]);

  // Initialize canvas when ready
  useEffect(() => {
    if (state !== 'ready') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [state]);

  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
    setHasDrawn(true);
  }, [getCanvasCoords]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [getCanvasCoords]);

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  // Native touch handlers attached with { passive: false } to allow preventDefault
  // React synthetic touch events are passive by default and cannot prevent scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const touch = e.touches[0];
      const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
      ctx.beginPath();
      ctx.moveTo(x, y);
      isDrawingRef.current = true;
      setHasDrawn(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const touch = e.touches[0];
      const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = false;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [getCanvasCoords]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmit = async () => {
    if (!token || !canvasRef.current) return;
    const signature = canvasRef.current.toDataURL('image/png');

    setState('submitting');
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error?.includes('already been signed')) {
          setState('already_signed');
          return;
        }
        throw new Error(json.error || 'Failed to submit signature');
      }

      setState('signed');
    } catch (err: any) {
      console.error('Signature submit error:', err);
      setError(err.message || 'Failed to submit signature');
      setState('ready');
    }
  };

  const brandColor = data?.brandColor || '#1E3A8A';
  const accentColor = data?.accentColor || '#14B8A6';

  // Loading
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto mb-4" />
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  // Not found
  if (state === 'not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">&#128533;</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sign Link Not Found</h1>
          <p className="text-gray-500">This sign link doesn't exist or has expired.</p>
        </div>
      </div>
    );
  }

  // Error
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">&#9888;&#65039;</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Already signed
  if (state === 'already_signed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
            <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Already Signed</h1>
          <p className="text-gray-500">This invoice has already been signed. No further action is needed.</p>
          {data && (
            <p className="text-sm text-gray-400 mt-4">Invoice {data.invoiceNumber} - {data.businessName}</p>
          )}
        </div>
      </div>
    );
  }

  // Success — signature submitted
  if (state === 'signed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
            <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-500">Your signature has been recorded.</p>
          {data && (
            <p className="text-sm text-gray-400 mt-4">Invoice {data.invoiceNumber} - {data.businessName}</p>
          )}
        </div>
      </div>
    );
  }

  // Ready to sign (or submitting)
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div
          className="rounded-t-2xl p-8 text-center"
          style={{ background: `linear-gradient(135deg, ${brandColor}, ${accentColor})` }}
        >
          {data.logo && (
            <img
              src={data.logo}
              alt={data.businessName}
              className="max-h-14 max-w-[180px] mx-auto mb-3 rounded-xl border-2 border-white/30 shadow-md"
            />
          )}
          <h1 className="text-white text-xl font-bold">{data.businessName}</h1>
        </div>

        {/* Invoice Info */}
        <div className="bg-white border-x border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Invoice</p>
                <p className="text-xl font-bold" style={{ color: brandColor }}>
                  {data.invoiceNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-900">{data.customerName}</p>
              </div>
            </div>
            {(data.date || data.dueDate) && (
              <div className="flex gap-6 mt-3 pt-3 border-t border-gray-200">
                {data.date && (
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-700">{data.date}</p>
                  </div>
                )}
                {data.dueDate && (
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium text-gray-700">{data.dueDate}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Line Items */}
          {data.lineItems && data.lineItems.length > 0 && (
            <div className="border-b border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                    <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Qty</th>
                    <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Rate</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.lineItems.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3">
                        <span className="text-gray-900">{item.description}</span>
                        {item.notes && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.notes}</p>
                        )}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-center">{item.quantity ?? ''}</td>
                      <td className="px-3 py-3 text-gray-600 text-right">{item.rate != null ? `$${item.rate.toFixed(2)}` : ''}</td>
                      <td className="px-6 py-3 text-gray-900 font-medium text-right">{item.amount != null ? `$${item.amount.toFixed(2)}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="px-6 py-4 border-b border-gray-200">
            {data.subtotal != null && data.subtotal !== data.total && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700">${data.subtotal.toFixed(2)}</span>
              </div>
            )}
            {data.tax != null && data.tax > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-700">${data.tax.toFixed(2)}</span>
              </div>
            )}
            {data.total != null && (
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span style={{ color: brandColor }}>${data.total.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {data.notes && (
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{data.notes}</p>
            </div>
          )}

          {/* Signature Section */}
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-3">By signing below, you acknowledge the items and charges listed above:</p>

            <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full cursor-crosshair touch-none"
                style={{ display: 'block' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Draw your signature above</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border-x border-gray-200 px-6 pb-6 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasDrawn || state === 'submitting'}
            className="flex-1 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: `linear-gradient(135deg, ${brandColor}, ${accentColor})` }}
          >
            {state === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Signature'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-2xl border border-gray-200 border-t-0 p-4 text-center">
          <p className="text-xs text-gray-400">
            Secure electronic signature
          </p>
          <p className="text-xs text-gray-300 mt-1">Powered by BilltUp Invoicing</p>
        </div>
      </div>
    </div>
  );
}
