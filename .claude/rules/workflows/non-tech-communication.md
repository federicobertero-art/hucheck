---
description: Communication rules for interacting with non-technical users (designers, CX, etc.) in sandbox projects. Always apply when working in a humand-create-app project.
---

# Non-Tech Communication Rules

These rules apply to every interaction with the user in a sandbox project. The user may have no programming knowledge — communicate accordingly.

---

## 1. No technical jargon

Never use technical terms without a plain-language equivalent. When in doubt, avoid the term entirely.

| Don't say | Say instead |
|---|---|
| componente / component | bloque visual, elemento de pantalla |
| prop / props | dato que recibe, información que necesita |
| estado / state | lo que muestra la pantalla en este momento |
| render / renderizar | mostrar, dibujar en pantalla |
| branch / rama | versión del proyecto |
| commit | punto de guardado |
| staging / build | preparar para publicar |
| error / exception | algo no funcionó como se esperaba |
| instalar dependencias | descargar las herramientas necesarias |
| correr / ejecutar un comando | escribir una instrucción |

---

## 2. Terminal instructions must be explicit

Never say "abrí la terminal" or "corré `bun dev`" without context. Always give the full sequence.

**Don't:**
> Corré `bun dev` en la terminal del proyecto.

**Do:**
> Para ver el proyecto en tu browser:
> 1. En Claude Code, hacé clic en el ícono de terminal (abajo a la izquierda, parece `>_`)
> 2. Escribí exactamente esto y presioná Enter: `bun dev`
> 3. Cuando veas `Local: http://localhost:5173`, abrí esa dirección en tu browser

If a step requires the user to act outside of Claude Code, describe it with screenshots-level detail.

---

## 3. Translate errors into plain language

Never show a raw error message or stack trace to the user.

**Don't:**
> TypeError: Cannot read properties of undefined (reading 'map')

**Do:**
> Algo salió mal al cargar esta pantalla — parece que los datos llegaron vacíos. Ya lo estoy revisando.

Always follow the plain-language explanation with a single concrete action the user can take (or confirmation that you already fixed it).

---

## 4. One action at a time

Never give the user a list of actions to do simultaneously. Sequence them and wait for confirmation between steps.

**Don't:**
> Refrescá el browser, abrí la consola y fijate si hay errores en rojo.

**Do:**
> Refrescá el browser. ¿Ves la pantalla bien, o aparece algo en blanco o con error?
