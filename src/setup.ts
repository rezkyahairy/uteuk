import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
} from "node:fs";
import { join, resolve as resolvePath } from "node:path";
import { homedir } from "node:os";
import type {
  AiAgentProfile,
  OnboardingConfig,
  VerificationCheck,
} from "./types.js";
import { hasGitRepo, hasGitRemote, resolveVaultPath } from "./vault.js";

export const AGENT_PROFILES: AiAgentProfile[] = [
  {
    id: "claude",
    name: "Claude Code",
    binary: "claude",
    authInstructions:
      "Get an API key at https://console.anthropic.com/settings/keys",
    authUrl: "https://console.anthropic.com/settings/keys",
    keyStoragePath: "~/.config/anthropic/credentials.json",
  },
  {
    id: "qwen",
    name: "Qwen Code",
    binary: "qwen",
    authInstructions:
      "Get an API key at https://dashscope.console.aliyun.com/apiKey",
    authUrl: "https://dashscope.console.aliyun.com/apiKey",
    keyStoragePath: "~/.dashscope/config",
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    binary: "gemini",
    authInstructions: "Get an API key at https://aistudio.google.com/apikey",
    authUrl: "https://aistudio.google.com/apikey",
    keyStoragePath: "~/.config/glm/config.json",
  },
  {
    id: "opencode",
    name: "OpenCode",
    binary: "opencode",
    authInstructions: "Configure your provider in the OpenCode config file.",
    authUrl: "",
    keyStoragePath: "~/.config/opencode/config.json",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    binary: "openclaw",
    authInstructions: "Configure your provider in the OpenClaw config file.",
    authUrl: "",
    keyStoragePath: "~/.config/openclaw/config.json",
  },
];

const CONFIG_FILE = "config.json";

export function loadOnboardingConfig(vaultPath: string): OnboardingConfig {
  const resolvedPath = resolveVaultPath(vaultPath);
  const configDir = join(resolvedPath, ".uteuk");
  const configPath = join(configDir, CONFIG_FILE);

  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, "utf-8");
      return JSON.parse(raw) as OnboardingConfig;
    } catch {
      // corrupt or unreadable, return default
    }
  }

  return {
    configVersion: 1,
    agentConfigs: {},
    onboardingComplete: false,
  };
}

export function saveOnboardingConfig(
  vaultPath: string,
  config: OnboardingConfig,
): void {
  const resolvedPath = resolveVaultPath(vaultPath);
  const configDir = join(resolvedPath, ".uteuk");

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  const configPath = join(configDir, CONFIG_FILE);
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

export function storeApiKey(
  agent: AiAgentProfile,
  key: string,
): { stored: boolean; path: string } {
  const resolvedPath = resolvePath(
    agent.keyStoragePath.replace("~", homedir()),
  );
  const dir = resolvePath(resolvedPath, "..");

  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const configData: Record<string, unknown> = {};
    if (existsSync(resolvedPath)) {
      try {
        const existing = readFileSync(resolvedPath, "utf-8");
        Object.assign(configData, JSON.parse(existing));
      } catch {
        // corrupt, start fresh
      }
    }

    configData.apiKey = key;
    writeFileSync(resolvedPath, JSON.stringify(configData, null, 2), "utf-8");
    return { stored: true, path: agent.keyStoragePath };
  } catch {
    return { stored: false, path: agent.keyStoragePath };
  }
}

export function runVerification(vaultPath: string): {
  checks: VerificationCheck[];
  passed: boolean;
} {
  const resolvedPath = resolveVaultPath(vaultPath);
  const checks: VerificationCheck[] = [];

  // Vault structure
  const paraFolders = [
    "00-Inbox",
    "01-Projects",
    "02-Areas",
    "03-Resources",
    "04-Archive",
    "05-Templates",
    "06-Daily",
  ];
  const missingPara = paraFolders.filter(
    (f) => !existsSync(join(resolvedPath, f)),
  );
  checks.push({
    name: "Vault structure",
    passed: missingPara.length === 0,
    message:
      missingPara.length === 0
        ? "All 7 PARA folders present"
        : `Missing: ${missingPara.join(", ")}`,
    fix:
      missingPara.length > 0
        ? "Run `uteuk init` to create the structure"
        : undefined,
  });

  // Git
  const hasGit = hasGitRepo(resolvedPath);
  const hasRemote = hasGitRemote(resolvedPath);
  checks.push({
    name: "Git repo",
    passed: hasGit,
    message: hasRemote
      ? "Initialized with remote"
      : hasGit
        ? "Initialized (no remote)"
        : "No git repository",
    fix: !hasGit ? "Run `git init` in your vault directory" : undefined,
  });

  // Templates
  const templatesDir = join(resolvedPath, "05-Templates");
  let hasTemplates = false;
  if (existsSync(templatesDir)) {
    try {
      hasTemplates = readdirSync(templatesDir, { withFileTypes: true }).some(
        (d) => d.isFile() && d.name.endsWith(".md"),
      );
    } catch {
      // unreadable
    }
  }
  checks.push({
    name: "Templates",
    passed: hasTemplates,
    message: hasTemplates ? "Templates installed" : "No templates found",
    fix: !hasTemplates ? "Run `uteuk init` to install templates" : undefined,
  });

  // Agent configs
  const agentFiles = [
    "AGENT.md",
    "CLAUDE.md",
    "QWEN.md",
    "GEMINI.md",
    "OPENCODE.md",
    "OPENCLAW.md",
  ];
  const installedAgents = agentFiles.filter((f) =>
    existsSync(join(resolvedPath, f)),
  );
  checks.push({
    name: "Agent configs",
    passed: installedAgents.length > 0,
    message: `${installedAgents.length} agent config(s) installed`,
    fix:
      installedAgents.length === 0
        ? "Run `uteuk init` to install agent configs"
        : undefined,
  });

  // Active agent
  const config = loadOnboardingConfig(resolvedPath);
  checks.push({
    name: "Active agent",
    passed: !!config.activeAgent,
    message: config.activeAgent
      ? `Active: ${config.activeAgent}`
      : "No active agent set",
    fix: !config.activeAgent
      ? "Run `uteuk setup ai` to select your primary agent"
      : undefined,
  });

  const passed = checks.every((c) => c.passed);
  return { checks, passed };
}
