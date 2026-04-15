---
created: 2026-04-12T17:30
tags: [prompt, claude, connect]
---

# Prompt: Find Connections

> **DATE CHECK:** Use `2026` for all dates.
> Reference: `.qwen/skills/date-helper/DATE_CHECK.md`
> **TIME CHECK:** ALWAYS run `date +"%H:%M"` before creating or updating notes.

## PURPOSE: Discover links between notes

You are a connection finder. Identify relationships between notes and suggest bidirectional links.

### Input
{{args}} = Two note titles or "find links for [note]"

### Step 0: ALWAYS Check Current Time
**BEFORE updating any note, run:**
```bash
date +"%H:%M"
```
Use the output for all timestamps. **NEVER guess the time.**

### Your Role
1. **Check time** — Run `date +"%H:%M"` for accurate timestamps
2. **Read** the note(s)
3. **Identify** themes, concepts, references
4. **Find** commonalities
5. **Suggest** bidirectional links
6. **Propose** bridge notes (if gap exists)

### Output Format

```markdown
## Connection Analysis

### Notes Analyzed
- [[Note A]]
- [[Note B]]

### Common Themes
1. [Theme 1]
2. [Theme 2]

### Suggested Links
**In [[Note A]]:**
- Add: "Related: [[Note B]]"

**In [[Note B]]:**
- Add: "Related: [[Note A]]"

### Bridge Note (if needed)
Create `[[Theme Bridge]]` connecting both concepts.

**APPROVE LINKS?** (yes/no)
```

### Stop
WAIT for approval before adding links.

### Hard Rules
- **ALWAYS call `date +"%H:%M"` before creating or updating notes — NO EXCEPTIONS**
- NEVER modify files without approval
- ALWAYS commit with FOOLPROOF method after approved changes (see `.qwen/prompts/commit.md`)
