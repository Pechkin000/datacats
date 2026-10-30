# DataCats Business Intelligence Website - Implementation Plan

**Created:** 2026-10-14  
**Status:** Ready for Implementation  
**Target Framework:** React + Vite with Tailwind CSS

---

## Executive Summary

Build a modern, responsive 4-page marketing website for DataCats Business Intelligence with Material Design 3 principles, full dark/light theme support, and cat-themed branding elements.

---

## Available Tooling (MCP)

Configured in `.vscode/.copilot/config.json` (GitHub Copilot) and `antigravity.mcp.json` (Antigravity). Keep both files in sync.

| Server | Use |
|--------|-----|
| `vscode` | VS Code editor, diagnostics, and integrated terminal access (requires the `acomagu.vscode-as-mcp-server` extension to be running) |
| `material-design-3` | MD3 tokens and Tailwind mapping |
| `relume-library` | Component and page-layout inspiration (remote, may need auth) |
| `page-design-guide` | Page design guidance (installed in `datacats-web/node_modules`) |
| `playwright` | Browser automation and QA |
| `chrome-dev-tools` | Console and network debugging |

---

## Phase 1: Project Foundation

### 1.1 Project Initialization

```bash
npm create vite@latest datacats-web -- --template react-ts
cd datacats-web
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion lucide-react
```

### 1.2 Directory Structure

```
datacats-web/
├── public/
│   └── assets/
│       └── img/
│           ├── dark-theme/          # Logo SVGs for dark theme
│           ├── light-theme/         # Logo SVGs for light theme
│           └── ba-rest-us-*.gif     # Animated brand assets
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Lightbox.tsx
│   │   └── sections/
│   │       ├── HeroBlock.tsx
│   │       ├── FeatureCard.tsx
│   │       ├── ReportGallery.tsx
│   │       └── IntakeForm.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Presentation.tsx
│   │   ├── Penelope.tsx
│   │   └── Contact.tsx
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 1.3 Design Tokens Configuration

Create `tailwind.config.js` with brand colors:

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme
        light: {
          surface: '#F8FAFC',      // Slate 50
          card: '#FFFFFF',
          text: {
            primary: '#0F172A',    // Slate 900
            secondary: '#475569'   // Slate 600
          }
        },
        // Dark theme
        dark: {
          surface: '#0F172A',      // Slate 900
          card: '#1E293B',         // Slate 800
          text: {
            primary: '#F8FAFC',    // Slate 50
            secondary: '#94A3B8'   // Slate 400
          }
        },
        // Brand accents
        brand: {
          gold: '#F59E0B',         // Amber 500
          amber: '#FBBF24',        // Amber 400
          cyan: '#06B6D4'          // Cyan 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'cat-swipe': 'swipe 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        swipe: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-15deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  }
}
```

---

## Phase 2: Asset Integration

### 2.1 Asset Mapping

| Asset File | Purpose | Location |
|------------|---------|----------|
| `logo-cat.svg` | Dark theme mascot icon | Navbar, Footer |
| `logo-text-cat.svg` | Dark theme full logo with cat | Hero sections |
| `logo-text.svg` | Dark theme text-only logo | Compact headers |
| `logo-cat-light.svg` | Light theme mascot icon | Navbar, Footer |
| `logo-text-cat-light.svg` | Light theme full logo | Hero sections |
| `logo-text-light.svg` | Light theme text-only | Compact headers |
| `ba-rest-us-med.gif` | Animated brand element | Home hero section |
| `ba-rest-us-sml.gif` | Small animated badge | Feature cards |
| `ba-rest-us-xl.gif` | Large animated hero | Landing pages |

### 2.2 Logo Component Strategy

Create a smart `<Logo />` component that:
- Automatically switches between light/dark variants based on current theme
- Supports three variants: `icon`, `text`, `full`
- Accepts custom className for sizing

```tsx
// components/ui/Logo.tsx
interface LogoProps {
  variant: 'icon' | 'text' | 'full';
  className?: string;
}

export function Logo({ variant, className }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const src = useMemo(() => {
    const themeDir = isDark ? 'dark-theme' : 'light-theme';
    switch(variant) {
      case 'icon': return `/assets/img/${themeDir}/logo-cat${isDark ? '' : '-light'}.svg`;
      case 'text': return `/assets/img/${themeDir}/logo-text${isDark ? '' : '-light'}.svg`;
      case 'full': return `/assets/img/${themeDir}/logo-text-cat${isDark ? '' : '-light'}.svg`;
    }
  }, [isDark, variant]);
  
  return <img src={src} alt="DataCats" className={className} />;
}
```

---

## Phase 3: Core Components

### 3.1 Theme System

