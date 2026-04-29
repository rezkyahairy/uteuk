import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  mkdirSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import {
  AGENT_PROFILES,
  loadOnboardingConfig,
  saveOnboardingConfig,
  storeApiKey,
  runVerification,
} from "../src/setup.js";
import { execSync } from "node:child_process";

describe("setup command", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `uteuk-setup-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe("agent config", () => {
    it("loads default config when no file exists", () => {
      const config = loadOnboardingConfig(testDir);
      expect(config.configVersion).toBe(1);
      expect(config.onboardingComplete).toBe(false);
      expect(config.activeAgent).toBeUndefined();
    });

    it("saves config to .uteuk/config.json", () => {
      const config = loadOnboardingConfig(testDir);
      config.activeAgent = "claude";
      config.onboardingComplete = true;
      saveOnboardingConfig(testDir, config);

      const configPath = join(testDir, ".uteuk", "config.json");
      expect(existsSync(configPath)).toBe(true);

      const loaded = loadOnboardingConfig(testDir);
      expect(loaded.activeAgent).toBe("claude");
    });

    it("overwrites previous active agent", () => {
      const config = loadOnboardingConfig(testDir);
      config.activeAgent = "claude";
      saveOnboardingConfig(testDir, config);

      const updated = loadOnboardingConfig(testDir);
      updated.activeAgent = "qwen";
      saveOnboardingConfig(testDir, updated);

      const final = loadOnboardingConfig(testDir);
      expect(final.activeAgent).toBe("qwen");
    });
  });

  describe("API key storage", () => {
    it("stores key in Claude's native location", () => {
      const claude = AGENT_PROFILES.find((p) => p.id === "claude")!;
      const result = storeApiKey(claude, "sk-test-key-123");
      expect(result.stored).toBe(true);
      expect(result.path).toBe(claude.keyStoragePath);
    });

    it("stores key in Qwen's native location", () => {
      const qwen = AGENT_PROFILES.find((p) => p.id === "qwen")!;
      const result = storeApiKey(qwen, "dashscope-key-456");
      expect(result.stored).toBe(true);
    });
  });

  describe("agent profiles", () => {
    it("AGENT_PROFILES has 5 entries (excludes uteuk CLI itself)", () => {
      expect(AGENT_PROFILES.length).toBe(5);
      expect(AGENT_PROFILES.map((p) => p.id)).toContain("claude");
      expect(AGENT_PROFILES.map((p) => p.id)).toContain("qwen");
    });
  });

  describe("verification", () => {
    it("fails when vault structure incomplete", () => {
      const result = runVerification(testDir);
      expect(result.passed).toBe(false);
      expect(result.checks.some((c) => c.name === "Vault structure")).toBe(
        true,
      );
    });

    it("fails when no git repo", () => {
      mkdirSync(join(testDir, "00-Inbox"), { recursive: true });
      mkdirSync(join(testDir, "01-Projects"), { recursive: true });
      mkdirSync(join(testDir, "02-Areas"), { recursive: true });
      mkdirSync(join(testDir, "03-Resources"), { recursive: true });
      mkdirSync(join(testDir, "04-Archive"), { recursive: true });
      mkdirSync(join(testDir, "05-Templates"), { recursive: true });
      mkdirSync(join(testDir, "06-Daily"), { recursive: true });

      const result = runVerification(testDir);
      const gitCheck = result.checks.find((c) => c.name === "Git repo");
      expect(gitCheck?.passed).toBe(false);
    });

    it("passes when vault structure complete with git and templates", () => {
      const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
      execSync(`${gitCmd} init`, { cwd: testDir });
      execSync(`${gitCmd} config user.name "test"`, { cwd: testDir });
      execSync(`${gitCmd} config user.email "test@test.com"`, { cwd: testDir });
      writeFileSync(join(testDir, "README.md"), "# test");
      execSync(`${gitCmd} add -A`, { cwd: testDir });
      execSync(`${gitCmd} commit -m "init"`, { cwd: testDir });

      mkdirSync(join(testDir, "00-Inbox"), { recursive: true });
      mkdirSync(join(testDir, "01-Projects"), { recursive: true });
      mkdirSync(join(testDir, "02-Areas"), { recursive: true });
      mkdirSync(join(testDir, "03-Resources"), { recursive: true });
      mkdirSync(join(testDir, "04-Archive"), { recursive: true });
      mkdirSync(join(testDir, "05-Templates"), { recursive: true });
      mkdirSync(join(testDir, "06-Daily"), { recursive: true });

      writeFileSync(join(testDir, "05-Templates", "Project.md"), "# Project");

      const result = runVerification(testDir);
      const structureCheck = result.checks.find(
        (c) => c.name === "Vault structure",
      );
      const gitCheck = result.checks.find((c) => c.name === "Git repo");
      const templateCheck = result.checks.find((c) => c.name === "Templates");

      expect(structureCheck?.passed).toBe(true);
      expect(gitCheck?.passed).toBe(true);
      expect(templateCheck?.passed).toBe(true);
    });
  });
});
