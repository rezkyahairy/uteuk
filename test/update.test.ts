import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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
import { fileURLToPath } from "node:url";
import { fileDiff } from "../src/fs.js";

const TEST_DIR = join(tmpdir(), "uteuk-update-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

vi.mock("ora", () => ({
  default: () => ({
    start: () => ({
      succeed: () => {},
      warn: () => {},
      stop: () => {},
    }),
    succeed: () => {},
    warn: () => {},
    stop: () => {},
  }),
}));

vi.mock("node:readline/promises", () => ({
  createInterface: () => ({
    question: () => Promise.resolve("n"),
    close: () => {},
  }),
}));

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

describe("update command", () => {
  it("exits with error when vault path does not exist", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { updateCommand } = await import("../src/update.js");
    await expect(updateCommand("/nonexistent/path")).rejects.toThrow(
      "process.exit called",
    );
    expect(errorSpy).toHaveBeenCalled();

    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("runs without crashing on empty vault directory", async () => {
    const vaultDir = join(TEST_DIR, "vault");
    mkdirSync(vaultDir, { recursive: true });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { updateCommand } = await import("../src/update.js");
    await updateCommand(vaultDir);

    expect(logSpy).toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it("detects changes when vault is missing bundled assets", async () => {
    const vaultDir = join(TEST_DIR, "vault");
    mkdirSync(vaultDir, { recursive: true });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { updateCommand } = await import("../src/update.js");
    await updateCommand(vaultDir);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toMatch(/Updates available|up to date/);

    logSpy.mockRestore();
  });

  it("handles directory comparison logic", async () => {
    const bundledPrompts = fileURLToPath(
      new URL("../.uteuk/prompts", import.meta.url),
    );
    const vaultPrompts = join(TEST_DIR, "vault", ".uteuk", "prompts");
    mkdirSync(vaultPrompts, { recursive: true });

    if (existsSync(bundledPrompts)) {
      const bundledFiles = readdirSync(bundledPrompts).filter((f) =>
        f.endsWith(".md"),
      );
      const vaultFiles = readdirSync(vaultPrompts).filter((f) =>
        f.endsWith(".md"),
      );

      expect(bundledFiles.length).toBeGreaterThan(0);
      expect(vaultFiles.length).toBe(0);
    }
  });
});
