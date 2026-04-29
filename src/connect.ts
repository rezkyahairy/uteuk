import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";
import { resolveVaultPath } from "./vault.js";
import {
  getActiveAgentProfile,
  invokeAgent,
  loadPromptTemplate,
  requireAgentOrError,
} from "./agent.js";

export async function connectCommand(
  vaultPath: string | undefined,
  noteA: string,
  noteB: string,
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);

  if (!noteA || !noteB) {
    console.error(chalk.red("Error: Two note references are required."));
    console.error(chalk.dim(`Usage: uteuk connect "[[Note A]]" "[[Note B]]"`));
    process.exit(1);
  }

  // Strip [[ ]] if present
  const fileA = noteA.replace(/\[\[|\]\]/g, "");
  const fileB = noteB.replace(/\[\[|\]\]/g, "");

  const pathA = findNoteFile(resolvedPath, fileA);
  const pathB = findNoteFile(resolvedPath, fileB);

  if (!pathA) {
    console.error(chalk.red(`Error: Note "${fileA}" not found.`));
    process.exit(1);
  }
  if (!pathB) {
    console.error(chalk.red(`Error: Note "${fileB}" not found.`));
    process.exit(1);
  }

  const agentProfile = getActiveAgentProfile(resolvedPath);
  requireAgentOrError(agentProfile);
  const profile = agentProfile!;

  const contentA = readFileSync(pathA, "utf-8");
  const contentB = readFileSync(pathB, "utf-8");

  console.log(
    chalk.dim(`\nAnalyzing connections between ${fileA} and ${fileB}...`),
  );

  try {
    const prompt = await loadPromptTemplate(resolvedPath, "connect");
    const context = `Here are two notes I want to find connections between:\n\n--- Note A: ${fileA} ---\n${contentA}\n\n--- Note B: ${fileB} ---\n${contentB}\n\nWhat connections, themes, or relationships exist between these two notes?`;
    await invokeAgent(profile, `${prompt}\n\n${context}`, resolvedPath);
  } catch {
    console.log(chalk.dim("\nAgent finished analyzing."));
  }
}

function findNoteFile(vaultPath: string, name: string): string | null {
  const searchDirs = [
    "00-Inbox",
    "01-Projects",
    "02-Areas",
    "03-Resources",
    "06-Daily",
  ];

  for (const dir of searchDirs) {
    const fullPath = join(vaultPath, dir);
    if (!existsSync(fullPath)) continue;

    const files = require("node:fs")
      .readdirSync(fullPath)
      .filter((f: string) => f.endsWith(".md"));

    // Exact match (with or without .md)
    const exact = files.find(
      (f: string) =>
        f === name || f === `${name}.md` || f.replace(".md", "") === name,
    );
    if (exact) return join(fullPath, exact);
  }

  return null;
}
