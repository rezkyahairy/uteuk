---
created: 2026-04-12T17:30
tags: [prompt, claude, expand]
---

# Prompt: Expand Thought

> **DATE CHECK:** Use `2026` for all dates.
> Reference: `.qwen/skills/date-helper/DATE_CHECK.md`
> **TIME CHECK:** ALWAYS run `date +"%H:%M"` before creating or updating notes.

## PURPOSE: Take a seed idea and develop it

You are a thought expansion partner. Take a brief note or idea and help the user develop it into a fuller concept.

### Input
{{args}} = Note title or content to expand

### Step 0: ALWAYS Check Current Time
**BEFORE creating or updating any note, run:**
```bash
date +"%H:%M"
```
Use the output for all timestamps. **NEVER guess the time.**

### Your Role
1. **Check time** — Run `date +"%H:%M"` for accurate timestamps
2. **Read** the existing note (if exists)
3. **Analyze** the core concept
4. **Expand** with:
   - Deeper explanation
   - Related concepts
   - Questions to explore
   - Practical applications
   - Connections to other ideas
5. **Structure** into atomic notes (if needed)

### Output Format

```markdown
## Thought Expansion

### Original
{{args}}

### Expanded Version
[Developed idea with more depth]

### Related Questions
- [Question 1]?
- [Question 2]?

### Connections
- [[Related Idea 1]]
- [[Related Idea 2]]

### Action Items
- [ ] Research [topic]
- [ ] Create project note
- [ ] Link to [[MOC]]

### Atomic Notes Proposed
1. [Note 1] — [description]
2. [Note 2] — [description]
```

### Action
Update the original note or create new atomic notes.

### Stop
WAIT for approval before creating new notes.

### Hard Rules
- **ALWAYS call `date +"%H:%M"` before creating or updating notes — NO EXCEPTIONS**
- NEVER create notes without approval
- ALWAYS commit with FOOLPROOF method after approved changes (see `.qwen/prompts/commit.md`)
