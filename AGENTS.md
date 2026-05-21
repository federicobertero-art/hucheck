# hucheck

This project was scaffolded with `humand-create-app`.

---

## Agent Coding Principles

**0. NEVER edit .sandbox/checks.json manually or via scripts to override check results.**

The file is generated automatically by the check scripts. This includes using update-checks.ts or any other script to set fields under checks.* (e.g. checks.auth, checks.criticalCount, checks.gapCount). The only legitimate use of update-checks.ts is to update project.* fields (e.g. project.type).

If a user declines a required remediation step, stop. Explain clearly that the project cannot continue until that step is resolved — do not look for workarounds or bypass the validation. A blocked check is information, not an obstacle to route around.

**1. Think Before Coding — Don't assume. Don't hide confusion. Surface tradeoffs.**
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

**2. Simplicity First — Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

**3. Surgical Changes — Touch only what you must. Clean up only your own mess.**
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken. Match existing style.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that *your* changes made unused, not pre-existing ones.
- Every changed line should trace directly to the user's request.

**4. Goal-Driven Execution — Define success criteria. Loop until verified.**
- Transform tasks into verifiable goals:
  - "Fix the bug" → "Write a test that reproduces it, then make it pass"
  - "Add validation" → "Write tests for invalid inputs, then make them pass"
- For multi-step tasks, state a brief plan with a verify step per item.
- Weak criteria ("make it work") require constant clarification — define what done looks like.

---

## Project Context

- Frontend app built on top of the Humand React stack.
- Designed to be operated by non-technical users — follow the rules in "Non-technical Communication".
- All structural decisions are encoded here. Do not invent new patterns; if something is missing, ask.

### Stack

- React 18 + TypeScript via Vite.
- `material-hu` (Hugo theme) — UI components.
- React Hook Form + Zod — forms and validation.
- React Router v6 — routing.
- Axios — HTTP client.
- React Query — server state.
- Biome — linter/formatter.

### Folder Structure

```
src/
  assets/       Static assets (images, fonts, icons)
  layouts/      App layouts (DashboardLayout, BlankLayout)
  providers/    React providers (theme, query client, router, etc.)
  pages/        Feature pages, one folder per feature (module architecture)
  services/     API clients and service functions
  theme/        Theme tokens and helpers
api/            Vercel proxy functions for external services
```

- Everything under `src/pages/` follows module-architecture — do NOT create ad-hoc modules.
- File, variable, and symbol names are in English. Only UI strings may be in another language.

### Routing

- Routes live in `src/App.tsx`.
- Use `DashboardLayout` for authenticated pages.
- Use `BlankLayout` for public / single-purpose pages (onboarding, focused tasks).

### Navigation

- Sidebar entries are configured in `SECTIONS` inside `DashboardLayout`.
- Icons from `@material-hu/icons/tabler`.

---

## Implementation Rule

NEVER write code directly in response to a user request. For ANY change to the UI or codebase (adding a button, fixing a label, changing a layout, modifying a form), you MUST invoke the `/build-feature` skill first using the Skill tool.

Exceptions (no skill needed):
- Reading files or explaining code
- Debugging help that doesn't write files
- Answering questions about the project

## Workflow (Mandatory Order)

1. `/bootstrap-react-project` — scaffold.
2. `/plan-project` — local plan in `.plans/`. NO code yet.
3. Per screen: `/refine-feature` — break into features.
4. Per feature: `/build-feature` — implement.

Rules baked into the workflow:

- After each feature, do a visual checkpoint: tell the user exactly what changed and where to look.
- After user confirmation, commit with a Spanish, user-visible message (e.g. "Pantalla de lista de pedidos lista").
- At the start of every session, read `git log --oneline -10` and summarize the state to the user.

---

## Pre-flight Checks

Before implementing anything, verify these files exist:

- `node_modules/material-hu/src/components/design-system/COMPONENTS.md`
- `node_modules/material-hu/src/components/composed-components/COMPONENTS.md`
- `node_modules/material-hu/src/theme/hugo/newTokens.ts`

If any of them is missing, run:

```bash
GITHUB_TOKEN=$(cat ~/.humand/github-token) bun install
```

---

## Non-technical Communication

This project is operated by non-technical users. Communication rules are strict:

- No tech jargon. Translate:
  - "componente" → "visual block"
  - "commit" → "checkpoint"
  - "error" → "something went wrong"
- Terminal instructions must be explicitly numbered, one step at a time.
- NEVER show raw errors or stack traces. Always translate them into plain language.
- One action at a time. Wait for confirmation before the next one.
