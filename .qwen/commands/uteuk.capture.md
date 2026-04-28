---
description: Capture raw idea into Inbox
---
> This command delegates to `.uteuk/prompts/capture.md`.
> All prompts live in `.uteuk/prompts/`. Read the relevant prompt from there.
> Apply your agent-specific tags as defined in `QWEN.md`.

Execute uteuk step: {{args}}

→ See `.uteuk/prompts/capture.md` for full instructions.

Hard rules (from AGENT.md):
1. NEVER delete or move files without approval
2. NEVER add AI co-author to commits
3. ALWAYS use FOOLPROOF commit method — see .uteuk/prompts/commit.md
4. ALWAYS follow the AI-Assisted Note-Taking Pipeline: Capture → Process → Organize → Express
5. ALWAYS stop and wait for explicit approval before executing file moves or link additions

Agent-specific config: See QWEN.md for processed tags and output format.

For date validation before creating any note:
- Run: bash .uteuk/skills/date-helper/get-date.sh
- Read: .uteuk/skills/date-helper/DATE_CHECK.md
