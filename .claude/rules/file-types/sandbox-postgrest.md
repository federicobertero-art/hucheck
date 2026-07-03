---
description: Hard constraints for PostgREST integration in sandbox projects. Points to docs/api/postgrest.md for full details on embedding, filtering, and the segmentation system.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Humand Frontend Sandbox — PostgREST

Applies only to projects scaffolded with `--humand-api` (they have `api/postgrest/[...path].ts` and `src/services/postgrest.ts`). If those files do not exist, skip this rule.

## Hard constraints

1. **All calls go through the proxy.** Use `postgrest` from `src/services/postgrest.ts` — never fetch `https://views-cx.humand.co` or any PostgREST host directly from the frontend.
2. **Never modify the proxy.** `api/postgrest/[...path].ts` is read-only generated code.
3. **Always use resource embedding for joins.** If a request touches more than one entity, use `select=parent(child)` — NEVER a second round-trip to hydrate related rows. That's N+1.
4. **Never `select=*`.** Always list the columns you actually need, both for size and to avoid leaking sensitive columns.
5. **Segmentation — user lookups use `user_segmentation_items`.** Never aggregate `Segmentations` directly when asking "which users can see this content?". The pre-computed snapshot is the source of truth.
6. **No M2M credentials in the frontend bundle.** `HUMAND_CLIENT_ID` / `HUMAND_CLIENT_SECRET` live in `.env.local`, never as `VITE_*` vars.

## Red-flag patterns — STOP if you see these

- `useEffect` / `forEach` / `map` that fires a per-row `postgrest.get(...)` → rewrite the top-level call with embedding.
- A second query to hydrate foreign keys from the result of a first query → embed instead.
- Hardcoded PostgREST URLs anywhere in `src/` → route through the proxy.

## Full reference

For pagination (`limit`/`offset` + `Prefer: count=planned`), the filter operator table, embedding semantics (`!inner`, `=is.null`, FK disambiguation), and the full segmentation matching logic with the `ov` operator → read `docs/api/postgrest.md`.
