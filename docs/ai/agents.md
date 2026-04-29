# AI Agents Setup

Guide for setting up each supported AI agent as your active agent.

## Supported Agents

| Agent | Binary | Install Command | API Key Location |
|-------|--------|----------------|-----------------|
| Claude Code | `claude` | `npm install -g @anthropic-ai/claude-code` | `ANTHROPIC_API_KEY` or `~/.config/anthropic/credentials.json` |
| Qwen Code | `qwen` | `npm install -g @anthropic-ai/qwen-code` | `DASHSCOPE_API_KEY` |
| Gemini CLI | `gemini` | `npm install -g @anthropic-ai/gemini-cli` | Google AI Studio API key |
| OpenCode | `opencode` | `npm install -g opencode` | Provider-specific config |
| OpenClaw | `openclaw` | `npm install -g openclaw` | Provider-specific config |

## Setup Flow

### Interactive Setup

```bash
uteuk setup ai
```

You'll be guided through:

1. **Select agent** from a numbered menu
2. **Enter API key** (input is masked)
3. **Store key** in the agent's native location
4. **Set as active** — marks this agent as your primary

### Quick Setup — Set Active Agent

If you've already configured the agent's credentials externally:

```bash
uteuk setup ai --set-active claude
```

### Per-Agent Setup

Configure a specific agent:

```bash
uteuk setup ai --agent qwen
```

## Agent-Specific Setup

### Claude Code

1. **Install:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Get API key:**
   - Visit [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
   - Create a new API key
   - Set `ANTHROPIC_API_KEY` environment variable, or let `uteuk setup ai` store it in `~/.config/anthropic/credentials.json`

3. **Verify:**
   ```bash
   claude --version
   ```

4. **Set active:**
   ```bash
   uteuk setup ai --set-active claude
   ```

### Qwen Code

1. **Install:**
   ```bash
   npm install -g @anthropic-ai/qwen-code
   ```

2. **Get API key:**
   - Visit [dashscope.console.aliyun.com/apiKey](https://dashscope.console.aliyun.com/apiKey)
   - Create a new API key
   - Set `DASHSCOPE_API_KEY` environment variable

3. **Verify:**
   ```bash
   qwen --version
   ```

4. **Set active:**
   ```bash
   uteuk setup ai --set-active qwen
   ```

### Gemini CLI

1. **Install:**
   ```bash
   npm install -g @anthropic-ai/gemini-cli
   ```

2. **Get API key:**
   - Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - Create a new API key

3. **Verify:**
   ```bash
   gemini --version
   ```

4. **Set active:**
   ```bash
   uteuk setup ai --set-active gemini
   ```

### OpenCode

1. **Install:**
   ```bash
   npm install -g opencode
   ```

2. **Configure provider:**
   - Edit `~/.config/opencode/config.json` with your provider credentials

3. **Verify:**
   ```bash
   opencode --version
   ```

4. **Set active:**
   ```bash
   uteuk setup ai --set-active opencode
   ```

### OpenClaw

1. **Install:**
   ```bash
   npm install -g openclaw
   ```

2. **Configure provider:**
   - Edit `~/.config/openclaw/config.json` with your provider credentials

3. **Verify:**
   ```bash
   openclaw --version
   ```

4. **Set active:**
   ```bash
   uteuk setup ai --set-active openclaw
   ```

## Changing Active Agent

You can switch your active agent at any time:

```bash
uteuk setup ai --set-active qwen
```

The previous agent's configuration remains in `.uteuk/config.json` — only the active designation changes.

## Configuration File

Active agent settings are stored in `.uteuk/config.json`:

```json
{
  "configVersion": 1,
  "activeAgent": "claude",
  "agentConfigs": {
    "claude": {
      "keyStored": true,
      "keyPath": "~/.config/anthropic/credentials.json"
    }
  },
  "onboardingComplete": true,
  "completedAt": "2026-04-30"
}
```

This file is created by `uteuk init` or `uteuk setup ai`. You can edit it manually if needed.
