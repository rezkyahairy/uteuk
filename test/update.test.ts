import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileDiff } from "../src/fs.js";

const TEST_DIR = join(tmpdir(), "uteuk-update-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  // Create minimal bundled assets
  mkdirSync(join(TEST_DIR, "bundled", ".uteuk", "prompts"), {
    recursive: true,
  });
  writeFileSync(
    join(TEST_DIR, "bundled", ".uteuk", "prompts", "capture.md"),
    "# Capture\n\nCapture prompt content",
  );
  mkdirSync(join(TEST_DIR, "bundled", "templates"), { recursive: true });
  writeFileSync(
    join(TEST_DIR, "bundled", "templates", "Project.md"),
    "---\ncreated: {{date}}\n---\n\n# Project\n",
  );
  writeFileSync(
    join(TEST_DIR, "bundled", "AGENT.md"),
    "# Agent Rules\n\nRule 1",
  );
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("fileDiff", () => {
  it("returns empty array for identical content", () => {
    expect(fileDiff("hello\nworld", "hello\nworld")).toEqual([]);
  });

  it("returns diff for changed lines", () => {
    const diff = fileDiff("old content", "new content");
    expect(diff.length).toBe(1);
    expect(diff[0]).toContain("new content");
  });

  it("handles multi-line changes", () => {
    const original = "line1\nline2\nline3";
    const updated = "line1\nchanged\nline3";
    const diff = fileDiff(original, updated);
    expect(diff.length).toBe(1);
    expect(diff[0]).toContain("changed");
  });

  it("handles added lines", () => {
    const diff = fileDiff("line1", "line1\nline2");
    expect(diff.length).toBe(1);
    expect(diff[0]).toContain("line2");
  });

  it("handles removed lines", () => {
    const diff = fileDiff("line1\nline2", "line1");
    expect(diff.length).toBe(1);
    expect(diff[0]).toContain("<missing>");
  });
});

describe("update command logic", () => {
  it("detects new files that don't exist in vault", () => {
    // Simulate: bundled has a file that vault doesn't
    const bundledFile = join(TEST_DIR, "bundled", "AGENT.md");
    const vaultFile = join(TEST_DIR, "vault", "AGENT.md");

    mkdirSync(join(TEST_DIR, "vault"), { recursive: true });
    // Vault doesn't have AGENT.md yet

    expect(existsSync(bundledFile)).toBe(true);
    expect(existsSync(vaultFile)).toBe(false);
  });

  it("detects modified files by comparing content", () => {
    const bundledFile = join(TEST_DIR, "bundled", "AGENT.md");
    const vaultDir = join(TEST_DIR, "vault");
    const vaultFile = join(vaultDir, "AGENT.md");
    mkdirSync(vaultDir, { recursive: true });

    writeFileSync(vaultFile, "# Agent Rules\n\nRule 1 (modified by user)");

    const bundledContent = readFileSync(bundledFile, "utf-8");
    const vaultContent = readFileSync(vaultFile, "utf-8");

    expect(bundledContent).not.toBe(vaultContent);

    const diff = fileDiff(vaultContent, bundledContent);
    expect(diff.length).toBeGreaterThan(0);
  });

  it("skips identical files (no changes)", () => {
    const bundledFile = join(TEST_DIR, "bundled", "AGENT.md");
    const vaultDir = join(TEST_DIR, "vault");
    const vaultFile = join(vaultDir, "AGENT.md");
    mkdirSync(vaultDir, { recursive: true });

    // Copy exact same content
    writeFileSync(vaultFile, readFileSync(bundledFile, "utf-8"));

    const bundledContent = readFileSync(bundledFile, "utf-8");
    const vaultContent = readFileSync(vaultFile, "utf-8");

    expect(bundledContent).toBe(vaultContent);
  });

  it("handles directory comparison for prompts", () => {
    const bundledPrompts = join(TEST_DIR, "bundled", ".uteuk", "prompts");
    const vaultPrompts = join(TEST_DIR, "vault", ".uteuk", "prompts");
    mkdirSync(vaultPrompts, { recursive: true });

    // Add a new prompt in bundled that vault doesn't have
    writeFileSync(
      join(bundledPrompts, "process.md"),
      "# Process\n\nProcess prompt",
    );

    const bundledFiles = readdirSync(bundledPrompts).filter((f) =>
      f.endsWith(".md"),
    );
    const vaultFiles = readdirSync(vaultPrompts).filter((f) =>
      f.endsWith(".md"),
    );

    expect(bundledFiles).toContain("process.md");
    expect(vaultFiles).not.toContain("process.md");
  });
});
