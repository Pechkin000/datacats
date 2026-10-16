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
