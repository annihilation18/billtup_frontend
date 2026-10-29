# Accessibility

Our goal is WCAG 2.1 Level AA. The site has not had a formal audit, so we do not claim it meets that level. This page lists what the code does today and how to test it.

## What the site does

### Structure

- `index.html` sets `lang="en"`.
- Public pages have a "Skip to main content" link that jumps to `<main id="main-content">` (`src/App.tsx`).
- The dashboard has a "Skip to dashboard content" link that jumps to `#dashboard-main-content` (`DashboardSection.tsx`).
- Pages use `header`, `nav` (with `aria-label`), `main`, and `footer` landmarks.

### Navigation

- The site header and the dashboard navigation mark the current page with `aria-current="page"`.
- Mobile menu buttons have `aria-label`, `aria-expanded`, and `aria-controls`.
- Premium-only dashboard tabs are disabled for Basic accounts. They have `aria-disabled` and say "(Premium only)" in their label.

### Dialogs, menus, and form controls

- Dialogs, dropdown menus, tabs, selects, switches, and checkboxes come from Radix UI (through `src/components/ui/`). Radix handles keyboard use, focus trapping in dialogs, focus return on close, and the matching ARIA roles.
- Form fields on sign-in and sign-up use `<label>` elements.

### Status and alerts

- The "free trial has ended" banner has `role="alert"`.
- Plan badges have `role="status"` and an `aria-label` with the plan name.
- Toasts come from Sonner, which announces them to screen readers.
- Decorative icons have `aria-hidden="true"`.

### Visual

- Keyboard focus shows a visible ring (`:focus-visible` in `src/index.css`).
- `prefers-reduced-motion: reduce` turns transitions and animations down to near zero.
- `prefers-contrast: high` makes borders thicker.

## Known gaps

- The customer pages (`/pay`, `/estimate`, `/sign`) have no ARIA attributes. They rely on plain HTML. The signature canvas on `/sign` cannot be used with a keyboard.
- Not every image and icon-only button has been checked for a text alternative.
- Color contrast has not been measured across all pages.
- `src/utils/accessibility.ts` and `src/styles/globals.css` contain helpers that nothing imports.

## How to test

Run these before a release that changes the UI.

### Automated

- Run Lighthouse (Chrome DevTools → Lighthouse → Accessibility) on the home page, `/pricing`, `/signup`, `/signin`, `/dashboard`, and a `/pay/<token>` page.
- Or install the axe DevTools browser extension and scan the same pages.

Fix anything rated serious or critical.

### Keyboard

- Use only Tab, Shift+Tab, Enter, Space, the arrow keys, and Esc.
- The first Tab on a page shows the skip link, and Enter on it moves focus to the main content.
- Every link, button, and field can be reached and used, in a sensible order.
- Focus is always visible.
- Dialogs keep focus inside, close with Esc, and return focus to the button that opened them.

### Screen reader

Use NVDA (Windows), VoiceOver (macOS or iOS), or TalkBack (Android).

- Page landmarks and headings make sense when listed.
- Buttons and links say what they do.
- Form errors and toasts are read out.
- The trial banner and plan badge are read.

### Visual

- Zoom to 200%. Nothing is cut off and there is no sideways scrolling at phone width.
- Turn on "reduce motion" in the OS. Animations stop.

## Reporting a problem

Email support@billtup.com with the page, what you expected, what happened, and the browser and assistive technology you used.
