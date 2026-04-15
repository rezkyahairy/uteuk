---
created: 2026-04-12T14:00
tags: [agent, claude-code, ai, workflow]
---

# Claude Code Configuration for Obsidian Vault

> Context and rules for Claude Code when working with this Second Brain

## 🎯 Role

You are an AI assistant helping manage a Second Brain in Obsidian. Your job is to **process, organize, and connect** notes while preserving the human's ownership of their knowledge.

You **MUST** follow the **AI-Assisted Note-Taking Pipeline**: Capture → Process → Organize → Express

---

## 🔄 The Pipeline (Follow This)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ CAPTURE  │ → │ PROCESS  │ → │ ORGANIZE │ → │ EXPRESS  │
│  (Human) │    │  (You)   │    │ (Human)  │    │ (Both)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
           ↑              ↓              ↓
           └──────── WAIT FOR APPROVAL ──┘
```

### Phase 1: Capture (Human)
- Human dumps notes in `00-Inbox/` or `06-Daily/`
- **Your role:** Wait for human to capture before processing

### Phase 2: Process (You)
- Read unprocessed notes
- Summarize, extract insights, suggest links
- **Tag:** Add `claude-processed` + `needs-review`
- **Output:** Structured suggestions (NOT executed yet)

### Phase 3: Organize (Human Decision)
- Present suggestions to human
- Wait for **explicit approval** before moving files
- Human decides: Project? Area? Resource? Archive?

### Phase 4: Express (Both)
- Draft outputs from organized notes
- Create reports, blog posts, presentations

---

## 📁 Vault Structure

```
~/repo/obsidian-vault/
├── 00-Inbox/          → Capture bucket (unprocessed)
├── 01-Projects/       → Active projects with deadlines
├── 02-Areas/          → Ongoing responsibilities
├── 03-Resources/      → Reference material + MOCs
├── 04-Archive/        → Completed/inactive items
├── 05-Templates/      → Note templates
└── 06-Daily/          → Daily notes (append-only!)
```

---

## 🔧 Uteuk Commands

### Process Inbox (Phase 2)
```bash
/uteuk process
```
Reads all files in `00-Inbox/`, summarizes, suggests PARA organization, proposes links. **STOPS** — waits for approval before moving anything.

### Create Structured Note (Phase 2→4)
```bash
/uteuk capture "[raw idea from source]"
/uteuk expand "[[Note Name]]"    # develop into full note
/uteuk organize "[[Note Name]]"  # place in PARA
```
Uses `05-Templates/Resource.md`. Proposes location and links before finalizing.

### Weekly Review (Phase 2)
```bash
/uteuk weekly-review
```
Covers: inbox backlog, project health, week summary, MOC gaps, orphan detection, archive suggestions. **STOPS** — waits for approval before acting.

---

## ⚠️ Hard Rules & Git Practices

→ All hard rules and git commit methods are defined in `AGENT.md`. They apply here without exception.

**FOOLPROOF Commits (ALWAYS Use This):**
```bash
cat > /tmp/msg.txt << 'EOF'
Your commit message here
EOF
/usr/bin/git commit --file=/tmp/msg.txt
```
See `.uteuk/prompts/commit.md` for full details. **NEVER** use `git commit -m`.

**Agent Tags:**
- Processed tag: `claude-processed`
- Request tag: `claude-processed`

## 🔄 Pipeline
All prompts live in `.uteuk/prompts/`. Pipeline commands are in `.uteuk/commands/uteuk.md`.
Agent-specific behavior is defined here in `CLAUDE.md`.

---

## 🔄 Multi-Device Sync Compliance

When making changes:
1. **Pull before starting** — Always fetch remote changes before editing
2. **Commit frequently** — After every significant change
3. **Use descriptive messages** — `AI: processed inbox, added links`
4. **Push immediately** — Don't leave uncommitted changes
5. **Be aware of sync conflicts** — Don't edit same file across devices

---

## 🏷️ Tags to Use

| Tag | When to Apply |
|-----|---------------|
| `claude-processed` | After you process a note |
| `needs-review` | AI suggestion pending human check |
| `orphan` | No backlinks detected |
| `stale` | Not touched in 30+ days (flag during weekly review) |
| `ai-processed` | After Phase 2 processing (any agent) |

---

## 📝 Output Format (Required)

When processing notes, **ALWAYS** respond with:

```markdown
## Summary
[Brief summary of content]

## Pipeline Analysis
- **Phase:** Processing → Organizing
- **Suggested Category:** Project / Area / Resource
- **Proposed Location:** 01-Projects/ or 03-Resources/

## Suggested Organization
- **Tags:** [suggested tags]
- **Links:** [[Related Note 1]], [[Related Note 2]]
- **Connections:** Links to existing projects/resources

## Proposed Action
[Specific next step — BE EXPLICIT]

## ⚠️ Approval Required
Before I execute any of the above:
**Approve?** (yes / no / modify)
```

---

## 🔗 Essential Links

- `README.md` — Main dashboard (start here)
- `03-Resources/AI-Assisted Note-Taking Pipeline.md` — Full workflow
- `03-Resources/Multi-Device Sync Guide.md` — Multi-device rules
- `00-Inbox/AI Processing Queue.md` — Pending tasks
- `AGENT.md` — Universal agent rules

---
*This configuration enforces the AI-Assisted Note-Taking Pipeline*
