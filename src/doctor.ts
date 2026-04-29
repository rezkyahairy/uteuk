import { existsSync, constants } from "node:fs";
import { accessSync } from "node:fs";
import { execSync } from "node:child_process";
import chalk from "chalk";
import type { DoctorCheck, DoctorResult } from "./types.js";

const MIN_NODE_MAJOR = 24;

export function checkNodeVersion(): DoctorCheck {
  const major = parseInt(process.versions.node.split(".")[0], 10);
  if (major >= MIN_NODE_MAJOR) {
    return {
      name: "Node.js",
      passed: true,
      message: `Node.js ${process.versions.node}`,
    };
  }
  return {
    name: "Node.js",
    passed: false,
    message: `Node.js ${process.versions.node} (requires >= ${MIN_NODE_MAJOR}.0)`,
    fix: "Upgrade Node.js: https://nodejs.org or use nvm: nvm install 24",
  };
}

export function checkGitAvailable(): DoctorCheck {
  try {
    const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
    const output = execSync(`${gitCmd} --version`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    const version = output.replace(/^git version\s*/, "");
    return {
      name: "git",
      passed: true,
      message: `git ${version}`,
    };
  } catch {
    return {
      name: "git",
      passed: false,
      message: "git not found",
      fix:
        process.platform === "darwin"
          ? "Install: brew install git"
          : process.platform === "linux"
            ? "Install: sudo apt install git"
            : "Install: https://git-scm.com/downloads",
    };
  }
}

export function checkVaultPath(vaultPath: string): DoctorCheck {
  if (!existsSync(vaultPath)) {
    return {
      name: "Vault path",
      passed: false,
      message: `Path does not exist: ${vaultPath}`,
      fix: `Create the directory: mkdir -p "${vaultPath}"`,
    };
  }
  try {
    accessSync(vaultPath, constants.W_OK);
    return {
      name: "Vault path",
      passed: true,
      message: `Exists and writable: ${vaultPath}`,
    };
  } catch {
    return {
      name: "Vault path",
      passed: false,
      message: `Path exists but is not writable: ${vaultPath}`,
      fix: "Check directory permissions",
    };
  }
}

export function runPreflight(vaultPath: string): DoctorResult {
  const checks: DoctorCheck[] = [
    checkNodeVersion(),
    checkGitAvailable(),
    checkVaultPath(vaultPath),
  ];
  const passed = checks.every((c) => c.passed);
  return { checks, passed };
}

export function printDoctorOutput(result: DoctorResult): void {
  for (const check of result.checks) {
    const icon = check.passed ? chalk.green("✓") : chalk.red("✗");
    console.log(`  ${icon} ${check.message}`);
    if (!check.passed && check.fix) {
      console.log(`    ${chalk.yellow("→")} ${check.fix}`);
    }
  }
  console.log();
  if (!result.passed) {
    console.log(
      chalk.red(
        "Pre-flight checks failed. Fix the issues above and try again.",
      ),
    );
  }
}
