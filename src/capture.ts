import { ensureDirSync, existsSync, writeFileSync } from "fs-extra";
import { join } from "node:path";
import chalk from "chalk";
import { resolveVaultPath } from "./vault.js";

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
  console.log(`\n${chalk.dim("Next: Ask your AI agent to process this note.")}`);
}
