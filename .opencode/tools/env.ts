import { tool } from "@opencode-ai/plugin"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

function parseEnvFile(filePath: string): Map<string, string> {
  const env = new Map<string, string>()
  if (!existsSync(filePath)) return env

  const content = readFileSync(filePath, "utf-8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const eqIndex = trimmed.indexOf("=")
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    env.set(key, value)
  }

  return env
}

function resolveEnvPath(envFile: string, worktree: string): string {
  if (envFile.startsWith("/")) return envFile
  return join(worktree, envFile)
}

export const check = tool({
  description:
    "Check if one or more keys exist in a .env file. Returns existence status for each key without exposing values.",
  args: {
    keys: tool.schema
      .array(tool.schema.string())
      .min(1)
      .describe("List of env key names to check"),
    envFile: tool.schema
      .string()
      .default(".env")
      .describe("Path to the env file, relative to project root. Default: .env"),
  },
  async execute(args, context) {
    const filePath = resolveEnvPath(args.envFile, context.worktree)
    const env = parseEnvFile(filePath)

    if (env.size === 0) {
      return `File not found or empty: ${args.envFile}`
    }

    const results: Record<string, boolean> = {}
    for (const key of args.keys) {
      results[key] = env.has(key)
    }

    return JSON.stringify(results, null, 2)
  },
})

export const empty = tool({
  description:
    "Check if one or more keys have empty values in a .env file. Returns empty status for each key. Missing keys are reported as 'not_found'. Never exposes actual values.",
  args: {
    keys: tool.schema
      .array(tool.schema.string())
      .min(1)
      .describe("List of env key names to check"),
    envFile: tool.schema
      .string()
      .default(".env")
      .describe("Path to the env file, relative to project root. Default: .env"),
  },
  async execute(args, context) {
    const filePath = resolveEnvPath(args.envFile, context.worktree)
    const env = parseEnvFile(filePath)

    if (env.size === 0) {
      return `File not found or empty: ${args.envFile}`
    }

    const results: Record<string, boolean | string> = {}
    for (const key of args.keys) {
      if (!env.has(key)) {
        results[key] = "not_found"
      } else {
        results[key] = env.get(key) === ""
      }
    }

    return JSON.stringify(results, null, 2)
  },
})
