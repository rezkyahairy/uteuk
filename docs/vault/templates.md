# Note Templates

Templates installed by `uteuk init` into `05-Templates/`. Used by `uteuk new <type>` to create structured notes.

## Available Templates

| Template | Type | Target Folder | Use Case |
|----------|------|---------------|----------|
| Daily Note | `daily` | `06-Daily/` | Daily log / journal |
| Project | `project` | `01-Projects/` | Active project with goals and status |
| Resource | `resource` | `03-Resources/` | Reference material with tags |
| MOC | `moc` | `03-Resources/` | Map of Content — index page for a topic |
| Task | `task` | `00-Inbox/` | Actionable task with status tracking |
| Inbox | `inbox` | `00-Inbox/` | Structured fleeting note with processing tags |

## Template Structure

Each template uses frontmatter with `{{date}}` and `{{title}}` placeholders that are substituted at creation time.

### Daily Note

```yaml
---
created: "{{date}}"
tags: [daily]
---
```

### Project

```yaml
---
created: "{{date}}"
tags: [project]
status: active
---
```

### Resource

```yaml
---
created: "{{date}}"
tags: [resource, seed]
source: ""
---
```

### MOC

```yaml
---
created: "{{date}}"
updated: "{{date}}"
tags: [moc]
topic: ""
---
```

### Task

```yaml
---
created: "{{date}}"
tags: [task]
status: active
priority: medium
project: ""
due: ""
---
```

### Inbox

```yaml
---
created: "{{date}}"
tags: [fleeting]
status: unprocessed
source: ""
related: []
---
```

## Template Variables

| Variable | Substituted With |
|----------|-----------------|
| `{{date}}` | Current date (`YYYY-MM-DD`) |
| `{{time}}` | Current time (`HH:MM:SS`) |
| `{{title}}` | Title argument from `uteuk new` (empty if omitted) |
| `{{<other>}}` | Replaced with empty string (placeholder for manual fill-in) |

## Creating Notes from Templates

```bash
uteuk new project "API Redesign"
uteuk new resource "TypeScript Patterns"
uteuk new moc "Learning"
uteuk new task "Fix login bug"
uteuk new inbox "Random thought"
uteuk new daily              # Uses today's date as filename
```

## Adding Custom Templates

Create a `.md` file in `05-Templates/` with frontmatter and content. The template name is the filename (without `.md`).

To use a custom template:

```bash
uteuk new resource "My Custom Note"  # Uses the closest name match
```

The matching algorithm finds templates by case-insensitive prefix matching.
