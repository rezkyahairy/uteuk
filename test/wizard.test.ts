import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdirSync, rmSync, existsSync } from "node:fs";

vi.mock("prompts", () => ({
  default: vi.fn().mockResolvedValue({}),
}));

vi.mock("../src/doctor.js", () => ({
  runPreflight: vi.fn().mockReturnValue({
    checks: [
      { name: "Node.js", passed: true, message: "Node.js 24.0.0" },
      { name: "git", passed: true, message: "git 2.43.0" },
      { name: "Vault path", passed: true, message: "OK" },
    ],
    passed: true,
  }),
  printDoctorOutput: vi.fn(),
}));

describe("interactive wizard", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `uteuk-wizard-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
    vi.clearAllMocks();
  });

  describe("git setup", () => {
    it("initializes git repo in from-scratch mode", async () => {
      const { runWizard } = await import("../src/wizard.js");
      await runWizard(testDir, "from-scratch", {
        nonInteractive: true,
        skipGit: false,
        skipAi: true,
      });
      expect(existsSync(join(testDir, ".git"))).toBe(true);
    });

    it("non-interactive mode runs without prompts", async () => {
      const prompts = await import("prompts");
      await import("../src/wizard.js");
      await import("../src/wizard.js");
      const { runWizard } = await import("../src/wizard.js");

      await runWizard(testDir, "from-scratch", {
        nonInteractive: true,
        skipGit: false,
        skipAi: true,
      });

      // In non-interactive mode, prompts should not be called for AI setup
      expect(prompts.default).not.toHaveBeenCalled();
    });

    it("skips git when --skip-git flag set", async () => {
      const { runWizard } = await import("../src/wizard.js");
      await runWizard(testDir, "from-scratch", {
        nonInteractive: true,
        skipGit: true,
        skipAi: true,
      });
      // Git repo should NOT be created
      expect(existsSync(join(testDir, ".git"))).toBe(false);
    });
  });

  describe("wizard orchestration", () => {
    it("runs all steps in non-interactive mode", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const { runWizard } = await import("../src/wizard.js");
      await runWizard(testDir, "from-scratch", {
        nonInteractive: true,
        skipGit: false,
        skipAi: true,
      });
      // Should complete without error
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();
    });
  });
});
