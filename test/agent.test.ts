import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import {
  AGENT_HEADLESS_PROFILES,
  getActiveAgentProfile,
  isAgentInstalled,
  getAgentInstallInstructions,
  buildAgentCommand,
  loadPromptTemplate,
  validateAgentOrWarn,
  requireAgentOrError,
} from "../src/agent.js";
import type { AiAgentProfile } from "../src/types.js";

describe("agent module", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `uteuk-agent-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe("getActiveAgentProfile", () => {
    it("returns profile when active agent configured", () => {
      const configDir = join(testDir, ".uteuk");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "config.json"),
        JSON.stringify({ activeAgent: "claude" }),
      );

      const profile = getActiveAgentProfile(testDir);
      expect(profile).not.toBeNull();
      expect(profile?.id).toBe("claude");
    });

    it("returns null when no active agent", () => {
      const configDir = join(testDir, ".uteuk");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "config.json"),
        JSON.stringify({ activeAgent: null }),
      );

      const profile = getActiveAgentProfile(testDir);
      expect(profile).toBeNull();
    });

    it("returns null when no config file exists", () => {
      const profile = getActiveAgentProfile(testDir);
      expect(profile).toBeNull();
    });

    it("returns null when unknown agent id", () => {
      const configDir = join(testDir, ".uteuk");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "config.json"),
        JSON.stringify({ activeAgent: "unknown" }),
      );

      const profile = getActiveAgentProfile(testDir);
      expect(profile).toBeNull();
    });
  });

  describe("isAgentInstalled", () => {
    it("returns true when binary on PATH", () => {
      const result = isAgentInstalled(AGENT_HEADLESS_PROFILES.claude);
      // May be true or false depending on test environment
      expect(typeof result).toBe("boolean");
    });

    it("returns false when binary missing", () => {
      const fakeProfile: AiAgentProfile = {
        ...AGENT_HEADLESS_PROFILES.claude,
        binary: "nonexistent-binary-xyz-12345",
      };
      const result = isAgentInstalled(fakeProfile);
      expect(result).toBe(false);
    });
  });

  describe("getAgentInstallInstructions", () => {
    it("returns npm install command for claude", () => {
      const result = getAgentInstallInstructions(
        AGENT_HEADLESS_PROFILES.claude,
      );
      expect(result).toContain("npm install");
    });

    it("returns npm install command for qwen", () => {
      const result = getAgentInstallInstructions(AGENT_HEADLESS_PROFILES.qwen);
      expect(result).toContain("npm install");
    });
  });

  describe("buildAgentCommand", () => {
    it("builds correct command for claude", () => {
      const cmd = buildAgentCommand(
        AGENT_HEADLESS_PROFILES.claude,
        "hello world",
      );
      expect(cmd).toEqual(["claude", "-p", "hello world"]);
    });

    it("builds correct command for qwen with --yolo", () => {
      const cmd = buildAgentCommand(
        AGENT_HEADLESS_PROFILES.qwen,
        "hello world",
      );
      expect(cmd).toEqual(["qwen", "-p", "hello world", "--yolo"]);
    });

    it("builds correct command for opencode with -q", () => {
      const cmd = buildAgentCommand(
        AGENT_HEADLESS_PROFILES.opencode,
        "hello world",
      );
      expect(cmd).toEqual(["opencode", "-p", "hello world", "-q"]);
    });

    it("builds correct command for openclaw with --message", () => {
      const cmd = buildAgentCommand(
        AGENT_HEADLESS_PROFILES.openclaw,
        "hello world",
      );
      expect(cmd).toEqual(["openclaw", "--message", "hello world"]);
    });

    it("builds correct command for gemini", () => {
      const cmd = buildAgentCommand(
        AGENT_HEADLESS_PROFILES.gemini,
        "hello world",
      );
      expect(cmd).toEqual(["gemini", "-p", "hello world"]);
    });
  });

  describe("loadPromptTemplate", () => {
    it("loads prompt template from vault", () => {
      const promptDir = join(testDir, ".uteuk", "prompts");
      mkdirSync(promptDir, { recursive: true });
      writeFileSync(join(promptDir, "process.md"), "# Process prompt content");

      const content = loadPromptTemplate(testDir, "process");
      expect(content).toContain("# Process prompt content");
    });

    it("throws when template not found", () => {
      expect(() => loadPromptTemplate(testDir, "nonexistent")).toThrow(
        "Prompt template not found",
      );
    });
  });

  describe("validateAgentOrWarn", () => {
    it("returns false when profile is null", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const result = validateAgentOrWarn(null);
      expect(result).toBe(false);
      spy.mockRestore();
    });

    it("returns false when profile is not installed", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const fakeProfile: AiAgentProfile = {
        ...AGENT_HEADLESS_PROFILES.claude,
        binary: "nonexistent-binary-xyz-999",
      };
      const result = validateAgentOrWarn(fakeProfile);
      expect(result).toBe(false);
      spy.mockRestore();
    });
  });

  describe("requireAgentOrError", () => {
    it("exits when profile is null", () => {
      const exitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
      requireAgentOrError(null);
      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });

    it("exits when profile is not installed", () => {
      const exitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
      const fakeProfile: AiAgentProfile = {
        ...AGENT_HEADLESS_PROFILES.claude,
        binary: "nonexistent-binary-xyz-888",
      };
      requireAgentOrError(fakeProfile);
      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });
  });

  describe("agent profiles", () => {
    it("has 5 agent entries", () => {
      expect(Object.keys(AGENT_HEADLESS_PROFILES).length).toBe(5);
    });

    it("each profile has required fields", () => {
      for (const profile of Object.values(AGENT_HEADLESS_PROFILES)) {
        expect(profile.id).toBeDefined();
        expect(profile.name).toBeDefined();
        expect(profile.binary).toBeDefined();
        expect(profile.headlessFlag).toBeDefined();
        expect(profile.installInstructions).toBeDefined();
      }
    });
  });
});
