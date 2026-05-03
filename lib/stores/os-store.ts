"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SnapPosition = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | null;

export interface AppWindow {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  snapPosition?: SnapPosition;
  prevBounds?: { x: number; y: number; width: number; height: number };
}

export interface Process {
  id: string;
  appId: string;
  windowId: string;
  startedAt: Date;
  status: "running" | "suspended" | "terminated";
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  appId?: string;
  timestamp: Date;
  read: boolean;
}

interface OSState {
  // Boot state
  isBooted: boolean;
  bootProgress: number;
  
  // Windows
  windows: AppWindow[];
  nextZIndex: number;
  
  // Processes
  processes: Process[];
  
  // UI State
  isLauncherOpen: boolean;
  isControlCenterOpen: boolean;
  isNotificationCenterOpen: boolean;
  activeWindowId: string | null;
  
  // Dock
  pinnedApps: string[];
  dockVisible: boolean;
  
  // Notifications
  notifications: Notification[];
  doNotDisturb: boolean;
  
  // System
  volume: number;
  brightness: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  
  // Actions
  boot: () => Promise<void>;
  shutdown: () => void;
  
  // Window actions
  openWindow: (appId: string, title: string, width: number, height: number, minWidth?: number, minHeight?: number) => string;
  closeWindow: (id: string) => void;
  closeAllWindowsForApp: (appId: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  snapWindow: (id: string, position: SnapPosition) => void;
  
  // UI actions
  setLauncherOpen: (open: boolean) => void;
  setControlCenterOpen: (open: boolean) => void;
  setNotificationCenterOpen: (open: boolean) => void;
  setDockVisible: (visible: boolean) => void;
  
  // Dock actions
  pinApp: (appId: string) => void;
  unpinApp: (appId: string) => void;
  reorderPinnedApps: (appIds: string[]) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setDoNotDisturb: (enabled: boolean) => void;
  
  // System actions
  setVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  setWifiEnabled: (enabled: boolean) => void;
  setBluetoothEnabled: (enabled: boolean) => void;
}

const DEFAULT_PINNED_APPS = [
  "files",
  "browser", 
  "terminal",
  "code",
  "music",
  "photos",
  "calendar",
  "settings",
  "appcenter",
];

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      // Initial state
      isBooted: false,
      bootProgress: 0,
      windows: [],
      nextZIndex: 100,
      processes: [],
      isLauncherOpen: false,
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
      activeWindowId: null,
      pinnedApps: DEFAULT_PINNED_APPS,
      dockVisible: true,
      notifications: [],
      doNotDisturb: false,
      volume: 75,
      brightness: 100,
      wifiEnabled: true,
      bluetoothEnabled: false,

      // Boot sequence
      boot: async () => {
        const steps = [10, 25, 40, 55, 70, 85, 95, 100];
        for (const progress of steps) {
          await new Promise((r) => setTimeout(r, 150));
          set({ bootProgress: progress });
        }
        await new Promise((r) => setTimeout(r, 300));
        set({ isBooted: true });
      },

      shutdown: () => {
        set({ 
          isBooted: false, 
          bootProgress: 0, 
          windows: [], 
          processes: [],
          isLauncherOpen: false,
          isControlCenterOpen: false,
          isNotificationCenterOpen: false,
        });
      },

