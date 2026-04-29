# Global Options

Options available on the root `uteuk` command or shared across multiple subcommands.

## `-v, --version`

Show the installed version number and exit.

```bash
uteuk -v
uteuk --version
```

## `-h, --help`

Show help information for the command and exit.

```bash
uteuk -h
uteuk init -h
uteuk process -h
```

## `--vault <path>`

Set the vault directory globally. Applies to all subcommands unless overridden by a local `--vault` flag.

```bash
# Global vault — applies to all subcommands
uteuk --vault ~/vault status
uteuk --vault ~/vault templates

# Local vault overrides global for a specific command
uteuk --vault ~/vault status --vault ~/other-vault
```

**Precedence:** Local `--vault` > Global `--vault` > Current directory (default)

## `--json`

Output in machine-parseable JSON format instead of human-readable text. Available on `status` and `templates` commands.

```bash
uteuk status --json
uteuk templates --json
```

Use with `jq` for scripting:

```bash
# Get inbox count
uteuk status --json | jq '.inboxCount'

# List template names
uteuk templates --json | jq '.[].name'
```

## `--non-interactive`

Run `uteuk init` without any interactive prompts. Uses sensible defaults: git init without remote setup, no AI configuration.

```bash
uteuk init --non-interactive
```

## `--skip-git`

Skip the git remote configuration step during `uteuk init`. Git repo is still initialized (if from-scratch), but no remote URL is set.

```bash
uteuk init --from-scratch --skip-git
```

## `--skip-ai`

Skip the AI agent setup step during `uteuk init`. All other onboarding steps run normally.

```bash
uteuk init --skip-ai
```
