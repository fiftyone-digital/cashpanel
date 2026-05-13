// Competitor data for SEO comparison pages

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FeatureComparison {
  category: string;
  features: {
    name: string;
    cashpanel: boolean | string;
    competitor: boolean | string;
  }[];
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
}

export interface Competitor {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  keyDifferences: {
    title: string;
    cashpanel: string;
    competitor: string;
  }[];
  features: FeatureComparison[];
  pricing: {
    cashpanel: PricingTier[];
    competitor: PricingTier[];
    competitorNote?: string;
  };
  switchingSteps: {
    title: string;
    description: string;
  }[];
  faq: FAQItem[];
  targetAudience: string[];
}

export const cashpanelDifferentiators = [
  {
    title: "Built for founders",
    description: "Designed for solo founders and small teams, not accountants",
  },
  {
    title: "Clean, modern interface",
    description: "No clutter, no complexity",
  },
  {
    title: "AI-powered insights",
    description: "Weekly summaries, assistant, automatic categorization",
  },
  {
    title: "Everything in one place",
    description: "Transactions, invoicing, time tracking, receipts",
  },
];

export const cashpanelPricing: PricingTier[] = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    features: [
      "Invoicing and payments",
      "Transactions and bank sync",
      "Inbox and receipt matching",
      "Time tracking",
      "Financial overview and reports",
      "AI assistant",
      "Vault",
      "Accounting exports",
      "Multi-currency",
      "API, CLI, and MCP",
      "3 banks · 15 invoices/mo · 10GB storage",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Starter",
      "10 banks · 50 invoices/mo · 100GB storage",
      "Custom transaction categories",
      "Invoice templates",
      "Customer portal",
      "Customer enrichment",
      "Advanced AI insights",
      "Priority support",
    ],
  },
];

