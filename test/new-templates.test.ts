import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  existsSync,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { newCommand } from "../src/new.js";
import { listTemplates } from "../src/templates.js";

const TEST_DIR = join(tmpdir(), "uteuk-new-test-" + Date.now());

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  // Create minimal templates
  const tplDir = join(TEST_DIR, "05-Templates");
  mkdirSync(tplDir, { recursive: true });
  writeFileSync(
    join(tplDir, "Project.md"),
    "---\ncreated: {{date}}\ntags: [project]\n---\n\n# {{title}}\n\n## Goals\n",
  );
  writeFileSync(
    join(tplDir, "Daily Note.md"),
    "---\ndate: {{date}}\ntags: [daily]\n---\n\n# Daily Note - {{date}}\n\n",
  );
  writeFileSync(
    join(tplDir, "Resource.md"),
    "---\ncreated: {{date}}\ntags: [resource]\n---\n\n# Resource\n\n",
  );
  writeFileSync(
    join(tplDir, "MOC.md"),
    "---\ncreated: {{date}}\ntags: [moc]\n---\n\n# MOC\n\n",
  );
  writeFileSync(
    join(tplDir, "Task.md"),
    "---\ncreated: {{date}}\nstatus: open\ntags: [task]\n---\n\n# Task\n\n",
  );
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe("new command", () => {
  it("creates a project note from template", async () => {
    await newCommand("project", "My New Project", TEST_DIR);

    const filePath = join(TEST_DIR, "01-Projects", "My New Project.md");
    expect(existsSync(filePath)).toBe(true);

    const content = readFileSync(filePath, "utf-8");
    expect(content).toContain("created:");
    expect(content).toContain("tags: [project]");
  });

  it("creates a daily note with date as filename", async () => {
    await newCommand("daily", undefined, TEST_DIR);

    const dailyDir = join(TEST_DIR, "06-Daily");
    const notes = readdirSync(dailyDir).filter((f) => f.endsWith(".md"));
    expect(notes.length).toBe(1);
    expect(notes[0]).toMatch(/^\d{4}-\d{2}-\d{2}\.md$/);
  });

  it("creates a resource note", async () => {
    await newCommand("resource", "How LLMs Work", TEST_DIR);

    const filePath = join(TEST_DIR, "03-Resources", "How LLMs Work.md");
    expect(existsSync(filePath)).toBe(true);
  });

  it("creates a MOC note", async () => {
    await newCommand("moc", "Learning", TEST_DIR);

    const filePath = join(TEST_DIR, "03-Resources", "Learning.md");
    expect(existsSync(filePath)).toBe(true);
  });

  it("creates a task note", async () => {
    await newCommand("task", "Fix bug", TEST_DIR);

    const filePath = join(TEST_DIR, "00-Inbox", "Fix bug.md");
    expect(existsSync(filePath)).toBe(true);
  });

  it("creates target directory if it doesn't exist", async () => {
    await newCommand("project", "Auto Dir", TEST_DIR);
    expect(existsSync(join(TEST_DIR, "01-Projects"))).toBe(true);
  });

  it("substitutes {{date}} frontmatter", async () => {
    await newCommand("project", "Date Test", TEST_DIR);
    const content = readFileSync(
      join(TEST_DIR, "01-Projects", "Date Test.md"),
      "utf-8",
    );
    expect(content).toContain("created:");
    expect(content).not.toContain("{{date}}");
  });
});

describe("templates command", () => {
  it("lists all available templates", () => {
    const templates = listTemplates(TEST_DIR);
    expect(templates.length).toBe(5);

    const names = templates.map((t) => t.name);
    expect(names).toContain("Project");
    expect(names).toContain("Daily Note");
    expect(names).toContain("Resource");
    expect(names).toContain("MOC");
    expect(names).toContain("Task");
  });

  it("returns empty array when no templates dir exists", () => {
    const emptyDir = join(TEST_DIR, "empty");
    mkdirSync(emptyDir, { recursive: true });
    const templates = listTemplates(emptyDir);
    expect(templates).toEqual([]);
  });

  it("extracts description from first heading", () => {
    const templates = listTemplates(TEST_DIR);
    const project = templates.find((t) => t.name === "Project");
    expect(project).toBeDefined();
  });
});
