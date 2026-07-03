---
description: Project structure, stack, routing, API, navigation, and styling conventions for humand-create-app projects. Component rules are in sandbox-components.md.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Humand Frontend Sandbox — Project Structure

Rules for projects created with `humand-create-app`.

> **Component rules** → `sandbox-components.md`
> **TypeScript and React conventions** follow `humand-react` (`react.md`, `typescript.md`)

---

## 1. Stack

- **React 18** + **TypeScript** via Vite
- **material-hu** for all UI — import from `@material-hu/components/design-system/*` and `@material-hu/mui/*`
- **React Hook Form** + **Zod** + `@hookform/resolvers` for all forms
- **React Router v6** for routing
- **Axios** via `src/services/axios.ts` for API calls
- **Biome** (`humand-biome-config`) for lint and format — run `bun run biome:fix` to auto-fix

---

## 2. Folder structure

**Module architecture** — sandboxes follow the same structure as production repos.
See `module-architecture.md` from the `humand-react` plugin for the full spec.

Sandbox-specific top-level folders (not covered by module-architecture):

- `src/assets/` — static files (images, SVGs)
- `src/layouts/` — DashboardLayout, BlankLayout
- `src/contexts/` — React auth context (`Auth.tsx`)
- `src/providers/` — other React context providers (e.g. `QueryProvider`)

Everything under `src/pages/` follows `module-architecture.md`, `module-architecture-files.md`, and `module-architecture-hooks.md` from the `humand-react` plugin.

---

## 3. Naming language

All code-facing names must be in **English**: page folders, component names, file names, variables, props, types, route paths, and sidebar keys. Only user-facing strings (labels, descriptions, placeholder text) can be in another language.

```
# YES
src/pages/Security/components/ActivityLogTable.tsx
{ key: 'security', title: 'Seguridad', path: '/security' }

# NO
src/pages/Seguridad/components/TablaRegistros.tsx
{ key: 'seguridad', title: 'Seguridad', path: '/seguridad' }
```

---

## 4. Routing

- Routes defined in `src/App.tsx`
- Use `DashboardLayout` for authenticated pages, `BlankLayout` for public/anonymous ones

---

## 5. API & data fetching

- All HTTP calls go through `src/services/axios.ts`
- Group related endpoints in `src/services/<domain>.ts`
- **React Query** (`@tanstack/react-query`) is the standard for all server/async state — `useQuery` for reads, `useMutation` for writes. See `react-query.md` from `humand-react` for detailed rules.
- Service functions in `src/services/<name>.ts`, react-query hooks in `src/services/<name>.hooks.ts`

### External services (Supabase, HubSpot, Google Sheets, etc.)

- External API calls MUST go through a **Vercel API proxy** at `api/<service-name>/[...path].ts` — the frontend NEVER calls external URLs directly
- API keys go in `process.env.<SERVICE>_API_KEY` (server-side only) — NEVER use `VITE_` prefix for secrets
- Each proxy only exposes the specific operations needed — no open passthrough
- Validate inputs with Zod in the API route, sanitize error responses, set timeouts on external calls
- Use the `/connect-service` skill to set up integrations correctly

---

## 6. Navigation

- Sidebar nav items defined in `SECTIONS` inside `src/layouts/DashboardLayout/index.tsx`
- Icons from `@material-hu/icons/tabler`
- Add a new entry for every new top-level page

---

## 7. TypeScript and material-hu aliases

The `@material-hu/mui/*` imports are Vite-only aliases at runtime. TypeScript doesn't resolve them to `@mui/material/*` by default, so module augmentations (like custom Typography variants `globalS`, `globalM`, etc.) won't be picked up automatically.

**The correct fix lives in `material-hu`**, not in the consumer project. `material-hu/src/theme/material-hu.ts` already augments `@mui/material/Typography` — it needs to also augment `@material-hu/mui/Typography` with the same overrides so projects using the Vite alias get the types automatically.

Until that fix is in place, add this workaround to the project at `src/types/material-hu.d.ts`:

```ts
export {};

declare module '@material-hu/mui/Typography' {
  interface TypographyPropsVariantOverrides {
    globalXXS: true;
    globalXS: true;
    globalS: true;
    globalM: true;
    globalL: true;
  }
}
```

---

## 8. Styling & tokens

**Never use hex color values.** All colors must come from the theme.

```tsx
import { useTheme } from '@material-hu/mui/styles';

const theme = useTheme();
sx={{ color: theme.palette.new.text.neutral.default }}
```

**Do not** assign sub-objects to variables:
```tsx
// NO
const neutral = theme.palette.new.text.neutral;
sx={{ color: neutral.default }}

// YES
sx={{ color: theme.palette.new.text.neutral.default }}
```

When the design specifies a color, find the closest match in `newTokens.ts` (read during pre-flight in `/feature-refine`). Never assume or guess a token path — incorrect paths fail silently. If no exact match, search the file for the hex value or a keyword (e.g. `"grey"`, `"border"`, `"disabled"`).

`theme.shape.borderRadiusL` is not typed due to Vite alias limitations. Use the string `'16px'` directly for radius-L (confirmed from design token `--radius/l`).
