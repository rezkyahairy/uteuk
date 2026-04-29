# AI Pipeline Prompts

14 prompt templates installed in `.uteuk/prompts/` that guide AI agents through the note-taking pipeline.

## Prompt Reference

| Prompt File | Phase | Purpose |
|-------------|-------|---------|
| `capture.md` | Capture | Structure raw ideas with context, tags, and initial links |
| `process.md` | Process | Summarize inbox notes, suggest tags, recommend PARA placement |
| `expand.md` | Process | Develop a seed idea into a full, well-structured note |
| `organize.md` | Organize | Move notes into the correct PARA folder |
| `connect.md` | Organize | Find semantic links and shared themes between notes |
| `populate-moc.md` | Organize | Build a Map of Content for a topic by scanning related notes |
| `weekly-review.md` | Organize | Full vault audit — inbox, projects, stale MOCs, orphans |
| `daily.md` | Express | Review and enhance today's daily note |
| `status.md` | Express | Report vault health metrics in structured format |
| `task-capture.md` | Capture | Create an actionable task note with priority and due date |
| `task-review.md` | Process | Review and organize tasks by project and priority |
| `publish.md` | Express | Draft a blog post, article, or report from organized notes |
| `commit.md` | Express | Generate a git commit message from vault changes |
| `uteuk.*.md` | Commands | Agent-agnostic slash command definitions in `.uteuk/commands/` |

## How Prompts Work

Each prompt is a markdown file containing instructions for the AI agent. When an AI command runs:

1. Uteuk reads the appropriate `.uteuk/prompts/<name>.md` file
2. Appends the command-specific context (note contents, file list, topic, etc.)
3. Invokes the agent's headless CLI with the combined prompt
4. Agent reads the prompt, accesses vault files, and outputs or writes results

## Prompt Structure

Prompts follow a consistent structure:

```markdown
# Role

You are an AI assistant helping manage a Second Brain in Obsidian...

## Task

[Specific instructions for this pipeline step]

## Rules

- Never delete notes without approval
- Always present suggestions first
- Use backlinks [[Note Name]] for connections

## Output Format

[Bullet points, tables, or markdown structure for the agent to follow]
```

## Slash Commands vs Prompts

| | Slash Commands | Prompt Templates |
|--|---------------|------------------|
| **Location** | `.claude/commands/`, `.qwen/commands/`, etc. | `.uteuk/prompts/` |
| **Invocation** | `/uteuk.process` in agent chat | `uteuk process` in terminal |
| **Content** | Agent-specific command format | Agent-agnostic prompt instructions |
| **Count** | 12 per agent (60+ total) | 14 prompt files |

Slash commands reference the same prompt templates — they're the in-chat equivalent of terminal commands.
