# Report Samples Workflow (`Presentation.tsx`)

Concise reference for adding or updating report sample screenshots on the **Solutions (`#gallery` / `Report Samples`)** page.

## 1. Asset Locations & Naming

1. Place source screenshots (light and dark variants) in `assets/img/samples/`:
   - `assets/img/samples/light-sample<N>.png`
   - `assets/img/samples/dark-sample<N>.png`
2. Copy them into the Vite public directory so they are served at runtime and included in builds:
   - `datacats-web/public/assets/img/samples/light-sample<N>.png`
   - `datacats-web/public/assets/img/samples/dark-sample<N>.png`

## 2. Wiring in `datacats-web/src/pages/Presentation.tsx`

Add `lightImage` and `darkImage` to the target entry in `galleryItems` in `datacats-web/src/pages/Presentation.tsx`:

```ts
{
  id: 1,
  title: 'Executive Summary',
  platform: 'Power BI',
  color: 'gold',
  lightImage: '/assets/img/samples/light-sample1.png',
  darkImage: '/assets/img/samples/dark-sample1.png',
}
```

### Current Gallery Slots (`galleryItems`)
| `id` | Grid Position (Desktop 3x2) | Default Title | Platform | Badge Color | Status |
|------|-----------------------------|---------------|----------|-------------|--------|
| `1` | Top-left | `Executive Summary` | `Power BI` | `gold` | Uses `light-sample1.png` / `dark-sample1.png` |
| `2` | Top-center | `Sales Pipeline` | `Tableau` | `cyan` | Placeholder |
| `3` | Top-right | `Financial Workbook` | `Excel` | `green` | Placeholder |
| `4` | Bottom-left | `Warehouse Metrics` | `BigQuery` | `slate` | Placeholder |
| `5` | Bottom-center | `Client Journey` | `Power BI` | `gold` | Uses `light-sample2.png` / `dark-sample2.png` |
| `6` | Bottom-right | `Utilization Heatmap` | `Tableau` | `cyan` | Placeholder |

## 3. Report Theme Behavior (Preserve as-is)

- **Opposite Contrast Default:**
  - Website in **Light** theme (`theme === 'light'`) → shows **Dark** reports (`darkImage`) by default.
  - Website in **Dark** theme (`theme === 'dark'`) → shows **Light** reports (`lightImage`) by default.
  - Switching the site theme via the navbar `ThemeToggle` resets all reports to this opposite-contrast default.
- **Section Switcher (`Report Samples` header):**
  - Subtitle text: `Use the theme switcher to preview light/dark versions of the reports.`
  - Clicking the section theme icon toggles `sectionReportTheme` for **all** reports in the grid without changing the website's theme.
- **Zoomed-in Lightbox Modal Switcher:**
  - Button next to modal title displays Sun/Moon icon + `View Light Version` (when viewing dark) or `View Dark Version` (when viewing light).
  - Toggles `zoomedThemeOverride` **only while the modal is open**. Closing the modal resets `zoomedThemeOverride` to `null` so the card returns to `sectionReportTheme`.

## 4. Verification & Release Checklist

1. Run `cd datacats-web && npm run lint && npm run build`.
2. Update `docs/current_work.md`.
3. Start local preview (`cd datacats-web && npm run dev`) if requested before pushing.
4. Commit and push to `origin/main` — `.github/workflows/deploy.yml` automatically bumps the CI/CD patch version from `.version` and deploys to Namecheap cPanel.

