---
description: Capture raw idea into Inbox
---
> **DATE CHECK:** Use `{{date:YYYY-MM-DD}}` for current date.
> Validate: `.uteuk/skills/date-helper/DATE_CHECK.md`

Execute uteuk step: {{args}}

→ See `.uteuk/prompts/capture.md` for full instructions.

## Hard Rules
→ See `AGENT.md` for the full list. Key reminders:
1. NEVER delete or move files without approval
2. NEVER add AI co-author to commits
3. ALWAYS use FOOLPROOF commit method — see `.uteuk/prompts/commit.md`

## Date Validation
Before creating any note:
- [ ] Fetch current date from `.uteuk/skills/date-helper/get-date.sh`
- [ ] Verify year matches internet time (not system time)
- [ ] Check `.uteuk/skills/date-helper/DATE_CHECK.md`
- [ ] Use `{{date:YYYY-MM-DD}}` template
