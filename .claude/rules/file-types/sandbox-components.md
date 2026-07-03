---
description: Rules for using material-hu components in sandbox projects. Covers component discovery, form variants, layers, and the "material-hu first" policy.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Humand Frontend Sandbox — Components

## 1. material-hu first

**Always** use material-hu components. Never import directly from `@mui/material`.

The only exceptions are layout primitives that come from `@material-hu/mui/`:
```tsx
import Stack from '@material-hu/mui/Stack'
import Typography from '@material-hu/mui/Typography'
import IconButton from '@material-hu/mui/IconButton'
```

Everything else must come from material-hu:
```tsx
import Button from '@material-hu/components/design-system/Buttons/Button'
```

---

## 2. Finding available components

1. **Check `docs/ui/patterns.md`** first — it has pre-curated snippets for the most common UI patterns. If the pattern you need is there, use it directly.
2. **Read both COMPONENTS.md indexes** (covered by pre-flight) to find components not covered by `docs/ui/patterns.md`.
3. **Prioritize composed-components** over manual implementations — check the Preferred Patterns section at the end of each COMPONENTS.md.
4. **Read the `types.ts`** of each component you plan to use, only if it's not already covered by `docs/ui/patterns.md` (covered by pre-flight for new components).
5. If a component doesn't exist in material-hu, do not fall back to `@mui/material`. Ask the user:
   > No encontré un componente en el design system para [X]. ¿Querés que cree uno personalizado siguiendo el estilo de Humand, o preferís omitirlo por ahora?

---

## 3. Always use Form variants in forms

When a component has a **Form variant** (listed in COMPONENTS.md), use it instead of the base component + manual `Controller`/`watch`/`setValue`:

```tsx
// YES — Form variant handles Controller, error state, and onChange automatically
import FormInputClassic from '@material-hu/components/design-system/Inputs/Classic/form';
import FormAutocomplete from '@material-hu/components/design-system/Inputs/Autocomplete/form';

<FormInputClassic
  name="processName"
  inputProps={{ label: 'Nombre*', maxLength: 100, hasCounter: true }}
/>

// NO — Manual wiring is error-prone and verbose
const name = watch('name');
<InputClassic value={name} onChange={value => setValue('name', value)} />
```

---

## 4. Snackbar on mutation forms

Any form whose submit triggers a **mutation** (create, update, delete — anything that changes state in the backend or a mock store) **must** show user feedback via snackbar:

- **Success** → green snackbar with a short, plain-language confirmation (`"Perfil actualizado"`, `"Contacto creado"`).
- **Error** → red snackbar with a readable message (`"No pudimos guardar los cambios. Intentá de nuevo."`). Never leak raw API error strings — translate them.

Read-only forms (filters, search) are exempt.

Use the material-hu snackbar layer (`useSnackbarLayer` or the equivalent pattern documented in COMPONENTS.md). Wire snackbars inside the mutation hook's `onSuccess` / `onError` when possible, so every consumer gets feedback for free:

```tsx
export const useUpdateProfileMutation = () => {
  const { showSnackbar } = useSnackbarLayer();
  return useMutation({
    mutationFn: profileService.update,
    onSuccess: () => showSnackbar({ variant: 'success', message: 'Perfil actualizado' }),
    onError: () => showSnackbar({ variant: 'error', message: 'No pudimos guardar los cambios. Intentá de nuevo.' }),
  });
};
```

If the exact API of `useSnackbarLayer` differs from the example, check COMPONENTS.md — the rule (success + error feedback on every mutation) stands regardless of the API shape.

---

## 5. Layers are mandatory

These components must always be used via their layer hooks — never instantiated directly:

| Component | Hook | Import |
|-----------|------|--------|
| `Drawer` | `useDrawerLayer()` | `@material-hu/components/layers/Drawers` |
| `Dialog` | `useDialogLayer()` | `@material-hu/components/layers/Dialogs` |
| `Menu` | `useMenuLayer()` | `@material-hu/components/layers/Menus` |
