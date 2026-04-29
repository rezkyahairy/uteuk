# AI Integration Overview

Uteuk integrates with AI coding agents to automate note processing, connection finding, and vault review — all from the terminal.

## How It Works

When you run an AI-enabled command, Uteuk:

1. **Reads** the active agent from `.uteuk/config.json`
2. **Validates** the agent binary is installed on your system
3. **Loads** the appropriate prompt template from `.uteuk/prompts/`
4. **Invokes** the agent's headless CLI with the prompt and context
5. **Streams** the agent's output directly to your terminal

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ uteuk       │────>│ Agent headless   │────>│ Agent reads/    │
│ captures    │     │ CLI (claude -p)  │     │ writes vault    │
│ context     │     │                  │     │ files           │
└─────────────┘     └──────────────────┘     └─────────────────┘
```

## BYOK — Bring Your Own Key

Uteuk **never stores or proxies API keys**. Your AI agent handles authentication using its own configuration:

- **Claude Code**: Reads from `~/.config/anthropic/credentials.json` or `ANTHROPIC_API_KEY` env var
- **Qwen Code**: Reads from `DASHSCOPE_API_KEY` env var
- **Gemini CLI**: Reads from its own config
- **OpenCode/OpenClaw**: Read from their respective config files

Uteuk only records **where** the key is stored, not the key itself.

## Graceful Fallback

When no AI agent is available, commands fall back gracefully:

| Command | Fallback Behavior |
|---------|------------------|
| `uteuk capture` | Creates raw note (existing behavior) + warning on stderr |
| `uteuk daily` | Creates template-based note (existing behavior) + warning |
| `uteuk process` | Error: "No active agent configured" |
| `uteuk connect` | Error: "No active agent configured" |
| `uteuk moc` | Error: "No active agent configured" |
| `uteuk weekly-review` | Error: "No active agent configured" |

The fallback ensures `capture` and `daily` always work, while dedicated AI commands require an active agent.

## Auto-Approval Flags

Some agents require explicit approval for file operations. Uteuk includes the appropriate auto-approval flag where available:

| Agent | Headless Command | Auto-Approval |
|-------|-----------------|---------------|
| Claude Code | `claude -p "prompt"` | None — prompts for approval |
| Qwen Code | `qwen --yolo -p "prompt"` | `--yolo` — auto-approve all |
| OpenCode | `opencode -p "prompt" -q` | Auto-approved in headless mode |
| Gemini CLI | `gemini -p "prompt"` | Trusted Folders (directory-based) |

## Setup Your Agent

```bash
# Interactive setup
uteuk setup ai

# Set a specific agent as active
uteuk setup ai --set-active claude
```

See [Agents Setup](agents.md) for detailed setup instructions for each agent.
