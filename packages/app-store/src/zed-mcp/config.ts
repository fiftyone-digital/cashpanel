import { Logo } from "./assets/logo";

export default {
  name: "Zed",
  id: "zed-mcp",
  category: "ai-automation",
  active: true,
  logo: Logo,
  short_description:
    "Connect Zed to your CashPanel financial data via MCP with OAuth.",
  description: `Connect Zed to your CashPanel account using the Model Context Protocol (MCP). No API key needed — authentication is handled automatically via OAuth.

**What you can do:**
- Query transactions, invoices, and reports from Zed
- Get financial insights while you code
- Track time and manage invoices without switching apps

**Setup steps:**

**Via Agent Panel:**
1. Open the Agent Panel settings and click **Add Custom Server**
2. Enter the URL: \`https://api.cashpanel.io/mcp\`
3. When prompted, sign in to CashPanel in your browser

**Via settings.json:**
Add to your Zed settings:
\`\`\`json
{
  "context_servers": {
    "cashpanel": {
      "url": "https://api.cashpanel.io/mcp"
    }
  }
}
\`\`\`

**Requirements:** Zed editor installed.`,
  images: [],
  installUrl: "https://cashpanel.io/mcp/zed",
};
