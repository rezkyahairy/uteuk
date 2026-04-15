import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };
import { initCommand } from "./init.js";
import { captureCommand } from "./capture.js";
import { newCommand } from "./new.js";
import { listTemplates, printTemplates } from "./templates.js";
import { statusCommand } from "./status.js";
import { updateCommand } from "./update.js";
import type { NoteType } from "./types.js";

const program = new Command();

program
  .name("uteuk")
  .description("AI-assisted Second Brain CLI")
  .version(pkg.version);

// ─── init ───────────────────────────────────────────────────
program
  .command("init [vault]")
  .description("Install Uteuk into an Obsidian vault")
  .option("--existing", "Merge into existing vault (default if vault detected)")
  .option("--from-scratch", "Create a new PARA-structured vault from scratch")
  .option("--force", "Force --from-scratch on non-empty directory")
  .action((vault, opts) => {
    initCommand(vault, opts);
  });

// ─── capture ────────────────────────────────────────────────
program
  .command("capture [text]")
  .description("Capture a raw idea into 00-Inbox/")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .action((text, opts) => {
    captureCommand(text, opts.vault);
  });

// ─── new ────────────────────────────────────────────────────
program
  .command("new <type> [title]")
  .description("Create a note from a template")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .argument("<type>", "Note type: project, daily, resource, moc, task")
  .action((type: string, title: string | undefined, opts) => {
    const validTypes: NoteType[] = ["project", "daily", "resource", "moc", "task"];
    if (!validTypes.includes(type as NoteType)) {
      console.error(
        `Error: Invalid type "${type}". Valid types: ${validTypes.join(", ")}`,
      );
      process.exit(1);
    }
    newCommand(type as NoteType, title, opts.vault);
  });

// ─── templates ──────────────────────────────────────────────
program
  .command("templates")
  .description("List available note templates")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .action((opts) => {
    const templates = listTemplates(opts.vault);
    printTemplates(templates);
  });

// ─── status ─────────────────────────────────────────────────
program
  .command("status")
  .description("Check vault health")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .action((opts) => {
    statusCommand(opts.vault);
  });

// ─── update ─────────────────────────────────────────────────
program
  .command("update")
  .description("Update Uteuk prompts and templates")
  .option("--vault <path>", "Path to vault (defaults to current directory)")
  .action((opts) => {
    updateCommand(opts.vault);
  });

program.parse();
