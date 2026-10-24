# Current Work Log - DataCats Website

**Last Updated:** 2026-10-23

## Status

The site and lead backend run locally and are deployed to Namecheap cPanel via GitHub Actions on push to `origin/main` (commit `8594f0f`).

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Project foundation | Done | `datacats-web/` (Vite, React, TS, Tailwind 3); backend in `server/` |
| 2. Asset integration | Done | Logos and hero GIF switch by theme (`public/assets/img/`); `.gitignore` fixed so `public/assets/` is tracked; the `.mp4` is unused |
| 3. Core components | Done | Theme provider, Button, Card, Badge, Logo, Navbar, Footer |
| 4. Pages | Done | Home, Solutions, Penelope, Contact; gallery uses placeholder tiles |
| 5. Styling and animation | Done | Hover bounce, framer-motion, reduced-motion support |
| 6. Accessibility and SEO | Partial | Skip link, labels, aria on forms, page meta; no structured data |
| 7. Testing and QA | Partial | Backend tests pass; manual theme and form checks; no Lighthouse or cross-browser run |
| 8. Deployment | Done | Automated GitHub Actions SSH deploy (`.github/workflows/deploy.yml`) to Namecheap cPanel Node.js 24 app |

## Open Items

- Rotate exposed credentials: the Microsoft client secret, the 9Router key, and the Gemini key from VS Code settings.
- Set `TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`, `MAIL_FROM` in cPanel; grant `Mail.Send` consent; restrict the app to one mailbox; send a real test lead.
- AI chat bot on the contact page: needs an LLM provider and key decision.
- Replace gallery placeholders with real report screenshots.
- Run Lighthouse and check Safari and Firefox.

## Key Decisions

- React, Vite, TypeScript, Tailwind 3, framer-motion, lucide-react, react-router.
- Class-based dark mode with localStorage persistence, defaulting to the OS preference.
- Leads are emailed to `josh@datacats.ca` through Microsoft Graph app-only auth (client credentials) from an Express backend; no redirect URI is needed.
- Hosting on Namecheap shared hosting with a cPanel Node.js app, which also serves the built site.
- Model selection is manual; see `.github/agents/builder-agent.agent.md`.

## History

- 2026-10-15: planning session, implementation plan, asset review.
- 2026-10-16: built the site, theme system and forms; added the Node lead backend and tests; consolidated project docs and customization files under `.github/` and `docs/`.
- 2026-10-23: installed frontend (`datacats-web/`) and backend (`server/`) dependencies; verified lint, production build, and backend tests; copied brand assets from `assets/img/` to `datacats-web/public/assets/img/` and anchored `/assets/` in `datacats-web/.gitignore` so `public/assets/` is not ignored; started local Vite dev server and dry-run Express backend; added `.github/workflows/deploy.yml` for automated GitHub Actions deployment to Namecheap cPanel over SSH; added `.version` (`VERSION=1.0`) and automatic CI/CD deployment version bumping displayed in `Footer.tsx`.
