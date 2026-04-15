# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
