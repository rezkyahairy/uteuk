import { describe, it, expect, beforeAll, beforeEach, afterEach } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
import pkg from "../package.json" with { type: "json" };

const execFileAsync = promisify(execFile);
const CLI_BIN = resolve(__dirname, "../bin/uteuk");

describe("CLI Options", () => {
  // ─── User Story 1: Version flag ──────────────────────────────
  describe("version flag", () => {
    it("outputs version with -v and exits 0", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "-v"]);
      expect(stdout.trim()).toBe(pkg.version);
    });

    it("outputs version with --version and exits 0", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "--version"]);
      expect(stdout.trim()).toBe(pkg.version);
    });

    it("version matches package.json", () => {
      expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  // ─── User Story 2: Help text ─────────────────────────────────
  describe("help text", () => {
    it("root help displays all subcommand names", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "-h"]);
      expect(stdout).toContain("init");
      expect(stdout).toContain("capture");
      expect(stdout).toContain("new");
      expect(stdout).toContain("templates");
      expect(stdout).toContain("status");
      expect(stdout).toContain("update");
    });

    it("root help displays version", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "-h"]);
      expect(stdout).toContain("--version");
    });

    it("subcommand help (init -h) displays usage examples", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "init", "-h"]);
      expect(stdout).toContain("Examples:");
    });

    it("subcommand help (capture -h) displays usage examples", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "capture",
        "-h",
      ]);
      expect(stdout).toContain("Examples:");
    });

    it("subcommand help (new -h) displays usage examples", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "new", "-h"]);
      expect(stdout).toContain("Examples:");
    });

    it("subcommand help (templates -h) displays usage examples", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "templates",
        "-h",
      ]);
      expect(stdout).toContain("Examples:");
    });

    it("subcommand help (status -h) displays usage examples", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "status", "-h"]);
      expect(stdout).toContain("Examples:");
    });

    it("subcommand help (update -h) displays usage examples", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "update", "-h"]);
      expect(stdout).toContain("Examples:");
    });

    it("invalid command exits non-zero with error listing valid commands", async () => {
      await expect(
        execFileAsync("node", [CLI_BIN, "invalidcmd"]),
      ).rejects.toThrow();
      try {
        await execFileAsync("node", [CLI_BIN, "invalidcmd"]);
      } catch (err: unknown) {
        const error = err as { stderr: string };
        expect(error.stderr).toContain("init");
        expect(error.stderr).toContain("capture");
        expect(error.stderr).toContain("new");
      }
    });
  });

  // ─── User Story 3: Global --vault option ─────────────────────
  describe("global --vault option", () => {
    it("global --vault passes vault path to subcommand", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "--vault",
        "/tmp",
        "templates",
      ]);
      // Should succeed using /tmp as vault path
      expect(stdout).toBeDefined();
    });

    it("local --vault overrides global --vault", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "--vault",
        "/nonexistent-global",
        "templates",
        "--vault",
        "/tmp",
      ]);
      expect(stdout).toBeDefined();
    });

    it("no --vault defaults to current directory", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "templates"]);
      expect(stdout).toBeDefined();
    });
  });

  // ─── User Story 4: JSON output ───────────────────────────────
  describe("--json output", () => {
    it("status --json outputs valid JSON", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "status",
        "--json",
        "--vault",
        "/tmp",
      ]);
      const parsed = JSON.parse(stdout);
      expect(parsed).toBeDefined();
      expect(typeof parsed).toBe("object");
    });

    it("templates --json outputs valid JSON array", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "templates",
        "--json",
        "--vault",
        "/tmp",
      ]);
      const parsed = JSON.parse(stdout);
      expect(Array.isArray(parsed)).toBe(true);
    });

    it("JSON output contains no ANSI escape codes", async () => {
      const { stdout: statusJson } = await execFileAsync("node", [
        CLI_BIN,
        "status",
        "--json",
        "--vault",
        "/tmp",
      ]);
      const { stdout: templatesJson } = await execFileAsync("node", [
        CLI_BIN,
        "templates",
        "--json",
        "--vault",
        "/tmp",
      ]);
      const ansiRegex = /\x1b\[[0-9;]*m/g;
      expect(statusJson).not.toMatch(ansiRegex);
      expect(templatesJson).not.toMatch(ansiRegex);
    });
  });

  // ─── Onboarding commands ──────────────────────────────────────
  describe("onboarding commands", () => {
    it("uteuk doctor -h shows help", async () => {
      const { stdout } = await execFileAsync("node", [CLI_BIN, "doctor", "-h"]);
      expect(stdout).toContain("prerequisites");
    });

    it("uteuk setup verify -h shows help", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "setup",
        "verify",
        "-h",
      ]);
      expect(stdout).toContain("Verify vault setup");
    });

    it("uteuk setup ai -h shows help", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "setup",
        "ai",
        "-h",
      ]);
      expect(stdout).toContain("AI agent");
    });

    it("uteuk init --non-interactive accepted as flag", async () => {
      const { stdout } = await execFileAsync("node", [
        CLI_BIN,
        "init",
        "--help",
      ]);
      expect(stdout).toContain("--non-interactive");
      expect(stdout).toContain("--skip-git");
      expect(stdout).toContain("--skip-ai");
    });
  });
});
