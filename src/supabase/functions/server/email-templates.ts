// Email template generation functions for invoice emails
// Supports Modern, Classic, and Minimal templates with custom branding

export function generateModernTemplate(
  invoiceData: any,
  businessData: any,
  primaryColor: string,
  secondaryColor: string,
  displayLogo: string,
  supportEmail: string
): string {
  const { customer, customerEmail, lineItems, subtotal, tax, total, number, date, signature } = invoiceData;
  const { businessName, phone } = businessData;
  
  let itemsHtml = '';
  if (lineItems && lineItems.length > 0) {
    itemsHtml = lineItems.map((item: any) => `
      <div style="display: grid; grid-template-columns: 7fr 2fr 3fr; gap: 8px; padding: 8px 0; font-size: 14px;">
        <div style="color: #374151;">${item.name}</div>
        <div style="text-align: center; color: #4b5563;">${item.quantity}</div>
        <div style="text-align: right; color: #374151;">$${(item.quantity * item.price).toFixed(2)}</div>
      </div>
    `).join('');
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Inter, -apple-system, sans-serif; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; background-color: #ffffff; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header with accent bar -->
        <div style="border-left: 4px solid ${secondaryColor}; padding-left: 16px; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
              ${displayLogo ? `<img src="${displayLogo}" alt="Logo" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid ${primaryColor}; flex-shrink: 0;">` : ''}
              <div style="min-width: 0; flex: 1;">
                <div style="font-size: 14px; font-weight: 500; color: #374151;">${businessName}</div>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <div style="font-size: 18px; font-weight: 600; color: ${primaryColor};">INVOICE</div>
              <div style="font-size: 13px; color: #4b5563;">${number || 'N/A'}</div>
              <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">${date || new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <!-- Bill To -->
        <div style="margin-bottom: 32px;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; color: ${secondaryColor};">Bill To</div>
          <div style="font-size: 14px; color: #374151;">${customer}</div>
          ${customerEmail ? `<div style="font-size: 12px; color: #6b7280;">${customerEmail}</div>` : ''}
        </div>

        <!-- Items -->
        <div style="margin-bottom: 32px;">
          <div style="display: grid; grid-template-columns: 7fr 2fr 3fr; gap: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: ${primaryColor};">
            <div>Description</div>
            <div style="text-align: center;">Qty</div>
            <div style="text-align: right;">Amount</div>
          </div>
          ${itemsHtml}
        </div>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <div style="width: 256px;">
            <div style="display: flex; justify-between; font-size: 14px; margin-bottom: 8px;">
              <span style="color: #4b5563;">Subtotal:</span>
              <span style="font-family: monospace; color: #374151;">$${subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            ${(tax && tax > 0) ? `
            <div style="display: flex; justify-between; font-size: 14px; margin-bottom: 8px;">
              <span style="color: #4b5563;">Tax:</span>
              <span style="font-family: monospace; color: #374151;">$${tax.toFixed(2)}</span>
            </div>
            ` : ''}
          </div>
        </div>
        <div style="border-top: 2px solid ${secondaryColor}; padding-top: 12px; margin-bottom: 32px;">
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 256px; display: flex; justify-between; align-items: center;">
              <span style="font-weight: 600; color: ${primaryColor};">TOTAL DUE</span>
              <span style="font-size: 20px; font-weight: 700; color: ${primaryColor};">$${total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        ${signature ? `
        <div style="padding-top: 24px; border-top: 1px solid #e5e7eb; margin-bottom: 32px;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px;">Customer Signature</div>
          <div style="border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; background-color: #f9fafb;">
            <img src="${signature}" alt="Signature" style="max-width: 100%; height: auto;">
          </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 16px;">
            <p style="font-size: 18px; font-weight: 600; color: ${primaryColor}; margin: 0;">Thank you for your business!</p>
          </div>
          
          <div style="background-color: #f9fafb; border: 2px solid ${primaryColor}; border-radius: 12px; padding: 16px;">
            <h3 style="font-weight: 600; margin: 0 0 8px 0; color: ${primaryColor};">Questions or Need Support?</h3>
            <p style="font-size: 14px; color: #4b5563; margin: 0 0 8px 0;">Contact ${businessName} at:</p>
            <p style="font-size: 14px; color: ${primaryColor}; margin: 4px 0;">📧 ${supportEmail}</p>
            <p style="font-size: 14px; color: ${primaryColor}; margin: 4px 0;">📞 ${phone || 'N/A'}</p>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Powered by BilltUp Invoicing</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateClassicTemplate(
  invoiceData: any,
  businessData: any,
  primaryColor: string,
  secondaryColor: string,
  displayLogo: string,
  supportEmail: string
): string {
  const { customer, customerEmail, lineItems, subtotal, tax, total, number, date, signature } = invoiceData;
  const { businessName, email, phone, address } = businessData;
  
  let itemsHtml = '';
  if (lineItems && lineItems.length > 0) {
    itemsHtml = lineItems.map((item: any) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0; font-size: 14px; color: #374151;">${item.name}</td>
        <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #4b5563;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #374151;">$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Inter, -apple-system, sans-serif; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; background-color: #ffffff; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header with colored background -->
        <div style="background-color: ${primaryColor}; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
              ${displayLogo ? `<img src="${displayLogo}" alt="Logo" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 4px solid white; flex-shrink: 0;">` : ''}
              <div style="color: white; min-width: 0; flex: 1;">
                <div style="font-weight: 600; font-size: 16px;">${businessName}</div>
                ${address ? `<div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">${address}</div>` : ''}
                ${email ? `<div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">${email}</div>` : ''}
                ${phone ? `<div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">${phone}</div>` : ''}
              </div>
            </div>
            <div style="text-align: right; color: white; flex-shrink: 0;">
              <div style="font-size: 24px; font-weight: 700;">INVOICE</div>
              <div style="font-size: 14px; opacity: 0.9;">${number || 'N/A'}</div>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
          <div>
            <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 4px;">BILL TO</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151;">${customer}</div>
            ${customerEmail ? `<div style="font-size: 12px; color: #6b7280;">${customerEmail}</div>` : ''}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 4px;">DATE</div>
            <div style="font-size: 14px; color: #374151;">${date || new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="margin-bottom: 32px;">
          <thead>
            <tr style="border-bottom: 2px solid ${primaryColor};">
              <th style="padding: 8px 0; text-align: left; font-size: 12px; font-weight: 600; color: #374151;">DESCRIPTION</th>
              <th style="padding: 8px 0; text-align: center; font-size: 12px; font-weight: 600; color: #374151;">QTY</th>
              <th style="padding: 8px 0; text-align: right; font-size: 12px; font-weight: 600; color: #374151;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Subtotal -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <div style="width: 256px;">
            <div style="display: flex; justify-between; font-size: 14px; margin-bottom: 8px;">
              <span style="color: #4b5563;">Subtotal:</span>
              <span style="font-family: monospace; color: #374151;">$${subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            ${(tax && tax > 0) ? `
            <div style="display: flex; justify-between; font-size: 14px; margin-bottom: 8px;">
              <span style="color: #4b5563;">Tax:</span>
              <span style="font-family: monospace; color: #374151;">$${tax.toFixed(2)}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Total -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
          <div style="width: 100%; max-width: 256px; background-color: ${secondaryColor}20; border-left: 4px solid ${secondaryColor}; border-radius: 8px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; color: #374151;">TOTAL DUE</span>
              <span style="font-size: 24px; font-weight: 700; color: ${primaryColor};">$${total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        ${signature ? `
        <div style="padding-top: 24px; border-top: 1px solid #e5e7eb; margin-bottom: 32px;">
          <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">CUSTOMER SIGNATURE</div>
          <div style="border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; background-color: #f9fafb;">
            <img src="${signature}" alt="Signature" style="max-width: 100%; height: auto;">
          </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 16px;">
            <p style="font-size: 18px; font-weight: 700; color: ${primaryColor}; margin: 0;">Thank you for your business!</p>
          </div>
          
          <div style="background-color: ${secondaryColor}20; border-left: 4px solid ${secondaryColor}; border-radius: 12px; padding: 16px;">
            <h3 style="font-weight: 700; margin: 0 0 8px 0; color: #374151;">Questions or Need Support?</h3>
            <p style="font-size: 14px; color: #4b5563; margin: 0 0 8px 0;">Contact ${businessName} at:</p>
            <p style="font-size: 14px; color: #374151; margin: 4px 0;">📧 ${supportEmail}</p>
            <p style="font-size: 14px; color: #374151; margin: 4px 0;">📞 ${phone || 'N/A'}</p>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Powered by BilltUp Invoicing</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateMinimalTemplate(
  invoiceData: any,
  businessData: any,
  primaryColor: string,
  secondaryColor: string,
  displayLogo: string,
  supportEmail: string
): string {
  const { customer, customerEmail, lineItems, subtotal, tax, total, number, date, signature } = invoiceData;
  const { businessName, phone } = businessData;
  
  let itemsHtml = '';
  if (lineItems && lineItems.length > 0) {
    itemsHtml = lineItems.map((item: any) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
        <div>
          <div style="font-size: 14px; color: #374151;">${item.name}</div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Qty: ${item.quantity}</div>
        </div>
        <div style="font-size: 14px; color: #374151;">$${(item.quantity * item.price).toFixed(2)}</div>
      </div>
    `).join('');
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Inter, -apple-system, sans-serif; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; background-color: #ffffff; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Minimal Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px; padding-bottom: 24px; margin-bottom: 32px; border-bottom: 1px solid #e5e7eb; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
            ${displayLogo ? `<img src="${displayLogo}" alt="Logo" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid ${primaryColor}; flex-shrink: 0;">` : ''}
            <div style="min-width: 0;">
              <div style="font-size: 12px; color: #9ca3af;">FROM</div>
              <div style="font-size: 14px; color: #374151;">${businessName}</div>
            </div>
          </div>
          <div style="text-align: right; flex-shrink: 0;">
            <div style="font-size: 28px; font-weight: 300; letter-spacing: -0.025em; color: ${primaryColor};">Invoice</div>
            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${number || 'N/A'} • ${date || new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <!-- Bill To -->
        <div style="margin-bottom: 32px;">
          <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">TO</div>
          <div style="font-size: 14px; color: #374151;">${customer}</div>
          ${customerEmail ? `<div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${customerEmail}</div>` : ''}
        </div>

        <!-- Minimal Items -->
        <div style="margin-bottom: 32px;">
          ${itemsHtml}
        </div>

        ${(tax && tax > 0) ? `
        <!-- Subtotal -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <div style="width: 256px;">
            <div style="display: flex; justify-between; font-size: 14px; margin-bottom: 8px;">
              <span style="color: #6b7280;">Subtotal:</span>
              <span style="color: #374151;">$${subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div style="display: flex; justify-between; font-size: 14px; margin-bottom: 8px;">
              <span style="color: #6b7280;">Tax:</span>
              <span style="color: #374151;">$${tax.toFixed(2)}</span>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Minimal Total -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #e5e7eb; margin-bottom: 32px;">
          <span style="font-size: 14px; color: #6b7280;">Total Due</span>
          <span style="font-size: 32px; font-weight: 300; letter-spacing: -0.025em; color: ${primaryColor};">$${total?.toFixed(2) || '0.00'}</span>
        </div>

        ${signature ? `
        <div style="padding-top: 24px; border-top: 1px solid #e5e7eb; margin-bottom: 32px;">
          <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">SIGNATURE</div>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px;">
            <img src="${signature}" alt="Signature" style="max-width: 100%; height: auto;">
          </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 16px;">
            <p style="font-size: 18px; font-weight: 300; letter-spacing: -0.025em; color: ${primaryColor}; margin: 0;">Thank you for your business!</p>
          </div>
          
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
            <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: #374151;">Questions or Need Support?</h3>
            <p style="font-size: 12px; color: #4b5563; margin: 0 0 8px 0;">Contact ${businessName} at:</p>
            <p style="font-size: 12px; color: #374151; margin: 4px 0;">📧 ${supportEmail}</p>
            <p style="font-size: 12px; color: #374151; margin: 4px 0;">📞 ${phone || 'N/A'}</p>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Powered by BilltUp Invoicing</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
