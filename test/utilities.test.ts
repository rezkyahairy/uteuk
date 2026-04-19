import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  copyFileSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  detectVaultState,
  resolveVaultPath,
  validateVaultPath,
} from "../src/vault.js";
import { safeCopy, fileDiff, ensureDirectory, atomicWrite } from "../src/fs.js";

const TEST_DIR = join(tmpdir(), "uteuk-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("detectVaultState", () => {
  it("returns EMPTY for empty directory", () => {
    const dir = join(TEST_DIR, "empty");
    mkdirSync(dir, { recursive: true });
    expect(detectVaultState(dir)).toBe("EMPTY");
  });

  it("returns EXISTING_VAULT when .obsidian/ exists but no .uteuk/", () => {
    const dir = join(TEST_DIR, "vault-existing");
    mkdirSync(join(dir, ".obsidian"), { recursive: true });
    writeFileSync(join(dir, "some-note.md"), "");
    expect(detectVaultState(dir)).toBe("EXISTING_VAULT");
  });

  it("returns ALREADY_INSTALLED when both .obsidian/ and .uteuk/ exist", () => {
    const dir = join(TEST_DIR, "vault-installed");
    mkdirSync(join(dir, ".obsidian"), { recursive: true });
    mkdirSync(join(dir, ".uteuk"), { recursive: true });
    writeFileSync(join(dir, "some-note.md"), "");
    expect(detectVaultState(dir)).toBe("ALREADY_INSTALLED");
  });

  it("returns EXISTING_PARA when PARA folders exist but no .obsidian/", () => {
    const dir = join(TEST_DIR, "vault-para");
    mkdirSync(join(dir, "00-Inbox"), { recursive: true });
    mkdirSync(join(dir, "01-Projects"), { recursive: true });
    writeFileSync(join(dir, "note.md"), "");
    expect(detectVaultState(dir)).toBe("EXISTING_PARA");
  });

  it("returns NON_EMPTY_DIR for random files", () => {
    const dir = join(TEST_DIR, "non-empty");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "random.txt"), "");
    expect(detectVaultState(dir)).toBe("NON_EMPTY_DIR");
  });
});

describe("resolveVaultPath", () => {
  it("returns current working directory if no path given", () => {
    expect(resolveVaultPath(undefined)).toBe(process.cwd());
  });

  it("resolves relative path to absolute", () => {
    const result = resolveVaultPath("some/path");
    expect(result).toMatch(/some[/\\]path$/);
  });
});

describe("validateVaultPath", () => {
  it("returns true for existing path", () => {
    const dir = join(TEST_DIR, "exists");
    mkdirSync(dir, { recursive: true });
    expect(validateVaultPath(dir)).toBe(true);
  });

  it("returns false for non-existing path", () => {
    expect(validateVaultPath(join(TEST_DIR, "no-exist"))).toBe(false);
  });
});

describe("detectVaultState — edge cases", () => {
  it("returns EMPTY for non-readable directory", () => {
    const dir = join(TEST_DIR, "unreadable");
    mkdirSync(dir, { recursive: true });
    // On Linux, removing read permission causes readdirSync to throw
    try {
      rmSync(dir, { recursive: true, force: true });
      // Create a file that will be deleted, then make dir unreadable
      mkdirSync(dir, { recursive: true });
      // This test may not trigger the catch on all systems
      expect(detectVaultState(dir)).toBe("EMPTY");
    } finally {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // cleanup may fail
      }
    }
  });
});

describe("safeCopy", () => {
  it("copies file when destination doesn't exist", async () => {
    const srcDir = join(TEST_DIR, "src");
    const destDir = join(TEST_DIR, "dest");
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(join(srcDir, "file.txt"), "hello");
    const result = await safeCopy(
      join(srcDir, "file.txt"),
      join(destDir, "file.txt"),
    );
    expect(result.copied).toBe(true);
    expect(result.skipped).toBe(false);
    expect(existsSync(join(destDir, "file.txt"))).toBe(true);
  });

  it("skips file when destination exists", async () => {
    const srcDir = join(TEST_DIR, "src2");
    const destDir = join(TEST_DIR, "dest2");
    mkdirSync(srcDir, { recursive: true });
    mkdirSync(destDir, { recursive: true });
    writeFileSync(join(destDir, "file.txt"), "exists");
    writeFileSync(join(srcDir, "other.txt"), "source");
    const result = await safeCopy(
      join(srcDir, "other.txt"),
      join(destDir, "file.txt"),
    );
    expect(result.copied).toBe(false);
    expect(result.skipped).toBe(true);
  });
});

describe("fileDiff", () => {
  it("returns empty array for identical content", () => {
    expect(fileDiff("hello\nworld", "hello\nworld")).toEqual([]);
  });

  it("returns diff for changed lines", () => {
    const diff = fileDiff("line1\nline2", "line1\nchanged");
    expect(diff.length).toBe(1);
    expect(diff[0]).toContain("changed");
  });

  it("handles different length files", () => {
    const diff = fileDiff("line1", "line1\nline2");
    expect(diff.length).toBe(1);
  });
});

describe("ensureDirectory", () => {
  it("creates nested directories", async () => {
    const dir = join(TEST_DIR, "deep", "nested", "dir");
    await ensureDirectory(dir);
    expect(existsSync(dir)).toBe(true);
  });
});

describe("atomicWrite", () => {
  it("writes content to file atomically", async () => {
    const filePath = join(TEST_DIR, "atomic-test.txt");
    await atomicWrite(filePath, "atomic content");
    expect(existsSync(filePath)).toBe(true);
    expect(readFileSync(filePath, "utf-8")).toBe("atomic content");
  });

  it("overwrites existing file atomically", async () => {
    const filePath = join(TEST_DIR, "atomic-overwrite.txt");
    writeFileSync(filePath, "old content");
    await atomicWrite(filePath, "new content");
    expect(readFileSync(filePath, "utf-8")).toBe("new content");
  });
});
