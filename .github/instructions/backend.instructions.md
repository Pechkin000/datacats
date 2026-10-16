---
description: "Use when editing the DataCats Node backend: the lead form endpoint, Microsoft Graph email sending, validation, rate limiting, server tests, or cPanel deployment settings."
applyTo: "server/**"
---
# Backend Guidelines

- CommonJS only, no build step. Passenger on cPanel loads `app.js`; `createApp()` lives in `src/app.js`. Node 18+ built-in `fetch`, no HTTP client library.
- Config comes from environment variables: `TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`, `MAIL_FROM`, `MAIL_TO`, `ALLOWED_ORIGIN`, `DRY_RUN`. List new ones in `server/env.example`. Never hardcode or log secrets, and surface only HTTP status codes from Microsoft errors.
- Email is plain text and sent as `MAIL_FROM`. Reply-To is the visitor so replies go straight to them. Strip control characters from anything placed in a subject.
- Validate and cap every field in `src/lead.js`. A filled `website` honeypot returns success without sending.
- Rate limiting is in-memory per IP in `src/app.js`; the app trusts one proxy hop for the client address.
- Tests use `node:test` in `server/test/`; run `npm test`. Mock Microsoft by replacing `global.fetch`; never call the real token or Graph endpoints in tests.
- Run locally without sending mail: `DRY_RUN=1 node app.js`.
