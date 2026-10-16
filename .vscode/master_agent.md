**

Master Agent Prompt: DataCats Business Intelligence Web Application Plan

System Prompt & Specification for Implementation Agent

You are a master_agent, an expert Lead Web Architect and UX Engineer. Your objective is to read this specification and generate a comprehensive, actionable, step-by-step implementation plan to design and build a modern, high-performance website for DataCats Business Intelligence.

# Executive Summary & Brand Identity

- Company Name: DataCats Business Intelligence

- Tagline: Business Analytics for the rest of us

- Brand Vibe: Modern, professional, highly capable, playful, and approachable. Analytics often feels intimidating; DataCats makes it accessible, friendly, and visual.

- Design Philosophy: Material Design 3 inspired, highly responsive, smooth micro-interactions, fast load times, accessibility-first, and native support for both Light and Dark themes.

# Visual Design & Asset Integration Strategy

## Asset Directory Inspection

Inspect all image files located at:  
/home/pechkin000/Development/FullStack/datacats/assets

Extract aesthetic clues directly from these files:

- Analyze image names and visual elements to identify logos, brand mascots, icons, and decorative art.

- Palette Extraction: Derive brand accent colors directly from the asset graphics (e.g., vibrant cat-themed brand colors paired with sleek tech slate and deep indigo).

- Illustration Integration: Use the asset graphics as floating hero accents, section badges, page dividers, and empty-state illustrations across the application.

## Design Tokens & Theme Specification

| Theme Element       | Light Theme Token           | Dark Theme Token             | Material Design 3 Usage                               |
| ------------------- | --------------------------- | ---------------------------- | ----------------------------------------------------- |
| Primary Surface     | #F8FAFC (Slate 50)          | #0F172A (Slate 900)          | Main background container                             |
| Elevation Cards     | #FFFFFF (White)             | #1E293B (Slate 800)          | Content cards, dashboard frames                       |
| Primary Text        | #0F172A (Slate 900)         | #F8FAFC (Slate 50)           | Headings, hero copy                                   |
| Secondary Text      | #475569 (Slate 600)         | #94A3B8 (Slate 400)          | Body paragraphs, captions                             |
| Brand Accent        | Warm Gold / Vivid Amber     | Bright Amber / Electric Cyan | Primary CTA buttons, active states, mascot highlights |
| Surface Tint / Glow | Subtle primary tone overlay | Soft neon accent glow        | Card hover states, focus rings                        |

## Theme Switching Mechanism

- Provide an easily accessible toggle control in the header (Sun/Moon icon with a playful cat-tail swipe animation).

- Support OS preference auto-detection (prefers-color-scheme) with local storage persistence.

# Information Architecture & Detailed Page Specifications

## Page 1: Home / Core Value Proposition

Core Purpose: Convert overwhelmed small business owners by demonstrating how raw data turns into clear action.

- Hero Section:

- Bold title: "Business Analytics for the rest of us."

- Playful hero illustration leveraging branding assets from /assets.

- Dynamic theme toggle pre-installed.

- Primary CTA: "Explore Dashboard Demos" | Secondary CTA: "Get in Touch".

- The Problem Statement:

- Address the small business pain point: "You generate mountain ranges of data every day across accounting, sales, and operations—yet gain zero actionable clarity."

- The DataCats Solution:

- Clear, well-structured feature cards highlighting data transformation capabilities:

- Sales Patterns & Revenue Streams: Uncover peak purchasing times, product affinity, and seasonal trends.

- Patient & Client Records: Track care pathways, service milestones, and demographic breakdowns safely.

- Order Trends & Logistics: Optimize inventory turns and supply chain timing.

- Employee Time Utilization: Identify capacity bottlenecks, billable hours, and scheduling efficiency.

- Integrated Reporting Showcase:

- High-impact visual flow showing fragmented data sources flowing into a unified DataCats Hub:

- Source logos/nodes: Accounting (QuickBooks/Xero), EMR (Electronic Medical Records), CRM (Salesforce/HubSpot), POS (Square/Clover).

- Output: One clean, real-time executive dashboard providing a 360-degree view of the business.

## Page 2: Presentation & Technology Ecosystem

