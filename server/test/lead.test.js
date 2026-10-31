'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.DRY_RUN = '1';
const { validateLead, formatLead } = require('../src/lead');
const { createApp } = require('../src/app');

test('validateLead rejects missing fields per form type', () => {
  assert.deepEqual(Object.keys(validateLead({ type: 'quick' }).errors).sort(), ['email', 'message', 'name']);
  const detailed = validateLead({ type: 'detailed', name: 'A', email: 'a@b.co' });
  assert.deepEqual(Object.keys(detailed.errors), ['company']);
  assert.ok(validateLead({ type: 'nope', name: 'A', email: 'a@b.co' }).errors.type);
});

test('validateLead treats a filled honeypot as a bot', () => {
  assert.equal(validateLead({ type: 'quick', name: 'A', email: 'a@b.co', message: 'x', website: 'http://spam' }).honeypot, true);
});

test('validateLead strips control characters and caps lengths', () => {
  const { lead } = validateLead({ type: 'quick', name: 'Bob\r\nBcc: x@y.z', email: 'a@b.co', message: 'hi\nthere' + 'x'.repeat(5000) });
  assert.ok(!/[\r\n]/.test(lead.name));
  assert.equal(lead.message.length, 4000);
  assert.ok(lead.message.includes('\n'));
});

test('formatLead builds a plain-text email with a safe subject', () => {
  const { lead } = validateLead({
    type: 'detailed', name: 'Ann', email: 'ann@acme.co', company: 'Acme',
    techStack: ['Power BI', 'Other'], otherTech: 'Odoo', painPoints: ['Data is siloed'],
  });
  const mail = formatLead(lead);
  assert.equal(mail.subject, '[DataCats] Discovery intake from Ann');
  assert.match(mail.text, /Tech stack: Power BI, Other, Odoo/);
  assert.match(mail.text, /Pain points: Data is siloed/);
});

async function withServer(app, fn) {
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  try { return await fn(`http://127.0.0.1:${server.address().port}`); } finally { server.close(); }
}

const post = (base, body) =>
  fetch(`${base}/api/lead`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('POST /api/lead validates, accepts, and rate limits', async () => {
  await withServer(createApp({ staticDir: '/nonexistent' }), async (base) => {
    const bad = await post(base, { type: 'quick', name: '', email: 'nope' });
    assert.equal(bad.status, 400);
    assert.ok((await bad.json()).errors.email);

    const ok = await post(base, { type: 'quick', name: 'Ann', email: 'ann@acme.co', message: 'Hello' });
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { ok: true });

    const bot = await post(base, { type: 'quick', name: 'Bot', email: 'b@b.co', message: 'x', website: 'spam' });
    assert.equal(bot.status, 200);

    // 3 requests used so far; the 6th within the window is rejected.
    for (let i = 0; i < 2; i += 1) await post(base, { type: 'quick', name: 'A', email: 'a@b.co', message: 'x' });
    assert.equal((await post(base, { type: 'quick', name: 'A', email: 'a@b.co', message: 'x' })).status, 429);
  });
});

test('POST /api/lead returns 502 when mail is not configured', async () => {
  process.env.DRY_RUN = '';
  delete process.env.CLIENT_SECRET;
  await withServer(createApp({ staticDir: '/nonexistent' }), async (base) => {
    const res = await post(base, { type: 'quick', name: 'Ann', email: 'ann@acme.co', message: 'Hello' });
    assert.equal(res.status, 502);
    assert.ok(!JSON.stringify(await res.json()).includes('configured'));
  });
  process.env.DRY_RUN = '1';
});

test('Graph flow: token request then sendMail with reply-to', async () => {
  const seen = [];
  const fake = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      seen.push({ url: req.url, auth: req.headers.authorization, body });
      if (req.url.includes('/oauth2/v2.0/token')) {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ access_token: 'tok', expires_in: 3600 }));
      }
      res.statusCode = 202;
      res.end();
    });
  });
  await new Promise((r) => fake.listen(0, r));
  const port = fake.address().port;

  // Redirect the two Microsoft hosts to the local fake.
  const realFetch = global.fetch;
  global.fetch = (url, opts) =>
    realFetch(String(url).replace(/^https:\/\/(login\.microsoftonline\.com|graph\.microsoft\.com)/, `http://127.0.0.1:${port}`), opts);

  Object.assign(process.env, { DRY_RUN: '', TENANT_ID: 'tenant-1', CLIENT_ID: 'client-1', CLIENT_SECRET: 'test-secret', MAIL_FROM: 'josh@datacats.ca' });
  try {
    await withServer(createApp({ staticDir: '/nonexistent' }), async (base) => {
      const res = await post(base, { type: 'quick', name: 'Ann', email: 'ann@acme.co', message: 'Hello' });
      assert.equal(res.status, 200);
    });
  } finally {
    global.fetch = realFetch;
    fake.close();
    process.env.DRY_RUN = '1';
  }

  const tokenReq = seen.find((s) => s.url.startsWith('/tenant-1/oauth2/v2.0/token'));
  assert.ok(tokenReq, 'token endpoint called with tenant id');
  assert.match(tokenReq.body, /grant_type=client_credentials/);
  assert.match(tokenReq.body, /scope=https%3A%2F%2Fgraph.microsoft.com%2F.default/);

  const mailReq = seen.find((s) => s.url === '/v1.0/users/josh%40datacats.ca/sendMail');
  assert.ok(mailReq, 'sendMail called for the mailbox');
  assert.equal(mailReq.auth, 'Bearer tok');
  const msg = JSON.parse(mailReq.body);
  assert.equal(msg.message.toRecipients[0].emailAddress.address, 'josh@datacats.ca');
  assert.equal(msg.message.replyTo[0].emailAddress.address, 'ann@acme.co');
  assert.equal(msg.message.body.contentType, 'Text');
});

