/**
 * Content for the "invoice app for <trade>" pages (app repo BACKLOG M.6).
 * Each page is written for its trade, not a copy with the name swapped, so search
 * engines treat them as separate, useful pages. Only describe features the app has.
 * New pages also go in public/sitemap.xml (titles come from here via src/utils/seo.ts).
 */

export interface TradeContent {
  /** URL path: /invoice-app-for-<slug> */
  slug: string;
  /** Short name used in headings and links ("Plumbers") */
  name: string;
  /** Page title for search results (about 60 characters) */
  metaTitle: string;
  /** Search result description (about 155 characters) */
  metaDescription: string;
  headline: string;
  intro: string;
  painPoints: { title: string; text: string }[];
  features: { title: string; text: string }[];
  /** A typical job, start to finish */
  workflow: string[];
  /** Example line items for this trade */
  lineItems: string[];
  faqs: { q: string; a: string }[];
}

export const STORE_LINKS = {
  appStore: 'https://apps.apple.com/app/billtup/id6762327635',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.billtup.app',
};

export const TRADES: TradeContent[] = [
  {
    slug: 'plumbers',
    name: 'Plumbers',
    metaTitle: 'Invoice App for Plumbers: Invoices & Estimates | BilltUp',
    metaDescription:
      'Plumbing invoice app: send estimates and invoices from the job, collect a deposit for parts, and get paid by card before you leave. Free 14-day trial.',
    headline: 'The invoice app for plumbers',
    intro:
      'Write up the job while you are still under the sink. BilltUp lets plumbers send estimates and invoices from their phone, collect a deposit for parts, and get paid by card before they leave the driveway.',
    painPoints: [
      { title: 'Paperwork after a long day', text: 'Writing invoices at the kitchen table at night means late bills and forgotten parts.' },
      { title: 'Waiting weeks to get paid', text: 'Mailed invoices and "I\'ll send a check" stretch out payment on jobs you finished days ago.' },
      { title: 'Big jobs, big parts bills', text: 'Water heaters and repipes tie up your money in materials before the customer pays a cent.' },
    ],
    features: [
      { title: 'Estimates customers approve by email', text: 'Quote the water heater swap on site. Your customer approves from the email, and one tap turns it into the invoice.' },
      { title: 'Deposits for parts', text: 'Request a deposit up front, mark it paid, and bill the balance when the job is done.' },
      { title: 'Paid by card on the spot', text: 'Every invoice has a payment link and QR code. Customers pay by card, Apple Pay or Google Pay through your own Stripe or Square account.' },
      { title: 'Photos and signatures', text: 'Attach before-and-after photos of the leak or the install, and collect the customer\'s signature on the invoice.' },
      { title: 'Works in basements and crawlspaces', text: 'No signal? Create the invoice anyway. BilltUp syncs it when you\'re back online.' },
      { title: 'Saved line items', text: 'Your common parts and labor rates fill in as you type, with tax and discounts worked out for you.' },
    ],
    workflow: [
      'Diagnose the problem and send an estimate from your phone.',
      'The customer approves it from their email; request a deposit for parts if you need one.',
      'Finish the job, snap photos, and turn the estimate into an invoice in one tap.',
      'The customer pays by card from the link or QR code, and BilltUp emails the receipt.',
    ],
    lineItems: ['Drain cleaning (main line)', '50-gallon water heater, installed', 'Shut-off valve replacement', 'Emergency call-out fee', 'Labor (per hour)'],
    faqs: [
      { q: 'Can I take a deposit for parts before starting a plumbing job?', a: 'Yes. Set a deposit on the invoice, send the deposit request, and BilltUp tracks the balance until the job is paid in full.' },
      { q: 'Do my customers need to download an app to pay?', a: 'No. They open the payment link or scan the QR code and pay in their browser by card, Apple Pay or Google Pay.' },
      { q: 'Who pays the card processing fee?', a: 'The processing fee is added to what your customer pays, so you receive the full invoice amount. Current rates are shown in the app before you turn payments on.' },
      { q: 'Does it work without cell signal?', a: 'Yes. You can create invoices and estimates offline; they sync automatically when you reconnect.' },
    ],
  },
  {
    slug: 'landscapers',
    name: 'Landscapers',
    metaTitle: 'Invoice App for Landscapers & Lawn Care | BilltUp',
    metaDescription:
      'Landscaping and lawn care invoice app: quote jobs on site, invoice customers from your phone, and get paid by card. Free 14-day trial, no card needed.',
    headline: 'The invoice app for landscapers and lawn care',
    intro:
      'Quote the patio while you are standing on the lawn, and invoice the mow before you load the trailer. BilltUp keeps your estimates, invoices and payments in your pocket, so the business side keeps up with the work.',
    painPoints: [
      { title: 'Too many small invoices', text: 'Weekly mows across dozens of yards add up to a pile of billing every Friday.' },
      { title: 'Customers who pay late', text: 'Chasing checks from last month\'s cleanup takes time away from this month\'s jobs.' },
      { title: 'Big projects need a quote first', text: 'Hardscaping and installs need a clear estimate before anyone agrees to start.' },
    ],
    features: [
      { title: 'Invoices in seconds', text: 'Your usual services, like mowing, edging and leaf cleanup, fill in from saved line items, so each invoice takes moments.' },
      { title: 'Estimates for bigger projects', text: 'Send a quote for the retaining wall or the spring cleanup; the customer approves it by email and it becomes the invoice.' },
      { title: 'Deposits for materials', text: 'Collect a deposit for mulch, stone and plants before you buy them.' },
      { title: 'Easy online payment', text: 'Customers pay from a link or QR code by card, Apple Pay or Google Pay, through your own Stripe or Square account.' },
      { title: 'See who owes you', text: 'Paid, pending and overdue invoices at a glance, with every customer\'s history in one place.' },
      { title: 'Before-and-after photos', text: 'Attach job photos to the invoice so customers see the work they\'re paying for.' },
    ],
    workflow: [
      'Walk the property and send an estimate from your phone.',
      'The customer approves by email; take a deposit for materials if needed.',
      'Do the work, add photos, and turn the estimate into an invoice.',
      'Your customer pays online, and you can see at a glance who is still outstanding.',
    ],
    lineItems: ['Weekly mowing and edging', 'Spring cleanup', 'Mulch, installed (per yard)', 'Hedge trimming', 'Paver patio installation'],
    faqs: [
      { q: 'Can I send invoices for regular weekly lawn service?', a: 'Yes. Save your regular services as line items so each week\'s invoice takes seconds, then send it by email with a payment link.' },
      { q: 'Can customers approve a landscaping estimate online?', a: 'Yes. They approve or decline from the estimate email, and you can turn an approved estimate into an invoice in one tap.' },
      { q: 'How do customers pay?', a: 'By card, Apple Pay or Google Pay from the payment link or QR code on the invoice, into your own Stripe or Square account.' },
      { q: 'How much does it cost?', a: 'Every feature is free for 14 days with no card needed. Then Basic is $4.99 a month (10 invoices and 10 estimates a month, 10 customers) or Premium is $9.99 a month for unlimited use.' },
    ],
  },
  {
    slug: 'mobile-detailers',
    name: 'Mobile Detailers',
    metaTitle: 'Invoice App for Mobile Detailers & Car Wash | BilltUp',
    metaDescription:
      'Invoice app for mobile auto detailing: send a professional invoice from the driveway and get paid by card, Apple Pay or Google Pay. Free 14-day trial.',
    headline: 'The invoice app for mobile detailers',
    intro:
      'Finish the ceramic coat, hand over a professional invoice, and get paid before you pack up. BilltUp is built for detailers who work out of a van, not an office.',
    painPoints: [
      { title: 'Cash and payment apps get messy', text: 'Payments scattered across cash, Venmo and Zelle make it hard to see what you earned.' },
      { title: 'Looking professional', text: 'A text that says "you owe $180" doesn\'t match the work you just did.' },
      { title: 'Packages and add-ons', text: 'Pet hair, headlights and coatings change the price on every car.' },
    ],
    features: [
      { title: 'Professional invoices', text: 'Your logo and colors on invoices and payment pages (Premium), with 15 invoice templates to choose from.' },
      { title: 'Paid before you leave', text: 'Customers scan the QR code and pay by card, Apple Pay or Google Pay through your Stripe or Square account.' },
      { title: 'Packages and add-ons', text: 'Save your packages and add-ons as line items and build each invoice in seconds, with discounts when you need them.' },
      { title: 'Estimates for big jobs', text: 'Quote paint correction or a coating; the customer approves by email and it becomes the invoice.' },
      { title: 'Before-and-after photos', text: 'Attach photos to the invoice so customers see the difference.' },
      { title: 'Know your numbers', text: 'Revenue trends and top customers in sales analytics (Premium).' },
    ],
    workflow: [
      'Book the job and send an estimate for any big add-ons.',
      'Do the detail and snap before-and-after photos.',
      'Build the invoice from your saved packages in seconds.',
      'Your customer scans the QR code and pays on the spot.',
    ],
    lineItems: ['Full interior and exterior detail', 'Ceramic coating (1-year)', 'Pet hair removal', 'Headlight restoration', 'Engine bay cleaning'],
    faqs: [
      { q: 'Can my customers pay with Apple Pay or Google Pay?', a: 'Yes. The payment page takes cards, Apple Pay and Google Pay, and Square payment pages also take Cash App Pay.' },
      { q: 'Can I put my logo on invoices?', a: 'Yes. With Premium, your logo and brand color appear on invoices, emails and payment pages.' },
      { q: 'Do I need a card reader?', a: 'No. Customers pay from their own phone using the payment link or QR code on the invoice.' },
      { q: 'Is there a free trial?', a: 'Yes. Try every feature free for 14 days, no card needed.' },
    ],
  },
  {
    slug: 'electricians',
    name: 'Electricians',
    metaTitle: 'Invoice App for Electricians: Estimates & Invoices | BilltUp',
    metaDescription:
      'Electrician invoice app: quote panel upgrades, collect deposits for materials, and send invoices customers pay by card. Free 14-day trial, no card needed.',
    headline: 'The invoice app for electricians',
    intro:
      'From a service call to a panel upgrade, BilltUp lets electricians quote, invoice and collect payment from their phone, with deposits for materials and the customer\'s signature on the work.',
    painPoints: [
      { title: 'Materials before payment', text: 'Panels, wire and fixtures cost money up front on bigger jobs.' },
      { title: 'Change orders', text: 'Extra outlets and fixtures added on site need to make it onto the bill.' },
      { title: 'Billing after hours', text: 'Writing up invoices at night delays payment and invites mistakes.' },
    ],
    features: [
      { title: 'Estimates for upgrades', text: 'Quote the panel upgrade or EV charger install; the customer approves by email, and it becomes the invoice in one tap.' },
      { title: 'Deposits for materials', text: 'Request a deposit before you order parts, then bill the balance at the end.' },
      { title: 'Customer signatures', text: 'Collect the customer\'s signature on the invoice when the work is done.' },
      { title: 'Edit before you send', text: 'Add the extra circuits or fixtures from the job, with tax worked out automatically.' },
      { title: 'Card payments', text: 'Customers pay by card, Apple Pay or Google Pay from a link or QR code, into your own Stripe or Square account.' },
      { title: 'Photos on the invoice', text: 'Attach photos of the finished work.' },
    ],
    workflow: [
      'Send an estimate for the job from your phone.',
      'The customer approves it; request a deposit for materials.',
      'Do the work, add any extras, photos and the customer\'s signature.',
      'Send the invoice and get paid by card.',
    ],
    lineItems: ['200-amp panel upgrade', 'EV charger installation (Level 2)', 'GFCI outlet, installed', 'Ceiling fan installation', 'Service call'],
    faqs: [
      { q: 'Can I collect a deposit before ordering materials?', a: 'Yes. Set a deposit on the invoice, send the request, and BilltUp tracks the remaining balance.' },
      { q: 'Can customers sign the invoice?', a: 'Yes. BilltUp can collect the customer\'s signature on the invoice.' },
      { q: 'Can I turn an estimate into an invoice?', a: 'Yes. Once your customer approves the estimate by email, one tap turns it into an invoice.' },
      { q: 'Does BilltUp work on iPhone and Android?', a: 'Yes. It\'s on the App Store and Google Play, and on the web at billtup.com.' },
    ],
  },
  {
    slug: 'small-business',
    name: 'Small Business',
    metaTitle: 'Simple Invoice App for Small Businesses | BilltUp',
    metaDescription:
      'Simple invoicing for small businesses: send invoices and estimates from your phone, accept card payments, and track who owes you. Free 14-day trial.',
    headline: 'Simple invoicing for small businesses',
    intro:
      'If you run a service business, BilltUp gives you professional invoices, estimates and card payments without accounting software you don\'t need. Bill from your phone, get paid faster, and see who still owes you.',
    painPoints: [
      { title: 'Accounting software is overkill', text: 'Most invoicing tools are built for accountants, not for people doing the work.' },
      { title: 'Chasing payments', text: 'Every unpaid invoice is a follow-up you have to remember.' },
      { title: 'Looking professional', text: 'Handwritten bills and texted totals undersell your business.' },
    ],
    features: [
      { title: 'Invoices and estimates', text: 'Send both from your phone, and turn approved estimates into invoices in one tap.' },
      { title: 'Card payments built in', text: 'Connect Stripe or Square; customers pay by card, Apple Pay or Google Pay from a link or QR code.' },
      { title: 'Customers keep the fee', text: 'The processing fee is added to what your customer pays, so you receive the full invoice amount.' },
      { title: 'Track what\'s owed', text: 'See paid, pending and overdue invoices at a glance, and each customer\'s history.' },
      { title: 'Your brand', text: 'Your logo and colors on invoices and payment pages (Premium).' },
      { title: 'Phone, tablet and web', text: 'Use BilltUp on iPhone, iPad, Android and at billtup.com.' },
    ],
    workflow: [
      'Add your business details and logo.',
      'Send an estimate or go straight to an invoice.',
      'Your customer pays online by card.',
      'BilltUp marks the invoice paid and emails the receipt.',
    ],
    lineItems: ['Consultation', 'Service visit', 'Materials', 'Labor (per hour)', 'Travel fee'],
    faqs: [
      { q: 'Is BilltUp accounting software?', a: 'No. BilltUp focuses on invoices, estimates and getting paid. It keeps your invoices, customers and payments organized without double-entry bookkeeping.' },
      { q: 'How much does BilltUp cost?', a: 'Every feature is free for 14 days with no card needed. Then Basic is $4.99 a month (10 invoices and 10 estimates a month, 10 customers) or Premium is $9.99 a month for unlimited invoices, estimates and customers.' },
      { q: 'Which payment processors does it work with?', a: 'Stripe and Square. You connect your own account, and payments go straight to it.' },
      { q: 'Can I use it on my computer too?', a: 'Yes. Sign in at billtup.com to use BilltUp in your browser, alongside the iPhone and Android apps.' },
    ],
  },
];

export function findTrade(slug: string): TradeContent | undefined {
  return TRADES.find((t) => t.slug === slug);
}
