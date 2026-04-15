import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };

const program = new Command();

program
  .name("uteuk")
  .description("AI-assisted Second Brain CLI")
  .version(pkg.version);

program.parse();
