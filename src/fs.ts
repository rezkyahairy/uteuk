import fs from "fs-extra";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";

const { copy, ensureDir, exists, readFile, writeFile, rename } = fs;

/**
 * Copy a file only if destination doesn't exist (safe copy).
 * Returns true if copied, false if skipped.
 */
export async function safeCopy(
  src: string,
  dest: string,
): Promise<{ copied: boolean; skipped: boolean }> {
  if (await exists(dest)) {
    return { copied: false, skipped: true };
  }
  await copy(src, dest);
  return { copied: true, skipped: false };
}

/**
 * Atomic write: write to a temp file, then rename.
 * Prevents partial writes on failure.
 */
export async function atomicWrite(
  dest: string,
  content: string,
): Promise<void> {
  const tmpFile = `${dest}.${randomUUID()}.tmp`;
  await writeFile(tmpFile, content, "utf-8");
  await rename(tmpFile, dest);
}

/**
 * Generate a simple diff between two strings.
 * Returns lines that differ.
 */
export function fileDiff(original: string, updated: string): string[] {
  const origLines = original.split("\n");
  const updLines = updated.split("\n");
  const diff: string[] = [];

  const maxLen = Math.max(origLines.length, updLines.length);
  for (let i = 0; i < maxLen; i++) {
    const orig = origLines[i] ?? "<missing>";
    const upd = updLines[i] ?? "<missing>";
    if (orig !== upd) {
      diff.push(`  Line ${i + 1}: "${orig}" → "${upd}"`);
    }
  }
  return diff;
}

/**
 * Wrapper around fs-extra ensureDir with explicit return.
 */
export async function ensureDirectory(dir: string): Promise<void> {
  await ensureDir(dir);
}
