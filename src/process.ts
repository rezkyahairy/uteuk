import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";
import { resolveVaultPath } from "./vault.js";
import {
  getActiveAgentProfile,
  isAgentInstalled,
  invokeAgent,
  loadPromptTemplate,
  requireAgentOrError,
} from "./agent.js";

export async function processCommand(
  vaultPath: string | undefined,
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);
  const inboxDir = join(resolvedPath, "00-Inbox");

  if (!existsSync(inboxDir)) {
    console.log(
      chalk.yellow("No Inbox directory found. Run `uteuk init` first."),
    );
    return;
  }

  const files = readdirSync(inboxDir).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log(chalk.green("✓ No notes to process. Inbox is empty!"));
    return;
  }

  const agentProfile = getActiveAgentProfile(resolvedPath);
  requireAgentOrError(agentProfile);
  const profile = agentProfile!;

  console.log(
    chalk.dim(`\nProcessing ${files.length} note(s) with ${profile.name}...`),
  );

  try {
    const prompt = await loadPromptTemplate(resolvedPath, "process");
    const fileList = files.map((f) => `  - ${f}`).join("\n");
    const context = `I have ${files.length} note(s) in my Inbox that need processing:\n${fileList}\n\nPlease read each note, summarize key points, suggest tags, recommend PARA folder placement, and identify any connections to existing notes.`;
    await invokeAgent(profile, `${prompt}\n\n${context}`, resolvedPath);
  } catch {
    console.log(chalk.dim("\nAgent finished processing."));
  }
}
