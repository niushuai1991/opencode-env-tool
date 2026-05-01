# AGENTS.md

## Project

OpenCode custom tool that safely inspects `.env` files. Single file, no build step, no dependencies beyond `@opencode-ai/plugin` (available at runtime).

## Critical constraint

**Never return env variable values.** All tool output must contain only boolean or status info. If modifying `env.ts`, ensure no code path leaks values into the return string.

## Structure

- `.opencode/tools/env.ts` — the entire tool, exports `check` and `empty` (registered as `env_check` and `env_empty` per OpenCode naming convention)
- `.env` — sample file for testing only, not used at runtime
- `README.md` — user-facing docs including install instructions

## When editing env.ts

- Uses `tool()` from `@opencode-ai/plugin` and `tool.schema` (Zod) — do not import zod directly
- File is consumed by OpenCode's Bun runtime at `.opencode/tools/`; no npm install or build needed
- `context.worktree` is the project root used to resolve relative env file paths
