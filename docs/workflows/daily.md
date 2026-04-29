# Daily Notes Workflow

Daily notes are append-only logs — one per day in `06-Daily/`, named `YYYY-MM-DD.md`.

## Creating a Daily Note

```bash
uteuk daily
```

If an AI agent is configured, the note is pre-populated with agenda suggestions and context.

## Daily Note Structure

```yaml
---
created: 2026-04-30
tags: [daily]
---

# 2026-04-30

## Agenda

-

## Notes

-

## Tasks

- [ ]
```

## Typical Daily Flow

1. **Morning**: `uteuk daily` — create today's note (AI-enhanced if available)
2. **Throughout the day**: Append entries manually in Obsidian or via CLI
3. **Capture ideas**: `uteuk capture "Thought during meeting"` — goes to Inbox
4. **End of day**: Review and link daily note to relevant project or resource notes

## Tips

- Use the daily note as a **log**, not a knowledge base. Capture events, decisions, and quick thoughts here. Move important ideas to proper notes via processing.
- **Link liberally**: Reference project notes with `[[Project Name]]` and resource notes with `[[Resource Name]]`.
- **Don't over-edit**: Daily notes are append-only. If you need to restructure content, create a new note in the appropriate PARA folder.

## AI-Enhanced Daily Notes

When an active agent is configured, `uteuk daily` invokes the agent to pre-populate the note with:

- Agenda suggestions based on your projects
- Follow-ups from recent daily notes
- Recurring tasks reminders

The agent reads recent daily notes and project notes to provide relevant context.
