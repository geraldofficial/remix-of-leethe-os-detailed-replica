"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "light" | "dark" | "highcontrast" | "sepia" | "nord" | "dracula";

export interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    panelBg: string;
    panelFg: string;
    windowBg: string;
    windowHeader: string;
    windowBorder: string;
    dockBg: string;
    launcherBg: string;
    terminalBg: string;
    terminalFg: string;
    sidebarBg: string;
    sidebarFg: string;
    toolbarBg: string;
    highlight: string;
    highlightText: string;
  };
}

export const THEMES: Record<ThemeName, Theme> = {
  light: {
    name: "light",
    label: "Light",
    colors: {
      background: "0 0% 96%",
      foreground: "210 11% 15%",
      card: "0 0% 100%",
      cardForeground: "210 11% 15%",
      primary: "210 11% 15%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 93%",
      secondaryForeground: "210 11% 15%",
      muted: "0 0% 93%",
      mutedForeground: "210 6% 45%",
      accent: "207 90% 54%",
      accentForeground: "0 0% 100%",
      destructive: "0 65% 51%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 85%",
      input: "0 0% 85%",
      ring: "207 90% 54%",
      panelBg: "210 11% 15%",
      panelFg: "0 0% 100%",
      windowBg: "0 0% 98%",
      windowHeader: "0 0% 95%",
      windowBorder: "0 0% 80%",
      dockBg: "0 0% 20%",
      launcherBg: "0 0% 97%",
      terminalBg: "210 14% 14%",
      terminalFg: "0 0% 85%",
      sidebarBg: "0 0% 93%",
      sidebarFg: "210 6% 35%",
      toolbarBg: "0 0% 95%",
      highlight: "170 50% 90%",
      highlightText: "170 40% 30%",
    },
  },
  dark: {
    name: "dark",
    label: "Dark",
    colors: {
      background: "0 0% 9%",
      foreground: "0 0% 95%",
      card: "0 0% 14%",
      cardForeground: "0 0% 95%",
      primary: "0 0% 95%",
      primaryForeground: "0 0% 9%",
      secondary: "0 0% 25%",
      secondaryForeground: "0 0% 95%",
      muted: "0 0% 25%",
      mutedForeground: "0 0% 65%",
      accent: "207 90% 60%",
      accentForeground: "0 0% 0%",
      destructive: "0 70% 55%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 25%",
      input: "0 0% 25%",
      ring: "207 90% 60%",
      panelBg: "0 0% 20%",
      panelFg: "0 0% 95%",
      windowBg: "0 0% 12%",
      windowHeader: "0 0% 18%",
      windowBorder: "0 0% 30%",
      dockBg: "0 0% 15%",
      launcherBg: "0 0% 18%",
      terminalBg: "0 0% 8%",
      terminalFg: "0 0% 85%",
      sidebarBg: "0 0% 18%",
      sidebarFg: "0 0% 85%",
      toolbarBg: "0 0% 16%",
      highlight: "207 90% 35%",
      highlightText: "207 90% 85%",
    },
  },
  highcontrast: {
    name: "highcontrast",
    label: "High Contrast",
    colors: {
      background: "0 0% 100%",
      foreground: "0 0% 0%",
      card: "0 0% 100%",
      cardForeground: "0 0% 0%",
      primary: "0 0% 0%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 85%",
      secondaryForeground: "0 0% 0%",
      muted: "0 0% 85%",
      mutedForeground: "0 0% 30%",
      accent: "0 100% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 100% 35%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 0%",
      input: "0 0% 85%",
      ring: "0 100% 50%",
      panelBg: "0 0% 0%",
      panelFg: "0 0% 100%",
      windowBg: "0 0% 100%",
      windowHeader: "0 0% 90%",
      windowBorder: "0 0% 0%",
      dockBg: "0 0% 0%",
      launcherBg: "0 0% 100%",
      terminalBg: "0 0% 0%",
      terminalFg: "0 0% 100%",
      sidebarBg: "0 0% 90%",
      sidebarFg: "0 0% 0%",
      toolbarBg: "0 0% 95%",
      highlight: "60 100% 50%",
      highlightText: "0 0% 0%",
    },
  },
  sepia: {
    name: "sepia",
    label: "Sepia",
    colors: {
      background: "30 40% 92%",
      foreground: "30 20% 20%",
      card: "30 30% 96%",
      cardForeground: "30 20% 20%",
      primary: "30 20% 20%",
      primaryForeground: "30 30% 96%",
      secondary: "30 25% 85%",
      secondaryForeground: "30 20% 20%",
      muted: "30 25% 85%",
      mutedForeground: "30 10% 40%",
      accent: "25 80% 50%",
      accentForeground: "30 30% 96%",
      destructive: "10 80% 50%",
      destructiveForeground: "30 30% 96%",
      border: "30 15% 75%",
      input: "30 15% 75%",
      ring: "25 80% 50%",
      panelBg: "30 20% 25%",
      panelFg: "30 30% 96%",
      windowBg: "30 25% 94%",
      windowHeader: "30 20% 85%",
      windowBorder: "30 15% 70%",
      dockBg: "30 15% 30%",
      launcherBg: "30 25% 94%",
      terminalBg: "30 20% 20%",
      terminalFg: "30 30% 85%",
      sidebarBg: "30 20% 85%",
      sidebarFg: "30 20% 30%",
      toolbarBg: "30 20% 90%",
      highlight: "25 70% 70%",
      highlightText: "30 20% 20%",
    },
  },
  nord: {
    name: "nord",
    label: "Nord",
    colors: {
      background: "220 16% 20%",
      foreground: "220 16% 92%",
      card: "220 16% 26%",
      cardForeground: "220 16% 92%",
      primary: "220 16% 92%",
      primaryForeground: "220 16% 20%",
      secondary: "220 16% 35%",
      secondaryForeground: "220 16% 92%",
      muted: "220 16% 35%",
      mutedForeground: "220 8% 65%",
      accent: "192 81% 60%",
      accentForeground: "220 16% 20%",
      destructive: "11 85% 67%",
      destructiveForeground: "220 16% 20%",
      border: "220 16% 35%",
      input: "220 16% 35%",
      ring: "192 81% 60%",
      panelBg: "220 16% 15%",
      panelFg: "220 16% 92%",
      windowBg: "220 16% 24%",
      windowHeader: "220 16% 30%",
      windowBorder: "220 16% 40%",
      dockBg: "220 16% 12%",
      launcherBg: "220 16% 24%",
      terminalBg: "220 16% 15%",
      terminalFg: "220 16% 85%",
      sidebarBg: "220 16% 28%",
      sidebarFg: "220 16% 85%",
      toolbarBg: "220 16% 26%",
      highlight: "192 81% 45%",
      highlightText: "220 16% 92%",
    },
  },
  dracula: {
    name: "dracula",
    label: "Dracula",
    colors: {
      background: "231 15% 18%",
      foreground: "231 15% 95%",
      card: "231 15% 24%",
      cardForeground: "231 15% 95%",
      primary: "231 15% 95%",
      primaryForeground: "231 15% 18%",
      secondary: "231 15% 35%",
      secondaryForeground: "231 15% 95%",
      muted: "231 15% 35%",
      mutedForeground: "231 8% 65%",
      accent: "265 90% 65%",
      accentForeground: "231 15% 18%",
      destructive: "0 85% 65%",
      destructiveForeground: "231 15% 18%",
      border: "231 15% 35%",
      input: "231 15% 35%",
      ring: "265 90% 65%",
      panelBg: "231 15% 13%",
      panelFg: "231 15% 95%",
      windowBg: "231 15% 22%",
      windowHeader: "231 15% 28%",
      windowBorder: "231 15% 40%",
      dockBg: "231 15% 10%",
      launcherBg: "231 15% 22%",
      terminalBg: "231 15% 13%",
      terminalFg: "231 15% 85%",
      sidebarBg: "231 15% 26%",
      sidebarFg: "231 15% 85%",
      toolbarBg: "231 15% 24%",
      highlight: "265 90% 50%",
      highlightText: "231 15% 95%",
    },
  },
};

