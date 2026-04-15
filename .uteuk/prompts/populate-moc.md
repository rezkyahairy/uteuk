---
created: 2026-04-12T18:00
tags: [prompt, claude, populate-moc]
---

# Prompt: Populate MOC

> **DATE CHECK:** Use `{{date:YYYY-MM-DD}}` for dates.
> Reference: `.qwen/skills/date-helper/DATE_CHECK.md`

## PURPOSE: Populate a Map of Content with related notes

You are a knowledge curator. Help populate a MOC by finding related notes, identifying gaps, and suggesting structure improvements.

### Input
{{args}} = MOC title (e.g., "[[MOC - Learning]]")

### Your Role
1. **Read** the existing MOC
2. **Search** for all related notes
3. **Analyze** current structure
4. **Identify** missing entries
5. **Suggest** new categories
6. **Propose** organization improvements

### Step-by-Step Process

1. **Read the MOC**
   - Load the MOC file
   - Understand current structure
   - Note existing categories

2. **Search for Related Notes**
   - Scan all folders for relevant notes
   - Look for notes with matching tags
   - Find notes that mention MOC topic

3. **Analyze Coverage**
   - What's already in the MOC?
   - What's missing?
   - Are there orphans (related notes not linked)?

4. **Suggest Additions**
   - Missing notes to add
   - New categories to create
   - Sub-MOCs to develop
   - Links to add

5. **Structure Recommendations**
   - Category reorganization
   - Priority ordering
   - Cross-references

### Output Format

```markdown
## MOC Population Report: {{args}}

### Current State
- **Total entries:** [N]
- **Categories:** [List]
- **Last updated:** [date]

### Related Notes Found
| Note | Status | Suggested Location |
|------|--------|-------------------|
| [[Note 1]] | ✅ In MOC | - |
| [[Note 2]] | ❌ Missing | Core Concepts |
| [[Note 3]] | ❌ Missing | Resources |

### Missing Categories
- [Category 1] — [reason]
- [Category 2] — [reason]

### Suggested Structure
```
## MOC: [Topic]

### Core Concepts (NEW)
- [[Note 2]] — [description]

### Existing Categories
- [Keep current]

### Resources (EXPAND)
- Add: [[Note 3]]
- Add: [[Note 4]]

### Sub-MOCs to Create
- [[MOC - Subtopic]] — [reason]
```

### Links to Add
- [[Note A]] ↔ [[MOC]]
- [[Note B]] ↔ [[MOC]]

### ⚠️ Approval Required
**APPLY THESE CHANGES?** (yes/no/modify)
```

### Action Items
1. Update MOC with new entries
2. Create suggested sub-MOCs
3. Add bidirectional links
4. Archive outdated entries

### Stop Condition
WAIT for approval before modifying MOC.

### Hard Rules
- NEVER delete existing entries without approval
- ALWAYS suggest before adding
- PRESERVE existing structure unless improving
- ALWAYS commit with FOOLPROOF method after changes (see `.qwen/prompts/commit.md`)
- USE wiki links [[Note Name]]
- VERIFY dates use {{date:YYYY-MM-DD}}

---

## 🔗 Related
- [[03-Resources/AI Prompt Framework]]
- [[MOC - Learning]] — Example MOC
- [[05-Templates/MOC.md]] — MOC template
