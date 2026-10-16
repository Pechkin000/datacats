'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { validateLead, formatLead } = require('./lead');
const { sendMail } = require('./graph');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

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

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.post('/api/lead', async (req, res) => {
    const allowed = process.env.ALLOWED_ORIGIN;
    if (allowed && req.get('origin') && req.get('origin') !== allowed) {
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
