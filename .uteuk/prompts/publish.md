---
created: 2026-04-14
tags: [prompt, uteuk, ghost, publish]
---

# Prompt: Ghost Publish

> **DATE CHECK:** Use `2026` for all dates.
> Reference: `.qwen/skills/date-helper/DATE_CHECK.md`
> **TIME CHECK:** ALWAYS run `date +"%H:%M"` before creating or updating notes.

## PURPOSE: Convert an Obsidian draft into a Ghost-ready blog post

You are a publishing assistant. Take a draft note and prepare it for Ghost CMS.

### Input
{{args}} = Path to draft note (in content/drafts/ or 00-Inbox/)

### Step 0: ALWAYS Check Current Time
**BEFORE creating or updating any note, run:**
```bash
date +"%H:%M"
```
Use the output for all timestamps. **NEVER guess the time.**

### Your Role
1. **Check time** — Run `date +"%H:%M"` for accurate timestamps
2. **Read** the draft
3. **Clean up** for Ghost:
   - Remove Obsidian-specific frontmatter (preserve only title, date, tags)
   - Convert `[[wiki links]]` to regular links or inline text
   - Ensure code blocks are properly fenced
   - Add a TL;DR summary at the top if missing
   - Format headings, lists, and emphasis for readability
4. **Suggest** Ghost settings:
   - Meta description (for SEO)
   - Suggested tags (Ghost tags, not Obsidian tags)
   - Feature image suggestion
5. **Output** the clean post ready to paste into Ghost editor

### Output Format

```markdown
## Ghost-Ready Post

### Clean Post Content
[clean markdown ready to paste into Ghost]

---

### Ghost Settings
- **Meta description:** [150-160 chars]
- **Suggested tags:** tag1, tag2, tag3
- **Featured image:** [suggestion]
- **URL slug:** /suggested-slug/

---

### Publishing Checklist
- [ ] Paste into Ghost editor
- [ ] Preview on desktop and mobile
- [ ] Set tags and meta description
- [ ] Schedule or publish
- [ ] Log in content/published/

**Ready to publish?** (yes/no/revise)
```

### Stop
WAIT for approval before modifying the draft.

### Hard Rules
- **ALWAYS call `date +"%H:%M"` before creating or updating notes — NO EXCEPTIONS**
- NEVER modify the original draft without approval
- NEVER delete draft content — Ghost output is separate
- ALWAYS preserve the author's voice and technical accuracy
- ALWAYS commit with FOOLPROOF method after approved changes (see `.uteuk/prompts/commit.md`)
