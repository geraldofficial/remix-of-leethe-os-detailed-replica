"use client";

import { type ComponentType } from "react";

export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
  component: ComponentType<{ windowId: string }>;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  category: AppCategory;
  isSystem: boolean;
  singleInstance: boolean;
  permissions: AppPermission[];
}

export type AppCategory = 
  | "productivity"
  | "utilities"
  | "media"
  | "development"
  | "system"
  | "games"
  | "social"
  | "other";

export type AppPermission =
  | "filesystem.read"
  | "filesystem.write"
  | "network"
  | "notifications"
  | "camera"
  | "microphone"
  | "clipboard"
  | "storage";

// App registry - will be populated by components
const appRegistry = new Map<string, AppDefinition>();

export function registerApp(app: AppDefinition): void {
  appRegistry.set(app.id, app);
}

export function getApp(id: string): AppDefinition | undefined {
  return appRegistry.get(id);
}

export function getAllApps(): AppDefinition[] {
  return Array.from(appRegistry.values());
}

export function getAppsByCategory(category: AppCategory): AppDefinition[] {
  return getAllApps().filter((app) => app.category === category);
}

export function getSystemApps(): AppDefinition[] {
  return getAllApps().filter((app) => app.isSystem);
}

export function getUserApps(): AppDefinition[] {
  return getAllApps().filter((app) => !app.isSystem);
}

// Export for use in components
export { appRegistry };
