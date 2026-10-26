'use strict';

let cached = { token: null, expiresAt: 0 };

function cleanEnv(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/,+$/, '').trim().replace(/^['"]|['"]$/g, '').trim();
}

function config() {
  const TENANT_ID = cleanEnv(process.env.TENANT_ID || process.env.tenantId);
  const CLIENT_ID = cleanEnv(process.env.CLIENT_ID || process.env.clientId);
  const CLIENT_SECRET = cleanEnv(process.env.CLIENT_SECRET || process.env.clientSecret);
  const MAIL_FROM = cleanEnv(process.env.MAIL_FROM || process.env.mailFrom) || 'josh@datacats.ca';
  const MAIL_TO = cleanEnv(process.env.MAIL_TO || process.env.mailTo) || MAIL_FROM;
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
    let code = '';
    try {
      const errBody = await res.json();
      if (Array.isArray(errBody.error_codes) && errBody.error_codes.length) {
        code = ` AADSTS${errBody.error_codes[0]}`;
      } else if (typeof errBody.error === 'string') {
        code = ` ${errBody.error}`;
      }
    } catch {
      // Ignore JSON parse errors
    }
    // Response body can echo configuration details, so only the status and error code are surfaced.
    throw new Error(`Microsoft token request failed (HTTP ${res.status}${code})`);
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

  if (res.status !== 202) {
    let code = '';
    try {
      const errBody = await res.json();
      if (errBody && errBody.error && typeof errBody.error.code === 'string') {
        code = ` ${errBody.error.code}`;
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(`Graph sendMail failed (HTTP ${res.status}${code})`);
  }
}

function maskId(v) {
  if (!v) return '';
  if (v.length <= 8) return `(${v.length})`;
  return `${v.slice(0, 4)}...${v.slice(-4)} (${v.length})`;
}

async function verifyConfig() {
  const c = config();
  const summary = {
    tenantId: maskId(c.TENANT_ID),
    clientId: maskId(c.CLIENT_ID),
    secretLength: c.CLIENT_SECRET ? c.CLIENT_SECRET.length : 0,
    mailFrom: c.MAIL_FROM,
    mailTo: c.MAIL_TO,
  };
  if (!isConfigured()) {
    return { configured: false, summary };
  }
  try {
    await getToken();
    return { configured: true, tokenOk: true, summary };
  } catch (err) {
    return { configured: true, tokenOk: false, error: err.message, summary };
  }
}

module.exports = { sendMail, isConfigured, verifyConfig };
