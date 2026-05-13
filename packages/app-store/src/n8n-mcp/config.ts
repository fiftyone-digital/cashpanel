import { Logo } from "./assets/logo";

export default {
  name: "n8n",
  id: "n8n-mcp",
  category: "ai-automation",
  active: true,
  logo: Logo,
  short_description:
    "Connect n8n workflows to your CashPanel data via MCP. Automate financial tasks with AI agents.",
  description: `Connect n8n to your CashPanel account using the Model Context Protocol (MCP).

**What you can do:**
- Build automated workflows that interact with your financial data
- Create AI agents that can query transactions and invoices
- Automate report generation and notifications
- Integrate CashPanel with 400+ other apps via n8n

**How it works:**
1. Add the CashPanel MCP server URL to your n8n MCP Client node
2. Configure authentication with your CashPanel API key
3. Use the available tools in your workflows and AI agents`,
  images: [],
  installUrl: "https://cashpanel.io/mcp/n8n",
};
