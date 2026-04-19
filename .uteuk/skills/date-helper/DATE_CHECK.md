# Date Validation Checklist

> **CRITICAL:** Always verify dates before creating or updating notes.

## Current Date Reference

| Format | Value |
|--------|-------|
| **Year** | 2026 |
| **Full Date** | 2026-04-15 |
| **Timestamp** | 2026-04-15T09:50 |

## Validation Checklist

Before creating ANY note, verify:

- [ ] **Year is 2026** (not 2025)
- [ ] Month is correct (01-12)
- [ ] Day is correct for the month
- [ ] Time format is ISO 8601 (YYYY-MM-DDTHH:mm)

## How to Get Current Date

### Option 1: Use Date Helper Script
```bash
source .uteuk/skills/date-helper/get-date.sh
echo $CURRENT_DATE  # Output: 2026-04-12
```

### Option 2: Use Internet API
```bash
curl -s "http://worldtimeapi.org/api/ip" | grep -o '"datetime":"[^"]*' | cut -d'"' -f4
```

### Option 3: Manual Check
Ask user: "Today's date is 2026-04-12, correct?"

## Common Date Mistakes

| Wrong | Correct | Issue |
|-------|---------|-------|
| 2026-04-12 | 2026-04-12 | Wrong year |
| 2025 | 2026 | Wrong year in frontmatter |
| Apr 12, 2025 | 2026-04-12 | Wrong format and year |

## Files That Need Date Validation

- [ ] Daily notes (06-Daily/YYYY-MM-DD.md)
- [ ] Project notes (01-Projects/*/README.md)
- [ ] Resource notes (03-Resources/*.md)
- [ ] MOC files (03-Resources/MOC - *.md)
- [ ] Agent configs (AGENT.md, CLAUDE.md, QWEN.md)

## Date in Templates

Templates should use `{{date:YYYY-MM-DD}}` which resolves to current date.

**Always verify the resolved date is 2026, not 2025.**

---

*Use this checklist for every note creation/update*
