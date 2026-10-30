# Current Work Log - DataCats Website

**Last Updated:** 2026-10-30

## Status

The site and lead backend run locally and are deployed to Namecheap cPanel via GitHub Actions on push to `origin/main`.

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Project foundation | Done | `datacats-web/` (Vite, React, TS, Tailwind 3); backend in `server/` |
| 2. Asset integration | Done | Logos (including inverted text logo per theme), hero GIF, and all 6 report sample slots switch by theme (`public/assets/img/`); `.gitignore` fixed so `public/assets/` is tracked; the `.mp4` is unused |
| 3. Core components | Done | Theme provider, Button, Card, Badge, Logo, Navbar (cat icon + text logo), Footer |
| 4. Pages | Done | Home, Solutions, Penelope, Contact; all 6 gallery slots use DataCats-branded light/dark report screenshots with fixed 16:9 zoom frame |
| 5. Styling and animation | Done | Hover bounce, framer-motion, reduced-motion support |
| 6. Accessibility, SEO, and Analytics | Partial | Skip link, labels, aria on forms, page meta, GA4 (`G-WHJLEG19K8`) via `react-ga4` with SPA route tracking; no structured data |
| 7. Testing and QA | Partial | Backend tests pass; manual theme and form checks; GA4 network collect verified; no Lighthouse or cross-browser run |
| 8. Deployment | Done | Automated GitHub Actions SSH deploy (`.github/workflows/deploy.yml`) to Namecheap cPanel Node.js 24 app |

## Open Items

- Rotate exposed credentials: the Microsoft client secret, the 9Router key, and the Gemini key from VS Code settings.
- Set `TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`, `MAIL_FROM` in cPanel; grant `Mail.Send` consent; restrict the app to one mailbox; send a real test lead.
- AI chat bot on the contact page: needs an LLM provider and key decision.
- Run Lighthouse and check Safari and Firefox.

## Key Decisions

- React, Vite, TypeScript, Tailwind 3, framer-motion, lucide-react, react-router, react-ga4.
- Class-based dark mode with localStorage persistence, defaulting to the OS preference.
- Google Analytics 4 (`G-WHJLEG19K8`) initialized in `datacats-web/src/main.tsx` with `RouteTracker` in `datacats-web/src/App.tsx` firing `pageview` hits on SPA route changes.
- Leads are emailed to `josh@datacats.ca` through Microsoft Graph app-only auth (client credentials) from an Express backend; no redirect URI is needed.
- Hosting on Namecheap shared hosting with a cPanel Node.js app, which also serves the built site.
- Model selection is manual; see `.github/agents/builder-agent.agent.md`.

## History

- 2026-10-15: planning session, implementation plan, asset review.
- 2026-10-16: built the site, theme system and forms; added the Node lead backend and tests; consolidated project docs and customization files under `.github/` and `docs/`.
- 2026-10-23: installed frontend (`datacats-web/`) and backend (`server/`) dependencies; verified lint, production build, and backend tests; copied brand assets from `assets/img/` to `datacats-web/public/assets/img/` and anchored `/assets/` in `datacats-web/.gitignore` so `public/assets/` is not ignored; started local Vite dev server and dry-run Express backend; added `.github/workflows/deploy.yml` for automated GitHub Actions deployment to Namecheap cPanel over SSH; added `.version` (`VERSION=1.0`) and automatic CI/CD deployment version bumping displayed in `Footer.tsx`.
- 2026-10-24: copied light/dark Power BI sample screenshots (`light-sample1.png`, `dark-sample1.png`) into `datacats-web/public/assets/img/samples/`; updated `Presentation.tsx` so report samples default to opposite contrast (dark reports in light site theme, light reports in dark site theme), added a section-level report theme toggle under "Report Samples" (`Use the theme switcher to preview light/dark versions of the reports.`) that switches all reports, added a temporary modal-only theme toggle (`View Light Version` / `View Dark Version`) inside the zoomed-in report preview, and documented the workflow in `docs/report-samples-workflow.md`.
- 2026-10-25: verified Microsoft Graph `Mail.Send` credentials against `josh@datacats.ca`; hardened `server/src/graph.js`, `server/src/app.js`, and `server/app.js` to accept both `UPPER_SNAKE_CASE` and camelCase env vars (`TENANT_ID`/`tenantId`, `CLIENT_ID`/`clientId`, `CLIENT_SECRET`/`clientSecret`, `MAIL_FROM`/`mailFrom`), strip accidental quotes/commas, default `MAIL_FROM` to `josh@datacats.ca`, allow both `datacats.ca` and `www.datacats.ca` in `ALLOWED_ORIGIN`, and report `mailConfigured` in `/api/health`; added second Power BI sample report screenshots (`light-sample2.png`, `dark-sample2.png`) to the bottom-center `Client Journey` gallery slot in `Presentation.tsx`.
- 2026-10-27: added Tableau samples (`light/dark-sample3.png` → slot 2 `Sales Pipeline`, `light/dark-sample4.png` → slot 6 `Utilization Heatmap`) and Excel sample (`light/dark-sample5.png` → slot 3 `Financial Workbook`); renamed from `*-tableu-*`/`*-excel-*` source names to the `sample<N>` convention and copied to `datacats-web/public/assets/img/samples/`.
- 2026-10-27: built an original BigQuery-style "Warehouse Metrics" mock dashboard (light/dark, 2400x1350) and added it as `light/dark-sample6.png` in slot 4.
- 2026-10-27: replaced the Tableau samples (`light/dark-sample3.png`, `light/dark-sample4.png`) with original DataCats-branded mock dashboards (Sales Pipeline Command Center, Utilization Heatmap; 2400x1350, 16/9 frame); removed the old `*-tableu-*` sources.
- 2026-10-27: replaced Power BI (`sample1`, `sample2`) and Excel (`sample5`) screenshots with original DataCats-branded mocks that keep each app's chrome (Power BI Desktop canvas/page tabs, Excel ribbon/formula bar/grid); all 6 samples now use a 16/9 frame.
- 2026-10-27: re-rendered the BigQuery sample (`light/dark-sample6.png`) with DataCats branding (logo header band, gold/cyan palette, Inter/JetBrains Mono).
- 2026-10-27: replaced text logos with `logo-text-dark.svg` (used in light theme) and `logo-text-light.svg` (used in dark theme) in `Logo.tsx`, and updated `Navbar.tsx` to display the cat icon + text logo side by side.
- 2026-10-30: integrated Google Analytics 4 (`G-WHJLEG19K8`) via `react-ga4` in `datacats-web/src/main.tsx` and added SPA route-change pageview tracking (`RouteTracker`) in `datacats-web/src/App.tsx`; updated `docs/ga4_react_setup_instructions.md` to reflect the TypeScript/Vite setup and verified `google-analytics.com/g/collect` requests across all routes.

- 2026-10-30: fixed the Excel report sample pill by defining the missing green Badge variant with contrasting light/dark colors; typed gallery badge colors so unsupported variants are caught during builds.