export const competitors: Competitor[] = [
  {
    id: "quickbooks",
    slug: "quickbooks-alternative",
    name: "QuickBooks",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a QuickBooks alternative? CashPanel offers a cleaner, founder-friendly approach to business finances without the accounting complexity.",
    keyDifferences: [
      {
        title: "Target User",
        cashpanel: "Founders and small teams",
        competitor: "Accountants and bookkeepers",
      },
      {
        title: "Learning Curve",
        cashpanel: "Intuitive, no training needed",
        competitor: "Steep learning curve",
      },
      {
        title: "Interface",
        cashpanel: "Clean, modern design",
        competitor: "Complex, feature-heavy",
      },
      {
        title: "AI Features",
        cashpanel: "Built-in AI assistant and insights",
        competitor: "Limited AI capabilities",
      },
    ],
    features: [
      {
        category: "Core Features",
        features: [
          { name: "Bank connections", cashpanel: true, competitor: true },
          {
            name: "Transaction categorization",
            cashpanel: true,
            competitor: true,
          },
          { name: "Invoicing", cashpanel: true, competitor: true },
          { name: "Receipt capture", cashpanel: true, competitor: true },
          { name: "Time tracking", cashpanel: true, competitor: "Add-on" },
          { name: "AI-powered insights", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
        ],
      },
      {
        category: "User Experience",
        features: [
          { name: "Modern interface", cashpanel: true, competitor: false },
          { name: "Mobile app", cashpanel: true, competitor: true },
          {
            name: "No accounting knowledge required",
            cashpanel: true,
            competitor: false,
          },
          {
            name: "Quick setup (under 5 min)",
            cashpanel: true,
            competitor: false,
          },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Simple Start",
          price: "$30",
          period: "/month",
          features: [
            "Income & expenses",
            "Invoices & payments",
            "Tax deductions",
            "Mileage tracking",
            "1 user",
          ],
        },
        {
          name: "Essentials",
          price: "$60",
          period: "/month",
          features: [
            "Everything in Simple Start",
            "Bill management",
            "Time tracking",
            "3 users",
          ],
        },
        {
          name: "Plus",
          price: "$90",
          period: "/month",
          features: [
            "Everything in Essentials",
            "Inventory tracking",
            "Project profitability",
            "5 users",
          ],
        },
      ],
      competitorNote: "Prices increase after promotional period ends",
    },
    switchingSteps: [
      {
        title: "Export your data from QuickBooks",
        description:
          "Download your transaction history and customer list as CSV files from QuickBooks.",
      },
      {
        title: "Sign up for CashPanel",
        description:
          "Create your CashPanel account and connect your bank accounts directly.",
      },
      {
        title: "Import your customers",
        description:
          "Add your existing customers to continue invoicing seamlessly.",
      },
      {
        title: "Start fresh with automatic sync",
        description:
          "Your transactions will sync automatically going forward. No manual entry needed.",
      },
    ],
    faq: [
      {
        question: "Is CashPanel a full replacement for QuickBooks?",
        answer:
          "CashPanel is designed for founders who want financial clarity without accounting complexity. If you need advanced accounting features like inventory management or payroll, QuickBooks may be more suitable. But if you want a clean overview of your business finances with less overhead, CashPanel is the better choice.",
      },
      {
        question: "Can my accountant still access my data?",
        answer:
          "Yes. You can export your transactions and reports at any time, or give your accountant direct access to your CashPanel account.",
      },
      {
        question: "What about tax preparation?",
        answer:
          "CashPanel categorizes your transactions and tracks receipts, making tax prep straightforward. You can export everything your accountant needs at tax time.",
      },
      {
        question: "How does pricing compare long-term?",
        answer:
          "CashPanel's pricing is transparent and consistent. QuickBooks often increases prices after promotional periods and charges extra for features like time tracking. With CashPanel, you get more included at a predictable price.",
      },
    ],
    targetAudience: [
      "Solo founders who find QuickBooks overwhelming",
      "Small teams that don't need full accounting software",
      "Founders who want financial clarity without hiring a bookkeeper",
      "Teams that value modern, well-designed tools",
    ],
  },
  {
    id: "freshbooks",
    slug: "freshbooks-alternative",
    name: "FreshBooks",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a FreshBooks alternative? CashPanel combines invoicing with transactions, time tracking, and AI-powered insights in one unified workspace.",
    keyDifferences: [
      {
        title: "Focus",
        cashpanel: "Complete financial workspace",
        competitor: "Primarily invoicing",
      },
      {
        title: "Bank Connections",
        cashpanel: "25,000+ banks worldwide",
        competitor: "Limited bank support",
      },
      {
        title: "AI Features",
        cashpanel: "Built-in AI assistant",
        competitor: "Basic automation only",
      },
      {
        title: "Pricing Model",
        cashpanel: "Simple, transparent tiers",
        competitor: "Per-client pricing limits",
      },
    ],
    features: [
      {
        category: "Core Features",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: true },
          { name: "Time tracking", cashpanel: true, competitor: true },
          { name: "Expense tracking", cashpanel: true, competitor: true },
          {
            name: "Bank connections",
            cashpanel: "25,000+ banks",
            competitor: "Limited",
          },
          { name: "AI-powered insights", cashpanel: true, competitor: false },
          {
            name: "Receipt matching",
            cashpanel: "Automatic",
            competitor: "Manual",
          },
        ],
      },
      {
        category: "Workflow",
        features: [
          {
            name: "Weekly financial summaries",
            cashpanel: true,
            competitor: false,
          },
          { name: "Unified dashboard", cashpanel: true, competitor: false },
          { name: "Project-based billing", cashpanel: true, competitor: true },
          { name: "Recurring invoices", cashpanel: true, competitor: true },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Lite",
          price: "$19",
          period: "/month",
          features: [
            "5 billable clients",
            "Unlimited invoices",
            "Expense tracking",
            "Time tracking",
          ],
        },
        {
          name: "Plus",
          price: "$33",
          period: "/month",
          features: [
            "50 billable clients",
            "Automatic receipt capture",
            "Double-entry accounting",
            "Business health reports",
          ],
        },
        {
          name: "Premium",
          price: "$60",
          period: "/month",
          features: [
            "Unlimited clients",
            "Project profitability",
            "Email customization",
            "Dedicated support",
          ],
        },
      ],
      competitorNote: "Client limits can be restrictive as you grow",
    },
    switchingSteps: [
      {
        title: "Export invoices and clients",
        description:
          "Download your client list and invoice history from FreshBooks.",
      },
      {
        title: "Create your CashPanel account",
        description:
          "Sign up and connect your bank accounts for automatic transaction sync.",
      },
      {
        title: "Import your customer data",
        description: "Add your clients to start sending invoices right away.",
      },
      {
        title: "Set up your invoice template",
        description:
          "Customize your invoice design and payment terms in CashPanel.",
      },
    ],
    faq: [
      {
        question: "How does invoicing compare?",
        answer:
          "Both offer professional invoicing, but CashPanel connects your invoices directly to your bank transactions and provides AI-powered insights into your cash flow. You get the full picture, not just the invoice.",
      },
      {
        question: "What about the client limit?",
        answer:
          "Unlike FreshBooks, CashPanel doesn't limit how many clients you can bill. Pay one price and invoice as many clients as you need.",
      },
      {
        question: "Is time tracking included?",
        answer:
          "Yes, time tracking is included in all CashPanel plans and connects directly to invoicing and project tracking.",
      },
    ],
    targetAudience: [
      "Freelancers outgrowing FreshBooks client limits",
      "Founders who want more than just invoicing",
      "Teams that need better bank connectivity",
      "Users who want AI-powered financial insights",
    ],
  },
  {
    id: "xero",
    slug: "xero-alternative",
    name: "Xero",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Xero alternative? CashPanel offers founder-friendly financial management without the accounting complexity.",
    keyDifferences: [
      {
        title: "Design Philosophy",
        cashpanel: "Built for founders",
        competitor: "Built for accountants",
      },
      {
        title: "Complexity",
        cashpanel: "Simple and intuitive",
        competitor: "Full accounting system",
      },
      {
        title: "Setup Time",
        cashpanel: "Under 5 minutes",
        competitor: "Hours to configure",
      },
      {
        title: "AI Features",
        cashpanel: "Native AI assistant",
        competitor: "Third-party add-ons",
      },
    ],
    features: [
      {
        category: "Core Features",
        features: [
          { name: "Bank feeds", cashpanel: true, competitor: true },
          { name: "Invoicing", cashpanel: true, competitor: true },
          { name: "Expense claims", cashpanel: true, competitor: true },
          {
            name: "Time tracking",
            cashpanel: "Built-in",
            competitor: "Add-on",
          },
          { name: "AI insights", cashpanel: true, competitor: false },
          {
            name: "Receipt capture",
            cashpanel: "Automatic",
            competitor: "Manual",
          },
        ],
      },
      {
        category: "Ease of Use",
        features: [
          {
            name: "No accounting knowledge needed",
            cashpanel: true,
            competitor: false,
          },
          { name: "Quick setup", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
          { name: "Clean dashboard", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Starter",
          price: "$29",
          period: "/month",
          features: [
            "Send 20 invoices",
            "Enter 5 bills",
            "Bank reconciliation",
            "Capture bills and receipts",
          ],
        },
        {
          name: "Standard",
          price: "$46",
          period: "/month",
          features: [
            "Unlimited invoices",
            "Unlimited bills",
            "Bulk reconcile",
            "Multi-currency",
          ],
        },
        {
          name: "Premium",
          price: "$62",
          period: "/month",
          features: [
            "Everything in Standard",
            "Multi-currency",
            "Expense management",
            "Project tracking",
          ],
        },
      ],
      competitorNote: "Invoice and bill limits on lower tiers",
    },
    switchingSteps: [
      {
        title: "Export your Xero data",
        description:
          "Download your contacts and transaction history as CSV files.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Import customers",
        description: "Add your existing customers to continue invoicing.",
      },
      {
        title: "Let CashPanel sync automatically",
        description:
          "Your transactions will flow in automatically. No more manual reconciliation.",
      },
    ],
    faq: [
      {
        question: "Is CashPanel suitable for complex accounting needs?",
        answer:
          "CashPanel is designed for founders who want clarity over their finances, not complex accounting. If you need features like multi-entity consolidation or detailed inventory tracking, Xero might be more appropriate. But for most founders and small teams, CashPanel provides everything you need with far less complexity.",
      },
      {
        question: "Can I still work with my accountant?",
        answer:
          "Absolutely. You can export your data anytime or invite your accountant to access your CashPanel account directly.",
      },
      {
        question: "What about Xero's app marketplace?",
        answer:
          "CashPanel has a growing integration ecosystem, and many features that require add-ons in Xero (like time tracking) are built directly into CashPanel.",
      },
    ],
    targetAudience: [
      "Founders overwhelmed by Xero's complexity",
      "Small teams that don't need full accounting",
      "Users frustrated with Xero's invoice limits",
      "Teams wanting built-in time tracking",
    ],
  },
  {
    id: "wave",
    slug: "wave-alternative",
    name: "Wave",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Wave alternative? CashPanel offers premium features, better bank connectivity, and AI-powered insights at a fair price.",
    keyDifferences: [
      {
        title: "Bank Connectivity",
        cashpanel: "25,000+ banks worldwide",
        competitor: "US and Canada only",
      },
      {
        title: "AI Features",
        cashpanel: "Built-in AI assistant",
        competitor: "None",
      },
      {
        title: "Support",
        cashpanel: "Included in all plans",
        competitor: "Paid add-on",
      },
      {
        title: "Revenue Model",
        cashpanel: "Subscription (transparent)",
        competitor: "Free + payment fees",
      },
    ],
    features: [
      {
        category: "Core Features",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: true },
          { name: "Expense tracking", cashpanel: true, competitor: true },
          {
            name: "Bank connections",
            cashpanel: "Global",
            competitor: "US/Canada",
          },
          { name: "Receipt scanning", cashpanel: true, competitor: true },
          { name: "Time tracking", cashpanel: true, competitor: false },
          { name: "AI insights", cashpanel: true, competitor: false },
        ],
      },
      {
        category: "Business Features",
        features: [
          { name: "Weekly summaries", cashpanel: true, competitor: false },
          { name: "Customer portal", cashpanel: true, competitor: false },
          {
            name: "Multiple currencies",
            cashpanel: true,
            competitor: "Limited",
          },
          {
            name: "Team collaboration",
            cashpanel: true,
            competitor: "Limited",
          },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Free",
          price: "$0",
          period: "",
          features: [
            "Unlimited invoicing",
            "Expense tracking",
            "Basic reports",
            "Single user",
          ],
        },
        {
          name: "Pro",
          price: "$16",
          period: "/month",
          features: [
            "Unlimited bank connections",
            "Unlimited receipt scanning",
            "Priority support",
          ],
        },
      ],
      competitorNote: "Payment processing fees: 2.9% + $0.60 per transaction",
    },
    switchingSteps: [
      {
        title: "Export from Wave",
        description:
          "Download your customer list and transaction data from Wave.",
      },
      {
        title: "Create your CashPanel account",
        description: "Sign up and connect your bank accounts globally.",
      },
      {
        title: "Import your data",
        description: "Add your customers and start with a clean slate.",
      },
      {
        title: "Enjoy premium features",
        description:
          "Access time tracking, AI insights, and global bank support.",
      },
    ],
    faq: [
      {
        question: "Why pay for CashPanel when Wave is free?",
        answer:
          "Wave's free model is supported by payment processing fees and limited features. CashPanel includes time tracking, AI insights, global bank support, and priority support. For growing businesses, the value far exceeds the cost.",
      },
      {
        question: "What if I'm outside the US or Canada?",
        answer:
          "CashPanel connects to over 25,000 banks worldwide. Wave's bank connections are limited to North America.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Yes, CashPanel offers a 14-day free trial so you can experience all features before committing.",
      },
    ],
    targetAudience: [
      "Users outside North America needing bank connections",
      "Growing businesses needing time tracking",
      "Teams wanting AI-powered insights",
      "Users needing better support",
    ],
  },
  {
    id: "zoho-books",
    slug: "zoho-books-alternative",
    name: "Zoho Books",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Zoho Books alternative? CashPanel offers a cleaner, more focused experience without the complexity of a massive software suite.",
    keyDifferences: [
      {
        title: "Focus",
        cashpanel: "Purpose-built for founders",
        competitor: "Part of large software suite",
      },
      {
        title: "Simplicity",
        cashpanel: "One tool, one login",
        competitor: "Complex ecosystem",
      },
      {
        title: "Interface",
        cashpanel: "Modern, clean design",
        competitor: "Dated, busy interface",
      },
      {
        title: "AI Features",
        cashpanel: "Native AI assistant",
        competitor: "Zia AI (limited)",
      },
    ],
    features: [
      {
        category: "Core Features",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: true },
          { name: "Expense tracking", cashpanel: true, competitor: true },
          { name: "Bank feeds", cashpanel: true, competitor: true },
          {
            name: "Time tracking",
            cashpanel: "Built-in",
            competitor: "Separate app",
          },
          { name: "AI insights", cashpanel: true, competitor: "Basic" },
          { name: "Receipt capture", cashpanel: true, competitor: true },
        ],
      },
      {
        category: "User Experience",
        features: [
          { name: "Modern interface", cashpanel: true, competitor: false },
          { name: "Single platform", cashpanel: true, competitor: false },
          { name: "No upsells", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Free",
          price: "$0",
          period: "",
          features: ["1,000 invoices/year", "1 user", "Limited features"],
        },
        {
          name: "Standard",
          price: "$20",
          period: "/month",
          features: ["5,000 invoices/year", "3 users", "Bank feeds"],
        },
        {
          name: "Professional",
          price: "$50",
          period: "/month",
          features: ["Unlimited invoices", "5 users", "Purchase orders"],
        },
      ],
      competitorNote: "Time tracking requires Zoho Projects (additional cost)",
    },
    switchingSteps: [
      {
        title: "Export from Zoho Books",
        description: "Download your contacts and transactions as CSV files.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account in minutes.",
      },
      {
        title: "Connect your banks",
        description: "Link your bank accounts for automatic transaction sync.",
      },
      {
        title: "Start fresh",
        description: "Enjoy a simpler, more focused financial workspace.",
      },
    ],
    faq: [
      {
        question: "What about the Zoho ecosystem?",
        answer:
          "If you're heavily invested in Zoho's suite, their integrations can be valuable. But if you find yourself only using Zoho Books and paying for complexity you don't need, CashPanel offers a cleaner alternative.",
      },
      {
        question: "Is time tracking really included?",
        answer:
          "Yes! Unlike Zoho, which requires a separate Zoho Projects subscription for time tracking, CashPanel includes it in all plans.",
      },
      {
        question: "Can I migrate my data?",
        answer:
          "Yes, you can export your data from Zoho Books and set up fresh in CashPanel. Your bank transactions will sync automatically.",
      },
    ],
    targetAudience: [
      "Users overwhelmed by Zoho's ecosystem",
      "Teams wanting time tracking included",
      "Founders preferring modern interfaces",
      "Users tired of constant upsells",
    ],
  },
  {
    id: "harvest",
    slug: "harvest-alternative",
    name: "Harvest",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Harvest alternative? CashPanel combines time tracking with full financial management, invoicing, and AI-powered insights.",
    keyDifferences: [
      {
        title: "Scope",
        cashpanel: "Complete financial workspace",
        competitor: "Time tracking focused",
      },
      {
        title: "Bank Integration",
        cashpanel: "Full bank connectivity",
        competitor: "None",
      },
      {
        title: "Financial Insights",
        cashpanel: "AI-powered analytics",
        competitor: "Time reports only",
      },
      {
        title: "Value",
        cashpanel: "All-in-one solution",
        competitor: "Need additional tools",
      },
    ],
    features: [
      {
        category: "Time & Projects",
        features: [
          { name: "Time tracking", cashpanel: true, competitor: true },
          { name: "Project tracking", cashpanel: true, competitor: true },
          { name: "Team timesheets", cashpanel: true, competitor: true },
          { name: "Budget tracking", cashpanel: true, competitor: true },
          { name: "Invoicing from time", cashpanel: true, competitor: true },
        ],
      },
      {
        category: "Financial Management",
        features: [
          { name: "Bank connections", cashpanel: true, competitor: false },
          { name: "Expense tracking", cashpanel: true, competitor: true },
          {
            name: "Transaction categorization",
            cashpanel: true,
            competitor: false,
          },
          { name: "AI insights", cashpanel: true, competitor: false },
          { name: "Cash flow visibility", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Free",
          price: "$0",
          period: "",
          features: ["1 seat", "2 projects", "Basic features"],
        },
        {
          name: "Pro",
          price: "$12",
          period: "/seat/month",
          features: ["Unlimited projects", "Invoicing", "Integrations"],
        },
      ],
      competitorNote: "Per-seat pricing adds up quickly for teams",
    },
    switchingSteps: [
      {
        title: "Export your Harvest data",
        description: "Download your projects, clients, and time entries.",
      },
      {
        title: "Create your CashPanel account",
        description: "Sign up and connect your bank accounts.",
      },
      {
        title: "Set up your projects",
        description: "Recreate your project structure for time tracking.",
      },
      {
        title: "Enjoy the full picture",
        description: "See time tracking alongside your complete finances.",
      },
    ],
    faq: [
      {
        question: "How does time tracking compare?",
        answer:
          "CashPanel offers comparable time tracking features, but connects them directly to your bank transactions, invoicing, and financial insights. You get the full picture of your business, not just hours tracked.",
      },
      {
        question: "What about team management?",
        answer:
          "CashPanel supports team members with time tracking and includes them in your overall business view. Unlike Harvest's per-seat pricing, CashPanel offers predictable team pricing.",
      },
      {
        question: "Can I still invoice based on tracked time?",
        answer:
          "Yes! You can create invoices directly from tracked time, just like in Harvest, but with the added benefit of seeing how those invoices flow into your overall financial picture.",
      },
    ],
    targetAudience: [
      "Teams needing more than just time tracking",
      "Founders wanting to see the full financial picture",
      "Users tired of per-seat pricing",
      "Businesses needing bank connectivity",
    ],
  },
  {
    id: "expensify",
    slug: "expensify-alternative",
    name: "Expensify",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for an Expensify alternative? CashPanel handles expenses as part of a complete financial workspace with invoicing, time tracking, and insights.",
    keyDifferences: [
      {
        title: "Scope",
        cashpanel: "Complete financial workspace",
        competitor: "Expense management only",
      },
      {
        title: "Simplicity",
        cashpanel: "One tool for everything",
        competitor: "Single-purpose tool",
      },
      {
        title: "Pricing",
        cashpanel: "Simple monthly fee",
        competitor: "Per-user pricing",
      },
      {
        title: "AI Features",
        cashpanel: "Full AI assistant",
        competitor: "SmartScan only",
      },
    ],
    features: [
      {
        category: "Expense Management",
        features: [
          { name: "Receipt scanning", cashpanel: true, competitor: true },
          {
            name: "Automatic categorization",
            cashpanel: true,
            competitor: true,
          },
          { name: "Bank connections", cashpanel: true, competitor: true },
          { name: "Expense reports", cashpanel: true, competitor: true },
          { name: "Mileage tracking", cashpanel: false, competitor: true },
        ],
      },
      {
        category: "Additional Features",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: "Limited" },
          { name: "Time tracking", cashpanel: true, competitor: false },
          { name: "AI insights", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
          { name: "Project tracking", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Collect",
          price: "$5",
          period: "/user/month",
          features: [
            "Unlimited SmartScans",
            "Expense reports",
            "Basic approvals",
          ],
        },
        {
          name: "Control",
          price: "$9",
          period: "/user/month",
          features: [
            "Everything in Collect",
            "Company cards",
            "Advanced policies",
            "Multi-level approvals",
          ],
        },
      ],
      competitorNote: "Per-user pricing scales quickly",
    },
    switchingSteps: [
      {
        title: "Export from Expensify",
        description: "Download your expense reports and transaction history.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Set up receipt forwarding",
        description: "Forward receipts via email or upload them directly.",
      },
      {
        title: "Enjoy the complete picture",
        description: "See expenses alongside invoices, time, and cash flow.",
      },
    ],
    faq: [
      {
        question: "Is receipt scanning as good as Expensify?",
        answer:
          "CashPanel uses advanced OCR and AI to capture receipt data automatically. While Expensify pioneered SmartScan, CashPanel's receipt capture is comparable and connects to your full financial picture.",
      },
      {
        question: "What about expense policies and approvals?",
        answer:
          "CashPanel is designed for founders and small teams where complex approval workflows aren't needed. If you require enterprise expense policies, Expensify may be more suitable.",
      },
      {
        question: "Can I track mileage?",
        answer:
          "Mileage tracking isn't built into CashPanel currently. If this is essential, you might use a dedicated mileage app alongside CashPanel for your other financial needs.",
      },
    ],
    targetAudience: [
      "Founders needing more than expense tracking",
      "Small teams tired of per-user pricing",
      "Users wanting invoicing and time tracking too",
      "Teams wanting a unified financial view",
    ],
  },
  {
    id: "mint",
    slug: "mint-alternative",
    name: "Mint",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Mint alternative for your business? CashPanel is built specifically for founders and small teams, not personal finance.",
    keyDifferences: [
      {
        title: "Purpose",
        cashpanel: "Business finances",
        competitor: "Personal finance",
      },
      {
        title: "Invoicing",
        cashpanel: "Full invoicing suite",
        competitor: "None",
      },
      {
        title: "Time Tracking",
        cashpanel: "Built-in",
        competitor: "None",
      },
      {
        title: "Business Features",
        cashpanel: "Receipts, projects, clients",
        competitor: "Personal budgets only",
      },
    ],
    features: [
      {
        category: "Financial Tracking",
        features: [
          { name: "Bank connections", cashpanel: true, competitor: true },
          {
            name: "Transaction categorization",
            cashpanel: true,
            competitor: true,
          },
          { name: "Spending insights", cashpanel: true, competitor: true },
          {
            name: "Cash flow tracking",
            cashpanel: true,
            competitor: "Limited",
          },
          {
            name: "Business categorization",
            cashpanel: true,
            competitor: false,
          },
        ],
      },
      {
        category: "Business Features",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: false },
          { name: "Time tracking", cashpanel: true, competitor: false },
          { name: "Receipt capture", cashpanel: true, competitor: false },
          { name: "Client management", cashpanel: true, competitor: false },
          { name: "AI assistant", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Free",
          price: "$0",
          period: "",
          features: ["Personal budgets", "Bill tracking", "Credit monitoring"],
        },
      ],
      competitorNote:
        "Mint is being sunset - Credit Karma now handles some features",
    },
    switchingSteps: [
      {
        title: "Separate personal and business",
        description: "Identify which accounts are for your business.",
      },
      {
        title: "Sign up for CashPanel",
        description:
          "Create your account and connect your business bank accounts.",
      },
      {
        title: "Set up business categories",
        description:
          "CashPanel's categories are designed for business expenses.",
      },
      {
        title: "Add invoicing and time tracking",
        description: "Start using the business features Mint never had.",
      },
    ],
    faq: [
      {
        question: "Why switch from Mint?",
        answer:
          "Mint was designed for personal finance. As a founder, you need invoicing, receipt tracking, time tracking, and business insights. CashPanel is purpose-built for running a business.",
      },
      {
        question: "What about personal finances?",
        answer:
          "We recommend keeping personal and business finances separate. Use CashPanel for your business, and a personal finance app for personal accounts.",
      },
      {
        question: "Is CashPanel free like Mint?",
        answer:
          "CashPanel is a paid service because running a business requires premium features and support. The value you get far exceeds the cost when you factor in time saved and insights gained.",
      },
    ],
    targetAudience: [
      "Founders using Mint for their business",
      "Users needing actual business features",
      "People starting a business and needing proper tools",
      "Mint users affected by the shutdown",
    ],
  },
  {
    id: "toggl",
    slug: "toggl-alternative",
    name: "Toggl",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Toggl alternative? CashPanel combines time tracking with invoicing, transactions, and AI-powered insights for the complete picture.",
    keyDifferences: [
      {
        title: "Scope",
        cashpanel: "Complete financial workspace",
        competitor: "Time tracking only",
      },
      {
        title: "Financial Integration",
        cashpanel: "Bank connections included",
        competitor: "None",
      },
      {
        title: "Invoicing",
        cashpanel: "Built-in from tracked time",
        competitor: "Requires separate tool",
      },
      {
        title: "Business Insights",
        cashpanel: "AI-powered analytics",
        competitor: "Time reports only",
      },
    ],
    features: [
      {
        category: "Time Tracking",
        features: [
          { name: "Timer", cashpanel: true, competitor: true },
          { name: "Manual entry", cashpanel: true, competitor: true },
          { name: "Project tracking", cashpanel: true, competitor: true },
          { name: "Team timesheets", cashpanel: true, competitor: true },
          { name: "Desktop app", cashpanel: true, competitor: true },
          { name: "Mobile app", cashpanel: true, competitor: true },
        ],
      },
      {
        category: "Financial Management",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: false },
          { name: "Bank connections", cashpanel: true, competitor: false },
          { name: "Expense tracking", cashpanel: true, competitor: false },
          { name: "Receipt capture", cashpanel: true, competitor: false },
          { name: "Cash flow insights", cashpanel: true, competitor: false },
          { name: "AI assistant", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Free",
          price: "$0",
          period: "",
          features: ["Time tracking", "5 users", "Basic reports"],
        },
        {
          name: "Starter",
          price: "$10",
          period: "/user/month",
          features: ["Billable rates", "Project time estimates", "Alerts"],
        },
        {
          name: "Premium",
          price: "$20",
          period: "/user/month",
          features: ["Time audits", "Project forecasts", "Priority support"],
        },
      ],
      competitorNote: "Per-user pricing adds up for growing teams",
    },
    switchingSteps: [
      {
        title: "Export your Toggl data",
        description:
          "Download your projects, clients, and time entries as CSV.",
      },
      {
        title: "Create your CashPanel account",
        description: "Sign up and connect your bank accounts.",
      },
      {
        title: "Set up projects and clients",
        description: "Recreate your project structure in CashPanel.",
      },
      {
        title: "Start tracking with context",
        description:
          "See your time alongside invoices, expenses, and cash flow.",
      },
    ],
    faq: [
      {
        question: "Is time tracking as powerful as Toggl?",
        answer:
          "CashPanel offers solid time tracking with timers, manual entry, project tracking, and team support. While Toggl has some advanced features like automated tracking, CashPanel gives you time tracking plus complete financial management in one place.",
      },
      {
        question: "What about integrations?",
        answer:
          "Toggl has 100+ integrations, many for syncing time to other tools. CashPanel reduces integration needs by including invoicing and finances directly. You may need fewer tools overall.",
      },
      {
        question: "How does pricing compare?",
        answer:
          "Toggl charges per user, which adds up quickly. CashPanel's team pricing is more predictable, and you get invoicing, bank connections, and AI insights included.",
      },
    ],
    targetAudience: [
      "Founders needing more than time tracking",
      "Teams wanting invoicing from tracked time",
      "Users tired of per-seat pricing",
      "Businesses needing financial visibility",
    ],
  },
  {
    id: "clockify",
    slug: "clockify-alternative",
    name: "Clockify",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Clockify alternative? CashPanel offers time tracking plus invoicing, bank connections, and AI-powered financial insights in one workspace.",
    keyDifferences: [
      {
        title: "Scope",
        cashpanel: "Complete financial workspace",
        competitor: "Time tracking only",
      },
      {
        title: "Financial Features",
        cashpanel: "Bank connections + invoicing",
        competitor: "None",
      },
      {
        title: "Business Insights",
        cashpanel: "AI-powered analytics",
        competitor: "Time reports only",
      },
      {
        title: "Pricing",
        cashpanel: "All-inclusive",
        competitor: "Free + paid add-ons",
      },
    ],
    features: [
      {
        category: "Time Tracking",
        features: [
          { name: "Timer", cashpanel: true, competitor: true },
          { name: "Manual entry", cashpanel: true, competitor: true },
          { name: "Project tracking", cashpanel: true, competitor: true },
          { name: "Team timesheets", cashpanel: true, competitor: true },
          { name: "Desktop app", cashpanel: true, competitor: true },
          { name: "Mobile app", cashpanel: true, competitor: true },
          { name: "Unlimited tracking", cashpanel: true, competitor: true },
        ],
      },
      {
        category: "Financial Management",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: "Basic" },
          { name: "Bank connections", cashpanel: true, competitor: false },
          {
            name: "Expense tracking",
            cashpanel: true,
            competitor: "Paid add-on",
          },
          { name: "Receipt capture", cashpanel: true, competitor: false },
          { name: "Cash flow insights", cashpanel: true, competitor: false },
          { name: "AI assistant", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Free",
          price: "$0",
          period: "",
          features: ["Unlimited tracking", "Unlimited users", "Basic reports"],
        },
        {
          name: "Basic",
          price: "$4.99",
          period: "/user/month",
          features: ["Time off", "Targets", "Custom fields"],
        },
        {
          name: "Standard",
          price: "$6.99",
          period: "/user/month",
          features: ["Timesheet approvals", "Invoicing", "Scheduling"],
        },
        {
          name: "Pro",
          price: "$9.99",
          period: "/user/month",
          features: ["GPS tracking", "Screenshots", "Labor costs"],
        },
      ],
      competitorNote: "Many features require paid upgrades",
    },
    switchingSteps: [
      {
        title: "Export your Clockify data",
        description:
          "Download your time entries, projects, and clients as CSV.",
      },
      {
        title: "Create your CashPanel account",
        description: "Sign up and connect your bank accounts.",
      },
      {
        title: "Set up your projects",
        description: "Recreate your project structure in CashPanel.",
      },
      {
        title: "Experience the full picture",
        description: "See time tracking connected to invoices and cash flow.",
      },
    ],
    faq: [
      {
        question: "Clockify is free - why pay for CashPanel?",
        answer:
          "Clockify's free tier is generous for time tracking alone, but you'll need additional paid tools for invoicing, expense tracking, and financial visibility. CashPanel includes everything in one workspace, saving you the cost and complexity of multiple tools.",
      },
      {
        question: "How does time tracking compare?",
        answer:
          "Both offer solid time tracking with timers, manual entry, and project tracking. The difference is that CashPanel connects your tracked time directly to invoicing, bank transactions, and financial insights.",
      },
      {
        question: "What about the unlimited free users?",
        answer:
          "Clockify's free plan is great for teams just tracking time. But once you need invoicing, expense tracking, or financial insights, you'll pay per user for multiple tools. CashPanel's predictable pricing includes everything.",
      },
    ],
    targetAudience: [
      "Teams outgrowing Clockify's free features",
      "Founders needing invoicing and financial tracking",
      "Users tired of cobbling together multiple tools",
      "Teams wanting bank connectivity with time tracking",
    ],
  },
  {
    id: "bench",
    slug: "bench-alternative",
    name: "Bench",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Bench alternative? CashPanel gives you real-time financial visibility and control, without waiting for monthly bookkeeper reports.",
    keyDifferences: [
      {
        title: "Access",
        cashpanel: "Real-time, self-service",
        competitor: "Monthly bookkeeper reports",
      },
      {
        title: "Control",
        cashpanel: "You're in control",
        competitor: "Dependent on bookkeeper",
      },
      {
        title: "Speed",
        cashpanel: "Instant insights",
        competitor: "Wait for month-end",
      },
      {
        title: "Cost",
        cashpanel: "From $19/mo",
        competitor: "$299+/month",
      },
    ],
    features: [
      {
        category: "Financial Management",
        features: [
          { name: "Bank connections", cashpanel: true, competitor: true },
          {
            name: "Transaction categorization",
            cashpanel: "Automatic + AI",
            competitor: "Done by bookkeeper",
          },
          { name: "Real-time visibility", cashpanel: true, competitor: false },
          {
            name: "Financial reports",
            cashpanel: "Instant",
            competitor: "Monthly",
          },
          {
            name: "Tax-ready books",
            cashpanel: "Export anytime",
            competitor: true,
          },
        ],
      },
      {
        category: "Additional Features",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: false },
          { name: "Time tracking", cashpanel: true, competitor: false },
          { name: "Receipt capture", cashpanel: true, competitor: true },
          { name: "AI assistant", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Bookkeeping",
          price: "$299",
          period: "/month",
          features: [
            "Monthly bookkeeping",
            "Year-end financial package",
            "Direct messaging",
          ],
        },
        {
          name: "Bookkeeping + Tax",
          price: "$499",
          period: "/month",
          features: ["Everything in Bookkeeping", "Tax filing", "Tax advisory"],
        },
      ],
      competitorNote: "Prices for businesses with <$20k monthly expenses",
    },
    switchingSteps: [
      {
        title: "Download your Bench reports",
        description: "Get your financial statements and transaction history.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Let CashPanel categorize",
        description: "AI-powered categorization starts working immediately.",
      },
      {
        title: "Enjoy real-time access",
        description: "No more waiting for monthly reports.",
      },
    ],
    faq: [
      {
        question: "Is CashPanel a replacement for bookkeeping?",
        answer:
          "CashPanel handles day-to-day financial management and gives you real-time visibility. For tax filing and complex accounting, you may still want an accountant - but you'll spend far less on bookkeeping services because CashPanel keeps everything organized.",
      },
      {
        question: "What about tax preparation?",
        answer:
          "CashPanel categorizes transactions, tracks receipts, and exports tax-ready reports. Your accountant will have everything they need, organized and ready to go.",
      },
      {
        question: "Why is CashPanel so much cheaper?",
        answer:
          "Bench employs human bookkeepers who manually review your transactions monthly. CashPanel uses AI and automation for instant categorization, giving you better speed at a fraction of the cost.",
      },
    ],
    targetAudience: [
      "Founders frustrated with monthly reporting delays",
      "Teams wanting real-time financial visibility",
      "Businesses looking to reduce bookkeeping costs",
      "Founders who want control over their finances",
    ],
  },
  {
    id: "qonto",
    slug: "qonto-alternative",
    name: "Qonto",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Qonto alternative? CashPanel offers financial management that works with any bank, plus invoicing, time tracking, and AI insights.",
    keyDifferences: [
      {
        title: "Bank Freedom",
        cashpanel: "Works with any bank",
        competitor: "Must use Qonto bank",
      },
      {
        title: "Invoicing",
        cashpanel: "Full invoicing suite",
        competitor: "Basic invoicing",
      },
      {
        title: "Time Tracking",
        cashpanel: "Built-in",
        competitor: "None",
      },
      {
        title: "AI Features",
        cashpanel: "AI assistant + insights",
        competitor: "Limited automation",
      },
    ],
    features: [
      {
        category: "Financial Management",
        features: [
          {
            name: "Multi-bank support",
            cashpanel: "25,000+ banks",
            competitor: "Qonto only",
          },
          {
            name: "Transaction categorization",
            cashpanel: true,
            competitor: true,
          },
          { name: "Expense tracking", cashpanel: true, competitor: true },
          { name: "Receipt capture", cashpanel: true, competitor: true },
          { name: "Team cards", cashpanel: false, competitor: true },
          { name: "AI insights", cashpanel: true, competitor: false },
        ],
      },
      {
        category: "Business Tools",
        features: [
          { name: "Full invoicing", cashpanel: true, competitor: "Basic" },
          { name: "Time tracking", cashpanel: true, competitor: false },
          { name: "Project tracking", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
          { name: "Customer management", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Basic",
          price: "€9",
          period: "/month",
          features: ["1 user", "German IBAN", "20 transfers/month"],
        },
        {
          name: "Smart",
          price: "€19",
          period: "/month",
          features: ["2 users", "100 transfers/month", "5 cards"],
        },
        {
          name: "Premium",
          price: "€39",
          period: "/month",
          features: ["5 users", "500 transfers/month", "Connect banks"],
        },
        {
          name: "Enterprise",
          price: "€99",
          period: "/month",
          features: ["10 users", "Unlimited transfers", "Priority support"],
        },
      ],
      competitorNote: "Must switch your banking to Qonto",
    },
    switchingSteps: [
      {
        title: "Keep your current bank",
        description:
          "No need to switch banks - CashPanel connects to your existing accounts.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Import your customers",
        description: "Add your existing customers for invoicing.",
      },
      {
        title: "Start using all features",
        description: "Access time tracking, AI insights, and more.",
      },
    ],
    faq: [
      {
        question: "Do I need to switch banks?",
        answer:
          "No! Unlike Qonto, CashPanel works with your existing bank accounts. Connect any of 25,000+ banks worldwide and keep your current banking relationships.",
      },
      {
        question: "What about team expense cards?",
        answer:
          "CashPanel focuses on financial management, not banking. If you need team cards, you can use your existing bank's cards while using CashPanel for tracking, invoicing, and insights.",
      },
      {
        question: "Is CashPanel available in Europe?",
        answer:
          "Yes! CashPanel works globally with banks across Europe, including SEPA countries. You get the same features whether you're in Germany, France, Netherlands, or anywhere else.",
      },
    ],
    targetAudience: [
      "EU founders who want to keep their current bank",
      "Teams needing more than basic invoicing",
      "Businesses wanting time tracking built-in",
      "Users who need AI-powered financial insights",
    ],
  },
  {
    id: "pleo",
    slug: "pleo-alternative",
    name: "Pleo",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Pleo alternative? CashPanel offers expense tracking plus invoicing, time tracking, and full financial visibility without requiring corporate cards.",
    keyDifferences: [
      {
        title: "Flexibility",
        cashpanel: "Works with any payment method",
        competitor: "Requires Pleo cards",
      },
      {
        title: "Scope",
        cashpanel: "Complete financial workspace",
        competitor: "Expense management only",
      },
      {
        title: "Invoicing",
        cashpanel: "Full suite",
        competitor: "None",
      },
      {
        title: "Time Tracking",
        cashpanel: "Built-in",
        competitor: "None",
      },
    ],
    features: [
      {
        category: "Expense Management",
        features: [
          { name: "Receipt capture", cashpanel: true, competitor: true },
          {
            name: "Automatic categorization",
            cashpanel: true,
            competitor: true,
          },
          { name: "Expense tracking", cashpanel: true, competitor: true },
          { name: "Corporate cards", cashpanel: false, competitor: true },
          { name: "Spending limits", cashpanel: false, competitor: true },
          { name: "Works with any card", cashpanel: true, competitor: false },
        ],
      },
      {
        category: "Financial Management",
        features: [
          { name: "Bank connections", cashpanel: true, competitor: "Limited" },
          { name: "Invoicing", cashpanel: true, competitor: false },
          { name: "Time tracking", cashpanel: true, competitor: false },
          {
            name: "Cash flow insights",
            cashpanel: true,
            competitor: "Limited",
          },
          { name: "AI assistant", cashpanel: true, competitor: false },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Starter",
          price: "Free",
          period: "",
          features: ["3 users", "Pleo cards", "Basic features"],
        },
        {
          name: "Essential",
          price: "€35",
          period: "/month base",
          features: ["Unlimited users", "Analytics", "Integrations"],
        },
        {
          name: "Advanced",
          price: "€75",
          period: "/month base",
          features: ["Budgets", "Multi-entity", "Priority support"],
        },
      ],
      competitorNote: "+ per-user fees on paid plans",
    },
    switchingSteps: [
      {
        title: "Export from Pleo",
        description: "Download your expense data and receipts.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Set up receipt forwarding",
        description: "Forward receipts via email or capture them in-app.",
      },
      {
        title: "Add invoicing and time tracking",
        description: "Start using features Pleo doesn't offer.",
      },
    ],
    faq: [
      {
        question: "What about corporate cards?",
        answer:
          "CashPanel focuses on financial management, not issuing cards. You can use your existing corporate or personal cards - all transactions sync automatically from your connected bank accounts.",
      },
      {
        question: "Can I still track team expenses?",
        answer:
          "Yes! CashPanel tracks all expenses from your connected bank accounts, regardless of which team member made the purchase. Receipts can be attached to any transaction.",
      },
      {
        question: "Is CashPanel available in Europe?",
        answer:
          "Absolutely. CashPanel works with banks across Europe and supports multiple currencies. You get the same features whether you're in Denmark, UK, Germany, or elsewhere.",
      },
    ],
    targetAudience: [
      "Teams who don't want to switch to corporate cards",
      "Founders needing invoicing alongside expenses",
      "Businesses wanting time tracking included",
      "EU teams seeking a simpler expense solution",
    ],
  },
  {
    id: "honeybook",
    slug: "honeybook-alternative",
    name: "HoneyBook",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a HoneyBook alternative? CashPanel offers clean financial management with invoicing and time tracking, without the CRM complexity.",
    keyDifferences: [
      {
        title: "Focus",
        cashpanel: "Financial clarity",
        competitor: "CRM + project management",
      },
      {
        title: "Simplicity",
        cashpanel: "Clean, focused workspace",
        competitor: "Feature-heavy platform",
      },
      {
        title: "Bank Connections",
        cashpanel: "25,000+ banks",
        competitor: "Limited",
      },
      {
        title: "AI Features",
        cashpanel: "AI assistant + insights",
        competitor: "Basic automation",
      },
    ],
    features: [
      {
        category: "Financial Management",
        features: [
          { name: "Invoicing", cashpanel: true, competitor: true },
          { name: "Online payments", cashpanel: true, competitor: true },
          { name: "Bank connections", cashpanel: true, competitor: "Limited" },
          { name: "Expense tracking", cashpanel: true, competitor: "Basic" },
          { name: "Time tracking", cashpanel: true, competitor: "Basic" },
          { name: "AI insights", cashpanel: true, competitor: false },
        ],
      },
      {
        category: "Business Tools",
        features: [
          { name: "Contracts/proposals", cashpanel: false, competitor: true },
          { name: "Client portal", cashpanel: true, competitor: true },
          { name: "Scheduling", cashpanel: false, competitor: true },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
          {
            name: "Cash flow visibility",
            cashpanel: true,
            competitor: "Limited",
          },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Starter",
          price: "$16",
          period: "/month",
          features: ["Unlimited clients", "Invoices", "Basic automation"],
        },
        {
          name: "Essentials",
          price: "$32",
          period: "/month",
          features: ["Scheduler", "Automation", "Custom branding"],
        },
        {
          name: "Premium",
          price: "$66",
          period: "/month",
          features: [
            "Priority support",
            "Multiple companies",
            "Advanced reports",
          ],
        },
      ],
      competitorNote: "Payment processing: 2.9% + $0.25 per transaction",
    },
    switchingSteps: [
      {
        title: "Export client and invoice data",
        description:
          "Download your clients and invoice history from HoneyBook.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Import your customers",
        description: "Add your clients to continue invoicing.",
      },
      {
        title: "Enjoy financial clarity",
        description: "Focus on finances without CRM complexity.",
      },
    ],
    faq: [
      {
        question: "What about contracts and proposals?",
        answer:
          "CashPanel focuses on financial management rather than proposals. If you need contract management, you might use a dedicated tool like DocuSign alongside CashPanel for your financial tracking and invoicing.",
      },
      {
        question: "Is CashPanel good for freelancers?",
        answer:
          "Absolutely! CashPanel is built for founders and freelancers who want clarity over their business finances. You get invoicing, time tracking, expense management, and AI insights in one clean interface.",
      },
      {
        question: "What about client scheduling?",
        answer:
          "CashPanel doesn't include scheduling. If you need that, tools like Calendly work great alongside CashPanel. Many users find they prefer best-in-class tools for each function rather than an all-in-one that compromises on each.",
      },
    ],
    targetAudience: [
      "Creatives who find HoneyBook too complex",
      "Freelancers wanting better financial visibility",
      "Users who don't need CRM features",
      "Teams wanting AI-powered insights",
    ],
  },
  {
    id: "freeagent",
    slug: "freeagent-alternative",
    name: "FreeAgent",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a FreeAgent alternative? CashPanel offers modern financial management with AI-powered insights, without the accounting complexity.",
    keyDifferences: [
      {
        title: "Design",
        cashpanel: "Modern, clean interface",
        competitor: "Traditional accounting UI",
      },
      {
        title: "Complexity",
        cashpanel: "Built for founders",
        competitor: "Built for accountants",
      },
      {
        title: "AI Features",
        cashpanel: "AI assistant + weekly insights",
        competitor: "None",
      },
      {
        title: "Global Reach",
        cashpanel: "25,000+ banks worldwide",
        competitor: "UK-focused",
      },
    ],
    features: [
      {
        category: "Core Features",
        features: [
          {
            name: "Bank connections",
            cashpanel: "Global",
            competitor: "UK-focused",
          },
          { name: "Invoicing", cashpanel: true, competitor: true },
          { name: "Expense tracking", cashpanel: true, competitor: true },
          { name: "Time tracking", cashpanel: true, competitor: true },
          { name: "Receipt capture", cashpanel: true, competitor: true },
          { name: "AI insights", cashpanel: true, competitor: false },
        ],
      },
      {
        category: "Accounting",
        features: [
          {
            name: "VAT returns",
            cashpanel: "Export for accountant",
            competitor: true,
          },
          { name: "MTD compatible", cashpanel: "Via export", competitor: true },
          {
            name: "Self-assessment",
            cashpanel: "Export ready",
            competitor: true,
          },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
          {
            name: "No accounting knowledge needed",
            cashpanel: true,
            competitor: false,
          },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "FreeAgent",
          price: "£19",
          period: "/month",
          features: [
            "Unlimited users",
            "Full accounting",
            "MTD compatible",
            "Banking integration",
          ],
        },
      ],
      competitorNote: "Free with some UK banks (NatWest, RBS, etc.)",
    },
    switchingSteps: [
      {
        title: "Export from FreeAgent",
        description:
          "Download your contacts, invoices, and transaction history.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Import customers",
        description: "Add your existing clients for invoicing.",
      },
      {
        title: "Experience modern finance",
        description: "Enjoy AI insights and a cleaner interface.",
      },
    ],
    faq: [
      {
        question: "What about Making Tax Digital (MTD)?",
        answer:
          "CashPanel exports your data in formats compatible with MTD requirements. Your accountant can use these exports for VAT submissions. CashPanel focuses on day-to-day financial clarity rather than tax compliance features.",
      },
      {
        question: "I get FreeAgent free with my bank - why switch?",
        answer:
          "Free is great, but if you find FreeAgent's interface dated or complex, CashPanel offers a modern experience with AI-powered insights. The value of time saved and better visibility often exceeds the subscription cost.",
      },
      {
        question: "Is CashPanel suitable for UK businesses?",
        answer:
          "Yes! CashPanel works with UK banks and handles GBP and multi-currency. While it doesn't file VAT directly, it provides everything your accountant needs for compliance.",
      },
    ],
    targetAudience: [
      "UK freelancers wanting a modern interface",
      "Founders who find FreeAgent too accounting-focused",
      "Users wanting AI-powered financial insights",
      "Teams that don't need built-in tax filing",
    ],
  },
  {
    id: "ramp",
    slug: "ramp-alternative",
    name: "Ramp",
    tagline: "Why Founders Switch to CashPanel",
    description:
      "Looking for a Ramp alternative? CashPanel offers financial visibility and expense tracking without requiring you to switch corporate cards.",
    keyDifferences: [
      {
        title: "Flexibility",
        cashpanel: "Works with any bank/card",
        competitor: "Requires Ramp cards",
      },
      {
        title: "Invoicing",
        cashpanel: "Full invoicing suite",
        competitor: "Bill pay only",
      },
      {
        title: "Time Tracking",
        cashpanel: "Built-in",
        competitor: "None",
      },
      {
        title: "Target",
        cashpanel: "Founders & small teams",
        competitor: "Mid-size companies",
      },
    ],
    features: [
      {
        category: "Expense Management",
        features: [
          { name: "Receipt capture", cashpanel: true, competitor: true },
          {
            name: "Automatic categorization",
            cashpanel: true,
            competitor: true,
          },
          { name: "Corporate cards", cashpanel: false, competitor: true },
          { name: "Spending limits", cashpanel: false, competitor: true },
          { name: "Works with any card", cashpanel: true, competitor: false },
          { name: "Bill pay", cashpanel: false, competitor: true },
        ],
      },
      {
        category: "Financial Management",
        features: [
          { name: "Bank connections", cashpanel: true, competitor: true },
          { name: "Invoicing", cashpanel: true, competitor: false },
          { name: "Time tracking", cashpanel: true, competitor: false },
          { name: "Cash flow insights", cashpanel: true, competitor: true },
          { name: "AI assistant", cashpanel: true, competitor: "Limited" },
          { name: "Weekly summaries", cashpanel: true, competitor: false },
        ],
      },
    ],
    pricing: {
      cashpanel: cashpanelPricing,
      competitor: [
        {
          name: "Ramp",
          price: "$0",
          period: "",
          features: [
            "Corporate cards",
            "Expense management",
            "Bill pay",
            "Accounting integrations",
          ],
        },
        {
          name: "Ramp Plus",
          price: "$12",
          period: "/user/month",
          features: [
            "Everything in Ramp",
            "Advanced controls",
            "Custom workflows",
            "Priority support",
          ],
        },
      ],
      competitorNote: "Requires using Ramp corporate cards",
    },
    switchingSteps: [
      {
        title: "Keep your current cards",
        description:
          "No need to switch - CashPanel works with your existing accounts.",
      },
      {
        title: "Sign up for CashPanel",
        description: "Create your account and connect your bank accounts.",
      },
      {
        title: "Set up expense tracking",
        description: "All card transactions sync automatically.",
      },
      {
        title: "Add invoicing and time tracking",
        description: "Start using features Ramp doesn't offer.",
      },
    ],
    faq: [
      {
        question: "Why not use free Ramp cards?",
        answer:
          "Ramp is great if you want to switch all spending to their cards and you're a larger team. But if you want flexibility to use any bank or card, plus invoicing and time tracking, CashPanel is the better fit for founders and small teams.",
      },
      {
        question: "What about the cashback and savings?",
        answer:
          "Ramp offers 1.5% cashback on their cards. However, the value of having invoicing, time tracking, and full financial visibility in one place often exceeds those savings for most small businesses.",
      },
      {
        question: "Is CashPanel for startups too?",
        answer:
          "Yes! While Ramp targets VC-backed startups with larger teams, CashPanel is built specifically for founders and small teams who want clarity without corporate card requirements.",
      },
    ],
    targetAudience: [
      "Founders who don't want to switch cards",
      "Small teams needing invoicing too",
      "Businesses wanting time tracking built-in",
      "Teams too small for enterprise expense tools",
    ],
  },
];

export function getCompetitorBySlug(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}

export function getAllCompetitorSlugs(): string[] {
  return competitors.map((c) => c.slug);
}
