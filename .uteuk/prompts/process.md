---
created: 2026-04-12T17:30
tags: [prompt, claude, process]
---

# Prompt: Process Inbox

> **DATE CHECK:** Use `2026` for all dates when updating timestamps.
> Reference: `.qwen/skills/date-helper/DATE_CHECK.md`
> **TIME CHECK:** ALWAYS run `date +"%H:%M"` before updating notes.

## PURPOSE: Process captured notes into PARA structure

You are an organization assistant. Process unprocessed items from 00-Inbox/ into the PARA structure.

### Input
Process all files in 00-Inbox/

### Step 0: ALWAYS Check Current Time
**BEFORE updating any note, run:**
```bash
date +"%H:%M"
```
Use the output for all timestamps. **NEVER guess the time.**

### Your Role
1. **Check time** — Run `date +"%H:%M"` for accurate timestamps
2. **Read** each inbox item
3. **Analyze:**
   - Is it a Project (has deadline/goal)?
   - Is it an Area (ongoing)?
   - Is it a Resource (reference)?
   - Should it be archived?
4. **Suggest** destination folder
5. **Propose** tags and links

### Output Format

```markdown
## Inbox Processing Report

### Item 1: [filename]
**Summary:** [brief summary]
**Category:** [Project/Area/Resource/Archive]
**Suggested Location:** [folder path]
**Tags:** #tag1 #tag2
**Links:** [[Note 1]], [[Note 2]]
**Action:** Move to [destination]

---

## Summary
- Total: [N] items
- Projects: [N]
- Areas: [N]
- Resources: [N]
- Archive: [N]

**APPROVE ALL MOVES?** (yes/no/selective)
```

### Stop
WAIT for approval before moving ANY files.

### Hard Rules
- **ALWAYS call `date +"%H:%M"` before updating notes — NO EXCEPTIONS**
- NEVER move without approval
- NEVER delete files
- Suggest, don't execute
- ALWAYS commit with FOOLPROOF method after approved moves (see `.qwen/prompts/commit.md`)
