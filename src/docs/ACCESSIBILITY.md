# BilltUp Accessibility Documentation

## Overview

BilltUp is committed to providing an accessible experience for all users, including those who rely on assistive technologies such as screen readers, keyboard navigation, and other accessibility tools. This document outlines the accessibility features implemented across the platform.

## Table of Contents

- [WCAG Compliance](#wcag-compliance)
- [Implemented Features](#implemented-features)
- [Semantic HTML](#semantic-html)
- [ARIA Attributes](#aria-attributes)
- [Keyboard Navigation](#keyboard-navigation)
- [Screen Reader Support](#screen-reader-support)
- [Focus Management](#focus-management)
- [Testing Tools](#testing-tools)
- [Future Improvements](#future-improvements)

## WCAG Compliance

BilltUp aims to meet WCAG 2.1 Level AA standards. Key areas of focus include:

- **Perceivable**: Content is presented in ways users can perceive
- **Operable**: Interface components and navigation are operable
- **Understandable**: Information and operation of the interface are understandable
- **Robust**: Content works with current and future technologies

## Implemented Features

### 1. Skip Links

All pages include a "Skip to main content" link that appears on keyboard focus, allowing users to bypass repetitive navigation:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
>
  Skip to main content
</a>
```

### 2. Landmark Regions

Proper HTML5 semantic elements and ARIA landmarks are used throughout:

- `<header role="banner">` - Site header
- `<nav aria-label="Main navigation">` - Primary navigation
- `<main id="main-content" role="main">` - Main content
- `<footer role="contentinfo">` - Site footer
- `<nav aria-labelledby="heading-id">` - Section navigation

### 3. Heading Hierarchy

Proper heading structure (h1-h6) is maintained throughout the site:

- One `<h1>` per page identifying the main content
- Headings follow sequential order without skipping levels
- Headings have descriptive, unique IDs for navigation

### 4. Focus Indicators

Enhanced focus styles for keyboard navigation:

```css
*:focus-visible {
  @apply ring-2 ring-ring ring-offset-2 ring-offset-background;
}
```

All interactive elements have visible focus indicators with sufficient contrast.

### 5. Color Contrast

All text meets WCAG AA contrast requirements:

- Normal text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

### 6. Responsive Design

The site is fully responsive and works across all device sizes, with special considerations for:

- Touch target sizes (minimum 44x44px)
- Readable text sizes (minimum 16px base)
- Flexible layouts that adapt to zoom levels up to 200%

## Semantic HTML

### Proper Element Usage

- Buttons use `<button>` elements (not divs)
- Links use `<a>` elements with proper href attributes
- Forms use `<form>`, `<label>`, `<input>` elements
- Lists use `<ul>`, `<ol>`, `<li>` elements
- Tables use proper table markup when displaying tabular data

### Example Structure

```tsx
<nav aria-label="Main navigation">
  <ul role="list">
    <li>
      <button aria-current="page">Home</button>
    </li>
  </ul>
</nav>
```

## ARIA Attributes

### ARIA Labels

All interactive elements without visible text have descriptive labels:

```tsx
<button aria-label="Close menu">
  <X className="w-6 h-6" />
</button>
```

### ARIA Expanded

Toggle buttons indicate their state:

```tsx
<button 
  aria-expanded={isOpen}
  aria-controls="menu-id"
>
  Menu
</button>
```

### ARIA Current

Navigation items indicate the current page:

```tsx
<button aria-current={isActive ? 'page' : undefined}>
  Home
</button>
```

### ARIA Hidden

Decorative elements are hidden from screen readers:

```tsx
<CheckCircle className="w-5 h-5" aria-hidden="true" />
```

### ARIA Describedby

Form fields link to error and helper text:

```tsx
<input
  aria-describedby={error ? 'field-error' : 'field-description'}
  aria-invalid={!!error}
/>
```

## Keyboard Navigation

### Tab Order

All interactive elements are reachable via keyboard in a logical order.

### Keyboard Shortcuts

- `Tab` - Navigate forward through interactive elements
- `Shift + Tab` - Navigate backward
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and menus
- Arrow keys - Navigate within menus and select elements

### Focus Trapping

Modals and dialogs trap focus within themselves:

- Focus moves to the modal when opened
- Tab cycles through modal elements only
- Escape closes the modal and returns focus
- Focus returns to trigger element on close

## Screen Reader Support

### Testing Platforms

Tested with:

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS, iOS)
- TalkBack (Android)

### Screen Reader Only Text

Important context is provided for screen reader users:

```tsx
<span className="sr-only">Current page: </span>
<span>Home</span>
```

### Live Regions

Dynamic content updates are announced:

```tsx
<div role="status" aria-live="polite">
  Invoice created successfully
</div>
```

## Focus Management

### Visual Focus Indicators

All focusable elements have visible focus rings with proper contrast.

### Focus Order

Focus order follows the visual layout and reading order.

### Modal Focus

When modals open:
1. Focus moves to the first focusable element
2. Focus is trapped within the modal
3. Clicking outside or pressing Escape closes the modal
4. Focus returns to the trigger element

### Auto-focus

Auto-focus is used sparingly and only when it enhances UX:
- First field in forms
- Search inputs when search is activated
- First focusable element in modals

## Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## High Contrast Mode

Supports high contrast mode preferences:

```css
@media (prefers-contrast: high) {
  * {
    border-width: 2px;
  }
}
```

## Form Accessibility

### Labels

All form fields have associated labels:

```tsx
<label htmlFor="email-input">Email Address</label>
<input id="email-input" type="email" />
```

### Error Messages

Errors are clearly associated with fields:

```tsx
<input 
  id="email" 
  aria-invalid={!!error}
  aria-describedby="email-error"
/>
{error && (
  <span id="email-error" role="alert">
    {error}
  </span>
)}
```

### Required Fields

Required fields are clearly marked:

```tsx
<label>
  Email <span aria-label="required">*</span>
</label>
<input required aria-required="true" />
```

## Testing Tools

### Recommended Tools

- **axe DevTools** - Browser extension for accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Chrome DevTools accessibility audit
- **Screen readers** - NVDA, JAWS, VoiceOver
- **Keyboard only** - Navigate without a mouse

### Manual Testing Checklist

- [ ] All functionality available via keyboard
- [ ] Focus indicators visible on all interactive elements
- [ ] Skip link works correctly
- [ ] Heading structure is logical
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Error messages are accessible
- [ ] Color is not the only means of conveying information
- [ ] Text can be resized to 200% without loss of functionality
- [ ] Content reflows at 320px viewport width

## Component-Specific Accessibility

### Modals/Dialogs

- Uses `role="dialog"`
- Has `aria-modal="true"`
- Has `aria-labelledby` pointing to title
- Has `aria-describedby` pointing to description
- Traps focus within modal
- Closes on Escape key
- Returns focus to trigger on close

### Menus

- Uses proper ARIA menu patterns
- Keyboard navigable with arrow keys
- Has `aria-expanded` on trigger
- Has `aria-controls` linking to menu
- Has `aria-haspopup="true"` where appropriate

### Tabs

- Uses `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Has `aria-selected` on active tab
- Has `aria-controls` linking tab to panel
- Keyboard navigable with arrow keys
- Tab panels have `aria-labelledby` linking to tab

### Tables

- Has proper `<thead>`, `<tbody>`, `<th>` structure
- Headers have `scope` attribute
- Complex tables have `<caption>`
- Has `aria-label` or `aria-labelledby` for context

## Image Accessibility

### Decorative Images

Decorative images are hidden from screen readers:

```tsx
<img src="decoration.svg" alt="" aria-hidden="true" />
```

### Informative Images

Informative images have descriptive alt text:

```tsx
<img src="chart.png" alt="Revenue chart showing 20% growth" />
```

### Complex Images

Complex images have extended descriptions:

```tsx
<figure>
  <img src="complex-chart.png" alt="Quarterly sales data" />
  <figcaption id="chart-desc">
    Detailed description of the chart data...
  </figcaption>
</figure>
```

## Future Improvements

### Planned Enhancements

1. **Automated Testing** - Integrate axe-core into CI/CD pipeline
2. **User Testing** - Conduct testing with users who rely on assistive technologies
3. **ARIA Live Regions** - Add more dynamic content announcements
4. **Custom Components** - Audit and improve custom component accessibility
5. **Documentation** - Expand component-specific accessibility documentation
6. **Training** - Provide accessibility training for development team

### Known Issues

Currently tracking accessibility issues in our issue tracker. See the "accessibility" label for current issues and roadmap.

## Resources

### Internal

- [Accessibility Utilities](/utils/accessibility.ts) - Helper functions for generating IDs and ARIA attributes
- [Global Styles](/styles/globals.css) - Accessibility CSS utilities

### External

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

## Contact

For accessibility concerns or suggestions, please contact:
- Email: accessibility@billtup.com
- Create an issue in our repository with the "accessibility" label

## Version History

- **v1.0** (Current) - Initial accessibility implementation
  - Skip links
  - ARIA landmarks
  - Keyboard navigation
  - Focus management
  - Screen reader support
  - Reduced motion support
  - High contrast mode support
