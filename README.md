# Forge UI

**Open source UI kit for any backend — accessible by default, free forever.**

Professional-grade UI components that drop into Django, Rails, Laravel, Spring, or plain HTML with two files and a script tag. No build step. No framework dependency. No invoice.

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Version](https://img.shields.io/badge/version-1.0.0-black.svg)](https://github.com/jlogan839-forge/forge-ui/releases)

---

## Why Forge

Small businesses and independent developers deserve the same quality UI as Fortune 500 companies. Enterprise software vendors charge hundreds of thousands of dollars a year for components that are slow, inaccessible, and ugly. Forge is the alternative — MIT licensed, built in public, free forever.

- **Zero dependencies** — two files, one script tag, works anywhere
- **WCAG 2.1 AA** — accessibility baked into every component, not bolted on
- **Any backend** — Django, Rails, Laravel, Spring, ASP.NET, plain HTML
- **Token-based theming** — override one CSS variable to re-brand everything
- **Dark mode** — automatic, no JavaScript required
- **MIT licensed** — use it commercially, white-label it, modify everything

---

## Quick start

### Via npm
\`\`\`bash
npm install @jlogan839-forge/forge-ui
\`\`\`

### Via CDN / direct download
\`\`\`html
<link rel="stylesheet" href="forge-ui-kit.css">
<script src="forge-ui-kit.js"></script>
\`\`\`

[Download the latest release →](https://github.com/jlogan839-forge/forge-ui/releases)

---

## Components

### Buttons
```html
<button class="ui-btn ui-btn-primary">Primary</button>
<button class="ui-btn ui-btn-accent">Accent</button>
<button class="ui-btn ui-btn-ghost">Ghost</button>
<button class="ui-btn ui-btn-danger">Danger</button>
<button class="ui-btn ui-btn-sm">Small</button>
<button class="ui-btn ui-btn-lg">Large</button>
<button class="ui-btn ui-btn-icon" aria-label="Search">...</button>
```

### Inputs
```html
<div class="ui-field">
  <label class="ui-label" for="email">
    Email <span class="required" aria-hidden="true">*</span>
  </label>
  <input class="ui-input" id="email" type="email"
         required aria-required="true">
  <span class="ui-helper">We'll never share your email</span>
</div>
```

### Select
```html
<div class="ui-select-wrap">
  <select class="ui-select">
    <option>Select a role...</option>
    <option>Admin</option>
    <option>Editor</option>
  </select>
  <svg class="ui-select-arrow" ...></svg>
</div>
```

### Toggle
```html
<div class="ui-toggle-wrap" role="switch" aria-checked="false"
     tabindex="0" aria-label="Email notifications">
  <div class="ui-toggle-track"><div class="ui-toggle-knob"></div></div>
  <span>Email notifications</span>
</div>
```

### Badge
```html
<span class="ui-badge ui-badge-success">Active</span>
<span class="ui-badge ui-badge-warn">Pending</span>
<span class="ui-badge ui-badge-danger">Error</span>
```

### Alert
```html
<div class="ui-alert ui-alert-success" role="status" aria-live="polite">
  <span class="ui-alert-icon" aria-hidden="true">✓</span>
  <div class="ui-alert-body">
    <div class="ui-alert-title">Saved</div>
    <div class="ui-alert-desc">Your changes have been published.</div>
  </div>
  <button class="ui-alert-close" aria-label="Dismiss">✕</button>
</div>
```

### Card
```html
<article class="ui-card" aria-labelledby="card-title">
  <div class="ui-card-header">
    <div class="ui-card-title" id="card-title">Project name</div>
    <span class="ui-badge ui-badge-success">Active</span>
  </div>
  <div class="ui-card-body">Content here.</div>
  <div class="ui-card-footer">
    <button class="ui-btn ui-btn-sm ui-btn-ghost">View</button>
    <button class="ui-btn ui-btn-sm ui-btn-primary">Edit</button>
  </div>
</article>
```

### Modal
```html
<!-- Trigger -->
<button class="ui-btn" data-ui-open="#my-modal">Open</button>

<!-- Modal -->
<div class="ui-modal-backdrop" id="my-modal"
     role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="ui-modal">
    <div class="ui-modal-header">
      <div class="ui-modal-title" id="modal-title">Title</div>
      <button class="ui-modal-close" data-ui-close aria-label="Close">✕</button>
    </div>
    <div class="ui-modal-body">Content here.</div>
    <div class="ui-modal-footer">
      <button class="ui-btn ui-btn-ghost" data-ui-close>Cancel</button>
      <button class="ui-btn ui-btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## Surface utilities

Apply to any section to guarantee accessible contrast for all child elements automatically. No manual color overrides needed.

```html
<section class="forge-surface-dark">
  <!-- All text, borders, buttons flip to light-on-dark automatically -->
</section>

<section class="forge-surface-light">
  <!-- Warm off-white background, dark text -->
</section>

<section class="forge-surface-accent">
  <!-- Forge red background, off-white text -->
</section>
```

Available surfaces: `forge-surface-dark`, `forge-surface-charcoal`, `forge-surface-light`, `forge-surface-white`, `forge-surface-accent`

---

## Theming

All values are CSS custom properties. Override on `:root` or any parent element to re-brand without touching component code.

```css
:root {
  /* Swap the accent color */
  --forge-red:   #0066cc;
  --forge-ember: #0080ff;
  --forge-tint:  #e6f0ff;
  --forge-deep:  #003d7a;

  /* Swap the neutral scale */
  --forge-black:    #0f0f0f;
  --forge-offwhite: #f8f8f8;

  /* Swap the fonts */
  --forge-font-display: "Your Display Font", serif;
  --forge-font-body:    "Your Body Font", sans-serif;
}
```

---

## JavaScript API

```js
// Re-initialize after dynamic DOM changes
UIKit.init();

// Button loading states
UIKit.Button.startLoading(btn, 'Saving…');
UIKit.Button.stopLoading(btn);

// Input validation
UIKit.Input.setError(input, 'Enter a valid email address');
UIKit.Input.clearError(input);

// Character counter
UIKit.Input.charCounter(textareaEl, counterEl, 500);

// Password visibility toggle
UIKit.Input.togglePassword(inputEl, toggleBtnEl);

// Toggle switch
UIKit.Toggle.toggle(wrapEl);
UIKit.Toggle.set(wrapEl, true);

// Alerts
UIKit.Alert.show(containerEl, {
  type: 'success',      // 'info' | 'success' | 'warn' | 'danger'
  title: 'Saved',
  desc: 'Changes published.',
  dismissible: true
});

// Modal
UIKit.Modal.open('modal-id');
UIKit.Modal.close('modal-id');
```

### Declarative HTML attributes

Wire behaviors without writing JavaScript:

```html
<!-- Open a modal -->
<button data-ui-open="#my-modal">Open</button>

<!-- Close from inside a modal -->
<button data-ui-close>Cancel</button>

<!-- Character counter -->
<textarea data-ui-counter="#counter" data-ui-max="500"></textarea>
<span id="counter"></span>

<!-- Password toggle -->
<input id="pw" type="password" data-ui-toggle-pass="#pw">
<button data-ui-toggle-pass="#pw">Show</button>
```

---

## Accessibility

Every component is built accessibility-first, not accessibility-patched.

| Feature | Implementation |
|---|---|
| WCAG 2.1 AA contrast | CSS variables calibrated for 4.5:1 minimum ratio |
| Keyboard navigation | Tab, Shift+Tab, Enter, Space, Escape wired on all components |
| Focus management | Modals trap focus and return it on close |
| ARIA | `role`, `aria-modal`, `aria-live`, `aria-busy`, `aria-required`, `aria-invalid` |
| Semantic HTML | `<button>`, `<label>`, `<fieldset>`, `<legend>` — no div soup |
| Visible focus rings | `:focus-visible` rings, never suppressed without replacement |
| Reduced motion | All animations wrapped in `prefers-reduced-motion: reduce` |
| Live regions | Alerts announced via `aria-live`, errors via `role="alert"` |

---

## Roadmap

Forge is built in layers. The Core Kit is the foundation — domain modules build on top of it using the same tokens and patterns.

| Module | Status | Covers |
|---|---|---|
| Core UI Kit | ✅ Available | Buttons, inputs, cards, modals, badges, alerts |
| SCM | ✅ Available | Purchase orders, supplier cards, shipment tracking |
| Finance | 🔜 Coming soon | Invoices, approval workflows, budget dashboards |
| CRM | 🔜 Coming soon | Contact cards, pipeline boards, activity timelines |
| HR | 📋 Planned | Employee profiles, org charts, leave requests |
| Projects | 📋 Planned | Gantt views, milestones, resource allocation |
| Analytics | 📋 Planned | KPI dashboards, chart wrappers, data tables |

Want to build a module? [Open a discussion →](https://github.com/jlogan839-forge/forge-ui/discussions)

---
## SCM Module — available now

[Live demo →](https://jlogan839-forge.github.io/forge-ui/ui-scm-demo.html)

Purchase orders, supplier cards, shipment tracking, inventory tables,
and approval flows. Free, MIT licensed, works with any backend.

\`\`\`html
<link rel="stylesheet" href="forge-ui-kit.css">
<link rel="stylesheet" href="ui-scm.css">
<script src="forge-ui-kit.js"></script>
<script src="ui-scm.js"></script>
\`\`\`

Or via npm:
\`\`\`bash
npm install @jlogan839-forge/forge-ui
\`\`\`
---

## Contributing

Forge is built in public. Every component, every fix, every module happens here on GitHub.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-component`
3. Make your changes
4. Open a pull request with a clear description

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

All contributions must:
- Pass WCAG 2.1 AA contrast requirements
- Work without JavaScript where possible
- Include proper ARIA attributes
- Use existing CSS tokens — no hardcoded hex values in components

---

## License

MIT — use it commercially, white-label it, modify everything.  
See [LICENSE](LICENSE) for the full text.

---

## Links

- [Website](https://jlogan839-forge.github.io/forge-ui)
- [Manifesto](https://jlogan839-forge.github.io/forge-ui/manifesto.html)
- [Docs](https://jlogan839-forge.github.io/forge-ui/docs.html)

---

*Built for small businesses. Free forever. No invoice required.*
