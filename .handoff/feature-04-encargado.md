# Handoff: Pantalla del Encargado

**Module**: Procesos Diarios
**Screen**: Encargado
**Order**: 4
**Commit**: 6e0778e — Pantalla del Encargado lista para revisar
**Notion**: https://www.notion.so/humand-co/hucheck-Plan-3676757f31308187a139ed9e567755e7

## Files created

- `src/pages/Processes/Compliance/index.tsx` — tabla de cumplimiento (progreso real de tareas por proceso)
- `src/pages/Processes/Management/types.ts` — `ManageableProcess`, `ProcessFormValues`
- `src/pages/Processes/Management/store.ts` — CRUD store para gestión de procesos
- `src/pages/Processes/Management/components/ProcessForm/index.tsx` — formulario Zod + RHF para drawer
- `src/pages/Processes/Management/index.tsx` — lista con CRUD: crear/editar (drawer) + eliminar (dialog) + menú 3 puntos

## Files modified (already existed)

- `src/App.tsx` — rutas `/procesos/cumplimiento` y `/procesos/gestion` (deben ir ANTES de `/procesos/:id`)
- `src/pages/Processes/index.tsx` — toggle "Encargado" (Switcher) que muestra botones Cumplimiento y Configurar

## Shared artifacts

- **Store**: `src/pages/Processes/Management/store.ts` — `getProcessList()`, `addProcess(name, area)`, `updateProcess(id, name, area)`, `removeProcess(id)` — inicializado desde MOCK_PROCESSES + MOCK_TASKS
- **Store (Feature 3)**: `src/pages/Processes/Detail/store.ts` — `getTasksForProcess(id)` también consumido por CompliancePage para mostrar progreso real

## Non-obvious decisions

- **Orden de rutas crítico**: `/procesos/cumplimiento` y `/procesos/gestion` deben declararse ANTES de `/procesos/:id` en App.tsx, o el segmento dinámico los intercepta.
- **Switcher necesita `sx={{ width: 'auto' }}`**: internamente tiene `width: '100%'` + `justifyContent: 'space-between'`, lo que separa el label del toggle visualmente. Con `width: 'auto'` quedan pegados.
- **CompliancePage lee el store de Detail**: importa `getTasksForProcess` de `'../Detail/store'` para mostrar el progreso en tiempo real (refleja tareas ya chequeadas).
- **`@material-hu/mui/IconButton`** (no el de design-system): el DS IconButton no tiene `index.d.ts` y no se puede tipar.
- **`() => undefined` en lugar de `() => {}`**: regla de Biome (no arrow function vacía).
- **`openMenu` requiere `anchorEl: e.currentTarget`**: el handler del botón de 3 puntos debe ser `(e: React.MouseEvent<HTMLElement>) => openMenu({ anchorEl: e.currentTarget, ... })`.
- **ProgressBar siempre necesita `variant="determinate"`**: el default es indeterminate (barra animada azul infinita).

## Project status

- Features completadas: 4
- Siguiente feature: **Avisos** — lista de avisos + detalle/drawer
- Pendiente manual: actualizar Notion con Estado ✅ Listo para features 2, 3 y 4 (Notion MCP con error de red persistente)
