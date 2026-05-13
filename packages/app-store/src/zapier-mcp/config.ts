import { Logo } from "./assets/logo";

export default {
  name: "Zapier",
  id: "zapier-mcp",
  category: "ai-automation",
  active: true,
  logo: Logo,
  short_description:
    "Connect CashPanel to 7,000+ apps. Automate reports, alerts, and workflows.",
  description: `Connect CashPanel to Zapier using the Model Context Protocol (MCP).

**What you can do:**
- Automate weekly profit reports to email or Slack
- Get alerts when invoices are overdue
- Sync customer data to Google Sheets or your CRM
- Build custom workflows without code

**How it works:**
1. Add CashPanel as an MCP connection in Zapier
2. Use your CashPanel API key for authentication
3. Create Zaps using CashPanel's 50+ tools`,
  images: [],
  installUrl: "https://cashpanel.io/mcp/zapier",
};
