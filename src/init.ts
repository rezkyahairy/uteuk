import fs from "fs-extra";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import ora from "ora";
import type { InitMode, VaultState } from "./types.js";
import { detectVaultState, resolveVaultPath } from "./vault.js";
import { safeCopy, ensureDirectory } from "./fs.js";

const {
  existsSync,
  readdirSync,
  copySync,
  ensureDirSync,
  writeFileSync,
  readFileSync,
} = fs;

const PARA_FOLDERS = [
  "00-Inbox",
  "01-Projects",
  "02-Areas",
  "03-Resources",
  "04-Archive",
  "05-Templates",
  "06-Daily",
];

const AGENT_CONFIGS = [
  "AGENT.md",
  "CLAUDE.md",
  "GEMINI.md",
  "OPENCODE.md",
  "QWEN.md",
  "OPENCLAW.md",
] as const;

const SLASH_COMMAND_DIRS = [
  ".claude/commands",
  ".qwen/commands",
  ".gemini/commands",
  ".opencode/commands",
  ".openclaw/commands",
] as const;

/**
 * Copy bundled assets from the repo's bundled directory to the vault.
 * Bundled assets are resolved relative to the running script.
 */
function getBundledPath(relative: string): string {
  return fileURLToPath(new URL(`../${relative}`, import.meta.url));
}

function isDirEmpty(dir: string): boolean {
  try {
    return readdirSync(dir).length === 0;
  } catch {
    return true;
  }
}

/**
 * Interactive mode selection: prompt user for existing vs from-scratch.
 * For now, returns mode based on detection (interactive prompt via stdin would use readline/prompts in future).
 */
function selectMode(state: VaultState, forceFromScratch: boolean): InitMode {
  if (forceFromScratch) return "from-scratch";
  if (state === "EMPTY" || state === "NON_EMPTY_DIR") return "from-scratch";
  return "existing";
}

async function initExisting(vaultPath: string): Promise<void> {
  const spinner = ora("Installing Uteuk into your vault...").start();

  // 1. Copy .uteuk/ prompts + commands
  const srcUteuk = getBundledPath(".uteuk");
  const destUteuk = join(vaultPath, ".uteuk");

  if (existsSync(destUteuk)) {
    spinner.warn(
      chalk.yellow(
        ".uteuk/ already exists. Skipping. Use `uteuk update` to refresh.",
      ),
    );
  } else {
    copySync(srcUteuk, destUteuk, { overwrite: false });
  }

  // 2. Copy templates into 05-Templates/ (only if missing)
  const srcTemplates = getBundledPath("templates");
  const destTemplates = join(vaultPath, "05-Templates");
  await ensureDirectory(destTemplates);

  if (existsSync(srcTemplates)) {
    for (const file of readdirSync(srcTemplates)) {
      const src = join(srcTemplates, file);
      const dest = join(destTemplates, file);
      await safeCopy(src, dest);
    }
  }

  // 3. Copy agent configs (only if not exists)
  for (const configFile of AGENT_CONFIGS) {
    const src = getBundledPath(configFile);
    const dest = join(vaultPath, configFile);
    if (existsSync(src)) {
      await safeCopy(src, dest);
    }
  }

  // 4. Copy shared skills (only if missing)
  const srcSkills = getBundledPath(".uteuk/skills");
  const destSkills = join(vaultPath, ".uteuk/skills");
  if (existsSync(srcSkills) && !existsSync(destSkills)) {
    copySync(srcSkills, destSkills, { overwrite: false });
  }

  // 5. Copy slash commands (only if missing)
  for (const dir of SLASH_COMMAND_DIRS) {
    const src = getBundledPath(dir);
    const dest = join(vaultPath, dir);
    if (existsSync(src) && !existsSync(dest)) {
      copySync(src, dest, { overwrite: false });
    }
  }

  // 6. Create missing PARA folders
  for (const folder of PARA_FOLDERS) {
    const dest = join(vaultPath, folder);
    if (!existsSync(dest)) {
      await ensureDirectory(dest);
    }
  }

  spinner.succeed(chalk.green("Uteuk installed successfully!"));

  // Print summary
  console.log("\n" + chalk.bold("Installed:"));
  if (existsSync(destUteuk))
    console.log(`  ${chalk.cyan(".uteuk/")} — AI prompts and commands`);
  if (existsSync(destTemplates))
    console.log(`  ${chalk.cyan("05-Templates/")} — Note templates`);
  if (existsSync(destSkills))
    console.log(`  ${chalk.cyan(".uteuk/skills/")} — Shared capabilities`);
  for (const dir of SLASH_COMMAND_DIRS) {
    if (existsSync(join(vaultPath, dir))) {
      const agentName = dir.split("/")[0].replace(".", "");
      console.log(`  ${chalk.cyan(dir + "/")} — ${agentName} slash commands`);
    }
  }
  for (const config of AGENT_CONFIGS) {
    if (existsSync(join(vaultPath, config))) {
      console.log(`  ${chalk.cyan(config)} — AI agent config`);
    }
  }
  console.log(`\n${chalk.bold("Next:")}`);
  console.log(`  Open your vault in Obsidian and start using Uteuk.`);
  console.log(`  Run ${chalk.cyan("uteuk capture")} to drop a raw idea.`);
}

