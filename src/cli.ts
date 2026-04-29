import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };
import { initCommand } from "./init.js";
import { captureCommand } from "./capture.js";
import { newCommand } from "./new.js";
import {
  listTemplates,
  printTemplates,
  printTemplatesJson,
} from "./templates.js";
import { statusCommand, printStatusJson } from "./status.js";
import { updateCommand } from "./update.js";
import { runPreflight, printDoctorOutput } from "./doctor.js";
import {
  runVerification,
  loadOnboardingConfig,
  saveOnboardingConfig,
  AGENT_PROFILES,
  storeApiKey,
} from "./setup.js";
import type { NoteType, AiAgentProfile, OnboardingConfig } from "./types.js";
import prompts from "prompts";
import chalk from "chalk";

const program = new Command();

function resolveVault(
  opts: { vault?: string },
  prog: Command,
): string | undefined {
  return opts.vault ?? (prog.opts().vault as string | undefined);
}

program
  .name("uteuk")
  .description("AI-assisted Second Brain CLI")
  .version(pkg.version, "-v, --version")
  .option("--vault <path>", "Path to vault (defaults to current directory)");

// ─── capture ────────────────────────────────────────────────
program
  .command("capture [text]")
  .description("Capture a raw idea into 00-Inbox/")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .action((text, opts) => {
    captureCommand(text, resolveVault(opts, program));
  })
  .addHelpText(
    "after",
    `\nExamples:\n  uteuk capture "What if notes auto-linked?"\n  uteuk capture --vault ~/vault`,
  );

// ─── new ────────────────────────────────────────────────────
program
  .command("new <type> [title]")
  .description("Create a note from a template")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .argument("<type>", "Note type: project, daily, resource, moc, task, inbox")
  .action((type: string, title: string | undefined, opts) => {
    const validTypes: NoteType[] = [
      "project",
      "daily",
      "resource",
      "moc",
      "task",
      "inbox",
    ];
    if (!validTypes.includes(type as NoteType)) {
      console.error(
        `Error: Invalid type "${type}". Valid types: ${validTypes.join(", ")}`,
      );
      process.exit(1);
    }
    newCommand(type as NoteType, title, resolveVault(opts, program));
  })
  .addHelpText(
    "after",
    `\nExamples:\n  uteuk new project "API Redesign"\n  uteuk new resource "TypeScript Patterns" --vault ~/vault`,
  );

// ─── templates ──────────────────────────────────────────────
program
  .command("templates")
  .description("List available note templates")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .option("--json", "Output in JSON format")
  .action((opts) => {
    const templates = listTemplates(resolveVault(opts, program));
    if (opts.json) {
      printTemplatesJson(templates);
    } else {
      printTemplates(templates);
    }
  })
  .addHelpText(
    "after",
    `\nExamples:\n  uteuk templates\n  uteuk templates --json`,
  );

// ─── status ─────────────────────────────────────────────────
program
  .command("status")
  .description("Check vault health")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .option("--json", "Output in JSON format")
  .action(async (opts) => {
    const resolved = resolveVault(opts, program);
    if (opts.json) {
      const { scanVault } = await import("./status.js");
      const status = await scanVault(resolved ?? ".");
      printStatusJson(status);
    } else {
      await statusCommand(resolved);
    }
  })
  .addHelpText(
    "after",
    `\nExamples:\n  uteuk status\n  uteuk status --vault ~/vault --json`,
  );

// ─── update ─────────────────────────────────────────────────
program
  .command("update")
  .description("Update Uteuk prompts and templates")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .action((opts) => {
    updateCommand(resolveVault(opts, program));
  })
  .addHelpText(
    "after",
    `\nExamples:\n  uteuk update\n  uteuk update --vault ~/vault`,
  );

// ─── doctor ─────────────────────────────────────────────────
program
  .command("doctor [vault]")
  .description("Check system prerequisites")
  .action((vault) => {
    const resolved = vault ?? process.cwd();
    const result = runPreflight(resolved);
    printDoctorOutput(result);
    if (!result.passed) process.exit(1);
  });

// ─── setup ──────────────────────────────────────────────────
const setupCmd = program.command("setup");
setupCmd.description("Manage onboarding and configuration");

setupCmd
  .command("verify [vault]")
  .description("Verify vault setup is complete")
  .action((vault) => {
    const resolved = vault ?? process.cwd();
    const result = runVerification(resolved);
    for (const check of result.checks) {
      const icon = check.passed ? chalk.green("✓") : chalk.red("✗");
      console.log(`  ${icon} ${check.name}: ${check.message}`);
      if (!check.passed && check.fix) {
        console.log(`    ${chalk.yellow("→")} ${check.fix}`);
      }
    }
    console.log();
    if (result.passed) {
      console.log(chalk.green("✓ All checks passed. Your vault is ready!"));
    } else {
      console.log(
        chalk.yellow(
          "Some checks failed. Fix the issues above and re-run this command.",
        ),
      );
    }
  });

