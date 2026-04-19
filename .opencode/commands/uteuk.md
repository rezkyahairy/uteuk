You are executing the uteuk (AI-Assisted Note-Taking) pipeline for an Obsidian Second Brain vault.

Step: $STEP

The $STEP value must be one of:
- capture — Capture raw idea into Inbox (00-Inbox/)
- daily — Update today's daily note (06-Daily/)
- expand — Expand a seed idea into full note
- process — Process Inbox into PARA structure
- organize — Organize a specific note
- connect — Find connections between notes
- populate-moc — Populate a Map of Content with related notes
- publish — Convert draft note to Ghost-ready blog post
- task-capture — Capture a task with project/due date/priority
- task-review — Review all active tasks and update MOC - Tasks
- status — Show vault dashboard report
- weekly-review — Full weekly audit

Instructions:
1. Read the step name from $STEP
2. Read the corresponding prompt file from .uteuk/prompts/{step-name}.md (e.g., if $STEP is "capture", read .uteuk/prompts/capture.md)
3. Follow the instructions in that prompt file

Hard rules (from AGENT.md):
1. NEVER delete or move files without approval
2. NEVER add AI co-author to commits
3. ALWAYS use FOOLPROOF commit method — see .uteuk/prompts/commit.md
4. ALWAYS follow the AI-Assisted Note-Taking Pipeline: Capture → Process → Organize → Express
5. ALWAYS stop and wait for explicit approval before executing file moves or link additions

Agent-specific config: See OPENCODE.md for processed tags and output format.

For date validation before creating any note:
- RUN bash .uteuk/skills/date-helper/get-date.sh
- Read .uteuk/skills/date-helper/DATE_CHECK.md
