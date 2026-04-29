import fs from "fs-extra";
import { join } from "node:path";
import chalk from "chalk";
import { resolveVaultPath } from "./vault.js";
import {
  getActiveAgentProfile,
  isAgentInstalled,
  invokeAgent,
  loadPromptTemplate,
} from "./agent.js";

const { ensureDirSync, existsSync, writeFileSync } = fs;

export async function captureCommand(
  text: string | undefined,
  vaultPath: string | undefined,
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);
  const inboxDir = join(resolvedPath, "00-Inbox");

  if (!existsSync(inboxDir)) {
    ensureDirSync(inboxDir);
  }

  const noteText = text || "Untitled idea";
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const timestamp = date.toISOString().replace(/[:.]/g, "-").slice(0, -5);

  // Sanitize filename from first few words
  const slug = noteText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);

  const fileName = `${timestamp}-${slug}.md`;
  const filePath = join(inboxDir, fileName);

  const content = `---
created: ${dateStr}
tags: [fleeting]
---

# ${noteText}

`;

  writeFileSync(filePath, content, "utf-8");
  console.log(chalk.green(`✓ Note created: ${filePath}`));

  // AI enhancement: invoke agent with capture prompt
  const agentProfile = getActiveAgentProfile(resolvedPath);
  if (agentProfile && isAgentInstalled(agentProfile)) {
    console.log(
      chalk.dim(`\nInvoking ${agentProfile.name} to expand this note...`),
    );
    try {
      const prompt = await loadPromptTemplate(resolvedPath, "capture");
      const context = `I just captured this idea: "${noteText}". It was saved to ${fileName}. Please expand this note with context, suggest tags, and link to any related notes in the vault.`;
      await invokeAgent(agentProfile, `${prompt}\n\n${context}`, resolvedPath);
    } catch {
      console.log(chalk.dim("\nAgent finished. Note created at: " + filePath));
    }
  } else if (agentProfile && !isAgentInstalled(agentProfile)) {
    console.error(
      chalk.dim(
        `\nAgent "${agentProfile.name}" not installed, using raw capture. Install: ${agentProfile.installInstructions}`,
      ),
    );
  }
}
