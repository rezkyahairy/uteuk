# /uteuk — AI-Assisted Note-Taking Pipeline

Execute a step in the Uteuk knowledge management pipeline. All prompts are loaded from `.uteuk/prompts/`.

## Subcommands

If the input (after stripping the `/uteuk` prefix) matches one of these keywords, execute the corresponding pipeline step:

- **capture** — Capture a raw idea into `00-Inbox/`
- **process** — Process all unprocessed inbox notes
- **organize** — Organize a specific note into PARA
- **connect** — Find connections between notes
- **expand** — Expand a seed idea into a full note
- **daily** — Update today's daily note
- **populate-moc** — Populate a Map of Content with related notes
- **publish** — Convert a draft note to a polished output
- **task-capture** — Capture a task with project/due date/priority
- **task-review** — Review all active tasks and update MOC - Tasks
- **status** — Show vault dashboard report
- **weekly-review** — Full weekly audit

Otherwise, show usage: `/uteuk <step> [args]`

## How It Works

1. **Parse the subcommand** from the input (first word after `/uteuk`)
2. **Load the prompt** from `.uteuk/prompts/<subcommand>.md`
3. **Execute the pipeline step** as defined in the prompt
4. **Follow hard rules** — never delete without approval, always use FOOLPROOF commits

## Date Validation

Before creating any note:
- [ ] Fetch current date from `.qwen/skills/date-helper/get-date.sh`
- [ ] Verify year matches internet time (not system time)
- [ ] Check `.qwen/skills/date-helper/DATE_CHECK.md`
- [ ] Use `{{date:YYYY-MM-DD}}` template

## Pipeline Flow

```
CAPTURE → PROCESS → ORGANIZE → EXPRESS
 (Inbox)  (You)     (Human)     (Both)
```

Each step has its own dedicated prompt in `.uteuk/prompts/`.

## Hard Rules
→ See `AGENT.md` for the full list. Key reminders:
1. NEVER delete or move files without approval
2. NEVER add AI co-author to commits
3. ALWAYS use FOOLPROOF commit method — see `.uteuk/prompts/commit.md`

## Examples

```bash
/uteuk capture "What if we built a personal wiki?"
/uteuk process
/uteuk organize "[[Some Idea]]"
/uteuk connect "[[Note A]] [[Note B]]"
/uteuk populate-moc "[[MOC - Learning]]"
/uteuk status
/uteuk weekly-review
/uteuk task-capture "Fix login bug in Inari"
/uteuk task-review
/uteuk daily "What happened today"
/uteuk expand "[[Seed Idea]]"
/uteuk publish "[[Draft Note]]"
```
