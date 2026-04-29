# CLI Commands Reference

Complete reference for all Uteuk CLI commands. All commands support `--vault <path>` to specify a non-default vault directory.

## Core Commands

### `uteuk init [vault]`

Install Uteuk into an Obsidian vault with an interactive 5-step setup wizard.

```bash
uteuk init ~/path/to/vault
```

| Flag | Description |
|------|-------------|
| `--existing` | Merge into existing vault (default if vault detected) |
| `--from-scratch` | Create a new PARA-structured vault from scratch |
| `--force` | Force `--from-scratch` on a non-empty directory |
| `--non-interactive` | Run without prompts (CI/automation) |
| `--skip-git` | Skip git remote configuration |
| `--skip-ai` | Skip AI agent setup |

**Examples:**

```bash
# Auto-detect and install into current vault
uteuk init

# Create fresh PARA structure in a new directory
uteuk init --from-scratch ~/vault

# Silent install for CI/automation
uteuk init ~/vault --non-interactive
```

### `uteuk capture [text]`

Create a timestamped note in `00-Inbox/`. If an AI agent is configured and installed, Uteuk automatically invokes it to expand and enrich the note.

```bash
uteuk capture "What if notes could auto-link themselves?"
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault (defaults to current directory) |

**Examples:**

```bash
# Quick capture with text
uteuk capture "Build a personal wiki"

# Untitled capture
uteuk capture

# Capture to a specific vault
uteuk capture "Idea about caching" --vault ~/vault
```

### `uteuk daily`

Create today's daily note from template. If an AI agent is configured, it pre-populates the note with agenda suggestions and context.

```bash
uteuk daily
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault (defaults to current directory) |

**Examples:**

```bash
# Create today's daily note
uteuk daily

# To a specific vault
uteuk daily --vault ~/vault
```

### `uteuk new <type> [title]`

Create a note from a template.

```bash
uteuk new project "API Redesign"
```

| Argument | Description |
|----------|-------------|
| `<type>` | Note type: `project`, `daily`, `resource`, `moc`, `task`, `inbox` |
| `[title]` | Optional title (uses date-based default if omitted) |

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault (defaults to current directory) |

**Examples:**

```bash
uteuk new project "Build CLI"
uteuk new resource "TypeScript Patterns"
uteuk new moc "Learning"
uteuk new task "Fix login bug"
uteuk new inbox "Random thought"
```

### `uteuk templates`

List available note templates.

```bash
uteuk templates
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |
| `--json` | Output in JSON format |

### `uteuk status`

Check vault health — inbox count, orphans, stale MOCs, sync status.

```bash
uteuk status
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |
| `--json` | Output in JSON format |

### `uteuk update`

Update Uteuk prompts, templates, and commands to the latest version.

```bash
uteuk update
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |

## AI Commands

These commands require an active AI agent configured via `uteuk setup ai`.

### `uteuk process`

Process all inbox notes with AI — summarizes, suggests tags, recommends PARA placement.

```bash
uteuk process
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |

**Examples:**

```bash
# Process inbox
uteuk process

# Specific vault
uteuk process --vault ~/vault
```

### `uteuk connect <noteA> <noteB>`

Find connections between two notes using AI.

```bash
uteuk connect "[[Learning]]" "[[AI Ethics]]"
```

| Argument | Description |
|----------|-------------|
| `<noteA>` | First note reference (with or without `[[ ]]`) |
| `<noteB>` | Second note reference |

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |

**Examples:**

```bash
uteuk connect "Learning" "AI Ethics"
uteuk connect "[[Machine Learning]]" "[[Philosophy]]"
```

### `uteuk moc <topic>`

Build a Map of Content for a topic using AI.

```bash
uteuk moc "Learning"
```

| Argument | Description |
|----------|-------------|
| `<topic>` | Topic name for the MOC |

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |

**Examples:**

```bash
uteuk moc "Learning"
uteuk moc "TypeScript Patterns" --vault ~/vault
```

### `uteuk weekly-review`

Run a comprehensive weekly vault review with AI — analyzes inbox backlog, project health, stale MOCs, and orphaned notes.

```bash
uteuk weekly-review
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |

## Utility Commands

### `uteuk doctor [vault]`

Check system prerequisites — Node.js version, git availability, vault path validity.

```bash
uteuk doctor
```

**Examples:**

```bash
# Check current directory
uteuk doctor

# Check specific vault
uteuk doctor ~/vault
```

### `uteuk setup ai`

Configure AI agent settings — select agent, enter API key, set as active.

```bash
uteuk setup ai
```

| Flag | Description |
|------|-------------|
| `--agent <name>` | Configure a specific agent |
| `--set-active <name>` | Set the active (primary) agent |
| `--skip` | Skip AI setup |

**Examples:**

```bash
# Interactive agent selection
uteuk setup ai

# Set specific agent as active
uteuk setup ai --set-active claude

# Configure a specific agent
uteuk setup ai --agent qwen
```

### `uteuk setup verify [vault]`

Verify vault setup is complete — checks structure, git, templates, agent configs.

```bash
uteuk setup verify
```

| Flag | Description |
|------|-------------|
| `--vault <path>` | Path to vault |
