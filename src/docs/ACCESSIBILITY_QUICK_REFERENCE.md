# Accessibility Quick Reference Card

**Quick guide for developers building accessible BilltUp components**

## 🎯 Golden Rules

1. **Keyboard First** - If you can't use it with keyboard alone, it's not accessible
2. **Semantic HTML** - Use the right element for the job (`<button>` not `<div>`)
3. **Labels Required** - Every form input needs a visible label
4. **Focus Visible** - Users must always see where they are
5. **Test Early** - Check accessibility as you build, not after

---

## 🏗️ Semantic HTML Cheat Sheet

### Use the Right Element

```tsx
// ✅ Good - Semantic HTML
<button onClick={handleClick}>Submit</button>
<a href="/about">About Us</a>
<nav>...</nav>
<main>...</main>
<header>...</header>
<footer>...</footer>

// ❌ Bad - Divs for everything
<div onClick={handleClick}>Submit</div>
<div onClick={() => navigate('/about')}>About Us</div>
```

### Heading Hierarchy

```tsx
// ✅ Good - Logical order
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

// ❌ Bad - Skipping levels
<h1>Page Title</h1>
  <h4>Section</h4> // Skipped h2 and h3
```

---

## 🎨 Essential ARIA Patterns

### Buttons

```tsx
// With visible text - no ARIA needed
<button onClick={handleSave}>Save</button>

// Icon only - needs label
<button onClick={handleClose} aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>

// Loading state
<button disabled={isLoading} aria-label={isLoading ? 'Saving...' : 'Save'}>
  {isLoading ? <Loader2 className="animate-spin" /> : 'Save'}
</button>

// Toggle button
<button 
  aria-pressed={isActive}
  onClick={toggle}
>
  {isActive ? 'Active' : 'Inactive'}
</button>
```

### Links

```tsx
// ✅ Good - Descriptive
<a href="/pricing">View Pricing Plans</a>

// ⚠️ Needs context
<a href="/pricing" aria-label="View BilltUp pricing plans">
  Learn More
</a>

// ❌ Bad - Not descriptive
<a href="/pricing">Click Here</a>

// Current page
<a href="/home" aria-current="page">Home</a>
```

### Form Fields

```tsx
// ✅ Complete pattern
<div className="space-y-2">
  <Label htmlFor="email-input">
    Email <span aria-label="required">*</span>
  </Label>
  <Input
    id="email-input"
    type="email"
    required
    aria-required="true"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
    autoComplete="email"
  />
  {error && (
    <span id="email-error" role="alert" className="text-red-500">
      {error}
    </span>
  )}
</div>

// ❌ Bad - No label association
<div>
  <span>Email</span>
  <input type="email" />
</div>
```

### Images

```tsx
// Informative image
<img src="chart.png" alt="Revenue growth chart showing 20% increase" />

// Decorative image
<img src="decoration.svg" alt="" aria-hidden="true" />

// Icon with adjacent text
<CheckCircle className="w-4 h-4" aria-hidden="true" />
<span>Verified</span>

// Icon only
<button aria-label="Delete">
  <Trash className="w-4 h-4" aria-hidden="true" />
</button>
```

### Modals

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle id="modal-title">
        Delete Customer
      </DialogTitle>
      <DialogDescription id="modal-description">
        Are you sure you want to delete this customer?
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>

// Automatically includes:
// - role="dialog"
// - aria-modal="true"
// - aria-labelledby="modal-title"
// - aria-describedby="modal-description"
// - Focus trap
// - Escape to close
```

### Navigation

```tsx
// Main navigation
<nav aria-label="Main navigation">
  <button 
    onClick={() => setPage('home')}
    aria-current={currentPage === 'home' ? 'page' : undefined}
  >
    Home
  </button>
</nav>

// Breadcrumbs
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/customers">Customers</a></li>
    <li aria-current="page">John Doe</li>
  </ol>
</nav>

// Tabs
<div role="tablist" aria-label="Dashboard sections">
  <button
    role="tab"
    aria-selected={activeTab === 'overview'}
    aria-controls="overview-panel"
    onClick={() => setActiveTab('overview')}
  >
    Overview
  </button>
