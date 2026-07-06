# 003 — Selector de rol y permisos

## Description

Selector de rol (Administrador / Encargado / Empleado) en el encabezado, similar al selector de sucursal existente. Cuando el rol activo es Encargado o Empleado, se bloquea el cambio de sucursal.

## Validation criteria

- Veo un selector de rol en el encabezado con las opciones "Administrador", "Encargado" y "Empleado"; "Administrador" aparece seleccionado por defecto al entrar a la app.
- Puedo cambiar el rol activo tocando cualquiera de las tres opciones.
- Cuando el rol activo es "Encargado" o "Empleado", el selector de sucursal se ve deshabilitado y no puedo elegir otra sucursal; si intento tocarlo, veo una indicación de por qué está bloqueado.
- Si vuelvo a elegir "Administrador", el selector de sucursal se habilita de nuevo y puedo cambiar de sucursal con normalidad.

## Components

| Section | Component | Storybook | Import path | Key prop | Value / Source |
|---|---|---|---|---|---|
| Selector de rol | ButtonGroup | https://hugo.humand.co/?path=/story/design-system-buttongroup--default | `@material-hu/components/design-system/ButtonGroup` | `labels`, `value`, `onChange` | `labels=['Administrador','Encargado','Empleado']`, `value` = índice del rol activo |
| Explicación de bloqueo | Tooltip | https://hugo.humand.co/?path=/story/design-system-tooltip--default | `@material-hu/components/design-system/Tooltip` | `title` | "Solo el Administrador puede cambiar de sucursal" |

Nota: el selector de sucursal existente (`DashboardLayout`) se envuelve con este `Tooltip` y pasa a un estado visualmente deshabilitado (opacidad reducida, sin clic) cuando el rol activo no es Administrador.

## Data

N/A — no hay backend real de roles todavía (no existe login). El rol activo es estado de sesión en el navegador, manejado por un nuevo `RoleContext` (mismo patrón que `BranchContext`), sin persistencia entre recargas — igual que el selector de sucursal.

## Pending follow-ups

<!-- Items added during /feature-build that fall outside the current scope but should be addressed later. /feature-commit warns if there are unresolved items at close time. -->

## Commits

- `e1ea152` — feat(layouts/dashboardlayout): role selector with branch-switch lock

---

## Technical metadata
<!-- Used by the workflow skills. Skip if you're reading to understand the feature. -->

```yaml
status: done
order: 3
screens:
  - module: Layouts
    screen: DashboardLayout
source_files:
  - src/App.tsx
  - src/contexts/RoleContext.tsx
  - src/layouts/DashboardLayout/index.tsx
```
