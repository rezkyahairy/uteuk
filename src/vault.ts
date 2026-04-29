import { existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { execSync } from "node:child_process";
import type { VaultState } from "./types.js";

const PARA_FOLDERS = [
  "00-Inbox",
  "01-Projects",
  "02-Areas",
  "03-Resources",
  "04-Archive",
  "05-Templates",
  "06-Daily",
];

export function detectVaultState(vaultPath: string): VaultState {
  const hasObsidian = existsSync(join(vaultPath, ".obsidian"));
  const hasUteuk = existsSync(join(vaultPath, ".uteuk"));
  const hasPara = PARA_FOLDERS.some((f) => existsSync(join(vaultPath, f)));

  let dirContents: string[] = [];
  try {
    dirContents = readdirSync(vaultPath);
  } catch {
    return "EMPTY";
  }

  const isEmpty = dirContents.length === 0;

  if (isEmpty) return "EMPTY";
  if (hasObsidian && hasUteuk) return "ALREADY_INSTALLED";
  if (hasObsidian) return "EXISTING_VAULT";
  if (hasPara) return "EXISTING_PARA";
  return "NON_EMPTY_DIR";
}

export function resolveVaultPath(input: string | undefined): string {
  if (!input) return process.cwd();
  return resolve(input);
}

export function validateVaultPath(vaultPath: string): boolean {
  return existsSync(vaultPath);
}

export function hasGitRepo(vaultPath: string): boolean {
  return existsSync(join(vaultPath, ".git"));
}

export function hasGitRemote(vaultPath: string): boolean {
  try {
    const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
    execSync(`${gitCmd} remote`, {
      cwd: vaultPath,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return true;
  } catch {
    return false;
  }
}

export function ensureGitRepo(
  vaultPath: string,
  options?: { userName?: string; userEmail?: string },
): void {
  const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
  if (!hasGitRepo(vaultPath)) {
    execSync(`${gitCmd} init`, { cwd: vaultPath });
  }
  if (options?.userName) {
    execSync(`${gitCmd} config user.name "${options.userName}"`, {
      cwd: vaultPath,
    });
  }
  if (options?.userEmail) {
    execSync(`${gitCmd} config user.email "${options.userEmail}"`, {
      cwd: vaultPath,
    });
  }
}

export function addGitRemote(vaultPath: string, url: string): void {
  const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
  try {
    execSync(`${gitCmd} remote add origin ${url}`, {
      cwd: vaultPath,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    execSync(`${gitCmd} remote set-url origin ${url}`, {
      cwd: vaultPath,
      stdio: ["pipe", "pipe", "pipe"],
    });
  }
}

export function getGitUserConfig(): {
  name: string | null;
  email: string | null;
} {
  const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
  let name: string | null = null;
  let email: string | null = null;
  try {
    name = execSync(`${gitCmd} config --global user.name`, {
      encoding: "utf-8",
    }).trim();
  } catch {
    // not configured
  }
  try {
    email = execSync(`${gitCmd} config --global user.email`, {
      encoding: "utf-8",
    }).trim();
  } catch {
    // not configured
  }
  return { name, email };
}