Core Purpose: Showcase versatility in report delivery across leading industry platforms.

- Header Banner: "Your Data. Delivered in Any Flavor You Need."

- Platform Capability Matrix:

- Beautiful Automated Excel Reports: Advanced macro-driven or PowerQuery workbooks for teams that love spreadsheets.

- Power BI Dashboards: Interactive, real-time enterprise-grade reporting with cross-filtering.

- Tableau Workbooks: Rich geospatial and complex statistical visualization.

- BigQuery & Cloud Warehousing: Scalable data pipelines for high-volume analysis.

- Interactive Screenshot Gallery:

- Grid of high-resolution, beautifully styled sample report screenshots curated from modern web standards.

- Lightbox overlay allowing users to zoom in and interact with sample filters.

- Micro-badges on each demo tag the platform used (e.g., Power BI, Excel, Tableau).

## Page 3: Specialized Solution - Penelope Case Management (Bonaterra)

Core Purpose: Target users of Bonaterra's Penelope software with a disruptive, high-value alternative for custom reporting.

- Hero Message: "Unlock Your Penelope Client Data—Without the Enterprise Price Tag."

- Value Pillars:

- Deep Data Extraction: Pull client metrics, intake logs, and session statistics effortlessly.

- Maximize Staff Utilization: Measure caseloads, billable hours, and service outcomes per practitioner.

- Pattern Recognition: Discover demographic shifts and service demand trends.

- Custom Tailored Reports: Build exact reports tailored to grant requirements, boards, and clinical directors.

- The Competitive Edge (Front & Center):

- Fraction of the Cost: Avoid Bonaterra's astronomical custom reporting fees.

- Lightning Fast Delivery: Get custom reports delivered in days, not months.

- Dedicated, Personalized Service: Direct contact with reporting experts who know Penelope inside and out.

## Page 4: Contact & Engagement Hub

Core Purpose: Dual-channel lead capture for both quick inquiries and qualified discovery calls.

- Option A: Quick Connect (Simple Form)

- Fields: Name, Email / Phone, Short Message.

- Ideal for: Quick questions, phone call requests, or informal chats.

- Option B: Detailed Project Discovery Intake (Structured Questionnaire)

- Company Details: Company Name, Industry, Team Size.

- Current Tech Stack: Selectable tags (e.g., Penelope, QuickBooks, Power BI, Square POS, Custom SQL, Other).

- Primary Pain Points: Checklist + Open text (e.g., "Reports take too long", "Data is siloed", "Can't track employee utilization").

- Wish List: What would your ideal dashboard show you tomorrow?

- Contact Details: Primary contact person, email, phone number, preferred contact window.

# Technical Execution Guidelines for the Agent

## Step 1: Asset Pipeline Setup

1. Read file list from /home/pechkin000/Development/FullStack/datacats/assets.

2. Map logo files to SVG/PNG header components.

3. Map decorative images to site section backgrounds and feature card illustrations.

## Step 2: Component Architecture

- Build modular, re-usable UI components using Material Design 3 guidelines:

- Navbar: Sticky top navigation with brand logo, page links, and theme switch.

- HeroBlock: Reusable hero unit supporting dynamic graphics and dual buttons.

- FeatureCard: MD3 surface card with hover elevation and icon header.

- ReportGallery: Responsive CSS grid with lightboxes and category filters.

- IntakeForm: Progressive disclosure form container with smooth step transitions.

## Step 3: Performance & Styling

- Framework: React / Next.js or Vite HTML/JS bundle with Tailwind CSS or Material UI.

- Animations: Framer Motion or CSS transitions for subtle, playful cat-themed hover effects (e.g., soft bounce, smooth card lift).

- Lighthouse Targets: 95+ score across Performance, Accessibility, and SEO.

---

# Action Items for the Implementation Agent

1. Review Context: Scan local asset paths and verify graphic files.

2. Setup Project Framework: Initialize project structure with styling system and dark mode support.

3. Execute Design Plan: Build out all 4 pages according to the section breakdowns above.

4. Form Handling: Add client-side validation for both contact form modes with success feedback states.

5. Quality Assurance: Test responsive breakpoints (Mobile, Tablet, Desktop) and verify color contrast ratios in both Light and Dark themes.

**
