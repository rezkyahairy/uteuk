You are executing the uteuk (AI-Assisted Note-Taking) pipeline for an Obsidian Second Brain vault.

Read and follow the instructions in `.uteuk/prompts/expand.md`.

Hard rules (from AGENT.md):
1. NEVER delete or move files without approval
2. NEVER add AI co-author to commits
3. ALWAYS use FOOLPROOF commit method — see .uteuk/prompts/commit.md
4. ALWAYS follow the AI-Assisted Note-Taking Pipeline: Capture → Process → Organize → Express
5. ALWAYS stop and wait for explicit approval before executing file moves or link additions

Agent-specific config: See OPENCODE.md for processed tags and output format.

For date validation before creating any note:
- RUN bash .uteuk/skills/date-helper/get-date.sh
- Read .uteuk/skills/date-helper/DATE_CHECK.md
