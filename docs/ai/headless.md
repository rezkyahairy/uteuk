# AI Commands

Commands that invoke an AI agent to process your vault. These require an active agent configured via `uteuk setup ai`.

## `uteuk process`

Process all inbox notes with AI — summarizes, suggests tags, recommends PARA placement.

```bash
uteuk process
```

**What happens:**
1. Lists all `.md` files in `00-Inbox/`
2. If empty: "No notes to process"
3. If agent available: Reads the `process.md` prompt, invokes agent with the file list as context
4. Agent reads each inbox note and outputs summary, tag suggestions, and folder recommendations

## `uteuk connect "[[A]]" "[[B]]"`

Find semantic connections between two notes using AI.

```bash
uteuk connect "Learning" "AI Ethics"
```

**What happens:**
1. Searches the vault for both notes (checks all PARA folders)
2. If not found: "Error: Note 'X' not found."
3. If agent available: Reads both files, invokes agent with the `connect.md` prompt
4. Agent outputs relationships, shared themes, and suggested cross-links

**Note references:** Use `[[Note Name]]` or plain `Note Name` — both work.

## `uteuk moc "<topic>"`

Build a Map of Content for a topic.

```bash
uteuk moc "Learning"
```

**What happens:**
1. Reads the `populate-moc.md` prompt template
2. Invokes agent with the topic as context
3. Agent scans the vault for related notes and outputs a structured MOC

## `uteuk weekly-review`

Run a comprehensive weekly vault review.

```bash
uteuk weekly-review
```

**What happens:**
1. Checks vault has content (skips if empty: "Vault is too new for a weekly review")
2. Reads the `weekly-review.md` prompt template
3. Invokes agent with full vault context
4. Agent analyzes: inbox backlog, project health, stale MOCs, orphaned notes, and suggests actions

## Error Messages

| Message | Cause | Fix |
|---------|-------|-----|
| `No active agent configured` | No agent set in `.uteuk/config.json` | Run `uteuk setup ai` |
| `Agent "X" is not installed` | Agent binary not on PATH | Install the agent (see [Agents Setup](agents.md)) |
| `No notes to process` | Inbox is empty | Run `uteuk capture` first |
| `Note "X" not found` | Note doesn't exist in any PARA folder | Check the note name with `find ~/vault -name "*.md"` |
| `Vault is too new for a weekly review` | No notes in vault | Create some content first |
