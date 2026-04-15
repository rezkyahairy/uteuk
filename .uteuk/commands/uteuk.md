---
description: Execute AI-Assisted Note-Taking Pipeline
---

> **DATE CHECK:** Use `{{date:YYYY-MM-DD}}` for current date.
> Validate: `.qwen/skills/date-helper/DATE_CHECK.md`

Execute uteuk step: {{args}}

Available steps:
- **capture** — Capture raw idea into Inbox
- **daily** — Update today's daily note
- **expand** — Expand a seed idea into full note
- **process** — Process Inbox into PARA
- **organize** — Organize specific note
- **connect** — Find connections between notes
- **populate-moc** — Populate MOC with related notes
- **publish** — Convert draft to Ghost-ready blog post
- **task-capture** — Capture a task with project/due date/priority
- **task-review** — Review all active tasks and update MOC - Tasks
- **status** — Show vault dashboard report
- **weekly-review** — Full weekly audit: inbox, projects, MOCs, tasks, archive candidates

Each step has its own dedicated prompt in `.uteuk/prompts/`.

## Usage

```bash
/uteuk capture "Your raw idea here"
/uteuk daily "What happened today"
/uteuk expand "Note to develop"
/uteuk process
/uteuk organize "[[Note Name]]"
/uteuk connect "[[Note A]] [[Note B]]"
/uteuk populate-moc "[[MOC - Learning]]"
/uteuk publish "[[Draft Note Name]]"
/uteuk task-capture "Fix login bug in Inari"
/uteuk task-review
/uteuk status
/uteuk weekly-review
```

## Pipeline Flow

```
CAPTURE → DAILY → EXPAND → PROCESS → ORGANIZE → CONNECT → POPULATE-MOC
 (Inbox) (Log)  (Develop)  (PARA)   (Structure) (Link)     (Curate)
   ↑                                                          ↑
Raw ideas                                               Maintain MOCs

Content Pipeline (Blog):
  CAPTURE → EXPAND → PUBLISH → Ghost CMS
  (Idea)  (Draft)  (Clean)    (Paste + Post)

Task Management:
  TASK-CAPTURE → Capture tasks with context → stored in 02-Areas/Tasks/
  TASK-REVIEW → Review all tasks → update MOC - Tasks

Meta-steps (operate across the full vault):
  STATUS → Quick dashboard snapshot (includes task counts)
  WEEKLY-REVIEW → Full audit: inbox + projects + MOCs + tasks + archive suggestions
```

## Hard Rules
→ See `AGENT.md` for the full list. Key reminders:
1. NEVER delete or move files without approval
2. NEVER add AI co-author to commits
3. ALWAYS use FOOLPROOF commit method — see `.uteuk/prompts/commit.md`

## Date Validation
Before creating any note:
- [ ] Fetch current date from `.qwen/skills/date-helper/get-date.sh`
- [ ] Verify year matches internet time (not system time)
- [ ] Check `.qwen/skills/date-helper/DATE_CHECK.md`
- [ ] Use `{{date:YYYY-MM-DD}}` template

See `.uteuk/prompts/` for detailed step instructions.