**File:** `src/hooks/useTheme.ts`

Implement theme management:
1. Check localStorage for saved preference
2. Fall back to `prefers-color-scheme` media query
3. Provide toggle function
4. Persist changes to localStorage
5. Apply `dark` class to `<html>` element

**File:** `src/components/layout/ThemeToggle.tsx`

- Sun/Moon icon toggle button
- Playful cat-tail swipe animation on toggle
- Accessible with aria-label
- Positioned in navbar

### 3.2 Layout Components

**Navbar Component:**
- Sticky top position with backdrop blur
- Logo (icon variant) on left
- Navigation links: Home, Solutions, Penelope, Contact
- Theme toggle on right
- Mobile hamburger menu with slide-out drawer
- Smooth scroll to sections on same page

**Footer Component:**
- 3-column layout: Brand info, Quick links, Contact
- Logo (text variant) centered
- Social icons (placeholder)
- Copyright year auto-updated

### 3.2.1 Universal Hover Micro-Interactions

**Requirement:** every interactive element (cards, hero blocks, buttons, nav links, gallery items, chips, form inputs) responds to hover with a slight, ever-so-subtle bounce.

- Scale to about 1.02 (buttons up to 1.05) with a small lift of up to 4px.
- Use an overshoot easing, `cubic-bezier(0.34, 1.56, 0.64, 1)` (Tailwind `ease-bounce`), 150-250ms.
- Press state scales to about 0.98.
- Share the behaviour through the `interactive` and `hover-lift` classes in `globals.css` instead of per-component styles.
- Respect `prefers-reduced-motion`.

### 3.3 Reusable UI Components

