import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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
import { listTemplates, printTemplates } from "../src/templates.js";
import type { TemplateInfo } from "../src/types.js";

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

  it("exits when no templates directory exists", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const emptyDir = join(TEST_DIR, "empty");
    mkdirSync(emptyDir, { recursive: true });

    await expect(newCommand("project", "Test", emptyDir)).rejects.toThrow(
      "process.exit called",
    );
    expect(errorSpy).toHaveBeenCalled();

    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("exits when template file is missing for note type", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const tplDir = join(TEST_DIR, "05-Templates");
    rmSync(join(tplDir, "Task.md"));

    await expect(newCommand("task", "Test", TEST_DIR)).rejects.toThrow(
      "process.exit called",
    );
    expect(errorSpy).toHaveBeenCalled();

    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("falls back to case-insensitive template matching", async () => {
    const tplDir = join(TEST_DIR, "05-Templates");
    rmSync(join(tplDir, "Project.md"));
    writeFileSync(
      join(tplDir, "PROJECT.md"),
      "---\ncreated: {{date}}\n---\n\n# Project\n",
    );

    await newCommand("project", "Case Test", TEST_DIR);

    const filePath = join(TEST_DIR, "01-Projects", "Case Test.md");
    expect(existsSync(filePath)).toBe(true);
  });

  it("creates default note names for all types", async () => {
    await newCommand("project", undefined, TEST_DIR);
    await newCommand("resource", undefined, TEST_DIR);
    await newCommand("moc", undefined, TEST_DIR);
    await newCommand("task", undefined, TEST_DIR);

    const projectFiles = readdirSync(join(TEST_DIR, "01-Projects"));
    const resourceFiles = readdirSync(join(TEST_DIR, "03-Resources"));
    const inboxFiles = readdirSync(join(TEST_DIR, "00-Inbox"));

    expect(projectFiles[0]).toMatch(/^project-\d{4}-\d{2}-\d{2}\.md$/);
    expect(resourceFiles.length).toBe(2);
    expect(inboxFiles[0]).toMatch(/^task-\d{4}-\d{2}-\d{2}\.md$/);
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

  it("extracts description from first non-empty line when no heading", () => {
    const tplDir = join(TEST_DIR, "05-Templates");
    writeFileSync(
      join(tplDir, "NoHeading.md"),
      "---\ncreated: {{date}}\n---\n\nJust some text without a heading\n\nMore text\n",
    );

    const templates = listTemplates(TEST_DIR);
    const noHeading = templates.find((t) => t.name === "NoHeading");
    expect(noHeading).toBeDefined();
    expect(noHeading!.description).toContain("Just some text");
  });

  it("handles template with only frontmatter (no description)", () => {
    const tplDir = join(TEST_DIR, "05-Templates");
    writeFileSync(join(tplDir, "Empty.md"), "---\ncreated: {{date}}\n---\n");

    const templates = listTemplates(TEST_DIR);
    const empty = templates.find((t) => t.name === "Empty");
    expect(empty).toBeDefined();
    expect(empty!.description).toBe("");
  });
});

describe("printTemplates", () => {
  it("prints templates with formatted output", () => {
    const templates: TemplateInfo[] = [
      { name: "Project", description: "Project template", file: "Project.md" },
      { name: "Daily Note", description: "Daily note", file: "Daily Note.md" },
    ];

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    printTemplates(templates);

    const calls = logSpy.mock.calls.flat().join("\n");
    expect(calls).toContain("Available templates");
    expect(calls).toContain("Project");
    expect(calls).toContain("Daily Note");

    logSpy.mockRestore();
  });

  it("shows message for empty template list", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    printTemplates([]);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("No templates found"),
    );

    logSpy.mockRestore();
  });
});
