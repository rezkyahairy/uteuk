import {
  existsSync,
  readFileSync,
  writeFileSync,
  copySync,
  readdirSync,
  ensureDirSync,
} from "fs-extra";
import { join } from "node:path";
import chalk from "chalk";
import ora from "ora";
import { resolveVaultPath } from "./vault.js";
import { fileDiff } from "./fs.js";

const ASSET_PATHS = [
  { src: ".uteuk", dest: ".uteuk", type: "directory" as const },
  { src: "templates", dest: "05-Templates", type: "directory" as const },
  { src: "AGENT.md", dest: "AGENT.md", type: "file" as const },
  { src: "CLAUDE.md", dest: "CLAUDE.md", type: "file" as const },
  { src: "QWEN.md", dest: "QWEN.md", type: "file" as const },
  { src: "OPENCLAW.md", dest: "OPENCLAW.md", type: "file" as const },
];

export async function updateCommand(
  vaultPath: string | undefined,
): Promise<void> {
  const resolvedPath = resolveVaultPath(vaultPath);

  if (!existsSync(resolvedPath)) {
    console.error(chalk.red("Error: Vault path does not exist."));
    process.exit(1);
  }

  const spinner = ora("Checking for updates...").start();

  // Compare bundled assets against vault copies
  const changes = await findChanges(resolvedPath);

  if (changes.length === 0) {
    spinner.succeed(chalk.green("Uteuk is up to date. No changes found."));
    return;
  }

  spinner.stop();
  console.log(chalk.bold("\n📦 Updates available:\n"));

  // Show diff and ask for confirmation per file
  const acceptedChanges: string[] = [];
  const skippedChanges: string[] = [];

  for (const change of changes) {
    console.log(chalk.cyan(`\n${change.file}:`));
    if (change.diff.length > 0) {
      console.log(change.diff.join("\n"));
    } else if (change.status === "new") {
      console.log(chalk.green("  New file — will be added"));
    }

    const answer = await prompt(`Update ${change.file}? [Y/n/s(kip)]: `, [
      "y",
      "n",
      "s",
    ]);

    if (answer === "n" || answer === "s") {
      skippedChanges.push(change.file);
      console.log(chalk.dim("  Skipped."));
    } else {
      acceptedChanges.push(change.file);
    }
  }

  // Apply accepted changes
  if (acceptedChanges.length > 0) {
    const applySpinner = ora("Applying updates...").start();
    await applyChanges(resolvedPath, acceptedChanges);
    applySpinner.succeed(
      chalk.green(`Updated ${acceptedChanges.length} file(s).`),
    );
  } else {
    console.log(chalk.yellow("\nNo updates applied."));
  }

  if (skippedChanges.length > 0) {
    console.log(
      chalk.dim(
        `\nSkipped ${skippedChanges.length} file(s): ${skippedChanges.join(", ")}`,
      ),
    );
  }
}

interface FileChange {
  file: string;
  status: "modified" | "new" | "deleted";
  diff: string[];
}

async function findChanges(vaultPath: string): Promise<FileChange[]> {
  const changes: FileChange[] = [];

  for (const asset of ASSET_PATHS) {
    const srcBase = new URL(`../${asset.src}`, import.meta.url).pathname;
    const destBase = join(vaultPath, asset.dest);

    if (asset.type === "file") {
      const srcFile = srcBase;
      const destFile = destBase;

      if (!existsSync(srcFile)) continue;

      if (!existsSync(destFile)) {
        changes.push({
          file: asset.dest,
          status: "new",
          diff: [],
        });
        continue;
      }

      const srcContent = readFileSync(srcFile, "utf-8");
      const destContent = readFileSync(destFile, "utf-8");

      if (srcContent !== destContent) {
        const diff = fileDiff(destContent, srcContent);
        changes.push({
          file: asset.dest,
          status: "modified",
          diff,
        });
      }
    } else if (asset.type === "directory") {
      if (!existsSync(srcBase)) continue;

      const srcFiles = readdirSync(srcBase, { recursive: true }).filter(
        (f) => typeof f === "string" && f.endsWith(".md"),
      ) as string[];

      for (const relPath of srcFiles) {
        const srcFile = join(srcBase, relPath);
        const destFile = join(destBase, relPath);

        if (!existsSync(destFile)) {
          changes.push({
            file: `${asset.dest}/${relPath}`,
            status: "new",
            diff: [],
          });
          continue;
        }

        const srcContent = readFileSync(srcFile, "utf-8");
        const destContent = readFileSync(destFile, "utf-8");

        if (srcContent !== destContent) {
          const diff = fileDiff(destContent, srcContent);
          changes.push({
            file: `${asset.dest}/${relPath}`,
            status: "modified",
            diff,
          });
        }
      }
    }
  }

  return changes;
}

async function applyChanges(
  vaultPath: string,
  acceptedFiles: string[],
): Promise<void> {
  for (const asset of ASSET_PATHS) {
    const srcBase = new URL(`../${asset.src}`, import.meta.url).pathname;
    const destBase = join(vaultPath, asset.dest);

    if (asset.type === "file") {
      if (acceptedFiles.includes(asset.dest) && existsSync(srcBase)) {
        ensureDirSync(join(destBase, ".."));
        copySync(srcBase, destBase);
      }
    } else if (asset.type === "directory") {
      for (const acceptedFile of acceptedFiles) {
        if (acceptedFile.startsWith(asset.dest)) {
          const relPath = acceptedFile.slice(asset.dest.length + 1);
          const srcFile = join(srcBase, relPath);
          const destFile = join(destBase, relPath);
          if (existsSync(srcFile)) {
            ensureDirSync(join(destFile, ".."));
            copySync(srcFile, destFile);
          }
        }
      }
    }
  }
}

async function prompt(
  message: string,
  validOptions: string[],
): Promise<string> {
  const readline = await import("node:readline/promises");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = (await rl.question(chalk.dim("  ") + message))
    .trim()
    .toLowerCase();
  rl.close();

  if (validOptions.includes(answer) || answer === "") {
    return answer === "" ? "y" : answer;
  }

  console.log(
    chalk.yellow("  Invalid option. Please choose: " + validOptions.join(", ")),
  );
  return prompt(message, validOptions);
}
