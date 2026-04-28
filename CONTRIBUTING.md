# Contributing to Uteuk

Thank you for your interest in contributing to Uteuk! This is open-source because knowledge should be free.

## How to Contribute

### Reporting Issues
- Found a bug in the prompts or CLI? [Open an issue](https://github.com/rezkyahairy/uteuk/issues)
- Describe the problem clearly and include steps to reproduce

### Suggesting Improvements
- Want to improve the pipeline? Add a template? Suggest a prompt enhancement?
- Open an issue with the `enhancement` label and describe your idea

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make your changes
4. Run tests: `npm run build && npm run test`
5. Commit using conventional commit format (e.g., `feat: add new template`)
6. Push and open a Pull Request

### What We're Looking For
- **Prompt improvements** — Better wording, new pipeline prompts
- **Template additions** — New note types, improved frontmatter
- **Bug fixes** — CLI issues, edge cases
- **Documentation** — Clearer explanations, examples
- **Agent configs** — Support for new AI assistants

### What We Won't Accept
- Breaking changes to existing commands without migration path
- AI-generated commits with `Co-authored-by:` lines (see our [commit policy](#commit-policy))
- Anything that compromises user privacy or vault ownership

## Commit Policy
Uteuk follows a strict commit policy:
- Human contributors are the sole authors
- No AI co-author annotations in commit messages
- Conventional commit format required
- Write commit messages to a file first (`/tmp/msg.txt`), never use `git commit -m`

## Adding a New CLI Command

1. Create the handler in `src/<command>.ts`
2. Export a function (e.g., `export function myCommand(args) { ... }`)
3. Register in `src/cli.ts`:
   ```ts
   import { myCommand } from "./my-command.js";
   program
     .command("my-command [args]")
     .description("Description here")
     .action((args, opts) => { myCommand(args, opts); });
   ```
4. Add tests in `test/`
5. Update README.md commands table

## Git Workflow

This repo uses git-flow (nvie):
- `main` — production releases, tagged with semver
- `develop` — integration branch, all features merge here first
- `feature/*` — branch from `develop`, merge back via PR
- `release/*` — stabilization from `develop`, merge to `main` + tag
- `hotfix/*` — branch from `main`, merge to both `main` and `develop`

**Rules:**
- NEVER commit directly to `develop` or `main` — always use a feature branch
- `develop` receives changes ONLY via PR (no direct commits)
- `main` MUST always be deployable

## Code Conventions

- **Language:** TypeScript (strict mode), ES Modules, target ES2022
- **Imports:** Always use `.js` extension for local imports
- **Types:** Defined in `src/types.ts`, imported with `import type`
- **JSON imports:** Use `with { type: "json" }` assertion
- **Formatting:** Prettier (enforced via ESLint)
- **No comments** unless explicitly requested

## Development Setup

```bash
git clone git@github.com:rezkyahairy/uteuk.git
cd uteuk
npm install
npm run build
npm run test
```

## Questions?
Open an issue and we'll help you get started.
