# Handoff: Lista de Procesos del Día

**Module**: Procesos Diarios
**Screen**: Lista de Procesos
**Order**: 2
**Commit**: 98ff80a — Lista de Procesos lista para revisar
**Notion**: https://www.notion.so/humand-co/hucheck-Plan-3676757f31308187a139ed9e567755e7

## Files created

- `src/pages/Processes/types.ts` — `DailyProcess` interface + `ProcessStatus` type
- `src/pages/Processes/constants.ts` — `MOCK_PROCESSES` array + `STATUS_CONFIG` map
- `src/pages/Processes/components/ProcessCard/index.tsx` — card with name, area, status pill, progress bar

## Files modified (already existed)

- `src/pages/Processes/index.tsx` — replaced stub with full list screen

## Shared artifacts

- **Types**: `src/pages/Processes/types.ts` — `DailyProcess` and `ProcessStatus` — Detalle de Proceso must import these to type the selected process
- **Mock data**: `src/pages/Processes/constants.ts` — `MOCK_PROCESSES` — Detalle de Proceso should receive a `DailyProcess` via route params or navigation state

## Non-obvious decisions

- **`ProgressBar` requires `variant="determinate"`**: the default is `indeterminate` (animated looping bar). Without this prop the bar animates indefinitely regardless of `current`/`total`.
- **Standard Typography variants only**: `globalM`/`globalS` custom variants require the module augmentation at `src/types/material-hu.d.ts` which is not set up in this project. Use `subtitle1`, `body2`, etc. instead.
- **`onClick={() => undefined}` on ProcessCard**: navigation to Detalle de Proceso is not wired yet. The next feature must replace this with `useNavigate()` to `/procesos/:id`.
- **Notion MCP down**: could not update Notion automatically. Manually set "Lista de Procesos del Día" → Estado: ✅ Listo, Commit: "Lista de Procesos lista para revisar".

## Project status

- Features completed: 2
- Next feature: **Detalle de Proceso — Checklist de Tareas** (Procesos Diarios / Detalle de Proceso)
- Blockers or pending items: Notion MCP network error — update manually if needed.
