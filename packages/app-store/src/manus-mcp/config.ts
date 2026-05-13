import { Logo } from "./assets/logo";

export default {
  name: "Manus",
  id: "manus-mcp",
  category: "ai-automation",
  active: true,
  logo: Logo,
  short_description: "Connect Manus to your CashPanel financial data via MCP.",
  description: `Connect Manus to your CashPanel account using the Model Context Protocol (MCP).

**What you can do:**
- Query transactions, invoices, and reports in Manus
- Get financial insights grounded in your real business data
- Automate workflows with your financial data
- Create reports and summaries using natural language

**Setup steps:**
1. In Manus, go to **Settings** and add a new MCP connector
2. Enter the server URL: \`https://api.cashpanel.io/mcp\`
3. Authenticate with your CashPanel account when prompted

**Requirements:** Manus account with MCP connector support.`,
  images: [],
  installUrl: "https://cashpanel.io/mcp/manus",
};
