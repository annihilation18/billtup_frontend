import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PaymentPage } from './PaymentPage';

const basePayData = {
  invoiceNumber: 'INV-001',
  customer: 'Jane Doe',
  lineItems: [{ name: 'Lawn care', quantity: 1, price: 100 }],
  subtotal: 100,
  tax: 0,
  total: 100,
  chargeAmount: 100,
  invoiceTotal: 100,
  paymentType: 'full',
  businessName: 'Acme Yards',
  provider: 'stripe',
  status: 'pending',
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
  fees: { processingFee: 4.12, totalCharge: 104.12 },
  feeRates: { platformPercent: 0.6, platformFixed: 0.2, processorPercent: 2.9, processorFixed: 0.3 },
};

let checkoutBodies: any[] = [];

function mockFetch(payData: Record<string, unknown>) {
  checkoutBodies = [];
  globalThis.fetch = vi.fn(async (url: any, init?: any) => {
    if (String(url).endsWith('/checkout')) {
      checkoutBodies.push(JSON.parse(init.body));
      return new Response(JSON.stringify({ checkoutUrl: 'https://checkout.example/session' }), { status: 200 });
    }
    return new Response(JSON.stringify(payData), { status: 200 });
  }) as any;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/pay/tok123']}>
      <Routes>
        <Route path="/pay/:token" element={<PaymentPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const originalLocation = window.location;
beforeEach(() => {
  // Checkout redirects by setting location.href; keep jsdom from navigating
  Object.defineProperty(window, 'location', { configurable: true, value: { ...originalLocation, href: '' } });
});
afterEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

describe('PaymentPage tips', () => {
  it('allowTip false: no tip button, pays without a tip', async () => {
    mockFetch({ ...basePayData, allowTip: false });
    renderPage();
    const pay = await screen.findByRole('button', { name: 'Pay $104.12' });
    expect(screen.queryByRole('button', { name: 'Add a tip' })).not.toBeInTheDocument();
    expect(screen.queryByText('10%')).not.toBeInTheDocument();
    await userEvent.click(pay);
    await waitFor(() => expect(checkoutBodies).toEqual([{}]));
  });

  it('hides tip options until "Add a tip" is tapped, with nothing pre-selected', async () => {
    mockFetch({ ...basePayData, allowTip: true });
    renderPage();
    await screen.findByRole('button', { name: 'Pay $104.12' });
    expect(screen.queryByText('10%')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip-line')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Add a tip' }));
    for (const label of [/10%/, /15%/, /20%/, /Custom/]) {
      expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'false');
    }
    // Opening the options alone adds nothing
    expect(screen.getByRole('button', { name: 'Pay $104.12' })).toBeInTheDocument();
    expect(screen.queryByTestId('tip-line')).not.toBeInTheDocument();
  });

  it('choosing 15% shows the tip, recalculated fee and total, and sends tipAmount 15', async () => {
    mockFetch({ ...basePayData, allowTip: true });
    renderPage();
    await screen.findByRole('button', { name: 'Pay $104.12' });
    await userEvent.click(screen.getByRole('button', { name: 'Add a tip' }));
    await userEvent.click(screen.getByRole('button', { name: /15%/ }));

    expect(screen.getByTestId('tip-line')).toHaveTextContent('$15.00');
    expect(screen.getByText('$4.66')).toBeInTheDocument();
    const pay = screen.getByRole('button', { name: 'Pay $119.66' });
    await userEvent.click(pay);
    await waitFor(() => expect(checkoutBodies).toEqual([{ tipAmount: 15 }]));
  });

  it('"No tip" removes the tip again', async () => {
    mockFetch({ ...basePayData, allowTip: true });
    renderPage();
    await screen.findByRole('button', { name: 'Pay $104.12' });
    await userEvent.click(screen.getByRole('button', { name: 'Add a tip' }));
    await userEvent.click(screen.getByRole('button', { name: /20%/ }));
    expect(screen.getByRole('button', { name: /^Pay \$/ })).not.toHaveTextContent('$104.12');

    await userEvent.click(screen.getByRole('button', { name: 'No tip' }));
    expect(screen.queryByTestId('tip-line')).not.toBeInTheDocument();
    const pay = screen.getByRole('button', { name: 'Pay $104.12' });
    await userEvent.click(pay);
    await waitFor(() => expect(checkoutBodies).toEqual([{}]));
  });

  it('custom tip is validated and sent in dollars', async () => {
    mockFetch({ ...basePayData, allowTip: true });
    renderPage();
    await screen.findByRole('button', { name: 'Pay $104.12' });
    await userEvent.click(screen.getByRole('button', { name: 'Add a tip' }));
    await userEvent.click(screen.getByRole('button', { name: /Custom/ }));
    const input = screen.getByLabelText('Custom tip amount');

    await userEvent.type(input, '150');
    expect(screen.getByText("A tip can't be more than the amount due")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Pay \$/ })).toBeDisabled();

    await userEvent.clear(input);
    await userEvent.type(input, '7.5');
    expect(screen.getByTestId('tip-line')).toHaveTextContent('$7.50');
    await userEvent.click(screen.getByRole('button', { name: /^Pay \$/ }));
    await waitFor(() => expect(checkoutBodies).toEqual([{ tipAmount: 7.5 }]));
  });

  it('deposits never offer a tip', async () => {
    mockFetch({ ...basePayData, allowTip: true, paymentType: 'deposit', chargeAmount: 50, fees: { processingFee: 2.37, totalCharge: 52.37 } });
    renderPage();
    await screen.findByRole('button', { name: 'Pay Deposit $52.37' });
    expect(screen.queryByRole('button', { name: 'Add a tip' })).not.toBeInTheDocument();
  });

  it('shows a checkout error message from the server', async () => {
    mockFetch({ ...basePayData, allowTip: true });
    globalThis.fetch = vi.fn(async (url: any) => {
      if (String(url).endsWith('/checkout')) {
        return new Response(JSON.stringify({ error: "Tips aren't turned on for this invoice" }), { status: 400 });
      }
      return new Response(JSON.stringify({ ...basePayData, allowTip: true }), { status: 200 });
    }) as any;
    renderPage();
    await screen.findByRole('button', { name: 'Pay $104.12' });
    await userEvent.click(screen.getByRole('button', { name: 'Add a tip' }));
    await userEvent.click(screen.getByRole('button', { name: /10%/ }));
    await userEvent.click(screen.getByRole('button', { name: /^Pay \$/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent("Tips aren't turned on for this invoice");
  });
});
