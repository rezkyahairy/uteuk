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
