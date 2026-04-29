# Uteuk

<p align="center">
  <img src="logo.png" alt="Uteuk Logo" width="200">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/uteuk"><img src="https://img.shields.io/npm/v/uteuk?style=flat-square&logo=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/uteuk"><img src="https://img.shields.io/npm/dm/uteuk?style=flat-square&logo=npm" alt="npm downloads"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D24-0E4A1E?style=flat-square&logo=node.js" alt="Node.js"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-0E4A1E?style=flat-square" alt="License"></a>
  <a href="https://github.com/rezkyahairy/uteuk/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/rezkyahairy/uteuk/ci.yml?style=flat-square&logo=github-actions" alt="CI"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
</p>

> **Uteuk** *(Basa Sunda: Brain)* — An AI-assisted Second Brain for Obsidian. Install pipeline prompts, note templates, and agent configs into any vault with one command.

## What Is Uteuk?

Uteuk is a CLI that installs AI knowledge-management infrastructure into Obsidian vaults. After `uteuk init`, your vault gets:

- **72 slash commands** across 6 AI agents (Claude, Qwen, Gemini, OpenCode, OpenClaw, Uteuk) — per-step commands for the full note-taking pipeline
- **12 pipeline prompts** in `.uteuk/prompts/` — structured instructions for capturing, processing, and organizing knowledge
- **5 note templates** — Daily, Project, Resource, MOC, Task
- **6 agent configs** — AGENT.md + per-agent configs that tell each AI how to work with your vault
- **Shared skills** — `.uteuk/skills/` with agent-agnostic utilities (date helper, etc.)

You bring your own vault. Uteuk installs into it.

## Quick Start

### Install

```bash
npm install -g uteuk
```

### Initialize a Vault

```bash
uteuk init ~/your-obsidian-vault
```

Or create a fresh PARA-structured vault:

```bash
uteuk init --from-scratch ~/new-vault
```

### Use with Your AI Agent

Open your vault in your preferred AI coding assistant. The installed configs tell the agent how to:

- Capture raw ideas into `00-Inbox/`
- Process and summarize inbox notes
- Find connections between notes
- Build Maps of Content
- Run weekly reviews

## CLI Reference

### Commands

| Command | Description |
|---------|-------------|
| `uteuk init [vault]` | Install Uteuk into an existing or new vault |
| `uteuk capture "idea"` | Create a timestamped note in `00-Inbox/` |
| `uteuk new <type> [title]` | Create a note from template (project, daily, resource, moc, task, inbox) |
| `uteuk templates` | List available note templates |
| `uteuk status` | Check vault health — inbox count, orphans, stale MOCs, sync status |
| `uteuk update` | Update prompts, templates, and commands to latest version |

### Global Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Show version number |
| `-h, --help` | Show help |
| `--vault <path>` | Set vault path globally (overridden by local `--vault`) |
| `--json` | Machine-parseable JSON output (`status` and `templates` commands) |

### Examples

```bash
# Install into existing vault
uteuk init ~/vault

# Create fresh PARA vault
uteuk init --from-scratch ~/vault

# Capture an idea
uteuk capture "What if notes auto-linked?"

# Create a project note
uteuk new project "API Redesign"

# Check vault health as JSON
uteuk status --json

# Use a non-default vault path once
uteuk --vault ~/vault status
```

## The Pipeline

Uteuk implements a 4-phase AI-assisted note-taking pipeline:

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ CAPTURE  │ → │ PROCESS  │ → │ ORGANIZE │ → │ EXPRESS  │
│  (You)   │    │  (AI)    │    │ (You+AI) │    │ (You+AI) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

Each phase has dedicated slash commands for every supported agent:

