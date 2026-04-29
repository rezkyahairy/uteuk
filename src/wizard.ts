import chalk from "chalk";
import prompts from "prompts";
import { runPreflight, printDoctorOutput } from "./doctor.js";
import {
  hasGitRepo,
  hasGitRemote,
  ensureGitRepo,
  addGitRemote,
  getGitUserConfig,
} from "./vault.js";
import {
  AGENT_PROFILES,
  loadOnboardingConfig,
  saveOnboardingConfig,
  storeApiKey,
  runVerification,
} from "./setup.js";
import type { AiAgentProfile, OnboardingConfig } from "./types.js";
import fs from "fs-extra";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const {
  copySync,
  existsSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  ensureDirSync,
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

export interface WizardOptions {
  nonInteractive: boolean;
  skipGit: boolean;
  skipAi: boolean;
}

function getBundledPath(relative: string): string {
  return fileURLToPath(new URL(`../${relative}`, import.meta.url));
}

async function safeCopy(src: string, dest: string): Promise<void> {
  if (!existsSync(dest)) {
    copySync(src, dest, { overwrite: false });
  }
}

export async function runWizard(
  vaultPath: string,
  mode: "existing" | "from-scratch",
  options: WizardOptions,
): Promise<void> {
  // ── Step 1: Pre-flight ──
  console.log(chalk.bold("\nStep 1/5: Checking prerequisites"));
  const preflight = runPreflight(vaultPath);
  printDoctorOutput(preflight);
  if (!preflight.passed) {
    process.exit(1);
  }

  // ── Core file installation ──
  await installCoreFiles(vaultPath, mode);

  // ── Step 2: Git setup ──
  if (!options.skipGit) {
    await runGitStep(vaultPath, mode, options.nonInteractive);
  }

  // ── Step 3: AI Agent setup ──
  if (!options.skipAi) {
    await runAiStep(vaultPath, options.nonInteractive);
  }

  // ── Step 4: Plugin recommendations ──
  runPluginStep();

  // ── Step 5: Verification ──
  await runVerificationStep(vaultPath);
}

async function installCoreFiles(
  vaultPath: string,
  mode: "existing" | "from-scratch",
): Promise<void> {
  // Copy .uteuk/
  const srcUteuk = getBundledPath(".uteuk");
  const destUteuk = join(vaultPath, ".uteuk");
  if (existsSync(destUteuk)) {
    console.log(
      chalk.yellow(
        "  ⚠ .uteuk/ already exists. Skipping. Use `uteuk update` to refresh.",
      ),
    );
  } else {
    copySync(srcUteuk, destUteuk, { overwrite: false });
  }

  // Copy templates
  const srcTemplates = getBundledPath("templates");
  const destTemplates = join(vaultPath, "05-Templates");
  ensureDirSync(destTemplates);
  if (existsSync(srcTemplates)) {
    for (const file of readdirSync(srcTemplates)) {
      const src = join(srcTemplates, file);
      const dest = join(destTemplates, file);
      await safeCopy(src, dest);
    }
  }

  // Copy agent configs
  for (const configFile of AGENT_CONFIGS) {
    const src = getBundledPath(configFile);
    const dest = join(vaultPath, configFile);
    if (existsSync(src)) {
      await safeCopy(src, dest);
    }
  }

  // Copy shared skills
  const srcSkills = getBundledPath(".uteuk/skills");
  const destSkills = join(vaultPath, ".uteuk/skills");
  if (existsSync(srcSkills) && !existsSync(destSkills)) {
    copySync(srcSkills, destSkills, { overwrite: false });
  }

  // Copy slash commands
  for (const dir of SLASH_COMMAND_DIRS) {
    const src = getBundledPath(dir);
    const dest = join(vaultPath, dir);
    if (existsSync(src) && !existsSync(dest)) {
      copySync(src, dest, { overwrite: false });
    }
  }

  // Create missing PARA folders
  for (const folder of PARA_FOLDERS) {
    const dest = join(vaultPath, folder);
    if (!existsSync(dest)) {
      ensureDirSync(dest);
    }
  }
}

async function runGitStep(
  vaultPath: string,
  mode: "existing" | "from-scratch",
  nonInteractive: boolean,
): Promise<void> {
  console.log(chalk.bold("\nStep 2/5: Git repository"));

  if (mode === "from-scratch" || !hasGitRepo(vaultPath)) {
    const userConfig = getGitUserConfig();
    let userName = userConfig.name;
    let userEmail = userConfig.email;

    if (!nonInteractive) {
      if (!userName) {
        const { name } = await prompts({
          type: "text",
          name: "name",
          message: "Enter your git user name:",
        });
        userName = name || undefined;
      }
      if (!userEmail) {
        const { email } = await prompts({
          type: "text",
          name: "email",
          message: "Enter your git email:",
        });
        userEmail = email || undefined;
      }
    }

    ensureGitRepo(vaultPath, {
      userName: userName ?? undefined,
      userEmail: userEmail ?? undefined,
    });
    console.log(chalk.green("  ✓ Git repository initialized"));

    // Remote URL prompt
    if (!hasGitRemote(vaultPath) && !nonInteractive) {
      const { configureRemote } = await prompts({
        type: "confirm",
        name: "configureRemote",
        message: "Configure a remote URL for vault sync?",
        initial: false,
      });

      if (configureRemote) {
        const { remoteUrl } = await prompts({
          type: "text",
          name: "remoteUrl",
          message: "Remote URL:",
        });

        if (remoteUrl) {
          addGitRemote(vaultPath, remoteUrl);
          console.log(chalk.green("  ✓ Remote 'origin' configured"));
        }
      }
    }
  } else {
    console.log(chalk.green("  ✓ Git repository already exists"));
  }
}

async function runAiStep(
  vaultPath: string,
  nonInteractive: boolean,
): Promise<void> {
  console.log(chalk.bold("\nStep 3/5: AI Agent"));

  if (nonInteractive) {
    console.log(chalk.dim("  AI setup skipped (non-interactive mode)"));
    return;
  }

  let config = loadOnboardingConfig(vaultPath);
  if (config.activeAgent) {
    console.log(
      chalk.dim(`  Active agent already set to: ${config.activeAgent}`),
    );
    return;
  }

  console.log(chalk.bold("  Which AI agent will you use as primary?"));
  const choices = [
    ...AGENT_PROFILES.map((p, i) => ({
      title: `${i + 1}) ${p.name}`,
      value: p.id,
    })),
    { title: "6) Skip for now", value: "skip" },
  ];

  const { agent } = await prompts({
    type: "select",
    name: "agent",
    message: "Select an agent:",
    choices,
  });

  if (agent === "skip" || !agent) {
    console.log(chalk.dim("  AI setup skipped."));
    return;
  }

  const profile = AGENT_PROFILES.find((p) => p.id === agent);
  if (profile) {
    console.log(chalk.bold(`\n  Configuring ${profile.name}`));
    if (profile.authUrl) {
      console.log(chalk.dim(`  ${profile.authInstructions}`));
    }

    const { apiKey } = await prompts({
      type: "password",
      name: "apiKey",
      message: `  Enter your ${profile.name} API key:`,
    });

    if (apiKey) {
      const { storeKey } = await prompts({
        type: "confirm",
        name: "storeKey",
        message: `  Store key in ${profile.keyStoragePath}?`,
        initial: true,
      });

      if (storeKey) {
        const result = storeApiKey(profile, apiKey);
        if (result.stored) {
          config.agentConfigs[profile.id] = {
            keyStored: true,
            keyPath: profile.keyStoragePath,
          };
          console.log(
            chalk.green(`  ✓ Key stored to ${profile.keyStoragePath}`),
          );
        } else {
          console.log(
            chalk.red(`  ✗ Failed to store key to ${profile.keyStoragePath}`),
          );
        }
      }
    }

    config.activeAgent = profile.id;
    console.log(chalk.green(`  ✓ Active agent: ${profile.name}`));
  }

  saveOnboardingConfig(vaultPath, config);
}

function runPluginStep(): void {
  console.log(chalk.bold("\nStep 4/5: Obsidian Plugins (optional)"));
  console.log(
    chalk.dim(`
  Recommended plugins for the best experience:
    • Templates      → Settings > Files & Links > Template folder → 05-Templates/
    • Daily Notes    → Settings > Daily Notes > New file location → 06-Daily/
    • Obsidian Git   → For GUI-based vault sync

  (Install from Obsidian Settings > Community Plugins)
`),
  );
}

async function runVerificationStep(vaultPath: string): Promise<void> {
  console.log(chalk.bold("\nStep 5/5: Verification"));
  const result = runVerification(vaultPath);

  for (const check of result.checks) {
    const icon = check.passed ? chalk.green("✓") : chalk.red("✗");
    console.log(`  ${icon} ${check.name}: ${check.message}`);
    if (!check.passed && check.fix) {
      console.log(`    ${chalk.yellow("→")} ${check.fix}`);
    }
  }

  console.log();

  if (result.passed) {
    console.log(
      chalk.green(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n ✓ Setup complete! Your vault is ready.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      ),
    );
    console.log(`\n  Try: ${chalk.cyan('uteuk capture "My first idea"')}\n`);
  } else {
    console.log(
      chalk.yellow(
        "Setup complete but some checks failed. You can fix them later.",
      ),
    );
    console.log(`\n  Try: ${chalk.cyan('uteuk capture "My first idea"')}\n`);
  }
}
