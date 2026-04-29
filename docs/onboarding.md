# Onboarding Wizard

The `uteuk init` command runs an interactive 5-step setup wizard to configure your vault for the full Uteuk experience.

## Step 1: Pre-flight Checks

Verifies your system is ready:

| Check | What It Tests | Fix |
|-------|--------------|-----|
| Node.js | Version >= 24 | `nvm install 24` |
| git | Binary on PATH | Install via package manager |
| Vault path | Directory exists and is writable | `mkdir -p ~/vault` |

If any check fails, `uteuk init` aborts with clear error messages before making any changes.

Run standalone anytime: `uteuk doctor`

## Step 2: Git Repository

Sets up git for vault sync:

- **From-scratch mode**: Runs `git init` automatically. Reads `user.name`/`user.email` from system git config. Prompts if not set.
- **Optional remote**: Asks `? Configure a remote URL for vault sync? (y/N)`. If yes, runs `git remote add origin <url>`.
- **Existing vault**: Detects if `.git/` exists. If missing, offers to initialize.

**Skip:** `uteuk init --skip-git`

## Step 3: AI Agent Setup

Selects and configures your primary AI agent:

1. **Choose agent**: Numbered menu of all supported agents (Claude, Qwen, Gemini, OpenCode, OpenClaw) or skip.
2. **Enter API key**: Masked input for your agent's API key.
3. **Store key**: Offers to save the key in the agent's native config location (e.g., `~/.config/anthropic/credentials.json` for Claude).
4. **Set active**: Asks to mark this agent as your primary (active) agent.

Active agent is recorded in `.uteuk/config.json`.

**Skip:** `uteuk init --skip-ai` or run later with `uteuk setup ai`.

## Step 4: Obsidian Plugin Recommendations

Displays recommended plugins (informational only):

| Plugin | What It Does | Setup |
|--------|-------------|-------|
| Templates | Use `05-Templates/` for new notes | Settings → Files & Links → Template folder → `05-Templates/` |
| Daily Notes | Create daily notes in `06-Daily/` | Settings → Daily Notes → New file location → `06-Daily/` |
| Obsidian Git | Automatic vault sync | Install from Community Plugins → Configure push/pull interval |

These are **optional**. Core Uteuk features work without any plugins.

## Step 5: Verification

Validates the complete setup:

| Check | What It Tests |
|-------|--------------|
| Vault structure | All 7 PARA folders exist |
| Git repo | `.git/` exists, optionally with remote |
| Templates | `05-Templates/` has `.md` files |
| Agent configs | At least one agent config file at vault root |
| Active agent | `.uteuk/config.json` has `activeAgent` set |

All pass → "✓ Setup complete! Your vault is ready."
Some fail → Shows failures with fix instructions, but doesn't block completion.

## Non-Interactive Mode

For CI/automation, run without prompts:

```bash
uteuk init ~/vault --non-interactive
```

This creates the full vault structure (PARA folders, templates, agent configs, slash commands) but skips the interactive wizard steps — no git remote, no AI configuration.
