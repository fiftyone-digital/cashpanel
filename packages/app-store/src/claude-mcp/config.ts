import { Logo } from "./assets/logo";

export default {
  name: "Claude",
  id: "claude-mcp",
  category: "ai-automation",
  active: true,
  logo: Logo,
  short_description:
    "Connect Claude to your CashPanel data via MCP with one-click OAuth.",
  description: `Connect Claude to your CashPanel account using the Model Context Protocol (MCP). No API key needed — authentication is handled automatically via OAuth.

**What you can do:**
- Analyze financial trends and patterns
- Get insights from your transaction history
- Ask questions about invoices, customers, and reports
- Have conversations grounded in your real business data

**Setup steps:**

**Claude.ai / Claude Desktop:**
1. Go to **Settings → Connectors** and click **Add custom connector**
2. Paste this URL as the server URL: \`https://api.cashpanel.io/mcp\`
3. When you use a CashPanel tool, you'll be prompted to sign in and select a team

**Claude Code:**
1. Run: \`claude mcp add --transport http cashpanel https://api.cashpanel.io/mcp\`
2. When prompted, sign in to CashPanel in your browser
3. Use @cashpanel in Claude Code to access your financial data`,
  images: [],
  installUrl: "https://cashpanel.io/mcp/claude",
};
