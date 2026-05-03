"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "auto";
export type DockPosition = "bottom" | "left" | "right";
export type AccentColor = "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "teal";

interface SettingsState {
  // Appearance
  theme: ThemeMode;
  accentColor: AccentColor;
  wallpaper: string;
  reduceMotion: boolean;
  reduceTransparency: boolean;
  
  // Dock
  dockPosition: DockPosition;
  dockIconSize: number;
  dockMagnification: boolean;
  dockAutoHide: boolean;
  
  // Desktop
  showDesktopIcons: boolean;
  iconSize: "small" | "medium" | "large";
  sortBy: "name" | "date" | "type" | "size";
  
  // Sound
  soundEffects: boolean;
  alertSound: string;
  
  // Accessibility
  fontSize: number;
  highContrast: boolean;
  
  // Privacy
  analyticsEnabled: boolean;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setWallpaper: (url: string) => void;
  setReduceMotion: (enabled: boolean) => void;
  setReduceTransparency: (enabled: boolean) => void;
  setDockPosition: (position: DockPosition) => void;
  setDockIconSize: (size: number) => void;
  setDockMagnification: (enabled: boolean) => void;
  setDockAutoHide: (enabled: boolean) => void;
  setShowDesktopIcons: (show: boolean) => void;
  setIconSize: (size: "small" | "medium" | "large") => void;
  setSortBy: (sort: "name" | "date" | "type" | "size") => void;
  setSoundEffects: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setHighContrast: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SETTINGS = {
  theme: "light" as ThemeMode,
  accentColor: "blue" as AccentColor,
  wallpaper: "/wallpapers/default.jpg",
  reduceMotion: false,
  reduceTransparency: false,
  dockPosition: "bottom" as DockPosition,
  dockIconSize: 48,
  dockMagnification: true,
  dockAutoHide: false,
  showDesktopIcons: true,
  iconSize: "medium" as const,
  sortBy: "name" as const,
  soundEffects: true,
  alertSound: "default",
  fontSize: 14,
  highContrast: false,
  analyticsEnabled: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          root.classList.remove("light", "dark");
          
          if (theme === "auto") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.add(prefersDark ? "dark" : "light");
          } else {
            root.classList.add(theme);
          }
        }
      },

      setAccentColor: (accentColor) => {
        set({ accentColor });
        // Apply accent color CSS variable
        if (typeof document !== "undefined") {
          const colors: Record<AccentColor, string> = {
            blue: "207 90% 54%",
            purple: "280 70% 55%",
            pink: "330 75% 60%",
            red: "0 70% 55%",
            orange: "25 90% 55%",
            yellow: "45 90% 55%",
            green: "142 76% 36%",
            teal: "180 50% 45%",
          };
          document.documentElement.style.setProperty("--accent", colors[accentColor]);
        }
      },

      setWallpaper: (wallpaper) => set({ wallpaper }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setReduceTransparency: (reduceTransparency) => set({ reduceTransparency }),
      setDockPosition: (dockPosition) => set({ dockPosition }),
      setDockIconSize: (dockIconSize) => set({ dockIconSize: Math.max(32, Math.min(72, dockIconSize)) }),
      setDockMagnification: (dockMagnification) => set({ dockMagnification }),
      setDockAutoHide: (dockAutoHide) => set({ dockAutoHide }),
      setShowDesktopIcons: (showDesktopIcons) => set({ showDesktopIcons }),
      setIconSize: (iconSize) => set({ iconSize }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSoundEffects: (soundEffects) => set({ soundEffects }),
      setFontSize: (fontSize) => set({ fontSize: Math.max(12, Math.min(20, fontSize)) }),
      setHighContrast: (highContrast) => set({ highContrast }),
      
      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "leetheos-settings",
    }
  )
);

// Accent color hex values for UI
export const ACCENT_COLORS: Record<AccentColor, { hex: string; hsl: string }> = {
  blue: { hex: "#2196F3", hsl: "207 90% 54%" },
  purple: { hex: "#9C27B0", hsl: "280 70% 55%" },
  pink: { hex: "#E91E63", hsl: "330 75% 60%" },
  red: { hex: "#F44336", hsl: "0 70% 55%" },
  orange: { hex: "#FF9800", hsl: "25 90% 55%" },
  yellow: { hex: "#FFC107", hsl: "45 90% 55%" },
  green: { hex: "#22C55E", hsl: "142 76% 36%" },
  teal: { hex: "#14B8A6", hsl: "180 50% 45%" },
};

// Default wallpapers
export const DEFAULT_WALLPAPERS = [
  { id: "default", name: "Aurora", url: "/wallpapers/default.jpg" },
  { id: "gradient-blue", name: "Ocean Blue", url: "/wallpapers/gradient-blue.jpg" },
  { id: "gradient-purple", name: "Nebula", url: "/wallpapers/gradient-purple.jpg" },
  { id: "mountains", name: "Mountains", url: "/wallpapers/mountains.jpg" },
  { id: "forest", name: "Forest", url: "/wallpapers/forest.jpg" },
  { id: "abstract", name: "Abstract", url: "/wallpapers/abstract.jpg" },
];
