# @cashpanel-ai/cli

Run your business from the command line. The CashPanel CLI gives you full access to transactions, invoices, time tracking, reports, and more — designed for humans and AI agents alike.

## Install

```bash
npx @cashpanel-ai/cli@latest
```

Or install globally:

```bash
npm install -g @cashpanel-ai/cli
```

## Authentication

```bash
cashpanel auth login          # Opens browser for OAuth
cashpanel auth login --no-browser  # Prints URL to open manually
cashpanel auth status         # Check current session
cashpanel auth logout         # Clear stored credentials
```

You can also authenticate with an API key:

```bash
echo $CASHPANEL_API_KEY | cashpanel auth login --token-stdin
```

## Commands

### Transactions

| Command | Description |
|---------|-------------|
| `cashpanel transactions list` | List transactions |
| `cashpanel transactions get <id>` | Get transaction details |
| `cashpanel transactions create` | Create a manual transaction |
| `cashpanel transactions update <id>` | Update a transaction |
| `cashpanel transactions delete <id>` | Delete a transaction |

```bash
cashpanel transactions list --from 2026-01-01 --to 2026-03-31
cashpanel transactions list --search "Spotify" --category software
cashpanel transactions create --name "Office Supplies" --amount -49.99 --currency USD --account acc_123
```

### Invoices

| Command | Description |
|---------|-------------|
| `cashpanel invoices list` | List invoices |
| `cashpanel invoices get <id>` | Get invoice details |
| `cashpanel invoices create` | Create an invoice |
| `cashpanel invoices send <id>` | Send to customer |
| `cashpanel invoices update <id>` | Update an invoice |
| `cashpanel invoices delete <id>` | Delete an invoice |
| `cashpanel invoices mark-paid <id>` | Mark as paid |
| `cashpanel invoices remind <id>` | Send payment reminder |

```bash
cashpanel invoices list --status unpaid
cashpanel invoices create --customer cust_123 --due-date 2026-04-30
cashpanel invoices send inv_abc123
```

### Customers

| Command | Description |
|---------|-------------|
| `cashpanel customers list` | List customers |
| `cashpanel customers get <id>` | Get customer details |
| `cashpanel customers create` | Create a customer |
| `cashpanel customers update <id>` | Update a customer |
| `cashpanel customers delete <id>` | Delete a customer |

```bash
cashpanel customers list --search "Acme"
cashpanel customers create --name "Acme Corp" --email billing@acme.com
```

### Time Tracking

| Command | Description |
|---------|-------------|
| `cashpanel tracker start` | Start the timer |
| `cashpanel tracker stop` | Stop the timer |
| `cashpanel tracker status` | Show current timer |
| `cashpanel tracker projects list` | List projects |
| `cashpanel tracker projects create` | Create a project |

```bash
cashpanel tracker start --project proj_abc --description "API development"
cashpanel tracker stop
cashpanel tracker projects create --name "Website Redesign" --rate 150
```

### Bank Accounts

| Command | Description |
|---------|-------------|
| `cashpanel bank-accounts list` | List connected accounts |
| `cashpanel bank-accounts balances` | Show all balances |
| `cashpanel bank-accounts get <id>` | Get account details |

### Inbox

| Command | Description |
|---------|-------------|
| `cashpanel inbox list` | List inbox items |
| `cashpanel inbox get <id>` | Get item details |
| `cashpanel inbox match <id>` | Match to transaction |
| `cashpanel inbox delete <id>` | Delete an item |

```bash
cashpanel inbox list --status pending
cashpanel inbox match inb_abc --transaction txn_def
```

### Reports

| Command | Description |
|---------|-------------|
| `cashpanel reports revenue` | Revenue report |
| `cashpanel reports profit` | Profit report |
| `cashpanel reports burn-rate` | Monthly burn rate |
| `cashpanel reports runway` | Cash runway estimate |
| `cashpanel reports expenses` | Expense breakdown |
| `cashpanel reports spending` | Spending by category |

```bash
cashpanel reports revenue --from 2026-01-01 --to 2026-03-31
cashpanel reports runway --currency USD
cashpanel reports spending --json
```

### Documents

| Command | Description |
|---------|-------------|
| `cashpanel documents list` | List documents |
| `cashpanel documents get <id>` | Get document details |
| `cashpanel documents delete <id>` | Delete a document |

### Categories

| Command | Description |
|---------|-------------|
| `cashpanel categories list` | List categories |
| `cashpanel categories create` | Create a category |
| `cashpanel categories update <id>` | Update a category |
| `cashpanel categories delete <id>` | Delete a category |

### Tags

| Command | Description |
|---------|-------------|
| `cashpanel tags list` | List tags |
| `cashpanel tags create` | Create a tag |
| `cashpanel tags delete <id>` | Delete a tag |

### Products

| Command | Description |
|---------|-------------|
| `cashpanel products list` | List invoice products |
| `cashpanel products get <id>` | Get product details |
| `cashpanel products create` | Create a product |
| `cashpanel products update <id>` | Update a product |
| `cashpanel products delete <id>` | Delete a product |

### Team

| Command | Description |
|---------|-------------|
| `cashpanel team info` | Show team information |
| `cashpanel team members` | List team members |

### Search

```bash
cashpanel search "Acme"
cashpanel search "office supplies" --json
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--json` | Output as JSON (default when piped) |
| `--table` | Output as table (default in terminal) |
| `--agent` | Agent mode: JSON, no prompts, no spinners |
| `--quiet` | Suppress progress output |
| `--dry-run` | Preview destructive actions |
| `--debug` | Verbose HTTP logging to stderr |
| `--api-url <url>` | Override API base URL |

## Agent & MCP Integration

The CLI is designed to work seamlessly with AI agents. Use `--agent` or `--json` for structured output:

```bash
cashpanel --agent transactions list --from 2026-01-01
cashpanel invoices list --json | jq '.data[].invoiceNumber'
```

Pipe data in with `--stdin`:

```bash
cat invoice.json | cashpanel invoices create --stdin
echo $API_KEY | cashpanel auth login --token-stdin
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CASHPANEL_API_KEY` | API key (skip `auth login`) |
| `CASHPANEL_API_URL` | Override API endpoint |
| `CASHPANEL_DASHBOARD_URL` | Override dashboard URL for OAuth |
| `NO_COLOR` | Disable colored output |

## Development

```bash
bun run dev -- auth login       # Run locally
bun run build                   # Build for distribution
bun run typecheck               # Type checking
bun run lint                    # Lint
```

## License

See the [LICENSE](../../LICENSE) file in the repository root.
