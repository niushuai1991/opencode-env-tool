# OpenCode Env Tool

An [OpenCode](https://opencode.ai) custom tool for safely inspecting `.env` files. It allows the LLM to check whether environment variable keys exist and whether their values are empty — **without ever exposing actual values**, preventing secret leakage in AI conversations.

## Features

- Check if one or more keys exist in a `.env` file
- Check if one or more keys have empty values
- List all key names in a `.env` file
- Supports quoted values (`KEY="VALUE"`, `KEY='VALUE'`)
- Ignores comments (`#`) and blank lines
- Custom env file path support (e.g. `.env.local`, `.env.production`)

## Install

Copy the tool file into your project's `.opencode/tools/` directory:

```bash
mkdir -p .opencode/tools
cp env.ts .opencode/tools/env.ts
```

Or install globally for all projects:

```bash
mkdir -p ~/.config/opencode/tools
cp env.ts ~/.config/opencode/tools/env.ts
```

## Usage

Once installed, three tools become available to the LLM in OpenCode:

### `env_check` — Check key existence

Returns whether each key exists in the env file.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | `string[]` | Yes | — | List of key names to check |
| `envFile` | `string` | No | `.env` | Path to env file, relative to project root |

Example result:

```json
{
  "DATABASE_URL": true,
  "REDIS_URL": true,
  "MISSING_KEY": false
}
```

### `env_list` — List all key names

Returns all key names in the env file without any values.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `envFile` | `string` | No | `.env` | Path to env file, relative to project root |

Example result:

```json
{
  "keys": ["DATABASE_URL", "REDIS_URL", "API_KEY"],
  "count": 3
}
```

### `env_empty` — Check if values are empty

Returns whether each key's value is empty. Missing keys are reported as `"not_found"`.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | `string[]` | Yes | — | List of key names to check |
| `envFile` | `string` | No | `.env` | Path to env file, relative to project root |

Example result:

```json
{
  "DATABASE_URL": false,
  "REDIS_URL": true,
  "MISSING_KEY": "not_found"
}
```

## Security

This tool is designed to **never return variable values**. All responses contain only boolean or status information, ensuring secrets like API keys, tokens, and passwords remain protected.
