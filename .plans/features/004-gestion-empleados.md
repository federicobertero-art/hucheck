# 004 — Gestión de empleados

## Description

Pantalla de empleados donde se les asigna la sucursal correspondiente, con posibilidad de reasignarlos a otra sucursal más adelante.

## Validation criteria

- Con el rol "Administrador" activo, veo "Empleados" como ítem del menú lateral; con "Encargado" o "Empleado" activo, ese ítem no aparece.
- Al entrar a "Empleados" veo una lista con el nombre, el área y la sucursal actual de cada empleado.
- Puedo elegir una sucursal distinta para cualquier empleado desde un selector en su fila.
- Al cambiar la sucursal de un empleado, veo una confirmación visual de que se guardó, o un aviso claro si algo salió mal.

## Components

| Section | Component | Storybook | Import path | Key prop | Value / Source |
|---|---|---|---|---|---|
| Encabezado de página | Title | https://hugo.humand.co/?path=/story/design-system-title--default | `@material-hu/components/design-system/Title` | `title`, `description`, `variant="L"` | "Empleados" / "Asigná o reasigná la sucursal de cada empleado." |
| Listado | Table + TableContainer + TableHead + TableBody + TableRow + TableCell | https://hugo.humand.co/?path=/story/design-system-table--default | `@material-hu/components/design-system/Table` (+ `/components/TableContainer`, `/TableHead`, `/TableBody`, `/TableRow`, `/TableCell`) | `headerRow`, `headerCell` | columnas: Nombre, Área, Sucursal |
| Selector de sucursal por fila | InputSelect | https://hugo.humand.co/?path=/story/design-system-inputs-select--default | `@material-hu/components/design-system/Inputs/Select` | `value`, `onChange`, `options` | `options` = sucursales (`{label: branch.name, value: branch.id}`); no usa react-hook-form — es un control independiente por fila que guarda al cambiar |
| Feedback de guardado | useSnackbar | N/A | `@material-hu/components/design-system/Snackbar` | `enqueueSnackbar({ variant, title })` | éxito: "Sucursal actualizada" / error: "No pudimos guardar el cambio. Intentá de nuevo." |

Nota: el ítem "Empleados" del menú lateral (`DashboardLayout`) solo se muestra cuando `useRole().role === 'Administrador'`, reutilizando el `RoleContext` de la funcionalidad 003.

## Data

| Field | Type | Visible in UI | Source |
|---|---|---|---|
| id | string | No | `/employees → id` |
| name | string | Yes | `/employees → name` |
| area | string | Yes | `/employees → area` |
| branchId | string | Yes (vía selector) | `/employees → branchId` |

Se agrega el campo `branchId` al recurso `employees` ya existente (`mock/db.json`), con un valor por defecto repartido entre las 3 sucursales para los empleados actuales, para que la pantalla no arranque vacía.

## Pending follow-ups

<!-- Items added during /feature-build that fall outside the current scope but should be addressed later. /feature-commit warns if there are unresolved items at close time. -->

## Commits

- `4cb347b` — feat(employees/list): employee branch assignment

---

## Technical metadata
<!-- Used by the workflow skills. Skip if you're reading to understand the feature. -->

```yaml
status: done
order: 4
screens:
  - module: Employees
    screen: List
source_files:
  - src/App.tsx
  - src/layouts/DashboardLayout/index.tsx
  - src/pages/Employees/index.tsx
  - src/pages/Employees/useUpdateEmployeeBranchMutation.ts
  - src/pages/Processes/employees.ts
```
