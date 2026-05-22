# Handoff: Layout mobile de la app

**Module**: General
**Screen**: Layout mobile
**Order**: 1 of 2 (refinement batch 1)
**Commit**: 65a8259 — Layout mobile lista para revisar (fe2e902 — Layout mobile con navegación inferior y rutas principales)
**Notion**: https://www.notion.so/humand-co/hucheck-Plan-3676757f31308187a139ed9e567755e7

## Files created

- `src/layouts/MobileLayout/index.tsx` — mobile shell with sticky header + bottom nav
- `src/pages/Audits/index.tsx` — stub page
- `src/pages/Notices/index.tsx` — stub page
- `src/pages/Processes/index.tsx` — stub page
- `.claude/launch.json` — preview server config (npx vite --port 3000)

## Files modified (already existed)

- `src/App.tsx` — replaced DashboardLayout with MobileLayout as layout route; added `/`, `/procesos`, `/avisos`, `/auditorias` routes
- `src/pages/Home/index.tsx` — removed DashboardLayout wrapper, now just content
- `src/layouts/DashboardLayout/index.tsx` — minor tweak
- `scripts/dev.ts` — removed Vercel-auth conditional; always starts plain Vite now
- `vite.config.ts` — added `fixMuiEmotionChunk` Vite plugin (see non-obvious decisions)

## Shared artifacts

- **Layout**: `src/layouts/MobileLayout/index.tsx` — provides sticky `HomeHeader` + `Outlet` + fixed 4-tab bottom nav. All authenticated pages must be children of the `<Route element={<MobileLayout />}>` wrapper in `App.tsx`.

## Non-obvious decisions

- **Vite 8 + MUI + emotion crash**: Vite 8's dep optimizer splits `@mui/material/styles` into a shared chunk that calls `init_emotion_react_browser_development_esm()` and `init_StyledEngineProvider()` without importing them. The `fixMuiEmotionChunk` plugin in `vite.config.ts` detects and patches this at transform time. Do NOT remove it.
- **`scripts/dev.ts` uses plain Vite**: Removed the `vercel dev` path because Vercel requires authentication. The `api/` folder exists but the app runs without it locally.
- **MUI IconButton instead of DS IconButton**: `@material-hu/components/design-system/Buttons/IconButton` has no `index.d.ts` in the built lib. Using `@material-hu/mui/IconButton` (MUI raw) as a fallback with `sx` color tokens for active state.
- **`() => undefined` for no-op callbacks**: Biome rejects `() => {}` (empty block). HomeHeader requires several callbacks (`onOpenMenu`, `onOpenLanguageMenu`) that are not used; they are `() => undefined`.

## Project status

- Features completed: 1/2 (batch 1 refinement)
- Next feature: **Lista de Procesos del Día** (Procesos Diarios / Lista de Procesos)
- Blockers or pending items: Notion MCP had a network error during commit — update "Layout mobile de la app" estado to ✅ Listo manually if needed.
