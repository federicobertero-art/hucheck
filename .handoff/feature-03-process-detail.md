# Handoff: Detalle de Proceso — Checklist de Tareas

**Module**: Procesos Diarios
**Screen**: Detalle de Proceso
**Order**: 3
**Commit**: 850a782 — Detalle de Proceso lista para revisar
**Notion**: https://www.notion.so/humand-co/hucheck-Plan-3676757f31308187a139ed9e567755e7

## Files created

- `src/pages/Processes/Detail/types.ts` — `Task` interface
- `src/pages/Processes/Detail/constants.ts` — `MOCK_TASKS: Record<string, Task[]>` (tasks per process id)
- `src/pages/Processes/Detail/store.ts` — module-level task state store (persists across navigation)
- `src/pages/Processes/Detail/index.tsx` — checklist page with back nav, progress bar, checkboxes

## Files modified (already existed)

- `src/App.tsx` — added route `/procesos/:id` → `<ProcessDetail />`
- `src/layouts/MobileLayout/index.tsx` — fixed header overlap: changed sticky → fixed + added `pt: '73px'` to content area
- `src/pages/Processes/components/ProcessCard/index.tsx` — removed `onClick` prop, added internal `useNavigate` to `/procesos/:id`
- `src/pages/Processes/index.tsx` — removed `onClick` prop from `<ProcessCard />`

## Shared artifacts

- **Store**: `src/pages/Processes/Detail/store.ts` — `getTasksForProcess(id)` + `toggleTaskInStore(id, taskId)` — module-level mutable object that initializes from MOCK_TASKS on first access and persists for the session
- **Types**: `src/pages/Processes/Detail/types.ts` — `Task` interface

## Non-obvious decisions

- **Header fix**: MobileLayout header changed from `position: sticky` to `position: fixed` + `pt: '73px'` on content. The sticky approach caused content to start at y=0 (overlapping the 73px header). This affects ALL pages — do not revert.
- **Module-level store for mock persistence**: Task state lives outside React in `store.ts`. On first navigation to a process, it copies from `MOCK_TASKS`; subsequent visits retain the modified state. No localStorage — state resets on full page refresh (acceptable for a mock).
- **`ProgressBar` requires `variant="determinate"`**: same as feature-02 — default is animated indeterminate.
- **Standard Typography variants only**: `globalM`/`globalS` not set up — use `subtitle1`, `body2`, etc.

## Project status

- Features completed: 3
- Next feature: **Procesos del Encargado** — Panel de Cumplimiento + Gestión de Procesos (Procesos Diarios)
- Blockers or pending items: Notion MCP network error persists — update Notion manually.
