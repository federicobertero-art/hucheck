---
description: Routes user intent to the appropriate skill in humand-create-app sandbox projects.
---

# Sandbox Workflow Rules

Sandbox projects in `humand-create-app` run on a strict command cycle. The skills enforce the cycle internally — but only when invoked. This rule's job is to ensure they get invoked.

## Hard constraint: any code change goes through `feature-build`

⛔ **Never write, edit, or delete project source files without invoking `/feature-build`.** This is not a suggestion — it is the binding rule of the workflow. An instruction the agent can skip is not a gate; this rule is the backstop for the gate inside `feature-build`.

**Any request that implies changing the project's code — however casual — is a `/feature-build` request.** Informal phrasing does not change the routing:

- *"Armá una tabla de usuarios con data de postgrest"* → **not** a direct code write → classify the feature + decide refine-or-fast-path + `/feature-build`.
- *"Agregá un filtro a la pantalla de pedidos"* → same: classify + `/feature-build`.
- *"Cambiá el color del botón"* → same, even if it's a one-liner.

When you arrive at `/feature-build`, **its own preflight gate** handles plan creation, feature classification, and path decision (fast-path vs. refined). You don't need to resolve those here — just route.

## The principle

When the user expresses an intent that matches a skill, **route to the skill** instead of acting directly. Don't write the code, don't make the commit, don't draft the plan from scratch in chat. Run the skill.

This applies even when the user phrases the request casually:

- *"Commiteá esto"* → `/feature-commit`
- *"Hacé el plan del proyecto"* → `/project-plan`

The user doesn't need to know the command names. You do. Translate intent to skill.

## Determining where the user is in the cycle

Before routing, read `.plans/PLAN.md` to understand current state:

- **No `PLAN.md`**: project hasn't been set up. If `src/` has code → `/project-document`; if fresh → `/project-plan`.
- **`PLAN.md` exists, a feature is `[~]`**: cycle is in progress. Route based on what the user wants next (build, verify, commit, handoff).
- **`PLAN.md` exists, no `[~]`**: between features. Route to `/feature-refine` for the next pending one, or ask which feature to work on.

## Intent → skill mapping

**Machine / project setup** (run once per machine or per project):

| User says (or implies) | Route to |
|---|---|
| "Set up my machine", "Install the tools" | `/sandbox-setup` |
| "Create a new project", "Start a new mockup" | `/project-bootstrap` |
| "I have an existing React project, adapt it to Humand" | `/project-humandify` |
| "Publish the repo to GitHub" | `/github-publish` |
| "Deploy to Vercel", "Push to production" | `/project-deploy` |
| "Sync .env with Vercel", "500 error on Vercel" | `/vercel-sync-env` |

**Feature cycle:**

| User says (or implies) | Route to |
|---|---|
| "Plan the project", "Help me define the features" | `/project-plan` |
| "Document this existing project", "Bring this code into the workflow" | `/project-document` |
| "Add a new feature", "Refine this screen", "Detail what feature X does" | `/feature-refine` |
| "Build it", "Write the code", "Implement this feature", "Add a filter / button / form" | `/feature-build` |
| "Check the code", "Run the linter", "Verify before commit" | `/feature-verify` |
| "Commit this", "Save the work", "Mark the feature done" | `/feature-commit` |
| "Save progress before clearing", "I'm taking a break", "Context is getting full" | `/session-handoff` |
| "Sync settings", "Set up Claude config" | `/sandbox-sync-settings` |
| "Check if the project is set up correctly" | `/project-check` |
| "Fix the project", "Remediate", "Set up the project" | `/project-remediate` |

**Platform capabilities** (install once; each skill validates its own pre-requisites and mutual exclusions):

| User says (or implies) | Route to | Pre-requisite | Mutually exclusive with |
|---|---|---|---|
| "Add login", "Add user authentication" | `/auth-add-user` | — | `/auth-add-staff` |
| "Add admin login", "Add SSO for internal users" | `/auth-add-staff` | — | `/auth-add-user` |
| "Connect to the Humand API", "Pull community data" | `/connect-postgrest` | `/auth-add-user` | `/connect-service` |
| "Connect to HubSpot / Redash / etc." | `/connect-service` | `/auth-add-staff` | `/connect-postgrest` |
| "Set up a database", "Add Supabase" | `/connect-supabase` | — | — |
| "Save data on the device", "local persistence", "keep data between sessions" | `/connect-local-db` | — | — |
| "Add AI", "Add a chatbot", "Summarize with AI", "Generate text", "Use AI to extract data", "Add AI embeddings / search", "Generate / edit images with AI", "Add text-to-speech / read this aloud" | `/connect-glados` | auth installed | — |

> **AI is infrastructure, not a feature.** `/connect-glados` wires the GLaDOS proxy (plumbing). The actual AI feature — the chat UI, the summarization logic, the extraction flow — is built afterward with `/feature-build`. Intent to *connect* AI routes here; intent to *build* an AI feature routes to `/feature-build` (after `connect-glados` has run).

**Security:**

| User says (or implies) | Route to |
|---|---|
| "Check for exposed secrets", "Audit before deploying", "Scan staged changes for secrets" | `/project-check` |

If the user's intent could match more than one skill, ask which they want. Don't guess.

## Plan changes mid-project

If the user wants to add, remove, or reorder features after `PLAN.md` exists:

- **Adding a feature** → append the entry to `.plans/PLAN.md` following the existing format, then route to `/feature-refine` on the new number.
- **Removing or reordering** → apply the change to `.plans/PLAN.md` directly, confirm with the user, then continue.
- **Large scope changes** → read the plan, propose the updated feature list for confirmation, apply it, then continue the cycle.

Never ask the user to edit plan files themselves.

⛔ **Don't chain skills silently.** If a pre-requisite isn't met, tell the user and let them run the right command. Each command is a deliberate decision. Each skill handles its own pre-requisite checks and will tell the user what's missing.

## When to push back

If the user asks you to do something that **bypasses** a skill — write code without `/feature-build`, commit directly with `git commit`, edit files without an active feature in `[~]` — **stop, don't write any code, and route to the right skill**.

Do not comply first and ask forgiveness later. Do not write a "quick one-liner" and then mention the workflow. The push-back is the response.

Example:

> User: "Just add a `formatCurrency` helper in `src/utils/`."
> You: "Got it. Before writing it: which feature is this part of? Routing through `/feature-build` — it'll handle whether this needs a plan entry or qualifies as a fast-path change. That keeps the plan in sync."

This is not bureaucracy. The plan-code sync is what makes the workflow recoverable across sessions.

## When NOT to route

Some questions don't need a skill. Don't route for:

- Conceptual questions ("what does `useEffect` do?")
- Reading existing code ("show me how the auth flow works")
- Debugging help that doesn't modify files
- General conversation about the project

The router is for **changes to the project**. Information requests stay in chat.

## Sync targets

Files that should be updated if the routing table or skill names change:

- `plugins/humand-frontend-sandbox/skills/get-started/SKILL.md` (typical workflows)
- `plugins/humand-frontend-sandbox/skills/feature-build/SKILL.md` (referenced as the code-change gate)
