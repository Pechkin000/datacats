'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const express = require('express');
const { validateLead, formatLead } = require('./lead');
const { sendMail, isConfigured, verifyConfig } = require('./graph');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const SITE_URL = 'https://datacats.ca';

const SHARED_HEADER_HTML = `
      <header class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav aria-label="Primary navigation" class="flex flex-wrap items-center justify-between gap-4">
          <a href="/" class="inline-flex min-h-[48px] items-center px-3 py-2 text-lg font-bold">DataCats Business Intelligence</a>
          <ul class="flex flex-wrap items-center gap-3 text-base">
            <li><a href="/" class="inline-flex min-h-[48px] items-center px-3 py-2">Home</a></li>
            <li><a href="/presentation" class="inline-flex min-h-[48px] items-center px-3 py-2">Solutions</a></li>
            <li><a href="/presentation#gallery" class="inline-flex min-h-[48px] items-center px-3 py-2">Report Samples</a></li>
            <li><a href="/penelope" class="inline-flex min-h-[48px] items-center px-3 py-2">Penelope Reporting</a></li>
            <li><a href="/penelope#faq" class="inline-flex min-h-[48px] items-center px-3 py-2">Penelope FAQ</a></li>
            <li><a href="/contact" class="inline-flex min-h-[48px] items-center px-3 py-2">Contact</a></li>
          </ul>
        </nav>
      </header>`;

const SHARED_FOOTER_HTML = `
      <footer class="mx-auto max-w-7xl space-y-6 px-4 py-8 text-base sm:px-6 lg:px-8">
        <h2 class="text-base font-semibold">Quick Links</h2>
        <ul class="flex flex-wrap gap-3 text-base">
          <li><a href="/" class="inline-flex min-h-[48px] items-center px-3 py-2">Home</a></li>
          <li><a href="/presentation" class="inline-flex min-h-[48px] items-center px-3 py-2">Solutions</a></li>
          <li><a href="/presentation#gallery" class="inline-flex min-h-[48px] items-center px-3 py-2">Report Samples</a></li>
          <li><a href="/penelope" class="inline-flex min-h-[48px] items-center px-3 py-2">Penelope Reporting</a></li>
          <li><a href="/penelope#faq" class="inline-flex min-h-[48px] items-center px-3 py-2">Penelope FAQ</a></li>
          <li><a href="/contact" class="inline-flex min-h-[48px] items-center px-3 py-2">Contact</a></li>
        </ul>
        <h2 class="text-base font-semibold">Contact</h2>
        <p class="text-base"><a href="mailto:josh@datacats.ca" class="inline-flex min-h-[48px] items-center px-3 py-2">josh@datacats.ca</a></p>
      </footer>`;

