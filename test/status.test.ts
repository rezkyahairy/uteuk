import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync } from "node:child_process";

const TEST_DIR = join(tmpdir(), "uteuk-status-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
  try {
    execSync(`${gitCmd} init`, { cwd: TEST_DIR });
    execSync(`${gitCmd} config user.name "test"`, { cwd: TEST_DIR });
    execSync(`${gitCmd} config user.email "test@test.com"`, { cwd: TEST_DIR });
    writeFileSync(join(TEST_DIR, "README.md"), "# test");
    execSync(`${gitCmd} add -A`, { cwd: TEST_DIR });
    execSync(`${gitCmd} commit -m "init"`, { cwd: TEST_DIR });
  } catch {
    // git may fail in temp dir, continue anyway
  }
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

describe("status command", () => {
  it("exits with error when vault path does not exist", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await expect(statusCommand("/nonexistent/path")).rejects.toThrow(
      "process.exit called",
    );
    expect(errorSpy).toHaveBeenCalled();

    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("shows zero inbox when 00-Inbox is empty", async () => {
    mkdirSync(join(TEST_DIR, "00-Inbox"), { recursive: true });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("0 notes"));

    logSpy.mockRestore();
  });

  it("counts inbox notes correctly", async () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(join(inboxDir, "idea1.md"), "# idea 1");
    writeFileSync(join(inboxDir, "idea2.md"), "# idea 2");
    writeFileSync(join(inboxDir, "note.txt"), "not a note");

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("2 notes");

    logSpy.mockRestore();
  });

  it("detects orphaned notes (no backlinks)", async () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(join(inboxDir, "orphan.md"), "no links here");

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("Orphaned");
    expect(calls).toContain("orphan.md");

    logSpy.mockRestore();
  });

  it("reports no orphans when notes have backlinks", async () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(join(inboxDir, "linked.md"), "See [[Another Note]]");

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).not.toContain("orphan");

    logSpy.mockRestore();
  });

  it("finds stale MOCs not updated in 30+ days", async () => {
    const resourceDir = join(TEST_DIR, "03-Resources");
    mkdirSync(resourceDir, { recursive: true });

    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - 45);
    writeFileSync(
      join(resourceDir, "MOC - Learning.md"),
      `---\ncreated: 2024-01-01\nupdated: ${staleDate.toISOString().split("T")[0]}\ntags: [moc]\n---\n# MOC - Learning\n`,
    );

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("Stale MOCs");
    expect(calls).toContain("MOC - Learning.md");

    logSpy.mockRestore();
  });

  it("detects project status from frontmatter", async () => {
    const projectDir = join(TEST_DIR, "01-Projects");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(
      join(projectDir, "My Project.md"),
      `---\ncreated: 2024-01-01\nstatus: active\n---\n# Active Project\n`,
    );

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("My Project");
    expect(calls).toContain("active");

    logSpy.mockRestore();
  });

  it("gets last sync date from git", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("Last Sync");
    expect(calls).not.toContain("Not tracked");

    logSpy.mockRestore();
  });

  it("reports no git sync when not a git repo", async () => {
    const nonGitDir = join(tmpdir(), "uteuk-status-nogit-" + Date.now());
    mkdirSync(nonGitDir, { recursive: true });
    mkdirSync(join(nonGitDir, "00-Inbox"), { recursive: true });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(nonGitDir);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("Not tracked");

    logSpy.mockRestore();
    rmSync(nonGitDir, { recursive: true, force: true });
  });

  it("shows no orphans message when none found", async () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(join(inboxDir, "linked.md"), "See [[Another Note]]");

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("None");

    logSpy.mockRestore();
  });

  it("limits orphaned notes display to 5 with ellipsis", async () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    for (let i = 1; i <= 7; i++) {
      writeFileSync(join(inboxDir, `orphan${i}.md`), `no link ${i}`);
    }

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { statusCommand } = await import("../src/status.js");
    await statusCommand(TEST_DIR);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("7 found");
    expect(calls).toContain("orphan1.md");
    expect(calls).toContain("more");

    logSpy.mockRestore();
  });
});
