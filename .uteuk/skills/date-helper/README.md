# Date Helper Skill

> Fetches current date from internet time API to ensure correct dates in all notes

## Purpose

This skill ensures all notes use the correct date by fetching from an internet time source (worldtimeapi.org) rather than relying on system date.

## Usage

### In Shell Scripts

```bash
source /home/rezkya/repo/obsidian-vault/.uteuk/skills/date-helper/get-date.sh

echo "Today is: $CURRENT_DATE"
echo "Year: $CURRENT_YEAR"
echo "Full datetime: $CURRENT_DATETIME"
```

### In Prompts

Reference this skill to get correct dates:

```markdown
Use date helper skill to get current date before creating notes.
Expected output: 2026 (not 2025)
```

### Environment Variables

After sourcing, these are available:

| Variable | Example | Description |
|----------|---------|-------------|
| `CURRENT_YEAR` | 2026 | Current year |
| `CURRENT_MONTH` | 04 | Current month |
| `CURRENT_DAY` | 12 | Current day |
| `CURRENT_DATE` | 2026-04-12 | Date in YYYY-MM-DD format |
| `CURRENT_DATETIME` | 2026-04-12T17:30 | Full datetime |

## Fallback

If internet is unavailable, falls back to system date.

## Integration

All prompts should reference this skill when:
- Creating new daily notes
- Updating timestamps
- Setting frontmatter dates
- Logging changes

---
*Part of Obsidian Second Brain skills system*
