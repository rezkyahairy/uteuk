import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn, execSync } from "node:child_process";
import type { AiAgentProfile } from "./types.js";
import { resolveVaultPath } from "./vault.js";

export const AGENT_HEADLESS_PROFILES: Record<string, AiAgentProfile> = {
  claude: {
    id: "claude",
    name: "Claude Code",
    binary: "claude",
    headlessFlag: "-p",
    autoApproveFlag: undefined,
    quietFlag: undefined,
    installInstructions: "npm install -g @anthropic-ai/claude-code",
    keyStoragePath: "~/.config/anthropic/credentials.json",
    authInstructions:
      "Get an API key at https://console.anthropic.com/settings/keys",
    authUrl: "https://console.anthropic.com/settings/keys",
  },
  qwen: {
    id: "qwen",
    name: "Qwen Code",
    binary: "qwen",
    headlessFlag: "-p",
    autoApproveFlag: "--yolo",
    quietFlag: undefined,
    installInstructions: "npm install -g @anthropic-ai/qwen-code",
    keyStoragePath: "~/.dashscope/config",
    authInstructions:
      "Get an API key at https://dashscope.console.aliyun.com/apiKey",
    authUrl: "https://dashscope.console.aliyun.com/apiKey",
  },
  gemini: {
    id: "gemini",
    name: "Gemini CLI",
    binary: "gemini",
    headlessFlag: "-p",
    autoApproveFlag: undefined,
    quietFlag: undefined,
    installInstructions: "npm install -g @anthropic-ai/gemini-cli",
    keyStoragePath: "~/.config/glm/config.json",
    authInstructions: "Get an API key at https://aistudio.google.com/apikey",
    authUrl: "https://aistudio.google.com/apikey",
  },
  opencode: {
    id: "opencode",
    name: "OpenCode",
    binary: "opencode",
    headlessFlag: "-p",
    autoApproveFlag: undefined,
    quietFlag: "-q",
    installInstructions: "npm install -g opencode",
    keyStoragePath: "~/.config/opencode/config.json",
    authInstructions: "Configure your provider in the OpenCode config file.",
    authUrl: "",
  },
  openclaw: {
    id: "openclaw",
    name: "OpenClaw",
    binary: "openclaw",
    headlessFlag: "--message",
    autoApproveFlag: undefined,
    quietFlag: undefined,
    installInstructions: "npm install -g openclaw",
    keyStoragePath: "~/.config/openclaw/config.json",
    authInstructions: "Configure your provider in the OpenClaw config file.",
    authUrl: "",
  },
};

export function getActiveAgentProfile(
  vaultPath: string,
): AiAgentProfile | null {
  const resolvedPath = resolveVaultPath(vaultPath);
  const configPath = join(resolvedPath, ".uteuk", "config.json");

  if (!existsSync(configPath)) return null;

  try {
    const raw = readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);
    if (!config.activeAgent) return null;
    return AGENT_HEADLESS_PROFILES[config.activeAgent] || null;
  } catch {
    return null;
  }
}

export function isAgentInstalled(profile: AiAgentProfile): boolean {
  try {
    const cmd = process.platform === "win32" ? "where" : "which";
    execSync(`${cmd} ${profile.binary}`, {
      stdio: ["pipe", "pipe", "pipe"],
    });
    return true;
  } catch {
    return false;
  }
}

export function getAgentInstallInstructions(profile: AiAgentProfile): string {
  return profile.installInstructions;
}

export function buildAgentCommand(
  profile: AiAgentProfile,
  prompt: string,
): string[] {
  const args = [profile.headlessFlag, prompt];
  if (profile.autoApproveFlag) args.push(profile.autoApproveFlag);
  if (profile.quietFlag) args.push(profile.quietFlag);
  return [profile.binary, ...args];
}

export interface InvocationResult {
  exitCode: number | null;
  duration: number;
}

export function invokeAgent(
  profile: AiAgentProfile,
  prompt: string,
  vaultPath: string,
): Promise<InvocationResult> {
  return new Promise((resolve) => {
    const resolvedPath = resolveVaultPath(vaultPath);
    const args = buildAgentCommand(profile, prompt);
    const startTime = Date.now();

    const child = spawn(args[0], args.slice(1), {
      cwd: resolvedPath,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      resolve({ exitCode: code, duration: Date.now() - startTime });
    });

    child.on("error", () => {
      resolve({ exitCode: 1, duration: Date.now() - startTime });
    });
  });
}

export function loadPromptTemplate(vaultPath: string, action: string): string {
  const resolvedPath = resolveVaultPath(vaultPath);
  const promptPath = join(resolvedPath, ".uteuk", "prompts", `${action}.md`);

  if (!existsSync(promptPath)) {
    throw new Error(`Prompt template not found: .uteuk/prompts/${action}.md`);
  }

  return readFileSync(promptPath, "utf-8");
}

export function validateAgentOrWarn(
  profile: AiAgentProfile | null,
): profile is AiAgentProfile {
  if (!profile) {
    console.error(
      "No active agent configured. Run `uteuk setup ai` to select one.",
    );
    return false;
  }

  if (!isAgentInstalled(profile)) {
    console.error(
      `Agent "${profile.name}" is not installed. Install: ${profile.installInstructions}\nFalling back to non-AI behavior.`,
    );
    return false;
  }

  return true;
}

export function requireAgentOrError(
  profile: AiAgentProfile | null,
): profile is AiAgentProfile {
  if (!profile) {
    console.error(
      "No active agent configured. Run `uteuk setup ai` to select one.",
    );
    process.exit(1);
    return false as never;
  }

  if (!isAgentInstalled(profile)) {
    console.error(
      `Agent "${profile.name}" is not installed. Install: ${profile.installInstructions}`,
    );
    process.exit(1);
    return false as never;
  }

  return true;
}
