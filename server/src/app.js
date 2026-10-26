'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { validateLead, formatLead } = require('./lead');
const { sendMail, isConfigured, verifyConfig } = require('./graph');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

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

  if (fs.existsSync(path.join(staticDir, 'index.html'))) {
    app.use(express.static(staticDir));
    app.get('*', (_req, res) => res.sendFile(path.join(staticDir, 'index.html')));
  }

  return app;
}

module.exports = { createApp };
