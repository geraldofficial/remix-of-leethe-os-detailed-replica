"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useOSStore } from "@/lib/stores/os-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useHotkeyStore } from "@/lib/stores/hotkey-store";
import TopBar from "./TopBar";
import Dock from "./Dock";
import Window from "./Window";
import AppLauncher from "./AppLauncher";
import ContextMenu from "./ContextMenu";
import { getApp } from "@/lib/os/app-registry";
import type { MenuItem } from "@/lib/types";
import type { SnapPosition } from "@/lib/stores/os-store";

// Import and register all apps
import "@/components/apps";

export default function Desktop() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const dockHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const {
    windows,
    isLauncherOpen,
    dockVisible,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    snapWindow,
    closeAllWindowsForApp,
    setLauncherOpen,
    setDockVisible,
  } = useOSStore();

  const { parseKeyboardEvent, getHotkey } = useHotkeyStore();

  const { wallpaper, dockAutoHide, theme } = useSettingsStore();
  
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: MenuItem[];
  } | null>(null);

  // Apply theme on mount and changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Auto-hide dock logic
  const hasWindows = windows.length > 0;
  
  const showDock = useCallback(() => {
    if (dockHideTimer.current) clearTimeout(dockHideTimer.current);
    setDockVisible(true);
  }, [setDockVisible]);

  const scheduleHideDock = useCallback(() => {
    if (!dockAutoHide) return;
    if (dockHideTimer.current) clearTimeout(dockHideTimer.current);
    dockHideTimer.current = setTimeout(() => setDockVisible(false), 600);
  }, [dockAutoHide, setDockVisible]);

  useEffect(() => {
    if (dockAutoHide && hasWindows) {
      scheduleHideDock();
    } else {
      showDock();
    }
  }, [hasWindows, dockAutoHide, scheduleHideDock, showDock]);

  const handleOpenApp = useCallback(
    (appId: string) => {
      const app = getApp(appId);
      if (app) {
        openWindow(
          appId,
          app.name,
          app.defaultWidth,
          app.defaultHeight,
          app.minWidth,
          app.minHeight
        );
      }
    },
    [openWindow]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, modifiers } = parseKeyboardEvent(e);
      const hotkey = getHotkey(key, modifiers);

      if (!hotkey) return;

      e.preventDefault();

      switch (hotkey.action) {
        case "launcher":
          setLauncherOpen(!isLauncherOpen);
          break;
        case "close-window":
          if (activeWindowId) closeWindow(activeWindowId);
          break;
        case "terminal":
          handleOpenApp("terminal");
          break;
        case "settings":
          handleOpenApp("settings");
          break;
        case "minimize":
          if (activeWindowId) minimizeWindow(activeWindowId);
          break;
        case "snap-left":
          if (activeWindowId) snapWindow(activeWindowId, "left");
          break;
        case "snap-right":
          if (activeWindowId) snapWindow(activeWindowId, "right");
          break;
        case "snap-up":
          if (activeWindowId) {
            const win = windows.find((w) => w.id === activeWindowId);
            if (win?.isMaximized) {
              maximizeWindow(activeWindowId);
            } else {
              snapWindow(activeWindowId, "top");
            }
          }
          break;
        case "snap-down":
          if (activeWindowId) snapWindow(activeWindowId, null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeWindowId, isLauncherOpen, windows, parseKeyboardEvent, getHotkey, setLauncherOpen, closeWindow, minimizeWindow, snapWindow, maximizeWindow, handleOpenApp]);

  const handleDesktopContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.dataset.desktop && target !== desktopRef.current) return;
      
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: "New Folder", onClick: () => {} },
          { label: "New File", onClick: () => {} },
          { separator: true },
          { label: "Change Wallpaper...", onClick: () => handleOpenApp("settings") },
          { label: "Display Settings", onClick: () => handleOpenApp("settings") },
          { separator: true },
          { label: "Open Terminal Here", onClick: () => handleOpenApp("terminal"), shortcut: "Ctrl+Alt+T" },
          { label: "Refresh", onClick: () => window.location.reload() },
        ],
      });
    },
    [handleOpenApp]
  );

  const handleDesktopClick = useCallback(() => {
    setLauncherOpen(false);
    setContextMenu(null);
  }, [setLauncherOpen]);

  return (
    <div
      ref={desktopRef}
      className="h-screen w-screen overflow-hidden relative select-none"
      onContextMenu={handleDesktopContextMenu}
      onClick={handleDesktopClick}
      data-desktop="true"
    >
      {/* Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        data-desktop="true"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundColor: "#1a1a2e",
        }}
      />

      {/* Top Bar */}
      <TopBar onApplicationsClick={() => setLauncherOpen(!isLauncherOpen)} />

      {/* App Launcher */}
      <AppLauncher
        isOpen={isLauncherOpen}
        onClose={() => setLauncherOpen(false)}
        onOpenApp={handleOpenApp}
      />

      {/* Windows */}
      {windows.map((win) => {
        const app = getApp(win.appId);
        if (!app) return null;
        
        const AppComponent = app.component;
        
        return (
          <Window
            key={win.id}
            win={win}
            onClose={closeWindow}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onMove={moveWindow}
            onResize={resizeWindow}
            onSnap={snapWindow}
            onContextMenu={(x, y) =>
              setContextMenu({
                x,
                y,
                items: [
                  {
                    label: win.isMaximized ? "Restore" : "Maximize",
                    onClick: () => maximizeWindow(win.id),
                  },
                  { label: "Minimize", onClick: () => minimizeWindow(win.id) },
                  { separator: true },
                  { label: "Always on Top", disabled: true },
                  { separator: true },
                  { label: "Close", onClick: () => closeWindow(win.id), shortcut: "Cmd+W" },
                ],
              })
            }
          >
            <AppComponent windowId={win.id} />
          </Window>
        );
      })}

      {/* Bottom hover trigger for auto-hide dock */}
      {dockAutoHide && hasWindows && (
        <div
          aria-hidden
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{ height: 8 }}
          onMouseEnter={showDock}
        />
      )}

      {/* Dock */}
      <Dock
        onOpenApp={handleOpenApp}
        openAppIds={windows.map((w) => w.appId)}
        visible={!dockAutoHide || !hasWindows || dockVisible}
        onMouseEnter={showDock}
        onMouseLeave={dockAutoHide && hasWindows ? scheduleHideDock : undefined}
        onContextMenu={(appId, x, y) => {
          const isOpen = windows.some((w) => w.appId === appId);
          setContextMenu({
            x,
            y,
            items: [
              { label: "Open", onClick: () => handleOpenApp(appId) },
              { label: "New Window", onClick: () => handleOpenApp(appId) },
              { separator: true },
              { label: "Keep in Dock", disabled: true },
              { label: "Show All Windows", disabled: !isOpen },
              { separator: true },
              { label: "Quit", disabled: !isOpen, onClick: () => closeAllWindowsForApp(appId) },
            ],
          });
        }}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
