import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  existsSync,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { initCommand } from "../src/init.js";

const TEST_DIR = join(tmpdir(), "uteuk-init-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("init command — existing vault mode", () => {
  it("installs GEMINI.md into existing vault", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    await initCommand(TEST_DIR, { existing: true });

    const geminiPath = join(TEST_DIR, "GEMINI.md");
    expect(existsSync(geminiPath)).toBe(true);
    const content = readFileSync(geminiPath, "utf-8");
    expect(content.length).toBeGreaterThan(0);
  });

  it("installs OPENCODE.md into existing vault", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    await initCommand(TEST_DIR, { existing: true });

    const opencodePath = join(TEST_DIR, "OPENCODE.md");
    expect(existsSync(opencodePath)).toBe(true);
    const content = readFileSync(opencodePath, "utf-8");
    expect(content.length).toBeGreaterThan(0);
  });

  it("does not overwrite existing agent config files", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    const existingContent =
      "---\ncreated: 2026-01-01\n---\n\nMy custom GEMINI config\n";
    writeFileSync(join(TEST_DIR, "GEMINI.md"), existingContent);
    writeFileSync(join(TEST_DIR, "OPENCODE.md"), existingContent);

    await initCommand(TEST_DIR, { existing: true });

    expect(readFileSync(join(TEST_DIR, "GEMINI.md"), "utf-8")).toBe(
      existingContent,
    );
    expect(readFileSync(join(TEST_DIR, "OPENCODE.md"), "utf-8")).toBe(
      existingContent,
    );
  });

  it("installs all 6 agent configs in existing vault mode", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    await initCommand(TEST_DIR, { existing: true });

    const expectedConfigs = [
      "AGENT.md",
      "CLAUDE.md",
      "GEMINI.md",
      "OPENCODE.md",
      "QWEN.md",
      "OPENCLAW.md",
    ];
    for (const config of expectedConfigs) {
      expect(existsSync(join(TEST_DIR, config))).toBe(true);
    }
  });
});

describe("init command — from-scratch mode", () => {
  it("installs all 6 agent configs in from-scratch mode", async () => {
    await initCommand(TEST_DIR, { fromScratch: true });

    const expectedConfigs = [
      "AGENT.md",
      "CLAUDE.md",
      "GEMINI.md",
      "OPENCODE.md",
      "QWEN.md",
      "OPENCLAW.md",
    ];
    for (const config of expectedConfigs) {
      expect(existsSync(join(TEST_DIR, config))).toBe(true);
    }
  });

  it("creates PARA structure in from-scratch mode", async () => {
    await initCommand(TEST_DIR, { fromScratch: true });

    const paraFolders = [
      "00-Inbox",
      "01-Projects",
      "02-Areas",
      "03-Resources",
      "04-Archive",
      "05-Templates",
      "06-Daily",
    ];
    for (const folder of paraFolders) {
      expect(existsSync(join(TEST_DIR, folder))).toBe(true);
    }
  });

  it("creates .obsidian/app.json with newFileFolderPath in from-scratch mode", async () => {
    await initCommand(TEST_DIR, { fromScratch: true });

    const appConfig = join(TEST_DIR, ".obsidian", "app.json");
    expect(existsSync(appConfig)).toBe(true);
    const content = JSON.parse(readFileSync(appConfig, "utf-8"));
    expect(content.newFileFolderPath).toBe("00-Inbox");
  });

  it("creates welcome note in 00-Inbox in from-scratch mode", async () => {
    await initCommand(TEST_DIR, { fromScratch: true });

    const welcomePath = join(TEST_DIR, "00-Inbox", "Welcome to Uteuk.md");
    expect(existsSync(welcomePath)).toBe(true);
    const content = readFileSync(welcomePath, "utf-8");
    expect(content).toContain("Welcome to Uteuk");
  });
});

