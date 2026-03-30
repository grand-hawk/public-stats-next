# AGENTS.md

## Code style

- Loosely use comments, only add them if additional context is required. When writing them, keep it casual and informal.
- Every component should have its own file. Look at the structure of the components directory for more context.

## Cursor Cloud specific instructions

### Project overview

This is a Next.js (Pages Router) app serving military vehicle statistics for Multicrew Tank Combat. It uses Turbopack in dev mode, tRPC for the API layer (inside Next.js API routes), and Chakra UI v3 for the component library. There is no database — all data is fetched from the remote `public-stats-data.multicrew.dev` API and code-generated into `generated/`.

### Key commands

| Task | Command |
|---|---|
| Install deps | `pnpm install` |
| Code generation | `pnpm generate` (auto-runs via `postinstall` if `generated/` is missing) |
| Content scaffolding | `pnpm content:generate` |
| Dev server | `pnpm dev` (port 3000, Turbopack) |
| Typecheck | `pnpm run typecheck` |
| Lint (typecheck + eslint) | `pnpm lint` |
| ESLint only | `pnpm run eslint` |
| Format | `pnpm run format` |
| Content validation | `pnpm content:validate` |

### Non-obvious caveats

- The `generated/` directory is not committed. It is created by `pnpm generate` which fetches data from the remote API. The `postinstall` hook runs it automatically if the directory is missing.
- The `content:generate` script creates markdown files under `content/vehicles/` and skips existing ones, so it is safe to re-run.
- The pre-commit hook (`.husky/pre-commit`) runs `pnpm lint` (typecheck + eslint). Ensure both pass before committing.
- No environment variables are required for local development. All env vars in `src/env.ts` have defaults or are optional.
- The devcontainer sets `DATA_ENV=production` and `FORCE_CACHE=true` for development. In cloud environments, the default `DATA_ENV=development` works fine.
