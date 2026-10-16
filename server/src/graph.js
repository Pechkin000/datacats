'use strict';

let cached = { token: null, expiresAt: 0 };

function config() {
  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET, MAIL_FROM } = process.env;
  const MAIL_TO = process.env.MAIL_TO || MAIL_FROM;
  return { TENANT_ID, CLIENT_ID, CLIENT_SECRET, MAIL_FROM, MAIL_TO };
}

function isConfigured() {
  const c = config();
  return Boolean(c.TENANT_ID && c.CLIENT_ID && c.CLIENT_SECRET && c.MAIL_FROM);
}

async function getToken() {
  if (cached.token && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = config();
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(TENANT_ID)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    // Response body can echo configuration details, so only the status is surfaced.
    throw new Error(`Microsoft token request failed (HTTP ${res.status})`);
  }
  const data = await res.json();
  cached = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cached.token;
}

// Sends as MAIL_FROM to MAIL_TO; replyTo is the visitor so answering goes straight to them.
async function sendMail({ subject, text, replyTo }) {
  if (process.env.DRY_RUN === '1') {
    console.log('[dry-run] email not sent\n', JSON.stringify({ subject, replyTo, text }, null, 2));
    return;
  }
  if (!isConfigured()) throw new Error('Mail is not configured');

  const { MAIL_FROM, MAIL_TO } = config();
  const token = await getToken();
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAIL_FROM)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'Text', content: text },
        toRecipients: [{ emailAddress: { address: MAIL_TO } }],
        replyTo: [{ emailAddress: { address: replyTo.email, name: replyTo.name } }],
      },
      saveToSentItems: true,
    }),
  });

  if (res.status !== 202) throw new Error(`Graph sendMail failed (HTTP ${res.status})`);
}

module.exports = { sendMail, isConfigured };
