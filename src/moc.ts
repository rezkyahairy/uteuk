import chalk from "chalk";
import { resolveVaultPath } from "./vault.js";
import {
  getActiveAgentProfile,
  invokeAgent,
  loadPromptTemplate,
  requireAgentOrError,
} from "./agent.js";

export async function mocCommand(
  vaultPath: string | undefined,
  topic: string | undefined,
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);

  if (!topic) {
    console.error(chalk.red("Error: Topic name is required."));
    console.error(chalk.dim(`Usage: uteuk moc "Topic Name"`));
    process.exit(1);
  }

  const agentProfile = getActiveAgentProfile(resolvedPath);
  requireAgentOrError(agentProfile);
  const profile = agentProfile!;

  console.log(
    chalk.dim(`\nBuilding MOC for "${topic}" with ${profile.name}...`),
  );

  try {
    const prompt = await loadPromptTemplate(resolvedPath, "populate-moc");
    const context = `I want to create a Map of Content for the topic: "${topic}". Please scan my vault for related notes and build a structured MOC that links them together.`;
    await invokeAgent(profile, `${prompt}\n\n${context}`, resolvedPath);
  } catch {
    console.log(chalk.dim("\nAgent finished building MOC."));
  }
}
