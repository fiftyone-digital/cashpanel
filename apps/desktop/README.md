# CashPanel Desktop App

A Tauri-based desktop application for CashPanel that supports multiple environments with a native transparent titlebar on macOS.

## Features

- **Environment Support**: Development, Staging, and Production environments
- **Transparent Titlebar**: Native macOS transparent titlebar with traffic light buttons
- **Responsive Design**: Minimum window size of 1450x900 for optimal experience

## Environment Configuration

The desktop app supports three environments, each loading a different URL:

- **Development**: `http://localhost:3001`
- **Staging**: `https://beta.cashpanel.io`
- **Production**: `https://app.cashpanel.io`

## Running the App

### Development Mode
```bash
# Run in development environment (loads localhost:3001)
bun run tauri:dev
```

### Staging Mode
```bash
# Run in staging environment (loads beta.cashpanel.io)
bun run tauri:staging
```

### Production Mode
```bash
# Run in production environment (loads app.cashpanel.io)
bun run tauri:prod
```

## Building the App

### Development Build
```bash
bun run tauri:build
```

### Staging Build
```bash
bun run tauri:build:staging
```

### Production Build
```bash
bun run tauri:build:prod
```

## Environment Variable

The environment is controlled by the `CASHPANEL_ENV` environment variable:

- `development` or `dev` → `http://localhost:3001`
- `staging` → `https://beta.cashpanel.io`
- `production` or `prod` → `https://app.cashpanel.io`

If no environment is specified, it defaults to development mode.

## Manual Environment Setting

You can also set the environment manually:

```bash
# macOS/Linux
CASHPANEL_ENV=staging tauri dev

# Windows (PowerShell)
$env:CASHPANEL_ENV="staging"; tauri dev

# Windows (Command Prompt)
set CASHPANEL_ENV=staging && tauri dev
```