interface ThemeStoreState {
  currentTheme: ThemeName;
  customColors: Partial<Theme["colors"]>;
  setTheme: (theme: ThemeName) => void;
  setCustomColor: (colorKey: keyof Theme["colors"], value: string) => void;
  resetCustomColors: () => void;
  getTheme: () => Theme;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      currentTheme: "light",
      customColors: {},

      setTheme: (theme: ThemeName) => {
        set({ currentTheme: theme, customColors: {} });
        applyTheme(theme, {});
      },

      setCustomColor: (colorKey: keyof Theme["colors"], value: string) => {
        set((state) => {
          const newCustomColors = { ...state.customColors, [colorKey]: value };
          applyTheme(state.currentTheme, newCustomColors);
          return { customColors: newCustomColors };
        });
      },

      resetCustomColors: () => {
        set({ customColors: {} });
        applyTheme(get().currentTheme, {});
      },

      getTheme: () => {
        const state = get();
        const baseTheme = THEMES[state.currentTheme];
        return {
          ...baseTheme,
          colors: {
            ...baseTheme.colors,
            ...state.customColors,
          },
        };
      },
    }),
    {
      name: "leetheos-theme",
    }
  )
);

function applyTheme(themeName: ThemeName, customColors: Partial<Theme["colors"]>) {
  if (typeof document === "undefined") return;

  const baseTheme = THEMES[themeName];
  const finalColors = { ...baseTheme.colors, ...customColors };

  const root = document.documentElement;

  // Apply CSS variables
  Object.entries(finalColors).forEach(([key, value]) => {
    const cssVar = camelToKebab(key);
    root.style.setProperty(`--${cssVar}`, value);
  });

  // Update document class for theme
  root.classList.remove("light-theme", "dark-theme", "highcontrast-theme", "sepia-theme", "nord-theme", "dracula-theme");
  root.classList.add(`${themeName}-theme`);
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
