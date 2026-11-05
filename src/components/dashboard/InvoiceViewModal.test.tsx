import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = vi.hoisted(() => ({
  fetchBusinessProfile: vi.fn(),
  getInvoicePhotos: vi.fn(),
  updateBusinessProfile: vi.fn(),
}));
vi.mock('../../utils/dashboard-api', () => api);
vi.mock('../../utils/auth/cognito', () => ({ getIdToken: vi.fn(async () => 'id-token') }));

import { InvoiceViewModal } from './InvoiceViewModal';

const invoice = {
  id: 'inv-1',
  number: 'INV-001',
  status: 'pending',
  customer: 'Jane Doe',
  customerEmail: 'jane@example.com',
  lineItems: [{ id: 'l1', name: 'Lawn care', quantity: 1, price: 100 }],
  total: 100,
  date: '2026-11-01',
};

let sendBodies: any[] = [];

beforeEach(() => {
  sendBodies = [];
  api.getInvoicePhotos.mockResolvedValue({ photos: [] });
  api.updateBusinessProfile.mockResolvedValue({ success: true });
  globalThis.fetch = vi.fn(async (_url: any, init?: any) => {
    sendBodies.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }) as any;
});

describe('InvoiceViewModal "Allow tip"', () => {
  it('starts from defaultAllowTip and sends allowTip with the email', async () => {
    api.fetchBusinessProfile.mockResolvedValue({ businessName: 'Acme', defaultAllowTip: true });
    render(<InvoiceViewModal invoice={invoice} onClose={() => {}} />);
    const toggle = await screen.findByRole('switch', { name: 'Allow tip' });
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'true'));

    await userEvent.click(screen.getByRole('button', { name: /Send Invoice/ }));
    await waitFor(() => expect(sendBodies).toHaveLength(1));
    expect(sendBodies[0].allowTip).toBe(true);
  });

  it('is off when the business has no saved choice; toggling saves defaultAllowTip and sends it', async () => {
    api.fetchBusinessProfile.mockResolvedValue({ businessName: 'Acme' });
    render(<InvoiceViewModal invoice={invoice} onClose={() => {}} />);
    const toggle = await screen.findByRole('switch', { name: 'Allow tip' });
    await waitFor(() => expect(api.fetchBusinessProfile).toHaveBeenCalled());
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(api.updateBusinessProfile).toHaveBeenCalledWith({ defaultAllowTip: true });

    await userEvent.click(screen.getByRole('button', { name: /Send Invoice/ }));
    await waitFor(() => expect(sendBodies).toHaveLength(1));
    expect(sendBodies[0].allowTip).toBe(true);
  });

  it('a paid invoice shows no switch, and shows the customer tip separately from the total', async () => {
    api.fetchBusinessProfile.mockResolvedValue({ defaultAllowTip: true });
    render(<InvoiceViewModal invoice={{ ...invoice, status: 'paid', tipAmount: 15 }} onClose={() => {}} />);
    await waitFor(() => expect(api.fetchBusinessProfile).toHaveBeenCalled());
    expect(screen.queryByRole('switch', { name: 'Allow tip' })).not.toBeInTheDocument();
    expect(screen.getByTestId('invoice-tip')).toHaveTextContent('Tip');
    expect(screen.getByTestId('invoice-tip')).toHaveTextContent('$15.00');
  });

  it('no tip row when the invoice has no tip', async () => {
    api.fetchBusinessProfile.mockResolvedValue({});
    render(<InvoiceViewModal invoice={invoice} onClose={() => {}} />);
    await waitFor(() => expect(api.fetchBusinessProfile).toHaveBeenCalled());
    expect(screen.queryByTestId('invoice-tip')).not.toBeInTheDocument();
  });
});
