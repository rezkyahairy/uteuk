# Claude Code Slash Commands

12 Uteuk slash commands available in Claude Code's `.claude/commands/uteuk.*.md` files.

## Usage

In your Claude Code session, type the slash command followed by any arguments:

```
/uteuk.capture I think we need to add caching to the API layer
```

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/uteuk.capture` | Create a raw idea note in Inbox | `/uteuk.capture Build a personal wiki` |
| `/uteuk.process` | Summarize and organize inbox notes | `/uteuk.process` |
| `/uteuk.expand` | Develop a seed idea into a full note | `/uteuk.expand` |
| `/uteuk.organize` | Move notes into PARA structure | `/uteuk.organize` |
| `/uteuk.connect` | Find links between notes | `/uteuk.connect` |
| `/uteuk.populate-moc` | Build a Map of Content | `/uteuk.populate-moc` |
| `/uteuk.daily` | Create and review today's daily note | `/uteuk.daily` |
| `/uteuk.status` | Check vault health | `/uteuk.status` |
| `/uteuk.task-capture` | Capture a task note | `/uteuk.task-capture` |
| `/uteuk.task-review` | Review and organize tasks | `/uteuk.task-review` |
| `/uteuk.publish` | Draft output from organized notes | `/uteuk.publish` |
| `/uteuk.weekly-review` | Full vault audit | `/uteuk.weekly-review` |

## How It Works

Each command file contains:
- **Description** of the pipeline step
- **Instructions** for Claude on what to do
- **Rules** (never delete without approval, suggest first, etc.)

Claude reads the command file, understands the pipeline step, and executes it by reading/writing vault files.

## Notes

- Claude Code may prompt for approval before modifying files — this is expected behavior
- Commands work in any Claude Code session pointed at your vault directory
- No additional setup needed beyond `uteuk init`
