import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";
import { resolveVaultPath } from "./vault.js";
import {
  getActiveAgentProfile,
  invokeAgent,
  loadPromptTemplate,
  requireAgentOrError,
} from "./agent.js";

export async function weeklyReviewCommand(
  vaultPath: string | undefined,
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);
  const inboxDir = join(resolvedPath, "00-Inbox");

  // Check vault has enough content for a meaningful review
  let noteCount = 0;
  if (existsSync(inboxDir)) {
    noteCount = readdirSync(inboxDir).filter((f) => f.endsWith(".md")).length;
  }

  if (noteCount === 0) {
    console.log(
      chalk.yellow(
        "Vault is too new for a weekly review. Start capturing some notes first!",
      ),
    );
    return;
  }

  const agentProfile = getActiveAgentProfile(resolvedPath);
  requireAgentOrError(agentProfile);
  const profile = agentProfile!;

  console.log(chalk.dim(`\nRunning weekly review with ${profile.name}...`));

  try {
    const prompt = await loadPromptTemplate(resolvedPath, "weekly-review");
    const context = `Please conduct a comprehensive weekly review of my vault. Analyze inbox backlog, project health, stale MOCs, orphaned notes, and suggest actions for the week ahead.`;
    await invokeAgent(profile, `${prompt}\n\n${context}`, resolvedPath);
  } catch {
    console.log(chalk.dim("\nWeekly review complete."));
  }
}
