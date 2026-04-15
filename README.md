# Uteuk

<p align="center">
  <img src="logo.png" alt="Uteuk Logo" width="200">
</p>

> **Uteuk** *(Basa Sunda: Brain)* — An AI-assisted Second Brain for people who think in connections, not folders.

## What Is This?

Uteuk is a **knowledge management system** for Obsidian. It gives you:

- **AI pipeline prompts** — Capture → Process → Organize → Express
- **Note templates** — Daily, Project, Resource, MOC, Task, Meeting Notes
- **Agent configs** — Works with Claude, Qwen, OpenClaw
- **PARA methodology** — Projects, Areas, Resources, Archive

You bring your own vault. Uteuk installs into it.

## Quick Start

### 1. Install the CLI

```bash
npm install -g uteuk
```

### 2. Initialize Your Vault

```bash
uteuk init ~/your-obsidian-vault
```

The CLI will:
- Copy `.uteuk/` prompts and commands into your vault
- Copy templates into `05-Templates/`
- Install agent configs (CLAUDE.md, QWEN.md, OPENCLAW.md)
- Create empty PARA folders if they don't exist

### 3. Set Up an AI Agent

Uteuk works with multiple AI coding assistants. The `init` command installs the right config for your setup:

| Agent | Config File |
|-------|-------------|
| **Claude Code** | `CLAUDE.md` |
| **Qwen Code** | `QWEN.md` |
| **OpenClaw** | `OPENCLAW.md` |

Each config file tells the AI how to process your notes, follow the pipeline, and respect your ownership of knowledge.

### 4. Start Using

Drop ideas into `00-Inbox/` or write a daily note. Then ask your AI agent:

```
"Process my inbox"
"Summarize today's daily note"
"Find connections between [[Note A]] and [[Note B]]"
```

## Commands

| Command | Description |
|---------|-------------|
| `uteuk init` | Install Uteuk into your vault |
| `uteuk capture "idea"` | Create a raw idea note in Inbox |
| `uteuk new project "Name"` | Create a note from template |
| `uteuk templates` | List available templates |
| `uteuk status` | Check vault health |
| `uteuk update` | Update prompts and templates |

## The Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ CAPTURE  │ → │ PROCESS  │ → │ ORGANIZE │ → │ EXPRESS  │
│  (You)   │    │  (AI)    │    │ (You+AI) │    │ (You+AI) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

1. **Capture** — Dump raw ideas into `00-Inbox/` or `06-Daily/`
2. **Process** — AI reads, summarizes, finds connections, suggests organization
3. **Organize** — You approve, AI moves files into PARA structure, adds links
4. **Express** — Draft blog posts, reports, presentations from organized knowledge

## What's Included

### `.uteuk/` — AI Pipeline Prompts
The core of Uteuk. Prompts for every step of the note-taking pipeline:
- `capture` — Structure raw ideas
- `process` — Summarize and organize inbox notes
- `expand` — Develop seed ideas into full notes
- `organize` — Move notes into PARA structure
- `connect` — Find links between notes
- `populate-moc` — Build Maps of Content
- `weekly-review` — Full vault audit

### `05-Templates/` — Note Templates
- `Daily Note.md`
- `Project.md`
- `Resource.md`
- `MOC.md`
- `Task.md`
- `AI Processing Request.md`
- `Meeting Notes - AI Processed.md`

### Agent Configs
- `AGENT.md` — Universal rules for all AI agents
- `CLAUDE.md`, `QWEN.md`, `OPENCLAW.md` — Agent-specific configs

## How AI Works Here

The AI is a **collaborator, not a replacement**. You own your knowledge. The pipeline ensures:

- AI **never** deletes or moves files without your approval
- AI **never** overwrites your original content
- AI **always** presents suggestions first, acts after you say "yes"
- All Git commits are yours — no AI co-author injected

See `AGENT.md` for the full rule set.

## Key Concepts

### PARA Methodology
- **Projects** — Active work with a goal and deadline
- **Areas** — Ongoing responsibilities with no end date
- **Resources** — Reference material you'll look up later
- **Archive** — Completed or inactive items

### Maps of Content (MOCs)
MOCs are index pages for your knowledge. They link related notes together so you can browse by theme instead of folder.

## Multi-Device Sync

Uteuk works with Git-based sync via the Obsidian Git plugin. Configure auto-commit/push/pull in your vault settings. See [Obsidian Git](https://github.com/denolehov/obsidian-git) for setup.

## Where to Go Next

| If you want to... | Go here |
|-------------------|---------|
| Install Uteuk into your vault | See "Quick Start" above |
| Understand the pipeline | Read `.uteuk/prompts/` |
| Browse templates | `05-Templates/` |
| Understand AI agent rules | `AGENT.md` |

## Development

```bash
git clone git@github.com:rezkyahairy/uteuk.git
cd uteuk
npm install
npm run build
npm run test
```

## License

Apache 2.0 — See [LICENSE](LICENSE) for details.

## Contributing

Found a bug in the prompts? Want to improve the pipeline? Open an issue or pull request. This is open-source because knowledge should be free.

---
*Uteuk — Think in connections.*
