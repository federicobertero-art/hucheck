# Check Report
Generated: 2026-07-03T18:59:56.997Z

## check-infra
vite.config.ts: pass
tsconfig.json: pass
biome.jsonc: pass
scripts/dev.ts: pass
vercel.json: pass
vercel.dev.json: pass
src/App.tsx: pass
.env.example: pass
scripts/dev.ts shape: pass
vercel.dev.json shape: pass
biome.json absent: pass
vercel.prod.json absent: pass
src/ directory: pass
api/ directory: pass

## check-claude-folder
claude-folder-exists: pass
claude-stale-entries: pass
claude-settings-exists: pass
claude-settings-valid: pass
claude-plugin:humand-react@hu-ai-agent-plugin: pass
claude-plugin:humand-frontend-sandbox@hu-ai-agent-plugin: pass
claude-permission:Skill(humand-frontend-sandbox:project-check): pass
claude-permission:Skill(humand-frontend-sandbox:project-remediate): pass
claude-permission:Bash(bun */scripts/checks/*.ts *): pass
claude-permission:Bash(bun */scripts/remediate/*.ts *): pass
claude-rules-synced: pass

## check-plan
plan: pass

## check-deps
dep:material-hu: pass
dep:hu-translations: pass
dep:@tanstack/react-query: pass
dep:react-hook-form: pass
dep:@hookform/resolvers: pass
dep:zod: pass
devDep:@biomejs/biome: pass
devDep:@humanddev/humand-biome-config: fail (missing)
devDep:@humanddev/external-app-audit: pass
script:dev: pass
script:prebuild: pass
script:predeploy: pass
no-conflicting-libs: pass
extra-dep: xlsx
extra-devDep: humand-biome-config

## check-vite-aliases
alias:@material-hu/mui: pass
alias:@material-hu/mui/lab: pass
alias:@material-hu/mui/x-date-pickers: pass
alias:@material-hu/icons/material: pass
alias:@material-hu/icons/tabler: pass
alias:@material-hu/hooks: pass
alias:@material-hu/utils: pass
alias:@material-hu/types: pass
alias:@material-hu/styles: pass
alias:@material-hu/theme: pass
alias:@material-hu/components: pass
alias:src: fail (missing)

## check-tsconfig
strict: pass
moduleResolution: pass
paths:@material-hu/mui: pass
paths:@material-hu/components: fail (missing)

## check-providers
ThemeProvider: pass
DialogLayerProvider: pass
DrawerLayerProvider: pass
MenuLayerProvider: pass

## check-persistence
persistence-layer: mock
persistence-layer: mock-unmigrated
persistence-layer: local

## check-mocks
mock-present: true
mock-centralized: true
mock-dispersed-count: 7
mock-dispersed-file: src//pages/Reporting/index.tsx
mock-dispersed-file: src//pages/Processes/Management/store.ts
mock-dispersed-file: src//pages/Processes/Detail/constants.ts
mock-dispersed-file: src//pages/Processes/Detail/store.ts
mock-dispersed-file: src//pages/Processes/constants.ts
mock-dispersed-file: src//pages/Processes/ComplianceHistory/constants.ts
mock-dispersed-file: src//pages/Processes/branches.ts

## check-auth
auth-method: unsafe
api/auth: warn (present but does not match any known Humand auth pattern)
auth: warn (UNSAFE-AUTH-GRACE — custom auth detected, not based on Humand/Janus patterns; deploying temporarily by explicit risk acceptance; remove when provisioning is live)

## check-audit
audit: pass
audit-blocking-count: 0
audit-warning-count: 0

## check-ai
ai-direct-usage: false
ai-on-glados: false
