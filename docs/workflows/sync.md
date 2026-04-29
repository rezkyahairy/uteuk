# Multi-Device Sync

Uteuk vaults sync via git — any git-based approach works. The recommended setup uses the Obsidian Git plugin for automatic sync.

## How Sync Works

Your vault is a git repository. Every note is a tracked file. Changes are committed and pushed/pulled across devices.

```
Device A ──commit──> Git Remote ──pull──> Device B
Device B ──commit──> Git Remote ──pull──> Device A
```

## Recommended: Obsidian Git Plugin

1. **Install**: Obsidian Settings → Community Plugins → Browse → Search "Git" → Install
2. **Configure**:
   - Set commit interval (e.g., every 5 minutes)
   - Enable auto-push/pull
   - Set remote origin URL

## Manual Sync

If you prefer manual control:

```bash
cd ~/vault

# Pull latest changes
git pull

# Make changes (edit notes, capture ideas, etc.)

# Commit and push
git add .
git commit -m "Daily notes and inbox updates"
git push
```

## Uteuk CLI Sync Commands

Uteuk reports sync status:

```bash
uteuk status
```

Shows:
- **Last Sync**: Date of the last git commit
- **Git Remote**: Whether a remote is configured

If no remote is configured, set one up:

```bash
cd ~/vault
git remote add origin git@github.com:username/vault.git
git push -u origin main
```

## Sync Conflicts

MOCs and heavily-edited notes are high-conflict files. Minimize conflicts:

- **Edit one vault at a time** — don't have the vault open on two devices simultaneously
- **Pull before editing** — always fetch latest changes before making edits
- **Commit frequently** — small, frequent commits reduce conflict scope
- **Pull before pushing** — always `git pull` before `git push`

## Alternative Sync Methods

### iCloud / Dropbox / Google Drive

If you use a cloud sync service instead of git:

- Works fine for personal vaults
- No conflict resolution — simultaneous edits may be lost
- Uteuk CLI features that depend on git (status, weekly-review sync check) won't report sync dates

### Obsidian Sync (Paid)

Obsidian's official sync service:

- No git required
- Real-time sync across devices
- Works alongside Uteuk — git is still used for version history

## .gitignore for Vaults

Uteuk creates a `.gitignore` in `--from-scratch` mode that excludes:

```gitignore
# Obsidian workspace
.obsidian/workspace
.obsidian/workspace.json

# OS files
.DS_Store
Thumbs.db

# Environment
.env
```

If your vault doesn't have one, create it manually at the vault root.
