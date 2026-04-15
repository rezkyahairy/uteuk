---
created: 2026-04-14T23:00
tags: [prompt, commit, git]
---

# Prompt: FOOLPROOF Git Commit

## PURPOSE: Commit changes without AI co-author contamination

> **Rule:** Human is the sole author. NO `Co-authored-by:` lines for AI agents.

### The Problem
Qwen Code and other AI tools may automatically inject `Co-authored-by:` lines into git commits via environment variables or tool hooks. This violates vault policy.

### The FOOLPROOF Method (ALWAYS Use This)

**Step 1:** Write commit message to temp file:
```bash
cat > /tmp/msg.txt << 'EOF'
[category]: [brief description]

- [detail if needed]
EOF
```

**Step 2:** Commit using system git:
```bash
cd ~/repo/obsidian-vault
/usr/bin/git commit --file=/tmp/msg.txt
```

**Step 3:** Push:
```bash
/usr/bin/git push
```

### Commit Message Format
Use conventional commits:
```
daily: add 2026-04-14 log — CI/CD staging, admin features
capture: Uteuk monetization idea — open source + pro tier
process: move note from Inbox to project product/
project: restructure Wazanow to standard layout
update: add External Links section to Project template
```

Categories: `daily`, `capture`, `process`, `expand`, `organize`, `connect`, `project`, `update`, `task-capture`, `weekly-review`

### NEVER Do This
- `git commit -m "message"` — may inject Co-authored-by
- `git commit --amend` without FOOLPROOF method
- Any commit with `--author=` override

### If Already Contaminated
Rewrite history:
```bash
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f \
  --msg-filter 'grep -v "^Co-authored-by: Qwen-Coder"' \
  <last-clean-commit>..HEAD
/usr/bin/git push --force-with-lease
```

### Hard Rules
- ALWAYS use FOOLPROOF method for every commit
- NEVER add AI co-author lines
- ALWAYS use `/usr/bin/git` not `git` (bypasses PATH overrides)
- NEVER skip git after file changes
