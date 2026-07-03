# 001 — Gestión de tareas dentro de procesos

## Description

Desde la pantalla de Gestión del Encargado, poder agregar, editar y eliminar las tareas individuales de cada proceso (hoy las tareas están fijas como datos de prueba).

## Validation criteria

- Desde la lista de Gestión, al abrir el menú (⋮) de un proceso aparece la opción "Gestionar tareas".
- Al entrar a "Gestionar tareas" veo la lista de tareas de ese proceso, o un estado vacío si todavía no tiene ninguna.
- Puedo agregar una tarea nueva indicando su nombre.
- Puedo editar el nombre de una tarea existente y puedo eliminarla (con confirmación antes de borrar).
- Las tareas que agrego, edito o elimino se reflejan después en la pantalla de Detalle del proceso (donde se marcan como hechas por turno).

## Components

| Section | Component | Storybook | Import path | Key prop | Value / Source |
|---|---|---|---|---|---|
| Abrir gestor de tareas | Menu item ("Gestionar tareas") | N/A | `@material-hu/components/layers/Menus` (useMenuLayer) | items | agregado a `handleMenu` en Management/index.tsx |
| Panel de tareas | Drawer | N/A | `@material-hu/components/layers/Drawers` (useDrawerLayer) | title | `Tareas de {process.name}` |
| Lista de tareas | CardContainer | N/A | `@material-hu/components/design-system/CardContainer` | - | una card por tarea |
| Sin tareas | StateCard | N/A | `@material-hu/components/composed-components/StateCard` | - | "Sin tareas" |
| Agregar tarea | Button | N/A | `@material-hu/components/design-system/Buttons/Button` | variant="primary" | "Nueva tarea" |
| Menú por tarea | Menu | N/A | `@material-hu/components/layers/Menus` (useMenuLayer) | items | Editar / Eliminar |
| Confirmar borrado | Dialog | N/A | `@material-hu/components/layers/Dialogs` (useDialogLayer) | title | "¿Eliminar tarea?" |
| Form. de tarea | FormInputClassic | N/A | `@material-hu/components/design-system/Inputs/Classic/form` | name="name" | nombre de la tarea |

## Data

| Field | Type | Visible in UI | Source |
|---|---|---|---|
| id | string | No | generado (`Date.now()`) al crear |
| name | string | Yes | user input |
| assignedTo | string[] | No (no se edita en esta función) | se preserva del existente / `[]` para tareas nuevas |

**Nota de datos:** hoy existen dos copias separadas de las tareas de un proceso: las que usa la pantalla de Gestión (`Management/store.ts`, inicializadas desde `MOCK_TASKS`) y las que usa la pantalla de Detalle (`Detail/store.ts`, con su propio `getTaskTemplate` leyendo `MOCK_TASKS` de forma independiente). Para que lo que se gestiona acá se refleje en Detalle, `Detail/store.ts` va a leer las tareas desde `Management/store.ts` en lugar de mantener su propia copia.

## Pending follow-ups

<!-- Items added during /feature-build that fall outside the current scope but should be addressed later. /feature-commit warns if there are unresolved items at close time. -->

## Commits

- `pending` — feat(processes/management): gestión de tareas dentro de procesos

---

## Technical metadata
<!-- Used by the workflow skills. Skip if you're reading to understand the feature. -->

```yaml
status: done
order: 1
screens:
  - module: Processes
    screen: Management
source_files:
  - src/pages/Processes/Detail/store.ts
  - src/pages/Processes/Management/components/ProcessTasksDrawerContent/index.tsx
  - src/pages/Processes/Management/components/TaskForm/index.tsx
  - src/pages/Processes/Management/index.tsx
  - src/pages/Processes/Management/store.ts
  - src/pages/Processes/index.tsx
```
