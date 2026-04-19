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
import { captureCommand } from "../src/capture.js";

const TEST_DIR = join(tmpdir(), "uteuk-capture-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("capture command", () => {
  it("creates a fleeting note in 00-Inbox/ with text argument", async () => {
    await captureCommand("What if we built a personal wiki?", TEST_DIR);

    const inboxDir = join(TEST_DIR, "00-Inbox");
    expect(existsSync(inboxDir)).toBe(true);

    // Check a note was created
    const notes = require("node:fs")
      .readdirSync(inboxDir)
      .filter((f: string) => f.endsWith(".md"));
    expect(notes.length).toBe(1);

    const notePath = join(inboxDir, notes[0]);
    const content = readFileSync(notePath, "utf-8");

    expect(content).toContain("---");
    expect(content).toContain("created:");
    expect(content).toContain("tags: [fleeting]");
    expect(content).toContain("# What if we built a personal wiki?");
  });

  it("creates 00-Inbox/ if it doesn't exist", async () => {
    await captureCommand("Some idea", TEST_DIR);
    expect(existsSync(join(TEST_DIR, "00-Inbox"))).toBe(true);
  });

  it("works with empty text (untitled)", async () => {
    await captureCommand(undefined, TEST_DIR);

    const inboxDir = join(TEST_DIR, "00-Inbox");
    const notes = require("node:fs")
      .readdirSync(inboxDir)
      .filter((f: string) => f.endsWith(".md"));
    expect(notes.length).toBe(1);

    const content = readFileSync(join(inboxDir, notes[0]), "utf-8");
    expect(content).toContain("# Untitled idea");
  });

  it("sanitizes filename from text", async () => {
    await captureCommand("A complex idea: with special chars! @#$%", TEST_DIR);

    const inboxDir = join(TEST_DIR, "00-Inbox");
    const notes = require("node:fs")
      .readdirSync(inboxDir)
      .filter((f: string) => f.endsWith(".md"));
    // Filename should not contain special characters
    expect(notes[0]).not.toMatch(/[@#$%!]/);
  });

  it("uses existing 00-Inbox/ without recreating", async () => {
    const inboxDir = join(TEST_DIR, "00-Inbox");
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(join(inboxDir, "existing.md"), "# existing");

    await captureCommand("New idea", TEST_DIR);

    const notes = require("node:fs")
      .readdirSync(inboxDir)
      .filter((f: string) => f.endsWith(".md"));
    expect(notes.length).toBe(2);
    expect(notes).toContain("existing.md");
  });
});
