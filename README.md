# Sequential examples

Examples that install [Sequential](https://www.usesequential.com), session replay and product analytics for websites and web apps.

| Example | What it shows |
|---|---|
| [`nextjs/`](nextjs) | A Next.js App Router app that loads the Sequential SDK from its root layout, with a Deploy with Vercel button. |
| [`google-tag-manager/`](google-tag-manager) | How to add Sequential with a Google Tag Manager Custom HTML tag, check it in Preview mode and fire it only after consent. |

Every example uses the install snippet from your project in Sequential: **Settings → Projects → your project → Setup**.

## Integrations

| Integration | What it does |
|---|---|
| [Sequential release](https://github.com/marketplace/actions/sequential-release) (GitHub Action, [`usesequential/release-action`](https://github.com/usesequential/release-action)) | Records each production deploy as a release in Sequential, with its merged pull requests and the cases that they fix ("Fixes F-12" in a pull request). It has a recipe for Vercel deployments. The CLI is [`@usesequential/release-cli`](https://www.npmjs.com/package/@usesequential/release-cli). See [Cases and fixes](https://www.usesequential.com/docs/findings). |
| [`usesequential/gtm-template`](https://github.com/usesequential/gtm-template) | A Google Tag Manager tag template that loads Sequential. |
| [`usesequential/wordpress-plugin`](https://github.com/usesequential/wordpress-plugin) | A WordPress plugin that adds the Sequential tag to every front-end page. |
| [`@usesequential/browser`](https://www.npmjs.com/package/@usesequential/browser) ([source](https://github.com/usesequential/sequential-browser)) | The browser SDK as an npm package: the same code as the script tag. |
| [`@usesequential/node`](https://www.npmjs.com/package/@usesequential/node) ([source](https://github.com/usesequential/sequential-node)) | The Node.js SDK: send your backend's events and errors to the same person and browser session. |
| [`usesequential/mcp`](https://github.com/usesequential/mcp) | Connect your agent to Sequential's hosted MCP server: configs for Claude Code, claude.ai, Cursor, Codex, Claude Desktop, Cline and Gemini CLI. |
| [`usesequential/claude-plugin`](https://github.com/usesequential/claude-plugin) | The Sequential plugin for Claude Code. |

Docs: [Install Sequential](https://www.usesequential.com/docs/install) · [Sequential SDK](https://www.usesequential.com/docs/sequential) · [Check your install](https://www.usesequential.com/docs/verify)

Questions: hello@usesequential.com

## License

MIT. See [LICENSE](LICENSE).
