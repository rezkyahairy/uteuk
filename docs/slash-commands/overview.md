# Slash Commands Overview

Slash commands let you invoke Uteuk pipeline operations directly from inside your AI agent session — no terminal switching needed.

## What Are Slash Commands?

Slash commands are markdown configuration files installed by `uteuk init` into each AI agent's command directory. When you type `/uteuk.capture` in your agent's chat, the agent reads the command definition and executes the pipeline step.

## The Pipeline

Uteuk implements a 4-phase AI-assisted note-taking pipeline:

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ CAPTURE  │ → │ PROCESS  │ → │ ORGANIZE │ → │ EXPRESS  │
│  (You)   │    │  (AI)    │    │ (You+AI) │    │ (You+AI) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

| Phase | Slash Command | Description |
|-------|--------------|-------------|
| Capture | `/uteuk.capture` | Create a raw idea note in `00-Inbox/` |
| Process | `/uteuk.process` | Summarize and organize inbox notes |
| Expand | `/uteuk.expand` | Develop a seed idea into a full note |
| Organize | `/uteuk.organize` | Move notes into PARA structure |
| Connect | `/uteuk.connect` | Find links between notes |
| MOC | `/uteuk.populate-moc` | Build a Map of Content |
| Daily | `/uteuk.daily` | Create and review today's daily note |
| Status | `/uteuk.status` | Check vault health |
| Task | `/uteuk.task-capture` | Capture a task note |
| Task Review | `/uteuk.task-review` | Review and organize tasks |
| Publish | `/uteuk.publish` | Draft output from organized notes |
| Weekly Review | `/uteuk.weekly-review` | Full vault audit |

## Where Commands Are Installed

Each agent gets 12 command files in its standard directory:

| Agent | Command Directory |
|-------|------------------|
| Claude Code | `.claude/commands/uteuk.*.md` |
| Qwen Code | `.qwen/commands/uteuk.*.md` |
| Gemini CLI | `.gemini/commands/uteuk.*.md` |
| OpenCode | `.opencode/commands/uteuk.*.md` |
| OpenClaw | `.openclaw/commands/uteuk.*.md` |

## Usage

In your AI agent session, type the slash command:

```
/uteuk.capture I think we need a caching layer in the API
```

The agent reads the command file, understands the pipeline step, and executes it — creating the note, processing inbox, finding connections, or whatever the command specifies.

## Agent-Specific Pages

Each AI agent has slightly different command conventions and invocation patterns. See the agent-specific pages for exact usage:

- [Claude Code](claude.md)
- [Qwen Code](qwen.md)
- [Gemini CLI](gemini.md)
- [OpenCode](opencode.md)
- [OpenClaw](openclaw.md)
