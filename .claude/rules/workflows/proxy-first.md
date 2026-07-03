---
description: Security rule for external service integrations in sandbox projects. Always apply.
paths:
  - "src/**"
  - "api/**"
---

# Proxy-First Rule

Any call to an external service (REST API, database, third-party SDK) **must go through a Vercel API route** (`api/`). API keys, tokens, and credentials must never reach the browser.

## The rule

```
browser → api/<service>.ts (Vercel serverless) → external service
```

Never:

```
browser → external service directly
```

This applies regardless of which skill creates the integration: `/connect-service`, `/connect-supabase`, `/connect-postgrest`, or any manual code.

## What this means in practice

- API keys go in `.env.local` and are read server-side only. Never prefix them with `VITE_`.
- `VITE_` variables are public — they are bundled into the browser build. Only use them for non-sensitive config (base URLs, feature flags, public client IDs).
- The frontend calls `fetch('/api/<service>')` or uses a typed service module that wraps that call. It never calls the external URL directly.
- If a third-party SDK must run client-side (e.g. analytics), it must not receive credentials — use only its public/anonymous mode.

## When this applies

Any time you write or review code that:
- Calls a URL that is not the local dev server
- Reads an environment variable to pass it to a fetch/axios call
- Installs an SDK that requires an API key

If a user asks to "just call the API directly from the component to keep it simple", push back and route through the proxy. Security is not negotiable here — a leaked key in a sandbox that gets deployed to Vercel is a real incident.