</div>
<div
  id="overview-panel"
  role="tabpanel"
  aria-labelledby="overview-tab"
  hidden={activeTab !== 'overview'}
>
  {/* Content */}
</div>
```

### Lists

```tsx
// ✅ Semantic list
<ul role="list">
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>

// With description
<dl>
  <dt>Customer Name</dt>
  <dd>John Doe</dd>
  <dt>Email</dt>
  <dd>john@example.com</dd>
</dl>
```

### Status Messages

```tsx
// Success message (announced)
<div role="status" aria-live="polite">
  Customer created successfully!
</div>

// Error message (announced immediately)
<div role="alert" aria-live="assertive">
  Failed to save. Please try again.
</div>

// Loading state
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading data...' : 'Data loaded'}
</div>

// For screen readers only
<span className="sr-only" role="status">
  {isLoading && 'Loading customer data...'}
</span>
```

---

## ⌨️ Keyboard Navigation

### Common Patterns

```tsx
// Dropdown menu
<button
  onClick={toggle}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'Escape') {
      close();
    }
  }}
  aria-expanded={isOpen}
  aria-controls="menu-id"
>
  Menu
</button>

// Custom component with keyboard support
<div
  tabIndex={0}
  role="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

### Focus Management

```tsx
// Auto-focus first field in modal
import { useEffect, useRef } from 'react';

function MyModal() {
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstFieldRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Dialog>
      <Input ref={firstFieldRef} />
    </Dialog>
  );
}
```

### Skip Links

```tsx
// Add at top of page
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring"
>
  Skip to main content
</a>

// Add ID to main content
<main id="main-content">
  {/* Content */}
</main>
```

---

## 🎨 Visual Accessibility

### Color Contrast

```tsx
// ✅ Good - High contrast
<p className="text-gray-900 bg-white">Text</p>  // ~21:1 ratio
<button className="bg-[#1E3A8A] text-white">Click</button>  // ~8.6:1 ratio

// ⚠️ Check - May need adjustment
<p className="text-gray-400 bg-white">Text</p>  // ~2.8:1 ratio - TOO LOW

// Tool: Use WebAIM contrast checker
// https://webaim.org/resources/contrastchecker/
```

### Focus Indicators

```css
/* Already in globals.css */
*:focus-visible {
  ring-2 ring-ring ring-offset-2;
}

/* For custom styling */
.my-button:focus-visible {
  outline: 2px solid #14B8A6;
  outline-offset: 2px;
}
```

### Reduced Motion

```tsx
// Animations already respect prefers-reduced-motion
// But you can add specific handling:

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.3,
    // Respects user preference automatically
  }}
>
  Content
</motion.div>
```

---

## 🛠️ Helper Functions

### Using Accessibility Utils

```tsx
import { generateStableId, getFormFieldAria } from '@/utils/accessibility';

function MyComponent() {
  const fieldId = generateStableId('email', 'customer-form');
  const error = ''; // or actual error

  return (
    <div>
      <Label htmlFor={fieldId}>Email</Label>
      <Input
        {...getFormFieldAria(fieldId, error)}
        type="email"
      />
    </div>
  );
}
```

---

## ✅ Pre-Commit Checklist

Before committing new components:

### Keyboard Navigation
- [ ] Can Tab to all interactive elements?
- [ ] Tab order is logical?
- [ ] Can activate with Enter/Space?
- [ ] Can close modals with Escape?
- [ ] No keyboard traps?

### Screen Reader
- [ ] All images have alt text (or alt="")?
- [ ] All buttons have accessible names?
- [ ] All form inputs have labels?
- [ ] Icons are aria-hidden?
- [ ] Loading states announced?

### ARIA
- [ ] Used semantic HTML first?
- [ ] ARIA only where needed?
- [ ] IDs are unique?
- [ ] aria-label for icon buttons?
- [ ] aria-current for active items?

### Visual
- [ ] Focus indicators visible?
- [ ] Color contrast checked?
- [ ] Works at 200% zoom?
- [ ] Works with high contrast?

---

## 🔧 Testing Commands

```bash
# Run in browser console

# Find all elements without alt text
document.querySelectorAll('img:not([alt])')

# Find all buttons without accessible names
document.querySelectorAll('button:not([aria-label]):empty')

# Find all inputs without labels
document.querySelectorAll('input:not([aria-label]):not([id])')

# Find all focusable elements
document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
```

