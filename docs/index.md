# Uteuk — AI-assisted Second Brain CLI

> **Uteuk** *(Basa Sunda: Brain)* — A knowledge management system for Obsidian that installs AI pipeline prompts, note templates, and agent configs with one command.

## Quick Start

### 1. Install

```bash
npm install -g uteuk
```

Requires **Node.js >= 24**.

### 2. Initialize Your Vault

```bash
# Into an existing Obsidian vault
uteuk init ~/path/to/vault

# Or create a fresh PARA-structured vault
uteuk init --from-scratch ~/new-vault
```

The interactive setup wizard walks you through:
1. **Pre-flight checks** — verifies Node.js, git, and vault path
2. **Git setup** — initializes git, optionally configures a remote
3. **AI Agent setup** — select your primary agent and enter API credentials
4. **Plugin recommendations** — suggested Obsidian plugins
5. **Verification** — confirms everything is set up correctly

### 3. Capture Your First Idea

```bash
uteuk capture "What if my notes could link themselves?"
```

If you've configured an AI agent, Uteuk automatically invokes it to expand and enrich the note.

### 4. Set Up Your AI Agent

```bash
uteuk setup ai
```

Follow the prompts to select your agent (Claude Code, Qwen Code, Gemini, OpenCode, or OpenClaw), enter your API key, and mark it as your active agent.

## What's Next?

- **[CLI Commands](cli/commands.md)** — Complete reference of all commands
- **[AI Integration](ai/overview.md)** — How Uteuk works with AI agents
- **[Slash Commands](slash-commands/overview.md)** — Use Uteuk from inside your AI agent session
- **[Vault Structure](vault/structure.md)** — Understanding PARA organization
- **[Workflows](workflows/daily.md)** — Daily notes, weekly reviews, and more
- **[Troubleshooting](troubleshooting.md)** — Common issues and solutions

## Key Features

| Feature | Description |
|---------|-------------|
| **Interactive onboarding** | 5-step setup wizard with pre-flight checks |
| **AI-enhanced notes** | Auto-invokes AI agent to expand captures and daily notes |
| **6 AI agents supported** | Claude, Qwen, Gemini, OpenCode, OpenClaw, Uteuk CLI |
| **72 slash commands** | Pipeline commands in every supported agent |
| **PARA methodology** | Projects, Areas, Resources, Archive |
| **Vault health checks** | Inbox count, orphans, stale MOCs, sync status |
| **Multi-device sync** | Git-based sync via Obsidian Git plugin |
| **Open source** | Apache 2.0 license |
