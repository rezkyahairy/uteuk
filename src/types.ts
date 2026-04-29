export type VaultState =
  | "EMPTY"
  | "EXISTING_VAULT"
  | "ALREADY_INSTALLED"
  | "EXISTING_PARA"
  | "NON_EMPTY_DIR";

export type InitMode = "existing" | "from-scratch";

export type NoteType =
  | "project"
  | "daily"
  | "resource"
  | "moc"
  | "task"
  | "inbox";

export interface VaultStatus {
  inboxCount: number;
  orphanedNotes: string[];
  staleMocs: { name: string; lastUpdated: Date }[];
  lastSync: Date | null;
  projectHealth: { name: string; status: string }[];
}

export interface InitOptions {
  path: string;
  mode: InitMode;
  force: boolean;
}

export interface TemplateInfo {
  name: string;
  description: string;
  file: string;
}

export interface DoctorCheck {
  name: string;
  passed: boolean;
  message: string;
  fix?: string;
}

export interface DoctorResult {
  checks: DoctorCheck[];
  passed: boolean;
}

export interface AiAgentProfile {
  id: string;
  name: string;
  binary: string;
  authInstructions: string;
  authUrl: string;
  keyStoragePath: string;
}

export interface AgentConfigEntry {
  keyStored: boolean;
  keyPath: string;
}

export interface OnboardingConfig {
  configVersion: number;
  activeAgent?: string;
  agentConfigs: Record<string, AgentConfigEntry>;
  onboardingComplete: boolean;
  completedAt?: string;
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  message: string;
  fix?: string;
}
