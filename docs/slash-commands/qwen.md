# Qwen Code Slash Commands

12 Uteuk slash commands available in Qwen Code's `.qwen/commands/uteuk.*.md` files.

## Usage

In your Qwen Code session, type the slash command:

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

## How It Works

Each command file contains the pipeline step instructions. Qwen Code reads the file and executes the step by creating/editing vault notes.

## Notes

- Qwen Code uses the same command structure as Claude Code
- Commands are installed in `.qwen/commands/` by `uteuk init`
- No additional setup needed