const ROUTE_META = {
  '/': {
    title: 'DataCats | Business Intelligence & Custom Dashboards',
    description:
      'Transform accounting, sales, CRM, EMR, and operations data into clear executive dashboards in Power BI, Tableau, Excel, BigQuery, and Bonaterra Penelope.',
    canonical: `${SITE_URL}/`,
    robots: 'index, follow',
    mainHtml: `
      <main id="main" class="mx-auto max-w-7xl space-y-12 px-4 py-12 text-base sm:px-6 lg:px-8">
        <section class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-5xl">Business Analytics for the rest of us.</h1>
          <p class="text-base sm:text-lg">Transform mountains of accounting, sales, and operations data into one clear, actionable dashboard.</p>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="/presentation" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Explore Dashboard Demos</a>
            <a href="/contact" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Get in Touch</a>
          </p>
        </section>
        <section id="problem" class="space-y-3">
          <h2 class="text-2xl font-bold sm:text-3xl">The Problem: Siloed Data, Zero Clarity</h2>
          <p class="text-base sm:text-lg">You generate mountain ranges of data every day across accounting, sales, and operations—yet gain zero actionable clarity.</p>
        </section>
        <section id="solutions" class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">The DataCats Business Intelligence Solution</h2>
          <p class="text-base sm:text-lg">Four analytical lenses that turn raw operational data into confident decisions.</p>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Sales Patterns &amp; Revenue Streams</h3>
            <p class="text-base">Uncover peak purchasing times, product affinity, and seasonal trends.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Patient &amp; Client Records</h3>
            <p class="text-base">Track care pathways, service milestones, and demographic breakdowns safely.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Order Trends &amp; Logistics</h3>
            <p class="text-base">Optimize inventory turns and supply chain timing.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Employee Time Utilization</h3>
            <p class="text-base">Identify capacity bottlenecks, billable hours, and scheduling efficiency.</p>
          </article>
        </section>
        <section id="integrations" class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">Your data sources, unified.</h2>
          <p class="text-base sm:text-lg">QuickBooks, Salesforce, Square, Clover, Bonaterra Penelope, your EMR, and more—flow into one clean, real-time executive dashboard.</p>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="/contact" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Start Your Free Discovery Call</a>
            <a href="/penelope" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Explore Penelope Reporting</a>
            <a href="/presentation#gallery" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">View Power BI, Tableau &amp; Excel Samples</a>
          </p>
        </section>
      </main>`,
    jsonLdGraph: [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        ],
      },
    ],
  },
  '/presentation': {
    title: 'Power BI, Tableau, Excel & BigQuery Dashboards | DataCats',
    description:
      'Explore sample executive dashboards, sales pipelines, utilization heatmaps, and automated financial workbooks across Power BI, Tableau, Excel & BigQuery.',
    canonical: `${SITE_URL}/presentation`,
    robots: 'index, follow',
    mainHtml: `
      <main id="main" class="mx-auto max-w-7xl space-y-12 px-4 py-12 text-base sm:px-6 lg:px-8">
        <section class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-5xl">Your Data. Delivered in Any Flavor You Need.</h1>
          <p class="text-base sm:text-lg">From Excel workbooks to enterprise Power BI and Tableau dashboards—delivered how your team actually works.</p>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="/presentation#gallery" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">See Sample Reports</a>
            <a href="/contact" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Talk to Us</a>
          </p>
        </section>
        <section id="capabilities" class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">Reporting Platforms &amp; Capabilities</h2>
          <p class="text-base sm:text-lg">Custom dashboards, automated spreadsheets, and scalable data pipelines tailored to your workflow.</p>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Beautiful Automated Excel Reports</h3>
            <p class="text-base">Advanced macro-driven or PowerQuery workbooks for teams that love spreadsheets.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Power BI Dashboards</h3>
            <p class="text-base">Interactive, real-time enterprise-grade reporting with cross-filtering.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Tableau Workbooks</h3>
            <p class="text-base">Rich geospatial and complex statistical visualization.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">BigQuery &amp; Cloud Warehousing</h3>
            <p class="text-base">Scalable data pipelines for high-volume analysis.</p>
          </article>
        </section>
        <section id="gallery" class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">Report Samples</h2>
          <p class="text-base sm:text-lg">Preview executive dashboards across Power BI, Tableau, Excel, and BigQuery.</p>
          <ul class="space-y-2 text-base">
            <li><h3 class="text-lg font-semibold">Executive Summary (Power BI)</h3></li>
            <li><h3 class="text-lg font-semibold">Sales Pipeline (Tableau)</h3></li>
            <li><h3 class="text-lg font-semibold">Financial Workbook (Excel)</h3></li>
            <li><h3 class="text-lg font-semibold">Warehouse Metrics (BigQuery)</h3></li>
            <li><h3 class="text-lg font-semibold">Client Journey (Power BI)</h3></li>
            <li><h3 class="text-lg font-semibold">Utilization Heatmap (Tableau)</h3></li>
          </ul>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="/penelope" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Explore Bonaterra Penelope Reporting</a>
            <a href="/contact" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Request a Custom Dashboard</a>
          </p>
        </section>
      </main>`,
    jsonLdGraph: [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${SITE_URL}/presentation` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'DataCats Sample Business Intelligence Dashboards',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Executive Summary (Power BI)' },
          { '@type': 'ListItem', position: 2, name: 'Sales Pipeline (Tableau)' },
          { '@type': 'ListItem', position: 3, name: 'Financial Workbook (Excel)' },
          { '@type': 'ListItem', position: 4, name: 'Warehouse Metrics (BigQuery)' },
          { '@type': 'ListItem', position: 5, name: 'Client Journey (Power BI)' },
          { '@type': 'ListItem', position: 6, name: 'Utilization Heatmap (Tableau)' },
        ],
      },
    ],
  },
  '/penelope': {
    title: 'Bonaterra Penelope Custom Reporting Services | DataCats',
    description:
      'Unlock your Bonaterra Penelope case management data without enterprise consulting fees. Fast custom reports, grant dashboards & staff utilization metrics.',
    canonical: `${SITE_URL}/penelope`,
    robots: 'index, follow',
    mainHtml: `
      <main id="main" class="mx-auto max-w-7xl space-y-12 px-4 py-12 text-base sm:px-6 lg:px-8">
        <section class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-5xl">Unlock Your Penelope Client Data—Without the Enterprise Price Tag.</h1>
          <p class="text-base sm:text-lg">Custom reporting for Bonaterra Penelope case management, built for agencies that need answers fast.</p>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="/contact" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Request a Penelope Report</a>
            <a href="/presentation" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">See All Solutions</a>
          </p>
        </section>
        <section class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">Penelope Reporting Value Pillars</h2>
          <p class="text-base sm:text-lg">Purpose-built analytics for social services, healthcare, and non-profit agencies using Penelope.</p>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Deep Data Extraction</h3>
            <p class="text-base">Pull client metrics, intake logs, and session statistics effortlessly.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Maximize Staff Utilization</h3>
            <p class="text-base">Measure caseloads, billable hours, and service outcomes per practitioner.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Pattern Recognition</h3>
            <p class="text-base">Discover demographic shifts and service demand trends.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Custom Tailored Reports</h3>
            <p class="text-base">Build exact reports tailored to grant requirements, boards, and clinical directors.</p>
          </article>
        </section>
        <section class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">Built for Penelope users.</h2>
          <p class="text-base sm:text-lg">Whether you need board dashboards, grant reports, or clinical metrics, we extract and shape your Penelope data into exactly what stakeholders ask for.</p>
          <h3 class="text-lg font-semibold">The Competitive Edge</h3>
          <ul class="space-y-2 text-base">
            <li><strong>Fraction of the Cost:</strong> Avoid Bonaterra&apos;s astronomical custom reporting fees.</li>
            <li><strong>Lightning Fast Delivery:</strong> Get custom reports delivered in days, not months.</li>
            <li><strong>Dedicated, Personalized Service:</strong> Direct contact with reporting experts who know Penelope inside and out.</li>
          </ul>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="/contact" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Start Your Penelope Project</a>
            <a href="/presentation#gallery" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">View Sample Dashboards</a>
          </p>
        </section>
        <section id="faq" class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">Penelope Custom Reporting FAQ</h2>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">What kind of custom reports can DataCats build from Bonaterra Penelope?</h3>
            <p class="text-base">We build board-ready executive dashboards, funder and grant compliance reports, practitioner caseload and billable-hour utilization reports, client intake and waitlist funnels, and demographic outcome breakdowns.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">Which reporting tools can connect to our Penelope data?</h3>
            <p class="text-base">We deliver Penelope analytics in Microsoft Power BI, Tableau, automated Excel workbooks, or cloud data warehouses like BigQuery—formatted to match how your clinical directors and finance team already work.</p>
          </article>
          <article class="space-y-1">
            <h3 class="text-lg font-semibold">How fast can you deliver a custom Penelope report compared to vendor services?</h3>
            <p class="text-base">Most custom Penelope reports and dashboards are delivered in days rather than months, at a fraction of standard enterprise custom reporting fees.</p>
          </article>
        </section>
      </main>`,
    jsonLdGraph: [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Penelope Reporting', item: `${SITE_URL}/penelope` },
        ],
      },
      {
        '@type': 'Service',
        name: 'Custom Bonaterra Penelope Case Management Reporting',
        provider: { '@id': `${SITE_URL}/#organization` },
        serviceType: 'Case Management Business Intelligence & Custom Reporting',
        description:
          'Custom reporting, caseload utilization, intake tracking, and grant compliance dashboards for agencies running Bonaterra Penelope case management software.',
        areaServed: ['CA', 'US'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What kind of custom reports can DataCats build from Bonaterra Penelope?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We build board-ready executive dashboards, funder and grant compliance reports, practitioner caseload and billable-hour utilization reports, client intake and waitlist funnels, and demographic outcome breakdowns.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which reporting tools can connect to our Penelope data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We deliver Penelope analytics in Microsoft Power BI, Tableau, automated Excel workbooks, or cloud data warehouses like BigQuery—formatted to match how your clinical directors and finance team already work.',
            },
          },
          {
            '@type': 'Question',
            name: 'How fast can you deliver a custom Penelope report compared to vendor services?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most custom Penelope reports and dashboards are delivered in days rather than months, at a fraction of standard enterprise custom reporting fees.',
            },
          },
        ],
      },
    ],
  },
  '/contact': {
    title: 'Contact DataCats | Start Your Custom Dashboard Project',
    description:
      'Contact DataCats Business Intelligence for a quick question or schedule a discovery call for Power BI, Tableau, Excel, BigQuery, or Penelope reporting.',
    canonical: `${SITE_URL}/contact`,
    robots: 'index, follow',
    mainHtml: `
      <main id="main" class="mx-auto max-w-7xl space-y-12 px-4 py-12 text-base sm:px-6 lg:px-8">
        <section class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-5xl">Let&apos;s build your dashboard.</h1>
          <p class="text-base sm:text-lg">Pick the path that fits: a quick question or a full discovery intake.</p>
        </section>
        <section class="space-y-4">
          <h2 class="text-2xl font-bold sm:text-3xl">Send a Message or Request a Discovery Call</h2>
          <p class="text-base sm:text-lg">Reach out to DataCats Business Intelligence for custom Power BI, Tableau, automated Excel, BigQuery, or Bonaterra Penelope reporting.</p>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="mailto:josh@datacats.ca" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Email josh@datacats.ca</a>
            <a href="/presentation" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Explore Dashboard Solutions</a>
            <a href="/penelope" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Bonaterra Penelope Reporting</a>
          </p>
        </section>
      </main>`,
    jsonLdGraph: [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
        ],
      },
      {
        '@type': 'ContactPage',
        name: 'Contact DataCats Business Intelligence',
        url: `${SITE_URL}/contact`,
        mainEntity: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  },
};

