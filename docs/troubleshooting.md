# Troubleshooting

Common issues and their solutions.

## Installation

### `uteuk: command not found`

The CLI is not installed globally.

```bash
npm install -g uteuk
```

### `error: unknown option '-v'`

Your installed version is older than 0.3.0. Update:

```bash
npm update -g uteuk
```

### Node.js version error

Uteuk requires Node.js >= 24.

```bash
node --version    # Check current version
nvm install 24    # Install Node 24 (if using nvm)
```

## Vault Initialization

### `Uteuk is already installed in this vault`

The vault already has `.uteuk/` and `.obsidian/` directories. To refresh prompts and templates:

```bash
uteuk update
```

To force a fresh install on a non-empty directory:

```bash
uteuk init --from-scratch --force
```

### `Error: Directory is not empty`

`--from-scratch` refuses to overwrite existing directories. Use `--force` to proceed:

```bash
uteuk init --from-scratch --force ~/vault
```

## AI Agent Issues

### `No active agent configured. Run uteuk setup ai to select one.`

No agent has been set as your primary. Configure one:

```bash
uteuk setup ai
```

### `Agent "Claude Code" is not installed. Install: npm install -g @anthropic-ai/claude-code`

The active agent's binary is not on your PATH. Install it:

```bash
# Claude Code
npm install -g @anthropic-ai/claude-code

# Qwen Code
npm install -g @anthropic-ai/qwen-code

# Gemini CLI
npm install -g @anthropic-ai/gemini-cli

# OpenCode
npm install -g opencode

# OpenClaw
npm install -g openclaw
```

### `Agent not installed, using raw capture`

You ran `uteuk capture` with an active agent configured, but the agent binary is missing. The note was still created (raw mode). Install the agent to enable AI enhancement next time.

### `Agent "X" failed to start`

The agent process exited with an error. Common causes:

- **API key not set**: Check that your agent's credentials are configured (e.g., `ANTHROPIC_API_KEY` for Claude).
- **Agent version outdated**: Update the agent: `npm update -g @anthropic-ai/claude-code`
- **Network issue**: Check your internet connection

## AI Commands (process, connect, moc, weekly-review)

### `No notes to process. Inbox is empty!`

Your `00-Inbox/` directory has no `.md` files. Capture some ideas first:

```bash
uteuk capture "My first idea"
uteuk capture "Another thought"
uteuk process
```

### `Error: Note "X" not found.`

The note reference in `uteuk connect` doesn't match any file in your vault. Check the name:

```bash
# List all notes in the vault
find ~/vault -name "*.md" | grep -i "learning"
```

### `Error: Topic name is required.`

`uteuk moc` needs a topic argument:

```bash
uteuk moc "Learning"
```

### `Vault is too new for a weekly review. Start capturing some notes first!`

Your vault has no notes yet. Create some content first:

```bash
uteuk capture "Getting started with Uteuk"
uteuk new project "My First Project"
uteuk weekly-review
```

## Git and Sync

### Git-related warnings during init

If `uteuk init` warns about git not being configured:

```bash
cd ~/vault
git config user.name "Your Name"
git config user.email "you@example.com"
```

## Getting Help

If none of the above resolves your issue:

1. Run `uteuk doctor` to check your system setup
2. Run `uteuk setup verify` to check your vault setup
3. Check for updates: `npm outdated -g uteuk`
4. [Open an issue](https://github.com/rezkyahairy/uteuk/issues) with:
   - `uteuk --version` output
   - `node --version` output
   - The exact command you ran and the full error output