describe("init command — shared skills", () => {
  it("installs .uteuk/skills/date-helper/get-date.sh in existing vault mode", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    await initCommand(TEST_DIR, { existing: true });

    const skillPath = join(TEST_DIR, ".uteuk/skills/date-helper/get-date.sh");
    expect(existsSync(skillPath)).toBe(true);
  });

  it("installs .uteuk/skills/date-helper/DATE_CHECK.md in existing vault mode", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    await initCommand(TEST_DIR, { existing: true });

    const skillPath = join(TEST_DIR, ".uteuk/skills/date-helper/DATE_CHECK.md");
    expect(existsSync(skillPath)).toBe(true);
  });

  it("installs .uteuk/skills/date-helper/ in from-scratch mode", async () => {
    await initCommand(TEST_DIR, { fromScratch: true });

    const skillDir = join(TEST_DIR, ".uteuk/skills/date-helper");
    expect(existsSync(skillDir)).toBe(true);
    expect(existsSync(join(skillDir, "get-date.sh"))).toBe(true);
    expect(existsSync(join(skillDir, "DATE_CHECK.md"))).toBe(true);
    expect(existsSync(join(skillDir, "README.md"))).toBe(true);
  });

  it("does not reference .qwen/skills/uteuk in source code", async () => {
    const initSource = readFileSync(
      fileURLToPath(new URL("../src/init.ts", import.meta.url)),
      "utf-8",
    );
    expect(initSource).not.toContain(".qwen/skills/uteuk");
  });
});

describe("init command — slash commands", () => {
  it("installs all 5 slash command dirs in existing vault mode", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    await initCommand(TEST_DIR, { existing: true });

    const expectedCommands = [
      ".claude/commands/uteuk.md",
      ".qwen/commands/uteuk.md",
      ".gemini/commands/uteuk.toml",
      ".opencode/commands/uteuk.md",
      ".openclaw/commands/uteuk.md",
    ];
    for (const cmd of expectedCommands) {
      expect(existsSync(join(TEST_DIR, cmd))).toBe(true);
    }
  });

  it("installs all 5 slash command dirs in from-scratch mode", async () => {
    await initCommand(TEST_DIR, { fromScratch: true });

    const expectedCommands = [
      ".claude/commands/uteuk.md",
      ".qwen/commands/uteuk.md",
      ".gemini/commands/uteuk.toml",
      ".opencode/commands/uteuk.md",
      ".openclaw/commands/uteuk.md",
    ];
    for (const cmd of expectedCommands) {
      expect(existsSync(join(TEST_DIR, cmd))).toBe(true);
    }
  });

  it("does not overwrite existing command files", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });

    const existingContent = "# My custom uteuk command\n";
    mkdirSync(join(TEST_DIR, ".claude", "commands"), { recursive: true });
    writeFileSync(join(TEST_DIR, ".claude/commands/uteuk.md"), existingContent);

    await initCommand(TEST_DIR, { existing: true });

    expect(
      readFileSync(join(TEST_DIR, ".claude/commands/uteuk.md"), "utf-8"),
    ).toBe(existingContent);
  });
});

describe("init command — edge cases", () => {
  it("refuses to overwrite non-empty directory without --force", async () => {
    writeFileSync(join(TEST_DIR, "existing-file.txt"), "data");

    await initCommand(TEST_DIR, { fromScratch: true }).catch(() => {});

    expect(existsSync(join(TEST_DIR, "00-Inbox"))).toBe(false);
  });

  it("overwrites non-empty directory with --force", async () => {
    writeFileSync(join(TEST_DIR, "existing-file.txt"), "data");

    await initCommand(TEST_DIR, { fromScratch: true, force: true });

    expect(existsSync(join(TEST_DIR, "00-Inbox"))).toBe(true);
  });

  it("shows already installed message when .uteuk and .obsidian exist", async () => {
    mkdirSync(join(TEST_DIR, ".obsidian"), { recursive: true });
    mkdirSync(join(TEST_DIR, ".uteuk"), { recursive: true });

    await initCommand(TEST_DIR, {});

    expect(existsSync(join(TEST_DIR, "00-Inbox"))).toBe(false);
  });

  it("creates vault path directory if it does not exist", async () => {
    const nestedPath = join(TEST_DIR, "nested", "new", "vault");

    await initCommand(nestedPath, { fromScratch: true });

    expect(existsSync(nestedPath)).toBe(true);
    expect(existsSync(join(nestedPath, "00-Inbox"))).toBe(true);
  });
});
