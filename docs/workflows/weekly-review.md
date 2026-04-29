# Weekly Review Workflow

A comprehensive vault audit that analyzes inbox backlog, project health, stale MOCs, orphaned notes, and suggests actions.

## Running the Review

```bash
uteuk weekly-review
```

Requires an active AI agent. If no agent is configured:

```bash
# Set up your agent first
uteuk setup ai
```

## What the Review Covers

### 1. Inbox Backlog

Lists all notes in `00-Inbox/` and recommends processing:
- Notes ready to move to Projects
- Notes that should become Resources
- Notes to archive or delete

### 2. Project Health

Reviews each note in `01-Projects/`:
- Projects with no recent activity (stale projects)
- Projects marked as `status: completed` that haven't been archived
- Projects with `status: unknown` that need a status update

### 3. Stale MOCs

Checks MOC files in `03-Resources/` that haven't been updated in 30+ days.

### 4. Orphaned Notes

Notes with no backlinks (`[[...]]` references) — candidates for linking or archiving.

### 5. Sync Status

Reports the last git commit date and whether a remote is configured.

## Actionable Output

The AI produces a structured review with:

- **Priority items** — notes that need immediate processing
- **Recommendations** — MOCs to update, projects to review
- **Suggestions** — connections between notes you might have missed

## Manual Weekly Review (No AI)

If you prefer not to use AI, review your vault manually:

```bash
# Check inbox count
uteuk status

# List inbox notes
ls ~/vault/00-Inbox/

# List projects
ls ~/vault/01-Projects/

# Check git status
cd ~/vault && git status
```

## Frequency

Run the weekly review:
- **Weekly**: Ideal cadence — keeps inbox manageable
- **Bi-weekly**: Acceptable if inbox is small
- **Monthly**: Minimum — inbox may accumulate significantly
