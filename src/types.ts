export type VaultState =
  | "EMPTY"
  | "EXISTING_VAULT"
  | "ALREADY_INSTALLED"
  | "EXISTING_PARA"
  | "NON_EMPTY_DIR";

export type InitMode = "existing" | "from-scratch";

export type NoteType = "project" | "daily" | "resource" | "moc" | "task";

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
