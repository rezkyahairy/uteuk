# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-04-29

### Added
- 72 per-step dot-notation slash commands across 6 agents (Claude, Qwen, Gemini, OpenCode, OpenClaw, Uteuk)
- Agent-specific command configurations: `$ARGUMENTS`, `{{args}}`, `@{file}` injection, shell injection
- `GEMINI.md` and `OPENCODE.md` agent config files installed by `uteuk init`
- Shared `.uteuk/commands/` for agent-agnostic command definitions
- `update.ts` now scans agent command directories for changes

### Changed
- Minimum Node.js requirement: 20 → 24
- CI matrix: [20, 22] → [22, 24]
- GitHub Actions: `actions/checkout@v4`, `actions/setup-node@v4` → `v5`

### Removed
- Single `/uteuk` command files (replaced by per-step commands)
- `.qwen/skills/uteuk/SKILL.md` (superseded by per-step commands)

## [0.1.3] - 2026-04-17

### Added
- Note templates: Daily Note, Project, Resource, MOC, Task
- `/uteuk` Qwen Code skill registration — enables `/uteuk capture`, `/uteuk process`, etc. as real slash commands
- `.qwen/skills/uteuk/SKILL.md` installed by `uteuk init` into vault's `.qwen/skills/`
- Updated `init.ts` to install the skill into vault's `.qwen/skills/uteuk/`
- Updated `package.json` files list to include `.qwen/`

## [0.1.2] - 2026-04-17

### Fixed
- Resolve prettier lint error in `src/new.ts` (line 7 formatting) that blocked CI publish workflow

## [0.1.1] - 2026-04-17

### Fixed
- No changes — re-tag for CI publish retry

## [0.1.0] - 2026-04-15

### Added
- `uteuk init` — Install Uteuk into existing or new Obsidian vaults (dual-mode)
- `uteuk capture` — Create raw idea notes in Inbox with timestamped filenames
- `uteuk new` — Create notes from templates (project, daily, resource, moc, task)
- `uteuk templates` — List available note templates
- `uteuk status` — Check vault health (inbox count, orphans, stale MOCs, sync status)
- `uteuk update` — Interactive update with per-file diff and merge confirmation
- AI pipeline prompts (14 total): capture, process, expand, organize, connect, populate-MOC, weekly-review, daily, status, task-capture, task-review, publish, commit, and more
- Note templates: Daily Note, Project, Resource, MOC, Task, AI Processing Request, Meeting Notes
- Agent configs: AGENT.md, CLAUDE.md, QWEN.md, OPENCLAW.md
- TypeScript codebase with ESM support
- Test suite with vitest (all commands tested)
- Apache 2.0 license
- CONTRIBUTING.md, CODE_OF_CONDUCT.md
