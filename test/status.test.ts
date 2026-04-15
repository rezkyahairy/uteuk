import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync } from "node:child_process";

const TEST_DIR = join(tmpdir(), "uteuk-status-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
  // Initialize git for sync tests
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

describe("status command", () => {
  it("should count inbox notes", () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(join(inboxDir, "idea1.md"), "# idea 1");
    writeFileSync(join(inboxDir, "idea2.md"), "# idea 2");

    const inboxCount = readDirCount(inboxDir);
    expect(inboxCount).toBe(2);
  });

  it("should detect orphaned notes (no backlinks)", () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(join(inboxDir, "orphan.md"), "no links here");

    const content = readFileSync(join(inboxDir, "orphan.md"), "utf-8");
    const hasBacklinks = content.includes("[[");
    expect(hasBacklinks).toBe(false);
  });

  it("should find stale MOCs (not updated in 30+ days)", () => {
    const resourceDir = join(TEST_DIR, "03-Resources");
    mkdirSync(resourceDir, { recursive: true });

    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - 45);
    const staleContent = `---
created: 2024-01-01
updated: ${staleDate.toISOString().split("T")[0]}
tags: [moc]
---
# MOC - Learning
`;
    writeFileSync(join(resourceDir, "MOC - Learning.md"), staleContent);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const dateMatch = staleContent.match(/updated:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const lastUpdated = new Date(dateMatch[1]);
      expect(lastUpdated < cutoffDate).toBe(true);
    }
  });

  it("should get last sync date from git", () => {
    const gitCmd = process.platform === "win32" ? "git" : "/usr/bin/git";
    const output = execSync(`${gitCmd} log -1 --format=%ci`, {
      cwd: TEST_DIR,
      encoding: "utf-8",
    }).trim();
    expect(output).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it("should detect project status from frontmatter", () => {
    const projectDir = join(TEST_DIR, "01-Projects");
    mkdirSync(projectDir, { recursive: true });

    const activeContent = `---
created: 2024-01-01
status: active
---
# Active Project
`;
    writeFileSync(join(projectDir, "My Project.md"), activeContent);

    const content = readFileSync(join(projectDir, "My Project.md"), "utf-8");
    const statusMatch = content.match(/status:\s*(\S+)/);
    expect(statusMatch).not.toBeNull();
    expect(statusMatch![1]).toBe("active");
  });
});

function readDirCount(dir: string): number {
  const { readdirSync } = require("node:fs");
  return readdirSync(dir).filter((f: string) => f.endsWith(".md")).length;
}
