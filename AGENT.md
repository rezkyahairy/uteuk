---
created: 2026-04-12T14:00
tags: [agent, ai, workflow, pipeline]
---

# Agent Configuration for Obsidian Vault

> Universal rules for any AI agent working with this Second Brain

## 🎯 Core Principle

**You are a collaborator, not a replacement.** The human owns their knowledge. You assist with processing, organizing, and connecting — but they decide what stays, goes, and how it's structured.

**MANDATORY: You MUST follow the AI-Assisted Note-Taking Pipeline.**

---

## 🔄 The Pipeline (ALL AGENTS MUST FOLLOW)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ CAPTURE  │ → │ PROCESS  │ → │ ORGANIZE │ → │ EXPRESS  │
│  (Human) │    │  (You)   │    │ (Human)  │    │ (Both)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
           ↑              ↓              ↓
           └──────── WAIT FOR APPROVAL ──┘
```

### Phase 1: Capture → 00-Inbox/ (Human)
**Goal:** Human dumps everything here. **Don't organize yet.**

- Quick notes, ideas, links, meeting notes
- Voice memos, screenshots, bookmarks
- **Your role:** WAIT — let human capture first

### Phase 2: Process → AI Agents (YOU)
**Goal:** Read, understand, suggest. **Don't execute yet.**

- Read unprocessed notes from `00-Inbox/`
- Summarize, extract insights, find connections
- Suggest: Project? Area? Resource? Links?
- **Tag:** Add `ai-processed` + `needs-review`
- **Output:** Structured suggestions only
- **CRITICAL:** STOP — Present findings, wait for approval

### Phase 3: Organize → PARA (Human Decision)
**Goal:** Human decides structure. You execute ONLY after approval.

- AI presents: "Suggested: Move to 01-Projects/"
- Human reviews: "Yes / No / Modify"
- AI executes: Move files, update links, commit
- **Never execute without explicit "yes"**

### Phase 4: Express → Output (Both)
**Goal:** Create from organized knowledge.

- Draft blog posts, reports, presentations
- Summarize learnings for sharing
- Generate MOCs (with approval)

---

## 📋 Universal Commands

### Process (Phase 2)
```
"Process [file/path]"
```
1. Read and analyze
2. Summarize
3. Suggest organization
4. Propose links
5. **STOP** — Wait for approval

### Organize (Phase 2→3)
```
"Organize [note] into PARA"
```
1. Determine: Project vs Area vs Resource vs Archive
2. **STOP** — Present recommendation
3. Wait for approval before moving

### Connect (Phase 2)
```
"Find links for [note]"
```
1. Identify related notes
2. Suggest backlinks
3. Propose new connections
4. **STOP** — Wait for approval before adding links

### Summarize (Phase 2)
```
"Summarize [file/daily notes/week]"
```
Extract key points, action items, insights.

---

## 🛑 Hard Rules (ALL AGENTS — NEVER BREAK)

1. **NEVER delete files**
2. **NEVER move files without explicit approval** — Suggest, don't execute
3. **NEVER modify frontmatter** (created date, original tags) — Only add tags
4. **ALWAYS suggest before acting** — Present plan, wait for "yes"
5. **ALWAYS use git** — Commit with descriptive messages
6. **NEVER add AI co-author to git commits** — No `Co-authored-by:` lines for AI agents (Claude, Qwen, OpenClaw, etc.)
7. **ALWAYS preserve wiki links** `[[Note Name]]`
8. **ALWAYS follow the pipeline** — Process → Suggest → Wait → Execute
9. **ALWAYS respect multi-device sync** — See [[03-Resources/Multi-Device Sync Guide|Multi-Device Sync Guide]]

---

## 🔧 Git Commit Best Practices (NO AI Co-Author)

### The Problem
Qwen Code and other AI tools may automatically inject `Co-authored-by:` lines into git commits via environment variables. This vault policy: **Human is the sole author.**

### How to Commit Cleanly

**Option 1: Write message to file (FOOLPROOF - Use This)**
```bash
cd ~/repo/obsidian-vault
cat > /tmp/msg.txt << 'EOF'
Your commit message here
EOF
/usr/bin/git commit --file=/tmp/msg.txt
```

**Option 2: Use system git with clean environment**
```bash
cd ~/repo/obsidian-vault
env -u QWEN_CODE -u QWEN_CODE_NO_RELAUNCH /usr/bin/git commit -m "message"
```

**Option 3: Use commit template (reminds you)**
```bash
cd ~/repo/obsidian-vault
git commit  # Opens .gitmessage template with warning
```

**Option 4: Use git config inline**
```bash
cd ~/repo/obsidian-vault
/usr/bin/git -c user.name="Rezkya Hairy" -c user.email="rezkyatinnov@gmail.com" commit -m "message"
```

### What to NEVER Do
- ❌ Use `git commit -m "message"` directly (may inject co-author)
- ❌ Allow AI tools to append `Co-authored-by:` lines
- ❌ Set `GIT_COMMITTER_NAME` or `GIT_COMMITTER_EMAIL` to AI values

### Verification
After committing, verify no co-author:
```bash
git log -1 --format="%B" | grep -i coauthor  # Should return empty
```

---

## 📁 PARA Quick Reference

| Folder | Contents | Test | Pipeline Phase |
|--------|----------|------|----------------|
| 00-Inbox | Unprocessed | "Just captured?" | Phase 1 (Human) |
| 01-Projects | Active work | "Has deadline/goal?" | Phase 3 (Organize) |
| 02-Areas | Ongoing | "No deadline, maintenance?" | Phase 3 (Organize) |
| 03-Resources | Reference | "Look up later?" | Phase 3 (Organize) |
| 04-Archive | Done | "Completed/inactive?" | Phase 3 (Organize) |

---

## 🏷️ Universal Tags

| Tag | Meaning | When to Use |
|-----|---------|-------------|
| `ai-processed` | Any AI has reviewed | After Phase 2 processing |
| `needs-review` | Suggestion pending approval | When waiting for human |
| `orphan` | No backlinks | After link analysis |
| `stale` | Not touched in 30+ days | During weekly review |

**Agent-Specific Tags:**
- `claude-processed` — Claude Code specific
- `qwen-processed` — Qwen Code specific
- `seed` — Qwen: Atomic note, ready for linking
- `fleeting` — Qwen: Temporary capture, needs processing
- `permanent` — Qwen: Final atomic note

---

## 🔄 Multi-Device Sync Requirements

When working on this vault:

1. **Commit after every change** — Don't batch multiple changes
2. **Use descriptive messages** — `AI: processed inbox, suggested 3 moves`
3. **Push immediately** — Other devices need updates
4. **Watch for conflicts** — Daily notes are append-only (never edit old entries)
5. **Pull before starting** — Check for remote changes first

---

## 📝 Approval Workflow (STANDARD)

```
┌─────────────────────────────────────────┐
│ 1. AI reads/processes content           │
│    (Phase 2: Processing)                │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 2. AI presents structured suggestions   │
│    - Summary                            │
│    - Proposed organization              │
│    - Suggested links                    │
│    - Specific recommended action        │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 3. Human reviews and decides            │
│    Human responds: "yes" / "no" / "modify: ..." │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 4a. APPROVED: AI executes               │
│     - Move files                        │
│     - Add links                         │
│     - Create notes                      │
│     - Commit with message               │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 4b. REJECTED: AI stops, no changes made │
└─────────────────────────────────────────┘
```

---

## 🔗 Essential Links

- `README.md` — Start here (main entry point)
- `00-Inbox/AI Processing Queue.md` — Pending tasks
- `03-Resources/AI-Assisted Note-Taking Pipeline.md` — Full workflow
- `03-Resources/Multi-Device Sync Guide.md` — Multi-device rules

## 🤖 Agent-Specific Configs

- `CLAUDE.md` — Claude Code specific rules (project root)
- `QWEN.md` — Qwen Code specific rules (project root)

**Each agent config extends these universal rules with specific commands.**

---
*This file applies to all AI agents: OpenClaw, Claude Code, Qwen Code, and others.*
*All agents MUST follow the AI-Assisted Note-Taking Pipeline.*