test('Origin check allows both apex and www subdomain when ALLOWED_ORIGIN is set', async () => {
  process.env.ALLOWED_ORIGIN = 'https://datacats.ca';
  try {
    await withServer(createApp({ staticDir: '/nonexistent' }), async (base) => {
      const postOrigin = (origin) =>
        fetch(`${base}/api/lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: origin },
          body: JSON.stringify({ type: 'quick', name: 'Ann', email: 'ann@acme.co', message: 'Hello' }),
        });

      assert.equal((await postOrigin('https://datacats.ca')).status, 200);
      assert.equal((await postOrigin('https://www.datacats.ca')).status, 200);
      assert.equal((await postOrigin('https://evil.example.com')).status, 403);
    });
  } finally {
    delete process.env.ALLOWED_ORIGIN;
  }
});

test('SPA route handler injects route-specific SEO meta, headings, internal links, and 301 redirects www/http', async () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const path = require('node:path');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'datacats-seo-'));
  fs.writeFileSync(
    path.join(tmpDir, 'index.html'),
    [
      '<!doctype html><html><head>',
      '<title>Default Title</title>',
      '<meta name="description" content="Default desc" />',
      '<meta name="robots" content="index, follow" />',
      '<link rel="canonical" href="https://datacats.ca/" />',
      '<meta property="og:url" content="https://datacats.ca/" />',
      '<meta property="og:title" content="Default Title" />',
      '<meta property="og:description" content="Default desc" />',
      '<meta name="twitter:title" content="Default Title" />',
      '<meta name="twitter:description" content="Default desc" />',
      '</head><body><div id="root"></div></body></html>',
    ].join('\n')
  );

  try {
    await withServer(createApp({ staticDir: tmpDir }), async (base) => {
      const homeRes = await fetch(`${base}/`);
      assert.equal(homeRes.status, 200);
      assert.equal(homeRes.headers.get('timing-allow-origin'), '*');
      assert.equal(homeRes.headers.get('access-control-allow-origin'), '*');
      const homeHtml = await homeRes.text();
      assert.match(homeHtml, /<h1[^>]*>Business Analytics for the rest of us\.<\/h1>/);
      assert.match(homeHtml, /<h2[^>]*>The Problem: Siloed Data, Zero Clarity<\/h2>/);
      assert.match(homeHtml, /<h3[^>]*>Sales Patterns &amp; Revenue Streams<\/h3>/);
      assert.match(homeHtml, /<a href="\/presentation"[^>]*>/);
      assert.match(homeHtml, /<a href="\/penelope"[^>]*>/);
      assert.match(homeHtml, /<a href="\/contact"[^>]*>/);
      assert.match(homeHtml, /https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-M8TZBJ5P/);
      assert.match(homeHtml, /https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-M8TZBJ5P/);
      assert.match(homeHtml, /'gtm\.start'/);

      const penelopeRes = await fetch(`${base}/penelope`);
      assert.equal(penelopeRes.status, 200);
      const penelopeHtml = await penelopeRes.text();
      assert.match(penelopeHtml, /<title>Bonaterra Penelope Custom Reporting Services \| DataCats<\/title>/);
      assert.match(penelopeHtml, /<link rel="canonical" href="https:\/\/datacats\.ca\/penelope" \/>/);
      assert.match(penelopeHtml, /<meta property="og:url" content="https:\/\/datacats\.ca\/penelope" \/>/);
      assert.match(penelopeHtml, /<h1[^>]*>Unlock Your Penelope Client Data—Without the Enterprise Price Tag\.<\/h1>/);
      assert.match(penelopeHtml, /<h2[^>]*>Penelope Reporting Value Pillars<\/h2>/);
      assert.match(penelopeHtml, /"@type":"FAQPage"/);

      const wwwRes = await fetch(`${base}/penelope`, {
        headers: { 'X-Forwarded-Host': 'www.datacats.ca' },
        redirect: 'manual',
      });
      assert.equal(wwwRes.status, 301);
      assert.equal(wwwRes.headers.get('location'), 'https://datacats.ca/penelope');

      const directHostRes = await new Promise((resolve, reject) => {
        const u = new URL(`${base}/penelope`);
        http
          .get({ hostname: u.hostname, port: u.port, path: u.pathname, headers: { Host: 'www.datacats.ca' } }, resolve)
          .on('error', reject);
      });
      assert.equal(directHostRes.statusCode, 301);
      assert.equal(directHostRes.headers.location, 'https://datacats.ca/penelope');

      const httpRes = await fetch(`${base}/contact`, {
        headers: { 'X-Forwarded-Host': 'datacats.ca', 'X-Forwarded-Proto': 'http' },
        redirect: 'manual',
      });
      assert.equal(httpRes.status, 301);
      assert.equal(httpRes.headers.get('location'), 'https://datacats.ca/contact');

      const trailingRes = await fetch(`${base}/presentation/`, { redirect: 'manual' });
      assert.equal(trailingRes.status, 301);
      assert.equal(trailingRes.headers.get('location'), '/presentation');

      const indexHtmlRes = await fetch(`${base}/index.html`, { redirect: 'manual' });
      assert.equal(indexHtmlRes.status, 301);
      assert.equal(indexHtmlRes.headers.get('location'), '/');

      const notFoundRes = await fetch(`${base}/some-missing-page`);
      assert.equal(notFoundRes.status, 404);
      const notFoundHtml = await notFoundRes.text();
      assert.match(notFoundHtml, /<meta name="robots" content="noindex, nofollow" \/>/);
      assert.match(notFoundHtml, /<h1[^>]*>This cat wandered off the chart\.<\/h1>/);
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