const NOT_FOUND_META = {
  title: 'Page Not Found | DataCats Business Intelligence',
  description:
    'The page you are looking for could not be found. Explore DataCats Business Intelligence dashboards and custom reporting solutions.',
  canonical: `${SITE_URL}/404`,
  robots: 'noindex, nofollow',
  mainHtml: `
      <main id="main" class="mx-auto max-w-7xl space-y-8 px-4 py-12 text-base sm:px-6 lg:px-8">
        <section class="space-y-4">
          <h1 class="text-3xl font-extrabold sm:text-5xl">This cat wandered off the chart.</h1>
          <p class="text-base sm:text-lg">We couldn&apos;t find the page you were looking for. Try heading back home or exploring our sample dashboards.</p>
          <p class="flex flex-wrap gap-4 pt-2">
            <a href="/" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Back to Home</a>
            <a href="/presentation" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">View Sample Reports</a>
            <a href="/penelope" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Penelope Reporting</a>
            <a href="/contact" class="inline-flex min-h-[48px] items-center rounded-full px-6 py-3 text-base font-semibold">Contact Us</a>
          </p>
        </section>
      </main>`,
};

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectGTM(html) {
  const gtmContainerId = 'GTM-M8TZBJ5P';

  const gtmScript = `
    <!-- Google Tag Manager -->
    <script>
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    </script>
    <script async src="https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}"></script>
    <!-- End Google Tag Manager -->
  `;

  const gtmNoscript = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
  `;

  let processedHtml = html;
  if (!processedHtml.includes(`gtm.js?id=${gtmContainerId}`)) {
    processedHtml = processedHtml.replace('</head>', `${gtmScript}</head>`);
  }
  if (!processedHtml.includes(`ns.html?id=${gtmContainerId}`)) {
    processedHtml = processedHtml.replace('<body>', `<body>${gtmNoscript}`);
  }

  return processedHtml;
}

function renderIndexHtml(template, meta) {
  const title = escapeHtmlAttr(meta.title);
  const desc = escapeHtmlAttr(meta.description);
  const canonical = escapeHtmlAttr(meta.canonical);
  const robots = escapeHtmlAttr(meta.robots);

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/i,
      `<meta name="description" content="${desc}" />`
    )
    .replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="robots" content="${robots}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/i,
      `<meta property="og:description" content="${desc}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${title}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
      `<meta name="twitter:description" content="${desc}" />`
    );

  if (meta.mainHtml) {
    const rootInner = `${SHARED_HEADER_HTML}${meta.mainHtml}${SHARED_FOOTER_HTML}\n    `;
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${rootInner}</div>`);
  }

  if (meta.jsonLdGraph && meta.jsonLdGraph.length > 0) {
    const jsonLdTag = `<script id="datacats-jsonld-route" type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': meta.jsonLdGraph,
    })}</script>`;
    html = html.replace('</head>', `  ${jsonLdTag}\n  </head>`);
  }

  return injectGTM(html);
}

function isOriginAllowed(origin, allowedRaw) {
  if (!allowedRaw || !origin) return true;
  const allowedSet = new Set();
  for (const item of allowedRaw.split(',')) {
    const clean = item.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');
    if (!clean) continue;
    allowedSet.add(clean);
    try {
      const u = new URL(clean);
      if (u.hostname.startsWith('www.')) {
        allowedSet.add(`${u.protocol}//${u.hostname.slice(4)}${u.port ? `:${u.port}` : ''}`);
      } else {
        allowedSet.add(`${u.protocol}//www.${u.hostname}${u.port ? `:${u.port}` : ''}`);
      }
    } catch {
      // Ignore malformed URL in ALLOWED_ORIGIN
    }
  }
  return allowedSet.size === 0 || allowedSet.has(origin.replace(/\/+$/, ''));
}