**Button Component:**
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}
```
- Primary: Gold/Amber background, dark text
- Secondary: Slate background, light text
- Hover animations with scale and glow
- Support both button and anchor modes

**Card Component:**
- Material Design 3 surface styling
- Hover elevation effect
- Subtle surface tint on hover
- Support icon/image header
- Overflow hidden for image cards

**Badge Component:**
- Small pill-shaped labels
- Platform tags for report gallery
- Color variants for different platforms

**Lightbox Component:**
- Full-screen image overlay
- Close on click outside or Escape key
- Zoom functionality
- Platform badge display

---

## Phase 4: Page-by-Page Implementation

### 4.1 Page 1: Home (`/`)

**Hero Section:**
- Full viewport height
- Background: Animated `ba-rest-us-med.gif` floating element
- Title: "Business Analytics for the rest of us."
- Subtitle: Brief value proposition
- Primary CTA: "Explore Dashboard Demos" → `/presentation`
- Secondary CTA: "Get in Touch" → `/contact`
- Theme toggle visible in hero

**Problem Statement Section:**
- Two-column layout (text + illustration)
- Headline: "You generate mountain ranges of data..."
- Body text addressing pain points
- Visual: Data chaos illustration or animated GIF

**Solution Section:**
- 4 Feature Cards in responsive grid (2x2 on desktop, 1x4 on mobile)
  
  **Card 1: Sales Patterns & Revenue Streams**
  - Icon: TrendingUp (lucide-react)
  - Description: Uncover peak purchasing times, product affinity, and seasonal trends
  
  **Card 2: Patient & Client Records**
  - Icon: Users
  - Description: Track care pathways, service milestones, and demographic breakdowns safely
  
  **Card 3: Order Trends & Logistics**
  - Icon: Truck
  - Description: Optimize inventory turns and supply chain timing
  
  **Card 4: Employee Time Utilization**
  - Icon: Clock
  - Description: Identify capacity bottlenecks, billable hours, and scheduling efficiency

**Data Integration Showcase:**
- Visual flow diagram/animation
- Left side: Scattered source icons (QuickBooks, Salesforce, Square, etc.)
- Arrow animation pointing to center
- Center: DataCats Hub logo
- Right side: Unified dashboard preview
- Animated connection lines

---

### 4.2 Page 2: Presentation (`/presentation`)

**Header Banner:**
- Full-width gradient background
- Title: "Your Data. Delivered in Any Flavor You Need."
- Subtitle: Platform versatility messaging

**Platform Capability Matrix:**
- 4 platform cards in horizontal scrollable row on mobile
  
  **Card 1: Excel Reports**
  - Badge: "EXCEL"
  - Icon: FileSpreadsheet
  - Description: Advanced macro-driven or PowerQuery workbooks
  - Features list: Pivot tables, auto-refresh, formulas
  
  **Card 2: Power BI Dashboards**
  - Badge: "POWER BI"
  - Icon: BarChart3
  - Description: Interactive, real-time enterprise-grade reporting
  - Features: Cross-filtering, drill-down, shared dashboards
  
  **Card 3: Tableau Workbooks**
  - Badge: "TABLEAU"
  - Icon: LineChart
  - Description: Rich geospatial and statistical visualization
  - Features: Map layers, complex calculations, parameters
  
  **Card 4: Cloud Warehousing**
  - Badge: "BIGQUERY"
  - Icon: Cloud
  - Description: Scalable data pipelines for high-volume analysis
  - Features: SQL interface, ML integration, real-time streaming

**Interactive Screenshot Gallery:**
- CSS Grid layout (3 columns on desktop)
- Placeholder images for now (16:9 aspect ratio)
- Each item has:
  - Thumbnail image
  - Platform badge overlay
  - Title caption
- Click opens Lightbox with full-size view
- Filter buttons to show only specific platform

---

### 4.3 Page 3: Penelope Solutions (`/penelope`)

**Hero Section:**
- Accent color background (Amber/Cyan gradient)
- Title: "Unlock Your Penelope Client Data—Without the Enterprise Price Tag."
- Subtitle: Value proposition for Bonaterra users
- CTA: "Schedule Consultation" → Contact form

**Value Pillars Section:**
- 4 vertical cards with icons
  
  **Pillar 1: Deep Data Extraction**
  - Icon: Database
  - Copy: Pull client metrics, intake logs, and session statistics effortlessly
  
  **Pillar 2: Maximize Staff Utilization**
  - Icon: UserCheck
  - Copy: Measure caseloads, billable hours, and service outcomes per practitioner
  
  **Pillar 3: Pattern Recognition**
  - Icon: Brain
  - Copy: Discover demographic shifts and service demand trends
  
  **Pillar 4: Custom Tailored Reports**
  - Icon: FileText
  - Copy: Build exact reports tailored to grant requirements, boards, and clinical directors

**Competitive Edge Banner:**
- Dark card with glowing border
- 3 comparison points in horizontal layout
  
  **Point 1: Fraction of the Cost**
  - Icon: DollarSign
  - Text: Avoid Bonaterra's astronomical custom reporting fees
  
  **Point 2: Lightning Fast Delivery**
  - Icon: Zap
  - Text: Get custom reports delivered in days, not months
  
  **Point 3: Dedicated Service**
  - Icon: Heart
  - Text: Direct contact with reporting experts who know Penelope inside and out

**Trust Indicators:**
- "Trusted by N Penelope users" (placeholder number)
- Optional testimonial cards

---

### 4.4 Page 4: Contact (`/contact`)

**Header:**
- Title: "Let's Talk About Your Data"
- Subtitle: "Choose your preferred way to connect"

**Two-Column Form Layout:**

**Left Column: Quick Connect Form**
- Simpler, approachable design
- Fields:
  - Name (text, required)
  - Email or Phone (text, required)
  - Message (textarea, required)
- Submit button: "Send Quick Message"
- Validation: Basic required field check
- Success state: Animated checkmark + confirmation message

**Right Column: Detailed Project Discovery**
- Progressive disclosure (accordion or tabbed)
- Section 1: Company Details
  - Company Name (text)
  - Industry (dropdown/select)
  - Team Size (select: 1-10, 11-50, 51-200, 200+)
- Section 2: Current Tech Stack
  - Multi-select tags: Penelope, QuickBooks, Power BI, Square POS, Custom SQL, Xero, Salesforce, HubSpot, Other
  - "Other" reveals text input
- Section 3: Pain Points
  - Checklist with common issues:
    - [ ] Reports take too long
    - [ ] Data is siloed
    - [ ] Can't track employee utilization
    - [ ] Manual data entry errors
    - [ ] No real-time visibility
  - "Other issues" textarea
- Section 4: Wish List
  - Textarea: "What would your ideal dashboard show you tomorrow?"
- Section 5: Contact Details
  - Primary Contact Person (text)
  - Email (email, required)
  - Phone (tel)
  - Preferred Contact Window (select: Morning, Afternoon, Evening)
- Submit button: "Submit Discovery Form"
- Success state: Different message for detailed intake

**Form Validation:**
- Real-time field validation
- Accessible error messages
- Disable submit during submission
- Loading spinner on submit button

---

## Phase 5: Styling & Animations

### 5.1 Global Styles

**File:** `src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-light-surface dark:bg-dark-surface 
           text-light-text-primary dark:text-dark-text-primary
           transition-colors duration-300;
  }
}

