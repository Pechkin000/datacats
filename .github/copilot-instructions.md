# DataCats Project Guidelines

Always use the `vscode-as-terminal` tool for running shell commands. Do not trigger hidden background tasks.

DataCats Business Intelligence marketing site: a React frontend (`datacats-web/`) plus a small Node backend (`server/`) that emails contact-form leads.

## Working Rules

- Change files with the edit tools. Never paste new file content into chat.
- Model selection is manual: the user picks the model. Do not switch models or retry on another one. Only follow the 9router table in `.github/agents/builder-agent.agent.md` when the user says "9router mode".
- Never commit, print, or paste secrets (API keys, client secrets, tokens). `supporting-scripts/` and `.env*` are git-ignored and must stay that way. Do not open `supporting-scripts/ms.app.json`.
- Do not push, delete files, or run destructive commands unless asked.

## Architecture

- `datacats-web/`: Vite, React 19, TypeScript, Tailwind CSS 3 (not v4), framer-motion, react-router, lucide-react.
- `server/`: Express (CommonJS). `POST /api/lead` emails leads through Microsoft Graph with app-only auth, and serves `datacats-web/dist` in production. In dev, Vite proxies `/api` to port 3001.
- Hosting: Namecheap shared hosting with a cPanel Node.js app. Secrets are environment variables set in cPanel.
- `assets/img/` holds the source brand assets, copied into `datacats-web/public/assets/img/`. The folder for the light-on-dark logos is misspelled `darke-theme`; keep that name.

## Build and Test

- Frontend: `cd datacats-web && npm run dev`, `npm run build`, `npm run lint`. Restart the dev server after editing `tailwind.config.js`.
- Backend: `cd server && npm test`. Run locally without sending mail: `DRY_RUN=1 node app.js`.

## Docs

- Brand and page spec: `docs/site-spec.md`
- Implementation plan: `docs/implementation_plan.md`
- Report samples workflow: `docs/report-samples-workflow.md`
- Status log (keep updated): `docs/current_work.md`
- MCP servers are defined twice and must stay in sync: `.vscode/.copilot/config.json` (Copilot, `mcp.servers`) and `antigravity.mcp.json` (Antigravity, `mcpServers`).
- Open Terminal (`http://10.0.0.149:8888/docs`, bearer key required) is a remote terminal on another machine, not an MCP server. Use the VS Code terminal for project commands.