| Phase | Claude | Qwen | Gemini | OpenCode | OpenClaw |
|-------|--------|------|--------|----------|----------|
| Capture | `uteuk.capture` | `uteuk.capture` | `uteuk.capture` | `uteuk.capture` | `uteuk.capture` |
| Process | `uteuk.process` | `uteuk.process` | `uteuk.process` | `uteuk.process` | `uteuk.process` |
| Expand | `uteuk.expand` | `uteuk.expand` | `uteuk.expand` | `uteuk.expand` | `uteuk.expand` |
| Organize | `uteuk.organize` | `uteuk.organize` | `uteuk.organize` | `uteuk.organize` | `uteuk.organize` |
| Connect | `uteuk.connect` | `uteuk.connect` | `uteuk.connect` | `uteuk.connect` | `uteuk.connect` |
| MOC | `uteuk.populate-moc` | `uteuk.populate-moc` | `uteuk.populate-moc` | `uteuk.populate-moc` | `uteuk.populate-moc` |
| Daily | `uteuk.daily` | `uteuk.daily` | `uteuk.daily` | `uteuk.daily` | `uteuk.daily` |
| Status | `uteuk.status` | `uteuk.status` | `uteuk.status` | `uteuk.status` | `uteuk.status` |
| Task Capture | `uteuk.task-capture` | `uteuk.task-capture` | `uteuk.task-capture` | `uteuk.task-capture` | `uteuk.task-capture` |
| Task Review | `uteuk.task-review` | `uteuk.task-review` | `uteuk.task-review` | `uteuk.task-review` | `uteuk.task-review` |
| Publish | `uteuk.publish` | `uteuk.publish` | `uteuk.publish` | `uteuk.publish` | `uteuk.publish` |
| Weekly Review | `uteuk.weekly-review` | `uteuk.weekly-review` | `uteuk.weekly-review` | `uteuk.weekly-review` | `uteuk.weekly-review` |

## What's Installed

### `.uteuk/` — AI Pipeline Infrastructure

```
.uteuk/
├── prompts/          # 12 pipeline prompt templates
│   ├── capture.md
│   ├── process.md
│   ├── expand.md
│   ├── organize.md
│   ├── connect.md
│   ├── populate-moc.md
│   ├── weekly-review.md
│   ├── daily.md
│   ├── status.md
│   ├── publish.md
│   ├── task-capture.md
│   └── task-review.md
├── commands/         # 12 agent-agnostic command definitions
│   └── uteuk.*.md
└── skills/           # Shared utilities
    └── date-helper/
```

### Agent Configs

Each agent gets its own config directory with 12 slash commands:

| Agent | Config | Command Dir |
|-------|--------|-------------|
| Claude Code | `CLAUDE.md` | `.claude/commands/` |
| Qwen Code | `QWEN.md` | `.qwen/commands/` |
| Gemini | `GEMINI.md` | `.gemini/commands/` |
| OpenCode | `OPENCODE.md` | `.opencode/commands/` |
| OpenClaw | `OPENCLAW.md` | `.openclaw/commands/` |
| Uteuk (CLI) | `AGENT.md` | `.uteuk/commands/` |

### Note Templates

5 templates installed into `05-Templates/`:

| Template | Use Case |
|----------|----------|
| Daily Note | Daily log / journal |
| Project | Active project with goals and status |
| Resource | Reference material with tags |
| MOC | Map of Content — index page for a topic |
| Task | Actionable task with status tracking |
| Inbox | Structured fleeting note with processing tags |

## AI Philosophy

The AI is a **collaborator, not an autonomous agent**. Key rules enforced across all agents:

- **Never** deletes or moves files without explicit human approval
- **Never** overwrites original content — only adds new tags and links
- **Always** presents suggestions first, acts only after "yes"
- Human is the **sole author** of all git commits — no AI co-author lines

See `AGENT.md` for the universal rules all agents follow.

## PARA Structure

Uteuk uses the PARA method for organizing knowledge:

| Folder | Purpose |
|--------|---------|
| `00-Inbox/` | Raw, unprocessed ideas — your capture bucket |
| `01-Projects/` | Active work with a goal and deadline |
| `02-Areas/` | Ongoing responsibilities with no end date |
| `03-Resources/` | Reference material + MOCs |
| `04-Archive/` | Completed or inactive items |
| `05-Templates/` | Note templates |
| `06-Daily/` | Daily notes (append-only) |

## Development

```bash
git clone git@github.com:rezkyahairy/uteuk.git
cd uteuk
npm install
npm run build
npm run test
npm run lint
```

### Adding a CLI Command

1. Create handler in `src/<command>.ts`
2. Export a function
3. Register in `src/cli.ts` with Commander
4. Add tests in `test/`
5. Update this README

### Feature Development

This project uses spec-kit (`/spec → /plan → /tasks → /implement`). See `CONTRIBUTING.md` for details.

## License

Apache 2.0 — See [LICENSE](LICENSE) for details.

## Contributing

Found a bug in the prompts? Want to improve the pipeline? Open an issue or pull request. This is open-source because knowledge should be free.

---
*Uteuk — Think in connections.*
