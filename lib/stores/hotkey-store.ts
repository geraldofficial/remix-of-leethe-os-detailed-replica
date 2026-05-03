"use client";

import { create } from "zustand";

export type KeyModifier = "ctrl" | "cmd" | "shift" | "alt";
export type KeyAction = 
  | "launcher"
  | "quit"
  | "close-window"
  | "terminal"
  | "settings"
  | "cycle-windows"
  | "cycle-app-windows"
  | "hide-app"
  | "minimize"
  | "force-quit"
  | "window-switcher"
  | "fullscreen"
  | "snap-left"
  | "snap-right"
  | "snap-up"
  | "snap-down";

export interface Hotkey {
  key: string;
  modifiers: KeyModifier[];
  action: KeyAction;
  enabled: boolean;
}

interface HotkeyState {
  hotkeys: Map<string, Hotkey>;
  enabled: boolean;
  registerHotkey: (key: string, modifiers: KeyModifier[], action: KeyAction) => void;
  unregisterHotkey: (key: string) => void;
  setEnabled: (enabled: boolean) => void;
  getHotkey: (key: string, modifiers: KeyModifier[]) => Hotkey | undefined;
  parseKeyboardEvent: (e: KeyboardEvent) => { key: string; modifiers: KeyModifier[] };
}

const DEFAULT_HOTKEYS: Hotkey[] = [
  { key: " ", modifiers: ["cmd"], action: "launcher", enabled: true },
  { key: " ", modifiers: ["ctrl"], action: "launcher", enabled: true },
  { key: "q", modifiers: ["cmd"], action: "quit", enabled: true },
  { key: "q", modifiers: ["ctrl"], action: "quit", enabled: true },
  { key: "w", modifiers: ["cmd"], action: "close-window", enabled: true },
  { key: "w", modifiers: ["ctrl"], action: "close-window", enabled: true },
  { key: "t", modifiers: ["cmd", "alt"], action: "terminal", enabled: true },
  { key: "t", modifiers: ["ctrl", "alt"], action: "terminal", enabled: true },
  { key: ",", modifiers: ["cmd"], action: "settings", enabled: true },
  { key: ",", modifiers: ["ctrl"], action: "settings", enabled: true },
  { key: "Tab", modifiers: ["cmd"], action: "cycle-windows", enabled: true },
  { key: "Tab", modifiers: ["ctrl"], action: "cycle-windows", enabled: true },
  { key: "`", modifiers: ["cmd"], action: "cycle-app-windows", enabled: true },
  { key: "`", modifiers: ["ctrl"], action: "cycle-app-windows", enabled: true },
  { key: "h", modifiers: ["cmd"], action: "hide-app", enabled: true },
  { key: "h", modifiers: ["ctrl"], action: "hide-app", enabled: true },
  { key: "m", modifiers: ["cmd"], action: "minimize", enabled: true },
  { key: "m", modifiers: ["ctrl"], action: "minimize", enabled: true },
  { key: "Escape", modifiers: ["cmd", "shift"], action: "force-quit", enabled: true },
  { key: "Escape", modifiers: ["ctrl", "shift"], action: "force-quit", enabled: true },
  { key: "Tab", modifiers: ["alt"], action: "window-switcher", enabled: true },
  { key: "F11", modifiers: [], action: "fullscreen", enabled: true },
  { key: "ArrowLeft", modifiers: ["cmd"], action: "snap-left", enabled: true },
  { key: "ArrowLeft", modifiers: ["ctrl"], action: "snap-left", enabled: true },
  { key: "ArrowRight", modifiers: ["cmd"], action: "snap-right", enabled: true },
  { key: "ArrowRight", modifiers: ["ctrl"], action: "snap-right", enabled: true },
  { key: "ArrowUp", modifiers: ["cmd"], action: "snap-up", enabled: true },
  { key: "ArrowUp", modifiers: ["ctrl"], action: "snap-up", enabled: true },
  { key: "ArrowDown", modifiers: ["cmd"], action: "snap-down", enabled: true },
  { key: "ArrowDown", modifiers: ["ctrl"], action: "snap-down", enabled: true },
];

export const useHotkeyStore = create<HotkeyState>((set, get) => ({
  hotkeys: new Map(DEFAULT_HOTKEYS.map((h) => [`${h.key}-${h.modifiers.join("-")}`, h])),
  enabled: true,

  registerHotkey: (key, modifiers, action) => {
    set((state) => {
      const newHotkeys = new Map(state.hotkeys);
      newHotkeys.set(`${key}-${modifiers.join("-")}`, {
        key,
        modifiers,
        action,
        enabled: true,
      });
      return { hotkeys: newHotkeys };
    });
  },

  unregisterHotkey: (key) => {
    set((state) => {
      const newHotkeys = new Map(state.hotkeys);
      newHotkeys.delete(key);
      return { hotkeys: newHotkeys };
    });
  },

  setEnabled: (enabled) => set({ enabled }),

  getHotkey: (key, modifiers) => {
    const state = get();
    const sortedModifiers = [...modifiers].sort();
    return state.hotkeys.get(`${key}-${sortedModifiers.join("-")}`);
  },

  parseKeyboardEvent: (e: KeyboardEvent) => {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const key = e.key;
    const modifiers: KeyModifier[] = [];

    if ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) {
      modifiers.push(isMac ? "cmd" : "ctrl");
    }
    if (e.shiftKey) modifiers.push("shift");
    if (e.altKey) modifiers.push("alt");

    return { key, modifiers };
  },
}));