---

## 🚫 Common Mistakes

### Don't Do This

```tsx
// ❌ Div as button
<div onClick={handleClick}>Click me</div>

// ❌ Missing label
<input type="text" placeholder="Enter name" />

// ❌ Image without alt
<img src="logo.png" />

// ❌ Icon-only button without label
<button><X /></button>

// ❌ Color-only information
<span className="text-red-500">Error</span>

// ❌ Keyboard trap
<div onKeyDown={(e) => e.stopPropagation()}>
  <input />
</div>

// ❌ title instead of aria-label
<button title="Close">×</button>

// ❌ Non-unique IDs
<input id="name" />
<input id="name" />
```

### Do This Instead

```tsx
// ✅ Button element
<button onClick={handleClick}>Click me</button>

// ✅ Proper label
<Label htmlFor="name-input">Name</Label>
<input id="name-input" type="text" />

// ✅ Descriptive alt
<img src="logo.png" alt="BilltUp company logo" />

// ✅ Icon with label
<button aria-label="Close">
  <X aria-hidden="true" />
</button>

// ✅ Icon + text
<div className="text-red-500">
  <AlertCircle aria-hidden="true" />
  <span>Error: Invalid input</span>
</div>

// ✅ Proper focus management
<Dialog> {/* Handles focus trap */}
  <input />
</Dialog>

// ✅ aria-label for interactive elements
<button aria-label="Close">×</button>

// ✅ Unique IDs
<input id="customer-name" />
<input id="invoice-name" />
```

---

## 📚 Resources

### Internal Docs
- Full Guide: `/docs/ACCESSIBILITY.md`
- Testing: `/docs/ACCESSIBILITY_TESTING.md`
- Audit: `/docs/ACCESSIBILITY_AUDIT_SUMMARY.md`
- Utils: `/utils/accessibility.ts`

### External Links
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project](https://www.a11yproject.com/)

### Browser Extensions
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [HeadingsMap](https://chrome.google.com/webstore/detail/headingsmap)

### Testing Tools
- Keyboard: Your keyboard!
- Screen Reader: NVDA (Windows), VoiceOver (Mac)
- Contrast: WebAIM Contrast Checker
- Audit: Lighthouse (Chrome DevTools)

---

## 💡 Quick Tips

1. **Start with HTML** - Use semantic elements before adding ARIA
2. **Test with keyboard** - Tab through your component
3. **Use the utils** - We have helpers in `/utils/accessibility.ts`
4. **Check the examples** - Look at existing accessible components
5. **Run axe DevTools** - Catch issues before code review
6. **Ask for help** - Accessibility questions welcome!

---

## 🎯 Component Patterns

### Button Variants

```tsx
// Primary action
<button className="bg-primary text-white">Save</button>

// Icon only
<button aria-label="Delete customer">
  <Trash2 className="w-4 h-4" aria-hidden="true" />
</button>

// Icon + Text
<button>
  <Plus className="w-4 h-4" aria-hidden="true" />
  <span>Add Customer</span>
</button>

// Loading
<button disabled={isLoading}>
  {isLoading && <Loader2 className="animate-spin" aria-hidden="true" />}
  <span>{isLoading ? 'Saving...' : 'Save'}</span>
</button>
```

### Form Pattern

```tsx
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>Contact Information</legend>
    
    <div className="space-y-2">
      <Label htmlFor="email-input">
        Email <span aria-label="required">*</span>
      </Label>
      <Input
        id="email-input"
        type="email"
        required
        aria-required="true"
        autoComplete="email"
      />
    </div>
  </fieldset>

  <div className="flex gap-2">
    <Button type="button" onClick={onCancel}>Cancel</Button>
    <Button type="submit">Submit</Button>
  </div>
</form>
```

### Search Pattern

```tsx
<div className="relative">
  <Label htmlFor="search-input" className="sr-only">
    Search customers
  </Label>
  <Search className="absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
  <Input
    id="search-input"
    type="search"
    placeholder="Search customers..."
    aria-label="Search customers"
  />
</div>
```

---

**Remember:** When in doubt, test with a screen reader or keyboard! 🎯
