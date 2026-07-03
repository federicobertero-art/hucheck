# 002 — Configuración de horarios de turno por sucursal

## Description

Pantalla donde se define, para cada sucursal, en qué rango horario cae cada turno (mañana / tarde / noche), ya que no todos los locales abren en el mismo horario.

## Validation criteria

- Al entrar a la pantalla "Configuración de turnos" veo los 3 turnos (Mañana, Tarde, Noche) de la sucursal actualmente seleccionada, cada uno con su hora de inicio y de fin.
- Si cambio de sucursal con el selector que ya existe en el encabezado, los horarios mostrados se actualizan para reflejar la sucursal nueva.
- Puedo editar la hora de inicio y la hora de fin de cualquier turno.
- Al guardar, veo una confirmación visual de que se guardó correctamente, o un aviso claro si algo salió mal.

## Components

| Section | Component | Storybook | Import path | Key prop | Value / Source |
|---|---|---|---|---|---|
| Encabezado de página | Title | https://hugo.humand.co/?path=/story/design-system-title--default | `@material-hu/components/design-system/Title` | `title`, `description`, `variant="L"` | "Configuración de turnos" / "Definí el rango horario de cada turno para la sucursal seleccionada." |
| Layout | Stack | N/A | `@material-hu/mui/Stack` | `sx` (flexDirection, gap) | layout de fila para header, columna para el formulario |
| Hora de inicio/fin por turno | FormTimePicker | https://hugo.humand.co/?path=/story/composed-components-timepicker-form--default | `@material-hu/components/composed-components/TimePicker/form` | `name`, `inputProps.label` | un par (inicio/fin) por cada uno de los 3 turnos |
| Botón guardar | Button | https://hugo.humand.co/?path=/story/design-system-buttons-button--default | `@material-hu/components/design-system/Buttons/Button` | `variant="primary"`, `onClick` | dispara el guardado del formulario |
| Feedback de guardado | useSnackbarLayer | N/A | `@material-hu/components/layers/Snackbar` | `showSnackbar({ variant, message })` | éxito: "Horarios guardados correctamente" / error: "No pudimos guardar los cambios. Intentá de nuevo." |

Nota: la sucursal se elige con el selector global que ya existe en el encabezado (`BranchContext` / `useBranch()`), reutilizado tal cual — esta pantalla no agrega un selector de sucursal propio.

## Data

| Field | Type | Visible in UI | Source |
|---|---|---|---|
| id | string | No | `/shiftSchedules → id` (igual al `branchId`) |
| branchId | string | No | `/shiftSchedules → branchId` |
| morningStart | string (`"HH:mm"`) | Yes | `/shiftSchedules → morningStart` |
| morningEnd | string (`"HH:mm"`) | Yes | `/shiftSchedules → morningEnd` |
| afternoonStart | string (`"HH:mm"`) | Yes | `/shiftSchedules → afternoonStart` |
| afternoonEnd | string (`"HH:mm"`) | Yes | `/shiftSchedules → afternoonEnd` |
| nightStart | string (`"HH:mm"`) | Yes | `/shiftSchedules → nightStart` |
| nightEnd | string (`"HH:mm"`) | Yes | `/shiftSchedules → nightEnd` |

Un registro por sucursal, en el mismo recurso local (`mock/db.json` vía el proveedor de datos ya existente) que `branches` y `processes`. El mismo rango aplica todos los días de la semana. Cualquier usuario que entra a la pantalla puede editarlo (no hay permisos por rol todavía).

## Pending follow-ups

<!-- Items added during /feature-build that fall outside the current scope but should be addressed later. /feature-commit warns if there are unresolved items at close time. -->

## Commits

- `a169a1e` — feat(processes/shift-settings): shift schedule configuration per branch

---

## Technical metadata
<!-- Used by the workflow skills. Skip if you're reading to understand the feature. -->

```yaml
status: done
order: 2
screens:
  - module: Processes
    screen: ShiftSettings
source_files:
  - src/App.tsx
  - src/data/idb-provider.ts
  - src/pages/Processes/ShiftSettings/components/ShiftScheduleForm/index.tsx
  - src/pages/Processes/ShiftSettings/hooks/useUpdateShiftScheduleMutation.ts
  - src/pages/Processes/ShiftSettings/index.tsx
  - src/pages/Processes/ShiftSettings/types.ts
  - src/pages/Processes/ShiftSettings/utils.ts
  - src/pages/Processes/index.tsx
  - src/pages/Processes/useShiftSchedules.ts
```
