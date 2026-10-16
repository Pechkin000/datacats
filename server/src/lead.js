'use strict';

const TYPES = ['quick', 'detailed', 'chat'];
const TEAM_SIZES = ['', '1-10', '11-50', '51-200', '200+'];
const WINDOWS = ['', 'morning', 'afternoon', 'evening'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Drops control characters (including CR/LF unless allowed) and caps length.
function clean(value, max, { multiline = false } = {}) {
  if (typeof value !== 'string') return '';
  const pattern = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(pattern, ' ').trim().slice(0, max);
}

function cleanList(value, maxItems, maxLen) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, maxItems)
    .map((v) => clean(v, maxLen))
    .filter(Boolean);
}

// Returns { honeypot: true } for bots, otherwise { errors } or { lead }.
function validateLead(body) {
  if (!body || typeof body !== 'object') return { errors: { form: 'Invalid request' } };

  if (typeof body.website === 'string' && body.website.trim() !== '') return { honeypot: true };

  const type = TYPES.includes(body.type) ? body.type : null;
  const lead = {
    type,
    name: clean(body.name, 100),
    email: clean(body.email, 200),
    phone: clean(body.phone, 50),
    message: clean(body.message, 4000, { multiline: true }),
    company: clean(body.company, 150),
    industry: clean(body.industry, 100),
    teamSize: TEAM_SIZES.includes(body.teamSize) ? body.teamSize : '',
    techStack: cleanList(body.techStack, 12, 60),
    otherTech: clean(body.otherTech, 200),
    painPoints: cleanList(body.painPoints, 12, 100),
    otherPain: clean(body.otherPain, 1000, { multiline: true }),
    wishList: clean(body.wishList, 2000, { multiline: true }),
    preferredWindow: WINDOWS.includes(body.preferredWindow) ? body.preferredWindow : '',
    summary: clean(body.summary, 6000, { multiline: true }),
  };

  const errors = {};
  if (!type) errors.type = 'Unknown form type';
  if (!lead.name) errors.name = 'Name is required';
  if (!EMAIL_RE.test(lead.email)) errors.email = 'A valid email is required';
  if (type === 'quick' && !lead.message) errors.message = 'Message is required';
  if (type === 'detailed' && !lead.company) errors.company = 'Company name is required';
  if (type === 'chat' && !lead.summary) errors.summary = 'Summary is required';

  return Object.keys(errors).length ? { errors } : { lead };
}

const LABELS = { quick: 'Quick message', detailed: 'Discovery intake', chat: 'AI chat summary' };

function line(label, value) {
  return value ? `${label}: ${value}` : null;
}

function formatLead(lead) {
  const parts = [
    line('Name', lead.name),
    line('Email', lead.email),
    line('Phone', lead.phone),
    line('Company', lead.company),
    line('Industry', lead.industry),
    line('Team size', lead.teamSize),
    line('Tech stack', [...lead.techStack, lead.otherTech].filter(Boolean).join(', ')),
    line('Pain points', lead.painPoints.join('; ')),
    line('Other pain points', lead.otherPain),
    line('Ideal dashboard', lead.wishList),
    line('Preferred contact window', lead.preferredWindow),
    lead.message ? `Message:\n${lead.message}` : null,
    lead.summary ? `Chat summary:\n${lead.summary}` : null,
  ].filter(Boolean);

  return {
    subject: `[DataCats] ${LABELS[lead.type]} from ${lead.name}`.slice(0, 200),
    text: `${parts.join('\n')}\n\n--\nSent from the datacats.ca website. Reply to answer ${lead.name} directly.`,
  };
}

module.exports = { validateLead, formatLead };
