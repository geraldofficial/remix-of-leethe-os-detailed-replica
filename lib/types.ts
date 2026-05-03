// Re-export all types from stores and modules
export type { AppWindow, Process, Notification } from "./stores/os-store";
export type { ThemeMode, DockPosition, AccentColor } from "./stores/settings-store";
export type { FileNode, FileType, MimeType } from "./os/filesystem";
export type { AppDefinition, AppCategory, AppPermission } from "./os/app-registry";

// Additional shared types
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds extends Point, Size {}

export interface MenuItem {
  label: string;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: MenuItem[];
  checked?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

export interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: "file" | "folder" | "app" | "shortcut";
  path?: string;
  appId?: string;
  position: Point;
}

// Terminal types
export interface TerminalCommand {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[], context: TerminalContext) => Promise<TerminalOutput>;
}

export interface TerminalContext {
  cwd: string;
  env: Record<string, string>;
  history: string[];
  user: string;
}

export interface TerminalOutput {
  content: string;
  type: "output" | "error" | "success" | "info" | "warning";
  isHtml?: boolean;
}

// External app types (from GitHub)
export interface ExternalAppManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  icon: string;
  repository: string;
  mainFile: string;
  permissions: string[];
  screenshots: string[];
  category: string;
  minOsVersion?: string;
}

export interface InstalledApp extends ExternalAppManifest {
  installedAt: Date;
  lastUpdated: Date;
  size: number;
}
