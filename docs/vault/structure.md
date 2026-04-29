# Vault Structure

Uteuk uses the **PARA methodology** (Projects, Areas, Resources, Archive) for organizing knowledge. PARA was developed by Tiago Forte and is designed around actionability — how likely you are to need the information for an active project or responsibility.

## Folder Structure

```
vault/
├── 00-Inbox/          → Raw, unprocessed ideas (capture bucket)
├── 01-Projects/       → Active work with a goal and deadline
├── 02-Areas/          → Ongoing responsibilities with no end date
├── 03-Resources/      → Reference material and Maps of Content
├── 04-Archive/        → Completed or inactive items
├── 05-Templates/      → Note templates
├── 06-Daily/          → Daily notes (append-only)
└── .uteuk/            → AI pipeline prompts and commands
```

### `00-Inbox/` — Capture Bucket

The entry point for all new ideas. Notes here are raw, unprocessed, and unorganized.

**Workflow:** Capture ideas here → process with AI → move to appropriate PARA folder.

```bash
uteuk capture "What if notes auto-linked?"
uteuk process          # AI processes all inbox notes
```

### `01-Projects/` — Active Projects

Work with a **specific goal** and **deadline**. Examples: "Redesign API", "Write blog post", "Plan vacation".

**Frontmatter:**

```yaml
---
created: 2026-04-30
status: active
---
```

### `02-Areas/` — Ongoing Responsibilities

Areas of life that require **ongoing attention** but have no end date. Examples: "Health", "Finances", "Team Management".

### `03-Resources/` — Reference Material

Information you'll **look up later**. This is also where Maps of Content (MOCs) live.

**Examples:** "TypeScript Patterns", "AI Ethics Notes", "MOC - Learning".

### `04-Archive/` — Completed Items

Moved here when a project is complete, an area is no longer relevant, or a resource is outdated.

### `05-Templates/` — Note Templates

Installed by `uteuk init`. Used by `uteuk new` to create structured notes.

See [Templates](templates.md) for the full template reference.

### `06-Daily/` — Daily Notes

Append-only daily logs. One note per day, named `YYYY-MM-DD.md`.

```bash
uteuk daily    # Creates today's daily note
```

### `.uteuk/` — AI Infrastructure

Contains pipeline prompts, slash commands, shared skills, and onboarding configuration.

```
.uteuk/
├── prompts/          # 14 pipeline prompt templates
├── commands/         # 12 agent-agnostic command definitions
├── skills/           # Shared utilities (date-helper, etc.)
└── config.json       # Onboarding state (activeAgent, etc.)
```

## How Notes Flow Through PARA

```
Capture → Inbox → Process → Organize → PARA
  │         │        │         │
  │         │        │         └─ Move to Projects/Areas/Resources
  │         │        └─ AI summarizes, suggests tags
  │         └─ Raw ideas pile up here
  └─ uteuk capture creates notes here
```

Use `uteuk process` to have AI review your inbox and suggest organization. Then manually (or via `/uteuk.organize` slash command) move notes to their final PARA location.
