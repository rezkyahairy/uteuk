# OpenClaw Slash Commands

12 Uteuk slash commands available in OpenClaw's `.openclaw/commands/uteuk.*.md` files.

## Usage

In your OpenClaw session, type the slash command:

```
/uteuk.capture I think we need to add caching to the API layer
```

## Available Commands

| Command | Description |
|---------|-------------|
| `/uteuk.capture` | Create a raw idea note in Inbox |
| `/uteuk.process` | Summarize and organize inbox notes |
| `/uteuk.expand` | Develop a seed idea into a full note |
| `/uteuk.organize` | Move notes into PARA structure |
| `/uteuk.connect` | Find links between notes |
| `/uteuk.populate-moc` | Build a Map of Content |
| `/uteuk.daily` | Create and review today's daily note |
| `/uteuk.status` | Check vault health |
| `/uteuk.task-capture` | Capture a task note |
| `/uteuk.task-review` | Review and organize tasks |
| `/uteuk.publish` | Draft output from organized notes |
| `/uteuk.weekly-review` | Full vault audit |

## Notes

- Commands are installed in `.openclaw/commands/` by `uteuk init`
- OpenClaw uses `--message` flag for headless invocation (different from other agents' `-p`)
