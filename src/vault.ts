import { existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
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
