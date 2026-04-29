import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  checkNodeVersion,
  checkGitAvailable,
  checkVaultPath,
  runPreflight,
  printDoctorOutput,
} from "../src/doctor.js";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdirSync, rmSync } from "node:fs";

describe("doctor / pre-flight", () => {
  describe("checkNodeVersion", () => {
    it("reports the current Node version", () => {
      const result = checkNodeVersion();
      expect(result.name).toBe("Node.js");
      expect(result.message).toContain(process.versions.node);
    });
  });

  describe("checkGitAvailable", () => {
    it("passes when git on PATH", () => {
      const result = checkGitAvailable();
      expect(result.passed).toBe(true);
      expect(result.name).toBe("git");
    });
  });

  describe("checkVaultPath", () => {
    let testDir: string;

    beforeEach(() => {
      testDir = join(tmpdir(), `uteuk-doctor-${Date.now()}`);
      mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
      rmSync(testDir, { recursive: true, force: true });
    });

    it("passes for existing writable dir", () => {
      const result = checkVaultPath(testDir);
      expect(result.passed).toBe(true);
    });

    it("fails for missing dir", () => {
      const result = checkVaultPath("/nonexistent-doctor-path");
      expect(result.passed).toBe(false);
      expect(result.fix).toContain("mkdir");
    });
  });

  describe("runPreflight", () => {
    it("returns 3 checks regardless of pass status", () => {
      const testDir = join(tmpdir(), `uteuk-preflight-${Date.now()}`);
      mkdirSync(testDir, { recursive: true });
      const result = runPreflight(testDir);
      expect(result.checks.length).toBe(3);
      rmSync(testDir, { recursive: true, force: true });
    });

    it("returns passed: false when vault path missing", () => {
      const result = runPreflight("/nonexistent-preflight-path");
      expect(result.passed).toBe(false);
      expect(result.checks.some((c) => !c.passed)).toBe(true);
    });
  });

  describe("printDoctorOutput", () => {
    it("formats output without error", () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      printDoctorOutput({
        checks: [
          { name: "Test", passed: true, message: "OK" },
          { name: "Fail", passed: false, message: "Bad", fix: "Fix it" },
        ],
        passed: false,
      });
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();
    });
  });
});
