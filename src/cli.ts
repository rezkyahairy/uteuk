import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };
import { initCommand } from "./init.js";
import { captureCommand } from "./capture.js";

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

program.parse();
