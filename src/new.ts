import { existsSync, ensureDirSync, writeFileSync, readFileSync, readdirSync } from "fs-extra";
import { join } from "node:path";
import chalk from "chalk";
import type { NoteType } from "./types.js";
import { resolveVaultPath } from "./vault.js";

const NOTE_TYPE_MAP: Record<NoteType, string> = {
  project: "01-Projects",
  daily: "06-Daily",
  resource: "03-Resources",
  moc: "03-Resources",
  task: "00-Inbox",
};

export async function newCommand(
  noteType: NoteType,
  title: string | undefined,
  vaultPath: string | undefined,
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);
  const targetDir = join(resolvedPath, NOTE_TYPE_MAP[noteType]);
  const templatesDir = join(resolvedPath, "05-Templates");

  if (!existsSync(templatesDir)) {
    console.error(
      chalk.red("Error: No templates found.") +
        `\nRun ${chalk.cyan("uteuk init")} to install Uteuk into your vault.`,
    );
    process.exit(1);
  }

  // Determine template file
  const templateFile = getTemplateFile(noteType, templatesDir);
  if (!templateFile) {
    console.error(
      chalk.red(`Error: Template for "${noteType}" not found in 05-Templates/`),
    );
    process.exit(1);
  }

  // Ensure target directory exists
  ensureDirSync(targetDir);

  // Generate filename
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const noteName = title || defaultNoteName(noteType, dateStr);
  const fileName = `${noteName}.md`;

  // Read template and substitute
  const templateContent = readFileSync(join(templatesDir, templateFile), "utf-8");
  const content = substituteFrontmatter(templateContent, dateStr);

  const filePath = join(targetDir, fileName);
  writeFileSync(filePath, content, "utf-8");
  console.log(chalk.green(`✓ ${noteType} note created: ${filePath}`));
}

function getTemplateFile(noteType: NoteType, templatesDir: string): string | null {
  const typeToFile: Record<NoteType, string> = {
    project: "Project.md",
    daily: "Daily Note.md",
    resource: "Resource.md",
    moc: "MOC.md",
    task: "Task.md",
  };

  const candidate = typeToFile[noteType];
  const full = join(templatesDir, candidate);
  if (existsSync(full)) return candidate;

  // Fallback: try case-insensitive match
  const allTemplates = readdirSync(templatesDir);
  const match = allTemplates.find(
    (f: string) => f.toLowerCase().startsWith(noteType.toLowerCase()) && f.endsWith(".md"),
  );
  return match || null;
}

function substituteFrontmatter(content: string, dateStr: string): string {
  return content
    .replace(/{{date}}/g, dateStr)
    .replace(/{{time}}/g, new Date().toTimeString().split(" ")[0])
    .replace(/{{title}}/g, "")
    .replace(/\{\{(\w+)\}\}/g, "");
}

function defaultNoteName(type: NoteType, dateStr: string): string {
  switch (type) {
    case "daily":
      return dateStr;
    case "project":
      return `project-${dateStr}`;
    case "resource":
      return `resource-${dateStr}`;
    case "moc":
      return `moc-${dateStr}`;
    case "task":
      return `task-${dateStr}`;
    default:
      return `${type}-${dateStr}`;
  }
}
