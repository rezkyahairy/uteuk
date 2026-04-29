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
import type { NoteType } from "./types.js";

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

// ─── init ───────────────────────────────────────────────────
program
  .command("init [vault]")
  .description("Install Uteuk into an Obsidian vault")
  .option("--existing", "Merge into existing vault (default if vault detected)")
  .option("--from-scratch", "Create a new PARA-structured vault from scratch")
  .option("--force", "Force --from-scratch on non-empty directory")
  .action((vault, opts) => {
    initCommand(vault, opts);
  })
  .addHelpText(
    "after",
    `\nExamples:\n  uteuk init                  Auto-detect and install into current vault\n  uteuk init --from-scratch   Create fresh PARA structure\n  uteuk init ~/my-vault       Install into specific directory`,
  );

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

program.addHelpText(
  "afterAll",
  `\nExamples:\n  uteuk init --from-scratch\n  uteuk capture "My great idea"\n  uteuk new project "Build CLI" --vault ~/vault\n  uteuk status --json`,
);

program.on("command:*", () => {
  const available = ["init", "capture", "new", "templates", "status", "update"];
  console.error(
    `error: unknown command '${program.args.join(" ")}'. Available commands: ${available.join(", ")}`,
  );
  process.exit(1);
});

program.parse();