@layer components {
  .surface-card {
    @apply bg-light-card dark:bg-dark-card 
           rounded-2xl shadow-lg 
           dark:shadow-none dark:border dark:border-slate-700
           transition-all duration-200;
  }
  
  .surface-card:hover {
    @apply shadow-xl dark:border-brand-gold/30;
  }
}
```

### 5.2 Animation Guidelines

**Framer Motion Presets:**
- Page transitions: Fade + slide up
- Card hover: Scale 1.02 + shadow increase
- Button hover: Scale 1.05 + glow
- Form errors: Shake animation
- Success states: Scale + checkmark draw

**Cat-Themed Micro-interactions:**
- Theme toggle: Cat tail swipe (rotate icon)
- Logo: Subtle bounce on page load
- CTA buttons: Paw-print cursor on hover (optional)
- Scroll indicators: Bouncing arrow

---

## Phase 6: Accessibility & SEO

### 6.1 Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works throughout
- [ ] Forms have proper labels and aria-describedby for errors
- [ ] Skip-to-content link
- [ ] Reduced motion support via `prefers-reduced-motion`
- [ ] Screen reader announcements for dynamic content

### 6.2 SEO Implementation

**Meta Tags (per page):**
```html
<title>DataCats - Business Analytics for the Rest of Us</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="/assets/img/logo-text-cat-light.svg" />
```

**Structured Data:**
- Organization schema on home page
- LocalBusiness schema on contact page
- SoftwareApplication schema on presentation page

---

## Phase 7: Testing & Quality Assurance

### 7.1 Responsive Breakpoints

Test all pages at:
- Mobile: 320px, 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px

### 7.2 Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari
- Mobile Chrome

### 7.3 Lighthouse Targets

- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

---

## Phase 8: Deployment Preparation

### 8.1 Build Optimization

- Code splitting by route
- Image optimization (WebP with fallbacks)
- CSS purging for unused styles
- Gzip compression
- Asset caching headers

### 8.2 Environment Configuration

```env
VITE_SITE_URL=https://datacats.com
VITE_CONTACT_EMAIL=hello@datacats.com
```

---

## File Creation Checklist

### Must Create:
- [ ] `src/hooks/useTheme.ts`
- [ ] `src/hooks/useLocalStorage.ts`
- [ ] `src/components/layout/Navbar.tsx`
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/layout/ThemeToggle.tsx`
- [ ] `src/components/ui/Button.tsx`
- [ ] `src/components/ui/Card.tsx`
- [ ] `src/components/ui/Badge.tsx`
- [ ] `src/components/ui/Lightbox.tsx`
- [ ] `src/components/ui/Logo.tsx`
- [ ] `src/components/sections/HeroBlock.tsx`
- [ ] `src/components/sections/FeatureCard.tsx`
- [ ] `src/components/sections/ReportGallery.tsx`
- [ ] `src/components/sections/IntakeForm.tsx`
- [ ] `src/pages/Home.tsx`
- [ ] `src/pages/Presentation.tsx`
- [ ] `src/pages/Penelope.tsx`
- [ ] `src/pages/Contact.tsx`
- [ ] `src/styles/globals.css`
- [ ] `src/App.tsx` (with routing)
- [ ] `tailwind.config.js`
- [ ] `public/robots.txt`
- [ ] `public/sitemap.xml`
- [ ] `index.html` (with meta tags)

---

## Implementation Order

1. **Foundation** (Day 1)
   - Initialize project
   - Configure Tailwind
   - Set up theme system
   - Create basic routing

2. **Layout** (Day 2)
   - Build Navbar
   - Build Footer
   - Implement theme toggle
   - Test navigation

3. **Home Page** (Day 3-4)
   - Hero section
   - Problem statement
   - Feature cards
   - Data integration showcase

4. **Presentation Page** (Day 5)
   - Platform cards
   - Screenshot gallery
   - Lightbox component

5. **Penelope Page** (Day 6)
   - Hero section
   - Value pillars
   - Competitive edge

6. **Contact Page** (Day 7)
   - Quick connect form
   - Discovery form
   - Form validation

7. **Polish & Testing** (Day 8-9)
   - Responsive testing
   - Accessibility audit
   - Performance optimization
   - Cross-browser testing

8. **Deployment** (Day 10)
   - Build optimization
   - Deploy to hosting
   - Final verification

---

## Notes for Implementation Agent

1. **DO NOT** create placeholder images - use colored divs with text labels until real assets are available
2. **ALWAYS** update `current_work.md` after each implementation session
3. **TEST** dark/light theme switching after every component
4. **VERIFY** all links work correctly
5. **ENSURE** accessibility before moving to next component
6. **USE** TypeScript strict mode
7. **FOLLOW** the lazy developer principle: build what's needed, nothing more

---

## Success Criteria

- All 4 pages fully functional
- Dark/light theme works correctly
- All forms validate and show success states
- Responsive at all breakpoints
- Lighthouse scores meet targets
- No console errors
- Accessible via keyboard
- Works without JavaScript (graceful degradation)
