import { existsSync, readdirSync, readFileSync } from "fs-extra";
import { join } from "node:path";
import chalk from "chalk";
import type { TemplateInfo } from "./types.js";
import { resolveVaultPath } from "./vault.js";

export function listTemplates(vaultPath: string | undefined): TemplateInfo[] {
  const resolvedPath = resolveVaultPath(vaultPath);
  const templatesDir = join(resolvedPath, "05-Templates");

  if (!existsSync(templatesDir)) {
    console.log(
      chalk.yellow("No templates found. Run `uteuk init` to install them."),
    );
    return [];
  }

  const files = readdirSync(templatesDir).filter((f) => f.endsWith(".md"));

  return files.map((file) => {
    const name = file.replace(".md", "");
    // Try to extract description from frontmatter or first heading
    const content = readFileSync(join(templatesDir, file), "utf-8");
    const description = extractDescription(content);
    return { name, description, file };
  });
}

function extractDescription(content: string): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, "");
  // Try to get first heading text
  const headingMatch = withoutFrontmatter.match(/^# (.+)$/m);
  if (headingMatch) return headingMatch[1];
  // Fallback: first non-empty line
  const firstLine = withoutFrontmatter.split("\n").find((l) => l.trim());
  return firstLine?.slice(0, 80) || "";
}

export function printTemplates(templates: TemplateInfo[]): void {
  if (templates.length === 0) return;

  console.log(chalk.bold("\nAvailable templates:\n"));
  for (const t of templates) {
    console.log(
      `  ${chalk.cyan(t.name.padEnd(25))} ${chalk.dim(t.description)}`,
    );
  }
  console.log();
}
