import { Logo } from "./assets/logo";

export default {
  name: "Make",
  id: "make-mcp",
  category: "ai-automation",
  active: true,
  logo: Logo,
  short_description:
    "Connect Make scenarios to your CashPanel data via MCP. Build visual automations with financial tools.",
  description: `Connect Make.com to your CashPanel account using the Model Context Protocol (MCP).

**What you can do:**
- Build visual automations that interact with your financial data
- Create scenarios that query transactions and invoices
- Automate report generation and notifications
- Connect CashPanel with 1,500+ apps via Make

**How it works:**
1. Add the MCP Client module to your Make scenario
2. Configure the CashPanel MCP server URL and authentication
3. Select tools and map inputs in the visual builder`,
  images: [],
  installUrl: "https://cashpanel.io/mcp/make",
};
