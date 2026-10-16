---
description: "Use when editing the DataCats React frontend: components, pages, Tailwind styling, theme, animations, forms, images. Covers design tokens, dark mode, hover bounce, and accessibility."
applyTo: "datacats-web/src/**"
---
# Frontend Guidelines

- Tailwind 3 syntax. Colors come from `tailwind.config.js`: `light.*`, `dark.*`, `brand.gold|amber|cyan`. Light accent is gold, dark accent is cyan, written as `text-brand-gold dark:text-brand-cyan`.
- Theme: class strategy through `ThemeProvider` and `useTheme()` (`src/components/layout/ThemeProvider.tsx`, `src/hooks/useTheme.ts`). Never keep separate theme state in a component.
- Logos and the hero GIF switch by theme through `Logo` and `useTheme()`. Dark theme assets live in `public/assets/img/darke-theme/` and carry a `-light` suffix.
- Hover bounce: every interactive element gets a slight bounce (scale about 1.02, up to 1.05 for buttons). Reuse the `interactive` and `hover-lift` classes and `ease-bounce` from `globals.css`; do not hand-roll transitions.
- Respect `prefers-reduced-motion`; `globals.css` already disables motion globally.
- Accessibility: every input has a `<label htmlFor>`, errors use `role="alert"` and `aria-describedby`, icon-only buttons have an `aria-label`, headings stay in order.
- Forms send data with `submitLead()` from `src/lib/submitLead.ts`; do not call `fetch` directly in pages. Keep the hidden `website` honeypot field.
- Import icon types with `import type { LucideIcon } from 'lucide-react'`; a value import breaks the Vite build.
- Routes: `/`, `/presentation`, `/penelope`, `/contact`. Use `Link` for internal navigation, not `<a href>`.
- Run `npm run build` and `npm run lint` after changes. Keep both clean.