setupCmd
  .command("ai")
  .description("Configure AI agent settings")
  .option("--agent <name>", "Configure a specific agent")
  .option("--set-active <name>", "Set the active (primary) agent")
  .option("--skip", "Skip AI setup")
  .action(async (opts) => {
    const vault = process.cwd();
    let config = loadOnboardingConfig(vault);

    if (opts.setActive) {
      const profile = AGENT_PROFILES.find((p) => p.id === opts.setActive);
      if (!profile) {
        console.error(
          chalk.red(
            `Error: Unknown agent "${opts.setActive}". Valid: ${AGENT_PROFILES.map((p) => p.id).join(", ")}`,
          ),
        );
        process.exit(1);
      }
      config.activeAgent = opts.setActive;
      saveOnboardingConfig(vault, config);
      console.log(chalk.green(`✓ Active agent set to ${profile.name}`));
      return;
    }

    if (opts.skip) {
      console.log(chalk.dim("AI setup skipped."));
      return;
    }

    if (opts.agent) {
      const profile = AGENT_PROFILES.find((p) => p.id === opts.agent);
      if (!profile) {
        console.error(
          chalk.red(
            `Error: Unknown agent "${opts.agent}". Valid: ${AGENT_PROFILES.map((p) => p.id).join(", ")}`,
          ),
        );
        process.exit(1);
      }
      await configureSingleAgent(profile, config, vault);
      return;
    }

    await configureAllAgents(config, vault);
  });

async function configureSingleAgent(
  profile: AiAgentProfile,
  config: OnboardingConfig,
  vault: string,
): Promise<void> {
  console.log(chalk.bold(`\nConfiguring ${profile.name}`));
  if (profile.authUrl) {
    console.log(chalk.dim(`${profile.authInstructions}\n`));
  }

  const { apiKey } = await prompts({
    type: "password",
    name: "apiKey",
    message: `Enter your ${profile.name} API key:`,
  });

  if (!apiKey) {
    console.log(chalk.dim("API key entry skipped."));
    return;
  }

  const { storeKey } = await prompts({
    type: "confirm",
    name: "storeKey",
    message: `Store key in ${profile.keyStoragePath}?`,
    initial: true,
  });

  if (storeKey) {
    const result = storeApiKey(profile, apiKey);
    if (result.stored) {
      config.agentConfigs[profile.id] = {
        keyStored: true,
        keyPath: profile.keyStoragePath,
      };
      console.log(chalk.green(`✓ Key stored to ${profile.keyStoragePath}`));
    } else {
      console.log(
        chalk.red(`✗ Failed to store key to ${profile.keyStoragePath}`),
      );
    }
  }

  const { setActive } = await prompts({
    type: "confirm",
    name: "setActive",
    message: `Set ${profile.name} as your active (primary) agent?`,
    initial: true,
  });

  if (setActive) {
    config.activeAgent = profile.id;
    console.log(chalk.green(`✓ Active agent: ${profile.name}`));
  }

  saveOnboardingConfig(vault, config);
}

async function configureAllAgents(
  config: OnboardingConfig,
  vault: string,
): Promise<void> {
  console.log(chalk.bold("\nWhich AI agent will you use as primary?"));
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
    console.log(chalk.dim("AI setup skipped."));
    return;
  }

  const profile = AGENT_PROFILES.find((p) => p.id === agent);
  if (profile) {
    await configureSingleAgent(profile, config, vault);
  }
}

// ─── init ───────────────────────────────────────────────────
program
  .command("init [vault]")
  .description("Install Uteuk into an Obsidian vault")
  .option("--existing", "Merge into existing vault (default if vault detected)")
  .option("--from-scratch", "Create a new PARA-structured vault from scratch")
  .option("--force", "Force --from-scratch on non-empty directory")
  .option("--non-interactive", "Run without interactive prompts")
  .option("--skip-git", "Skip git remote configuration")
  .option("--skip-ai", "Skip AI agent setup")
  .action((vault, opts) => {
    initCommand(vault, {
      existing: opts.existing,
      fromScratch: opts.fromScratch,
      force: opts.force,
      nonInteractive: opts.nonInteractive ?? !process.stdin.isTTY,
      skipGit: opts.skipGit,
      skipAi: opts.skipAi,
    });
  })
  .addHelpText(
    "after",
    `\nExamples:\n  uteuk init                  Auto-detect and install into current vault\n  uteuk init --from-scratch   Create fresh PARA structure\n  uteuk init --non-interactive  Run silently (CI/automation)\n  uteuk init ~/my-vault       Install into specific directory`,
  );

program.addHelpText(
  "afterAll",
  `\nExamples:\n  uteuk init --from-scratch\n  uteuk capture "My great idea"\n  uteuk new project "Build CLI" --vault ~/vault\n  uteuk status --json\n  uteuk doctor\n  uteuk setup verify`,
);

program.on("command:*", () => {
  const available = [
    "init",
    "capture",
    "new",
    "templates",
    "status",
    "update",
    "doctor",
    "setup",
  ];
  console.error(
    `error: unknown command '${program.args.join(" ")}'. Available commands: ${available.join(", ")}`,
  );
  process.exit(1);
});

program.parse();