      // Window management
      openWindow: (appId, title, width, height, minWidth = 400, minHeight = 300) => {
        const state = get();
        
        // Check if app is already open (single instance)
        const existing = state.windows.find((w) => w.appId === appId);
        if (existing) {
          // Focus existing window
          get().focusWindow(existing.id);
          if (existing.isMinimized) {
            get().restoreWindow(existing.id);
          }
          return existing.id;
        }

        const id = `${appId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const offset = (state.windows.length % 5) * 30;
        const x = Math.max(50, 100 + offset);
        const y = Math.max(50, 80 + offset);
        
        const newWindow: AppWindow = {
          id,
          appId,
          title,
          x,
          y,
          width,
          height,
          minWidth,
          minHeight,
          isMinimized: false,
          isMaximized: false,
          zIndex: state.nextZIndex,
        };

        const process: Process = {
          id: `proc-${id}`,
          appId,
          windowId: id,
          startedAt: new Date(),
          status: "running",
        };

        set({
          windows: [...state.windows, newWindow],
          processes: [...state.processes, process],
          nextZIndex: state.nextZIndex + 1,
          activeWindowId: id,
        });

        return id;
      },

      closeWindow: (id) => {
        set((state) => ({
          windows: state.windows.filter((w) => w.id !== id),
          processes: state.processes.filter((p) => p.windowId !== id),
          activeWindowId: state.activeWindowId === id 
            ? state.windows.filter((w) => w.id !== id)[0]?.id ?? null 
            : state.activeWindowId,
        }));
      },

      closeAllWindowsForApp: (appId) => {
        set((state) => ({
          windows: state.windows.filter((w) => w.appId !== appId),
          processes: state.processes.filter((p) => p.appId !== appId),
        }));
      },

      focusWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id 
              ? { ...w, zIndex: state.nextZIndex, isMinimized: false } 
              : w
          ),
          nextZIndex: state.nextZIndex + 1,
          activeWindowId: id,
          isLauncherOpen: false,
          isControlCenterOpen: false,
          isNotificationCenterOpen: false,
        }));
      },

      minimizeWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMinimized: true } : w
          ),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        }));
      },

      maximizeWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            if (w.isMaximized) {
              // Restore
              return {
                ...w,
                isMaximized: false,
                x: w.prevBounds?.x ?? w.x,
                y: w.prevBounds?.y ?? w.y,
                width: w.prevBounds?.width ?? w.width,
                height: w.prevBounds?.height ?? w.height,
                prevBounds: undefined,
              };
            } else {
              // Maximize
              return {
                ...w,
                isMaximized: true,
                prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
              };
            }
          }),
        }));
      },

      restoreWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
          ),
          nextZIndex: state.nextZIndex + 1,
          activeWindowId: id,
        }));
      },

      moveWindow: (id, x, y) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, x, y } : w
          ),
        }));
      },

      resizeWindow: (id, width, height) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id 
              ? { 
                  ...w, 
                  width: Math.max(w.minWidth, width), 
                  height: Math.max(w.minHeight, height) 
                } 
              : w
          ),
        }));
      },

      snapWindow: (id, position) => {
        if (!position) {
          // Unsnap - restore previous bounds
          set((state) => ({
            windows: state.windows.map((w) => {
              if (w.id !== id) return w;
              return {
                ...w,
                snapPosition: null,
                x: w.prevBounds?.x ?? w.x,
                y: w.prevBounds?.y ?? w.y,
                width: w.prevBounds?.width ?? w.width,
                height: w.prevBounds?.height ?? w.height,
                prevBounds: undefined,
              };
            }),
          }));
          return;
        }

        // Get viewport dimensions (accounting for topbar at 28px height)
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
        const viewportHeight = typeof window !== "undefined" ? window.innerHeight - 28 : 1080 - 28;
        const topbarHeight = 28;

        let newBounds = { x: 0, y: topbarHeight, width: viewportWidth / 2, height: viewportHeight };

        switch (position) {
          case "left":
            newBounds = { x: 0, y: topbarHeight, width: viewportWidth / 2, height: viewportHeight };
            break;
          case "right":
            newBounds = { x: viewportWidth / 2, y: topbarHeight, width: viewportWidth / 2, height: viewportHeight };
            break;
          case "top":
            newBounds = { x: 0, y: topbarHeight, width: viewportWidth, height: viewportHeight / 2 };
            break;
          case "bottom":
            newBounds = { x: 0, y: topbarHeight + viewportHeight / 2, width: viewportWidth, height: viewportHeight / 2 };
            break;
          case "top-left":
            newBounds = { x: 0, y: topbarHeight, width: viewportWidth / 2, height: viewportHeight / 2 };
            break;
          case "top-right":
            newBounds = { x: viewportWidth / 2, y: topbarHeight, width: viewportWidth / 2, height: viewportHeight / 2 };
            break;
          case "bottom-left":
            newBounds = { x: 0, y: topbarHeight + viewportHeight / 2, width: viewportWidth / 2, height: viewportHeight / 2 };
            break;
          case "bottom-right":
            newBounds = { x: viewportWidth / 2, y: topbarHeight + viewportHeight / 2, width: viewportWidth / 2, height: viewportHeight / 2 };
            break;
        }

        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            return {
              ...w,
              snapPosition: position,
              prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
              ...newBounds,
            };
          }),
        }));
      },

      // UI actions
      setLauncherOpen: (open) => set({ 
        isLauncherOpen: open,
        isControlCenterOpen: false,
        isNotificationCenterOpen: false,
      }),
      
      setControlCenterOpen: (open) => set({ 
        isControlCenterOpen: open,
        isLauncherOpen: false,
        isNotificationCenterOpen: false,
      }),
      
      setNotificationCenterOpen: (open) => set({ 
        isNotificationCenterOpen: open,
        isLauncherOpen: false,
        isControlCenterOpen: false,
      }),
      
      setDockVisible: (visible) => set({ dockVisible: visible }),

      // Dock actions
      pinApp: (appId) => {
        set((state) => ({
          pinnedApps: state.pinnedApps.includes(appId)
            ? state.pinnedApps
            : [...state.pinnedApps, appId],
        }));
      },

      unpinApp: (appId) => {
        set((state) => ({
          pinnedApps: state.pinnedApps.filter((id) => id !== appId),
        }));
      },

      reorderPinnedApps: (appIds) => set({ pinnedApps: appIds }),

      // Notifications
      addNotification: (notification) => {
        const state = get();
        if (state.doNotDisturb) return;
        
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date(),
          read: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50),
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),
      
      setDoNotDisturb: (enabled) => set({ doNotDisturb: enabled }),

      // System
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
      setBrightness: (brightness) => set({ brightness: Math.max(0, Math.min(100, brightness)) }),
      setWifiEnabled: (enabled) => set({ wifiEnabled: enabled }),
      setBluetoothEnabled: (enabled) => set({ bluetoothEnabled: enabled }),
    }),
    {
      name: "leetheos-state",
      partialize: (state) => ({
        pinnedApps: state.pinnedApps,
        volume: state.volume,
        brightness: state.brightness,
        wifiEnabled: state.wifiEnabled,
        bluetoothEnabled: state.bluetoothEnabled,
        doNotDisturb: state.doNotDisturb,
      }),
    }
  )
);
