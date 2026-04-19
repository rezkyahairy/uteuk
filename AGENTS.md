# AGENTS.md — Uteuk

## Project Overview

**Uteuk** is a TypeScript CLI tool for Obsidian vaults. It installs AI pipeline prompts, note templates, and agent configs into a vault, enabling an AI-assisted knowledge management workflow (Capture → Process → Organize → Express).

- **Package:** `uteuk` on npm
- **Repository:** https://github.com/rezkyahairy/uteuk
- **License:** Apache-2.0
- **Node:** >= 20
- **Module type:** ES Modules

## Directory Structure

```
uteuk/
├── bin/uteuk              # CLI entry point (shell script)
├── src/                   # TypeScript source
│   ├── cli.ts             # Commander-based CLI definitions
│   ├── init.ts            # Vault initialization logic
│   ├── capture.ts         # Capture raw ideas
│   ├── new.ts             # Create notes from templates
│   ├── templates.ts       # Template listing
│   ├── status.ts          # Vault health check
│   ├── update.ts          # Update prompts/templates
│   ├── vault.ts           # Vault detection utilities
│   ├── fs.ts              # File system helpers
│   └── types.ts           # TypeScript types
├── templates/             # Note templates (Daily, Project, Resource, MOC, Task)
├── .uteuk/prompts/        # AI pipeline prompts (capture, process, organize, etc.)
├── .uteuk/commands/       # CLI commands for AI agents
├── test/                  # Vitest test files
├── dist/                  # Compiled output (gitignored)
├── package.json
├── tsconfig.json
├── eslint.config.js
└── vite.config.ts
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run lint` | Run ESLint on `src/` |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without writing |

Always run `npm run build && npm run test && npm run lint` before committing.

## Code Conventions

- **Language:** TypeScript (strict mode)
- **Module system:** ES Modules (`"type": "module"` in package.json)
- **Module resolution:** `NodeNext`
- **Target:** ES2022
- **JSON imports:** Use `import pkg from "../package.json" with { type: "json" }`
- **Imports:** Always use `.js` extension for local imports (even though source is `.ts`)
- **Types:** Define types in `src/types.ts`, import with `import type`
- **Formatting:** Prettier (enforced via ESLint)
- **No comments** unless explicitly requested

## CLI Architecture

Commands are defined in `src/cli.ts` using Commander. Each command delegates to a module:

- `init [vault]` → `src/init.ts`
- `capture [text]` → `src/capture.ts`
- `new <type> [title]` → `src/new.ts`
- `templates` → `src/templates.ts`
- `status` → `src/status.ts`
- `update` → `src/update.ts`

Shared utilities live in `src/vault.ts` (vault detection) and `src/fs.ts` (file operations).

## Testing

- **Framework:** Vitest
- **Config:** `vite.config.ts`
- **Mocking:** Use `memfs` for file system tests
- **Location:** `test/` directory
- **Run:** `npm run test`

## Git Commit Rules

**NEVER** use `git commit -m`. Always write the message to a file first:

```bash
cat > /tmp/msg.txt << 'EOF'
Your commit message here
EOF
/usr/bin/git commit --file=/tmp/msg.txt
```

- **NEVER** add AI co-author lines (`Co-authored-by:`)
- **NEVER** set `GIT_COMMITTER_NAME` or `GIT_COMMITTER_EMAIL` to AI values
- Commit frequently with descriptive messages (e.g., `feat: add vault health check`)
- Verify no co-author after committing: `git log -1 --format="%B" | grep -i coauthor`

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `commander` | CLI framework |
| `chalk` | Terminal colors |
| `fs-extra` | File system operations |
| `ora` | Terminal spinners |

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
