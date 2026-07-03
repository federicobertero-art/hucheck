---
description: Debugging protocol when an API call fails in a sandbox project. Always reproduce with curl before changing code.
---

# Workflow: API debugging (curl-first)

When an API call fails — whether from a frontend service, a react-query hook, or a Vercel proxy route — **do not modify code first**. First isolate where the failure is happening. Most "it doesn't work" bugs are misunderstandings of the request, not defects in the app code.

## The rule

Before editing the proxy, the service, or the hook, reproduce the failing request with `curl` and inspect the raw response. This answers three questions in seconds:

1. **Is the external service returning what you expect?** (auth, params, URL shape)
2. **Is it the proxy translating the request/response incorrectly?**
3. **Is it the frontend sending the wrong payload?**

Without curl, you're guessing. With curl, you know which layer to fix.

## Protocol

### Step 1 — Identify the failing layer

Look at the error:
- **Frontend only** (network tab shows the request never left) → skip curl, debug the frontend.
- **Proxy returns 4xx/5xx** → curl both the proxy AND the external service directly.
- **Proxy returns 200 with wrong data** → curl the external service directly to see what it really returns.

### Step 2 — Curl the external service directly

Bypass the proxy. Use the credentials from `.env.local` (read via `source .env.local && echo $SUPABASE_SERVICE_ROLE_KEY` — never paste the key into chat output).

**Pattern for fetch-based services** (HubSpot, Airtable, etc.):

```bash
curl -sS -i \
  -H "Authorization: Bearer $SERVICE_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.service.com/v3/resource?limit=10"
```

**Pattern for Supabase REST** (via PostgREST):

```bash
curl -sS -i \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/<table>?select=*&limit=10"
```

**Pattern for a POST**:

```bash
curl -sS -i -X POST \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"field":"value"}' \
  "https://api.service.com/v3/resource"
```

Flags:
- `-i` includes response headers (status code, rate limit info).
- `-sS` silences progress but keeps errors.
- `-X <method>` only when not GET.

### Step 3 — Curl the proxy

Once the external service works, curl the local proxy with the same request to see where the translation breaks:

```bash
curl -sS -i "http://localhost:3000/api/<service>/<path>"
```

Compare the two responses. The diff tells you what the proxy is mangling.

### Step 4 — Only now, change code

After you know which layer is wrong, fix that layer and only that layer. Do not "shotgun" changes across the stack.

## Security

- **Never echo secrets to chat.** Read them with `source .env.local` and reference as `$VAR_NAME` in commands.
- **Never paste the raw curl output if it contains tokens** (refresh tokens, JWTs with secrets, etc). Redact before sharing.
- If the user sees a secret in your output, treat it as leaked and ask them to rotate.

## When to tell the user

If the curl reveals the problem is user-owned (wrong API key, insufficient permissions, account not provisioned), stop and tell them in plain language what the service is complaining about and how to fix it. Don't try to work around it in code.
