# Project Tracking

Use `01-Projects/` to track active work with goals and deadlines.

## Creating a Project

```bash
uteuk new project "API Redesign"
```

Creates a note in `01-Projects/API Redesign.md` with frontmatter:

```yaml
---
created: 2026-04-30
tags: [project]
status: active
---
```

## Project Lifecycle

| Status | Meaning | Action |
|--------|---------|--------|
| `active` | Currently being worked on | Continue tracking |
| `completed` | Finished and delivered | Move to `04-Archive/` |
| `on-hold` | Paused pending external factor | Review periodically |
| `cancelled` | No longer relevant | Move to `04-Archive/` |

## Project Note Structure

A well-structured project note includes:

```markdown
# Project Name

## Goal

[What success looks like]

## Status

- Current status: active
- Last updated: 2026-04-30

## Milestones

- [ ] Milestone 1
- [ ] Milestone 2
- [ ] Milestone 3

## Notes

- [[Related Resource]]
- [[Related Task]]
```

## Monitoring Projects

Check all project statuses:

```bash
uteuk status
```

The status command lists all projects with their current status.

## Linking Projects to Other Notes

- **Tasks**: Link task notes to projects with `project: "Project Name"` in task frontmatter
- **Daily notes**: Reference projects in daily entries with `[[Project Name]]`
- **Resources**: Link relevant resource notes to projects

## Archiving Completed Projects

When a project is complete:

1. Update status to `completed`
2. Move the note to `04-Archive/`
3. Update any MOCs or index notes that referenced it

```bash
# After completing the project in Obsidian, move the file:
mv ~/vault/01-Projects/API\ Redesign.md ~/vault/04-Archive/
```
