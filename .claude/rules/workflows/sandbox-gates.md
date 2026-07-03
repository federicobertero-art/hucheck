---
description: Blocks build actions when the working directory is not a sandbox project. Always apply in humand-frontend-sandbox.
---

# Rule: Open a new conversation in the project folder

Before running any build skill (`/project-plan`, `/project-document`, `/feature-refine`, `/feature-build`, `/feature-commit`, `/feature-verify`, `/project-check`, `/project-remediate`, or writing code), check whether the current working directory is a sandbox project:

```bash
test -d .sandbox || (cat package.json 2>/dev/null | grep -q "humand-create-app" && echo "ok")
```

If neither condition is true, **stop immediately** and tell the user:

> It looks like this conversation isn't open inside a project folder. To build, you need to start a new conversation from the project folder.
>
> **From the terminal:**
> ```
> cd <project-path>
> claude
> ```
>
> **From Claude Desktop:** click the folder name at the bottom of the window and switch to the project folder.

Do NOT proceed with any build action. Do NOT create files, plan features, or write code.

This rule does NOT block: `/project-bootstrap`, `/sandbox-setup`, `/get-started`, or general questions.
