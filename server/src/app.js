'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { validateLead, formatLead } = require('./lead');
const { sendMail, isConfigured, verifyConfig } = require('./graph');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const SITE_URL = 'https://datacats.ca';

const ROUTE_META = {
  '/': {
    title: 'DataCats | Business Intelligence & Custom Dashboards',
    description:
      'Transform accounting, sales, CRM, EMR, and operations data into clear executive dashboards in Power BI, Tableau, Excel, BigQuery, and Bonaterra Penelope.',
    canonical: `${SITE_URL}/`,
    robots: 'index, follow',
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
};

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

  if (meta.jsonLdGraph && meta.jsonLdGraph.length > 0) {
    const jsonLdTag = `<script id="datacats-jsonld-route" type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': meta.jsonLdGraph,
    })}</script>`;
    html = html.replace('</head>', `  ${jsonLdTag}\n  </head>`);
  }

  return html;
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
      const routeMeta = ROUTE_META[normalizedPath];
      const status = routeMeta ? 200 : 404;
      const html = renderIndexHtml(indexTemplate, routeMeta || NOT_FOUND_META);
      res.status(status).type('html').send(html);
    });
  }

  return app;
}

module.exports = { createApp, ROUTE_META };
