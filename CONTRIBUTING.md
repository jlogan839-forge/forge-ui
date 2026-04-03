# Contributing to Forge UI

First, thank you. Every contribution makes Forge more useful for every small business that deserves better software and can't afford to wait for it.

Forge is built in public. Every component, every module, every fix happens here on GitHub. There are no private roadmaps, no closed betas, no features reserved for paying customers.

---

## Ways to contribute

You don't need to write code to contribute. Here are all the ways you can help:

- **Fix a bug:** open an issue or submit a PR
- **Improve a component:** better accessibility, better mobile support, better dark mode
- **Build a module:** SCM, Finance, CRM, HR, Projects, Analytics, all open
- **Write docs:** the documentation page is coming and needs writers
- **Add framework guides:** Django, Rails, Laravel, Spring, ASP.NET examples
- **Report accessibility issues:** if something fails WCAG, that's a priority bug
- **Translate:** help make Forge accessible to non-English speaking developers
- **Star the repo:** signals credibility to other developers finding Forge for the first time

---

## Before you start

**Check existing issues and PRs** before opening a new one. Someone may already be working on the same thing.

**Open an issue first** for any significant change: new component, new module, breaking change. A quick discussion saves everyone time before code is written.

**Small fixes** (typos, contrast issues, minor bugs) can go straight to a PR without an issue.

---

## Development setup

Forge has no build step. That's intentional.

```bash
# Clone the repo
git clone https://github.com/jlogan839-forge/forge-ui.git
cd forge-ui

# Open in your editor
code .

# Open index.html with Live Server in VS Code
# or just open it directly in your browser
open index.html
```

No build step. No compilation. Open the file, make a change, refresh the browser. 
Forge is on npm for easy installation, but development requires nothing more than a browser.

---

## Component requirements

Every component or change must meet these standards before it will be merged:

### Accessibility (non-negotiable)
- WCAG 2.1 AA contrast ratio minimum (4.5:1 for text, 3:1 for UI components)
- Keyboard navigable: Tab, Shift+Tab, Enter, Space, Escape where applicable
- Correct ARIA roles, states, and properties
- Semantic HTML: `<button>` not `<div onclick>`, `<label>` not placeholder-only
- Visible focus indicators: never `outline: none` without a replacement
- Works with a screen reader (test with VoiceOver on Mac or NVDA on Windows)
- Respects `prefers-reduced-motion`

### CSS tokens (required)
- No hardcoded hex values in component styles
- Use existing `--forge-*` or `--color-*` custom properties
- Dark mode must work automatically via the token system
- Add new tokens to `:root` in `forge-ui-kit.css` if needed, and document them

### Naming conventions
- Core Kit classes: `.ui-{component}` e.g. `.ui-btn`, `.ui-input`, `.ui-card`
- SCM module classes: `.scm-{component}` e.g. `.scm-po`, `.scm-supplier`
- Finance module: `.fin-{component}`
- CRM module: `.crm-{component}`
- HR module: `.hr-{component}`
- No single-letter class names, no camelCase, no BEM

### JavaScript
- No dependencies: vanilla JS only
- Support CommonJS, AMD, and browser globals (see `forge-ui-kit.js` for the pattern)
- Auto-initialize from declarative HTML attributes where possible
- Emit custom DOM events so frameworks can listen without coupling

### Mobile
- All components must work at 375px viewport width minimum
- Test in Chrome DevTools device toolbar before submitting

---

## Module contributions

Building a domain module is the highest-impact contribution you can make.

A module is a separate CSS + JS file pair that builds on the Core Kit:

```
ui-{module}.css   ← component styles, inherits Core Kit tokens
ui-{module}.js    ← interactive behaviors, requires forge-ui-kit.js
ui-{module}-demo.html  ← realistic demo with fake data
```

**Before building a module:**
1. Open a GitHub Discussion with your module proposal
2. Describe what business problem it solves and who uses it
3. List the components you plan to build
4. Get feedback before writing code. Scope creep is the #1 reason modules stall

**Module standards:**
- All classes namespaced to the module (`.scm-*`, `.fin-*` etc.)
- Full status token system, at minimum: draft, pending, approved, cancelled
- Mobile responsive
- Dark mode automatic via inherited tokens
- Demo page with realistic fake data showing a full workflow

---

## Pull request process

1. **Fork** the repo and create a branch:
   ```bash
   git checkout -b feat/your-component-name
   ```

2. **Make your changes:** keep commits focused and descriptive

3. **Test manually:**
   - Open in Chrome, Firefox, and Safari
   - Test keyboard navigation
   - Test in Chrome DevTools mobile view (375px)
   - Toggle dark mode and verify everything renders correctly
   - Run a Lighthouse accessibility audit, aim for 100

4. **Open a PR** with:
   - A clear title: `feat: add ui-tooltip component` or `fix: modal focus trap on iOS`
   - What the change does and why
   - Screenshots or a screen recording for visual changes
   - Notes on any accessibility testing you did

5. **One PR per concern:** don't bundle unrelated changes

---

## Reporting bugs

Open a GitHub Issue with:

- **What happened:** describe the bug
- **What you expected:** what should have happened
- **How to reproduce:** steps, or a minimal code example
- **Environment:** browser, OS, screen reader if relevant

**Accessibility bugs are priority.** Label them `a11y` and they'll be treated as blockers.

---

## Reporting accessibility issues

If you find a component that fails WCAG 2.1 AA (contrast, keyboard, screen reader, anything) please open an issue immediately with the `a11y` label.

Forge's entire value proposition is built on accessibility. A failing component is a broken promise. These get fixed before anything else.

---

## Code of conduct

Forge is for everyone. Contributors of all backgrounds, experience levels, and locations are welcome.

Be kind. Be constructive. Assume good intent. Focus on the code, not the person.

Harassment, discrimination, or exclusionary behavior of any kind will not be tolerated.

---

## Questions?

Open a [GitHub Discussion](https://github.com/jlogan839-forge/forge-ui/discussions). That's the best place for questions, ideas, and module proposals.

---

*Forge UI · MIT License · Built for small businesses · Free forever*