async function initFromScratch(
  vaultPath: string,
  force: boolean,
): Promise<void> {
  const isNonEmpty = existsSync(vaultPath) && !isDirEmpty(vaultPath);

  if (isNonEmpty && !force) {
    console.error(
      chalk.red("Error: Directory is not empty.") +
        "\nUse --force to proceed, or run on an empty directory.",
    );
    process.exit(1);
  }

  const spinner = ora("Creating new Uteuk vault from scratch...").start();

  // 1. Create .obsidian/ minimal config (optional)
  const obsidianDir = join(vaultPath, ".obsidian");
  await ensureDirectory(obsidianDir);
  const appConfig = join(obsidianDir, "app.json");
  if (!existsSync(appConfig)) {
    writeFileSync(
      appConfig,
      JSON.stringify(
        { newFileLocation: "folder", newFileFolderPath: "00-Inbox" },
        null,
        2,
      ),
    );
  }

  // 2. Create full PARA structure
  for (const folder of PARA_FOLDERS) {
    await ensureDirectory(join(vaultPath, folder));
  }

  // 3. Copy .uteuk/ all prompts + commands
  copySync(getBundledPath(".uteuk"), join(vaultPath, ".uteuk"), {
    overwrite: false,
  });

  // 4. Copy templates
  const destTemplates = join(vaultPath, "05-Templates");
  const srcTemplates = getBundledPath("templates");
  if (existsSync(srcTemplates)) {
    copySync(srcTemplates, destTemplates, { overwrite: false });
  }

  // 5. Copy agent configs
  for (const configFile of AGENT_CONFIGS) {
    const src = getBundledPath(configFile);
    if (existsSync(src)) {
      const dest = join(vaultPath, configFile);
      if (!existsSync(dest)) {
        copySync(src, dest);
      }
    }
  }

  // 6. Copy shared skills
  const srcSkills = getBundledPath(".uteuk/skills");
  const destSkills = join(vaultPath, ".uteuk/skills");
  if (existsSync(srcSkills) && !existsSync(destSkills)) {
    copySync(srcSkills, destSkills, { overwrite: false });
  }

  // 7. Copy slash commands
  for (const dir of SLASH_COMMAND_DIRS) {
    const src = getBundledPath(dir);
    const dest = join(vaultPath, dir);
    if (existsSync(src) && !existsSync(dest)) {
      copySync(src, dest, { overwrite: false });
    }
  }

  // 8. Create welcome note
  const welcomePath = join(vaultPath, "00-Inbox", "Welcome to Uteuk.md");
  if (!existsSync(welcomePath)) {
    writeFileSync(
      welcomePath,
      `---
created: ${new Date().toISOString().split("T")[0]}
tags: [welcome]
---

# Welcome to Uteuk

> **Uteuk** *(Basa Sunda: Brain)* — An AI-assisted Second Brain.

## Quick Start

1. **Capture** — Drop raw ideas into \`00-Inbox/\`
2. **Process** — Ask your AI agent to process your inbox
3. **Organize** — Move notes into PARA folders
4. **Express** — Draft blog posts, reports from organized notes

## Useful Commands

\`\`\`
uteuk capture "Some idea"    # Create a raw idea note
uteuk new project "Project"  # Create from template
uteuk status                 # Check vault health
uteuk update                 # Update Uteuk prompts/templates
\`\`\`

## The Pipeline

\`\`\`
Capture → Process → Organize → Express
\`\`\`

Happy note-taking!
`,
    );
  }

  spinner.succeed(chalk.green(`Vault created at ${vaultPath}`));
  console.log(`\n${chalk.bold("Next:")} Open this folder in Obsidian.`);
}

export async function initCommand(
  vaultPath: string | undefined,
  options: { existing?: boolean; fromScratch?: boolean; force?: boolean },
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);

  // Ensure directory exists
  if (!existsSync(resolvedPath)) {
    ensureDirSync(resolvedPath);
  }

  const state = detectVaultState(resolvedPath);

  if (state === "ALREADY_INSTALLED" && !options.fromScratch) {
    console.log(
      chalk.yellow("Uteuk is already installed in this vault.") +
        `\nUse ${chalk.cyan("uteuk update")} to refresh prompts and templates.`,
    );
    return;
  }

  const mode = selectMode(state, !!options.fromScratch);

  if (mode === "from-scratch") {
    await initFromScratch(resolvedPath, !!options.force);
  } else {
    await initExisting(resolvedPath);
  }
}