function createRateLimiter() {
  const hits = new Map();
  return function limited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) {
      for (const [key, times] of hits) if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
    return recent.length > MAX_PER_WINDOW;
  };
}

function createApp({ staticDir = process.env.STATIC_DIR || path.join(__dirname, '..', '..', 'datacats-web', 'dist') } = {}) {
  const app = express();
  const limited = createRateLimiter();

  app.disable('x-powered-by');
  // Behind Apache/Passenger on shared hosting the real client address is in X-Forwarded-For.
  app.set('trust proxy', 1);

  app.use((req, res, next) => {
    res.setHeader('Timing-Allow-Origin', '*');
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    const rawHost = (req.get('x-forwarded-host') || req.get('host') || '').split(',')[0].trim();
    const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(?::|$)/i.test(rawHost);
    const hasWww = /^www\./i.test(rawHost);
    const cleanHost = hasWww ? rawHost.replace(/^www\./i, '') : rawHost;
    const forwardedProto = (req.get('x-forwarded-proto') || '').split(',')[0].trim().toLowerCase();
    const needsHttps = !isLocal && forwardedProto === 'http';

    if ((hasWww || needsHttps) && cleanHost) {
      return res.redirect(301, `https://${cleanHost}${req.originalUrl}`);
    }
    if (req.method === 'GET' || req.method === 'HEAD') {
      if (req.path === '/index.html') {
        const qs = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
        return res.redirect(301, `/${qs}`);
      }
      if (req.path.length > 1 && /\/+$/.test(req.path)) {
        const trimmedPath = req.path.replace(/\/+$/, '');
        if (ROUTE_META[trimmedPath]) {
          const qs = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
          return res.redirect(301, `${trimmedPath}${qs}`);
        }
      }
    }
    return next();
  });

  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', async (req, res) => {
    if (req.query.verify === '1') {
      const diag = await verifyConfig();
      return res.json({ ok: true, mailConfigured: isConfigured(), diag });
    }
    return res.json({ ok: true, mailConfigured: isConfigured() });
  });

  app.post('/api/lead', async (req, res) => {
    const allowed = process.env.ALLOWED_ORIGIN;
    if (!isOriginAllowed(req.get('origin'), allowed)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (limited(req.ip)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const result = validateLead(req.body);
    if (result.honeypot) return res.json({ ok: true });
    if (result.errors) return res.status(400).json({ errors: result.errors });

    try {
      const { subject, text } = formatLead(result.lead);
      await sendMail({ subject, text, replyTo: { email: result.lead.email, name: result.lead.name } });
      return res.json({ ok: true });
    } catch (err) {
      console.error('lead send failed:', err.message);
      return res.status(502).json({ error: 'We could not send your message right now.' });
    }
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexTemplate = fs.readFileSync(indexPath, 'utf8');
    const renderedRoutes = new Map();
    for (const [routePath, meta] of Object.entries(ROUTE_META)) {
      const html = renderIndexHtml(indexTemplate, meta);
      renderedRoutes.set(routePath, {
        html,
        gzip: zlib.gzipSync(Buffer.from(html, 'utf8')),
      });
    }
    const notFoundHtml = renderIndexHtml(indexTemplate, NOT_FOUND_META);
    const renderedNotFound = {
      html: notFoundHtml,
      gzip: zlib.gzipSync(Buffer.from(notFoundHtml, 'utf8')),
    };

    app.use(
      express.static(staticDir, {
        index: false,
        maxAge: '7d',
        setHeaders(res, filePath) {
          if (/[\\/]assets[\\/]index-[A-Za-z0-9_-]+\.(js|css)$/.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      })
    );
    app.get('*', (req, res) => {
      const normalizedPath = req.path === '/' ? '/' : req.path.replace(/\/+$/, '');
      const entry = renderedRoutes.get(normalizedPath);
      const status = entry ? 200 : 404;
      const payload = entry || renderedNotFound;
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.setHeader('Vary', 'Accept-Encoding');
      const acceptEncoding = req.get('accept-encoding') || '';
      if (/\bgzip\b/i.test(acceptEncoding)) {
        res.setHeader('Content-Encoding', 'gzip');
        return res.status(status).type('html').send(payload.gzip);
      }
      return res.status(status).type('html').send(payload.html);
    });
  }

  return app;
}

module.exports = { createApp, ROUTE_META, injectGTM };
