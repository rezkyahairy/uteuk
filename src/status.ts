import { existsSync, readdirSync, readFileSync } from "fs-extra";
import { join } from "node:path";
import chalk from "chalk";
import type { VaultStatus } from "./types.js";
import { resolveVaultPath } from "./vault.js";

const STALE_DAYS = 30;

export async function statusCommand(vaultPath: string | undefined): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);

  if (!existsSync(resolvedPath)) {
    console.error(chalk.red("Error: Vault path does not exist."));
    process.exit(1);
  }

  const status = await scanVault(resolvedPath);
  printStatus(status);
}

async function scanVault(vaultPath: string): Promise<VaultStatus> {
  const inboxDir = join(vaultPath, "00-Inbox");
  const inboxCount = existsSync(inboxDir)
    ? readdirSync(inboxDir).filter((f) => f.endsWith(".md")).length
    : 0;

  const orphanedNotes = await findOrphanedNotes(vaultPath);
  const staleMocs = await findStaleMocs(vaultPath);
  const lastSync = await getLastSyncDate(vaultPath);
  const projectHealth = await getProjectHealth(vaultPath);

  return { inboxCount, orphanedNotes, staleMocs, lastSync, projectHealth };
}

async function findOrphanedNotes(vaultPath: string): Promise<string[]> {
  const orphaned: string[] = [];
  const dirsToScan = [
    "00-Inbox",
    "01-Projects",
    "02-Areas",
    "03-Resources",
    "06-Daily",
  ];

  for (const dir of dirsToScan) {
    const fullPath = join(vaultPath, dir);
    if (!existsSync(fullPath)) continue;

    const files = readdirSync(fullPath).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const content = readFileSync(join(fullPath, file), "utf-8");
      if (!content.includes("[[")) {
        orphaned.push(`${dir}/${file}`);
      }
    }
  }

  return orphaned;
}

async function findStaleMocs(vaultPath: string): Promise<{ name: string; lastUpdated: Date }[]> {
  const stale: { name: string; lastUpdated: Date }[] = [];
  const mocDir = join(vaultPath, "03-Resources");

  if (!existsSync(mocDir)) return stale;

  const files = readdirSync(mocDir).filter((f) => f.endsWith(".md"));
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - STALE_DAYS);

  for (const file of files) {
    const content = readFileSync(join(mocDir, file), "utf-8");
    const dateMatch = content.match(/updated:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const lastUpdated = new Date(dateMatch[1]);
      if (lastUpdated < cutoffDate) {
        stale.push({ name: file, lastUpdated });
      }
    }
  }

  return stale;
}

async function getLastSyncDate(vaultPath: string): Promise<Date | null> {
  try {
    const { execSync } = await import("node:child_process");
    const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
    const output = execSync(`${gitCmd} log -1 --format=%ci`, {
      cwd: vaultPath,
      encoding: "utf-8",
    }).trim();
    return output ? new Date(output) : null;
  } catch {
    return null;
  }
}

async function getProjectHealth(
  vaultPath: string,
): Promise<{ name: string; status: string }[]> {
  const projects: { name: string; status: string }[] = [];
  const projectDir = join(vaultPath, "01-Projects");

  if (!existsSync(projectDir)) return projects;

  const files = readdirSync(projectDir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const content = readFileSync(join(projectDir, file), "utf-8");
    const statusMatch = content.match(/status:\s*(\S+)/);
    const status = statusMatch ? statusMatch[1] : "unknown";
    projects.push({ name: file.replace(".md", ""), status });
  }

  return projects;
}

function printStatus(status: VaultStatus): void {
  console.log(chalk.bold("\n🧠 Uteuk Vault Status\n"));

  // Inbox
  const inboxColor = status.inboxCount > 0 ? chalk.yellow : chalk.green;
  console.log(
    `${chalk.bold("📥 Inbox:")} ${inboxColor(status.inboxCount + " notes")}${status.inboxCount > 0 ? " (needs processing)" : ""}`,
  );

  // Orphaned notes
  if (status.orphanedNotes.length > 0) {
    console.log(
      `\n${chalk.bold("🔗 Orphaned Notes:")} ${chalk.yellow(status.orphanedNotes.length + " found")}`,
    );
    for (const note of status.orphanedNotes.slice(0, 5)) {
      console.log(`  ${chalk.dim("- " + note)}`);
    }
    if (status.orphanedNotes.length > 5) {
      console.log(chalk.dim(`  ... and ${status.orphanedNotes.length - 5} more`));
    }
  } else {
    console.log(`\n${chalk.bold("🔗 Orphaned Notes:")} ${chalk.green("None")}`);
  }

  // Stale MOCs
  if (status.staleMocs.length > 0) {
    console.log(
      `\n${chalk.bold("📑 Stale MOCs:")} ${chalk.red(status.staleMocs.length + " not updated in 30+ days")}`,
    );
    for (const moc of status.staleMocs) {
      console.log(
        `  ${chalk.dim("- " + moc.name + " (last: " + moc.lastUpdated.toISOString().split("T")[0] + ")")}`,
      );
    }
  }

  // Last sync
  if (status.lastSync) {
    console.log(
      `\n${chalk.bold("🔄 Last Sync:")} ${chalk.cyan(status.lastSync.toISOString().split("T")[0])}`,
    );
  } else {
    console.log(`\n${chalk.bold("🔄 Last Sync:")} ${chalk.dim("Not tracked (no git)")}`);
  }

  // Project health
  if (status.projectHealth.length > 0) {
    console.log(`\n${chalk.bold("📁 Projects:")}`);
    for (const proj of status.projectHealth) {
      const statusColor =
        proj.status === "active" ? chalk.green : proj.status === "completed" ? chalk.dim : chalk.yellow;
      console.log(`  ${chalk.cyan(proj.name)} ${statusColor("(" + proj.status + ")")}`);
    }
  }

  console.log();
}
