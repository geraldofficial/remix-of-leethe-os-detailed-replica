import { useState, useCallback, useRef } from 'react';
import wallpaper from '@/assets/wallpaper.jpg';
import TopPanel from './os/TopPanel';
import Dock from './os/Dock';
import AppLauncher from './os/AppLauncher';
import Window from './os/Window';
import ContextMenu, { MenuItem } from './os/ContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import CodeApp from './apps/CodeApp';
import TerminalApp from './apps/TerminalApp';
import FilesApp from './apps/FilesApp';
import CalendarApp from './apps/CalendarApp';
import MailApp from './apps/MailApp';
import PlaceholderApp from './apps/PlaceholderApp';

interface AppMeta {
  title: string; width: number; height: number;
  component: React.ComponentType<{ appId: string }>;
}

const appRegistry: Record<string, AppMeta> = {
  code: { title: 'Code', width: 900, height: 560, component: CodeApp },
  terminal: { title: 'Terminal', width: 700, height: 480, component: TerminalApp },
  files: { title: 'Files', width: 800, height: 500, component: FilesApp },
  calendar: { title: 'Calendar', width: 850, height: 520, component: CalendarApp },
  mail: { title: 'Mail', width: 900, height: 560, component: MailApp },
  browser: { title: 'Web', width: 900, height: 600, component: PlaceholderApp },
  tasks: { title: 'Tasks', width: 700, height: 500, component: PlaceholderApp },
  music: { title: 'Music', width: 900, height: 560, component: PlaceholderApp },
  videos: { title: 'Videos', width: 900, height: 560, component: PlaceholderApp },
  photos: { title: 'Photos', width: 900, height: 560, component: PlaceholderApp },
  settings: { title: 'System Settings', width: 800, height: 540, component: PlaceholderApp },
  calculator: { title: 'Calculator', width: 360, height: 480, component: PlaceholderApp },
  camera: { title: 'Camera', width: 700, height: 500, component: PlaceholderApp },
  maps: { title: 'Maps', width: 900, height: 560, component: PlaceholderApp },
  monitor: { title: 'System Monitor', width: 800, height: 540, component: PlaceholderApp },
  docviewer: { title: 'Document Viewer', width: 800, height: 600, component: PlaceholderApp },
  feedback: { title: 'Feedback', width: 600, height: 500, component: PlaceholderApp },
  appcenter: { title: 'AppCenter', width: 900, height: 600, component: PlaceholderApp },
  screenshot: { title: 'Screenshot', width: 500, height: 380, component: PlaceholderApp },
  multitasking: { title: 'Multitasking', width: 900, height: 560, component: PlaceholderApp },
  plus: { title: 'Add App', width: 600, height: 400, component: PlaceholderApp },
};

export const APP_REGISTRY = appRegistry;

export default function Desktop() {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const [dockVisible, setDockVisible] = useState(true);
  const dockHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const { windows, openOrFocus, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow, closeAllForApp } = useWindowManager();

  const showDock = useCallback(() => {
    if (dockHideTimer.current) clearTimeout(dockHideTimer.current);
    setDockVisible(true);
  }, []);
  const scheduleHideDock = useCallback(() => {
    if (dockHideTimer.current) clearTimeout(dockHideTimer.current);
    dockHideTimer.current = setTimeout(() => setDockVisible(false), 600);
  }, []);

  // Auto-hide when any window exists; always show on empty desktop
  const hasWindows = windows.length > 0;

  const handleOpenApp = useCallback((appId: string) => {
    const app = appRegistry[appId];
    if (app) openOrFocus(appId, app.title, app.width, app.height);
  }, [openOrFocus]);

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    if (e.target !== desktopRef.current && !(e.target as HTMLElement).dataset.desktop) return;
    e.preventDefault();
    setCtxMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'New Folder', onClick: () => {} },
        { separator: true },
        { label: 'Change Wallpaper…', onClick: () => {} },
        { label: 'Display Settings', onClick: () => handleOpenApp('settings') },
        { separator: true },
        { label: 'Open Terminal Here', onClick: () => handleOpenApp('terminal'), shortcut: '⌃⌥T' },
      ],
    });
  }, [handleOpenApp]);

  return (
    <div className="h-screen w-screen overflow-hidden relative select-none" ref={desktopRef}
      onContextMenu={handleDesktopContextMenu} data-desktop="true">
      <img src={wallpaper} alt="Leethe desktop wallpaper" data-desktop="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" width={1920} height={1080} />

      <TopPanel onApplicationsClick={() => setLauncherOpen(o => !o)} />

      <AppLauncher isOpen={launcherOpen} onClose={() => setLauncherOpen(false)} onOpenApp={handleOpenApp} />

      {windows.map(win => {
        const app = appRegistry[win.appId];
        if (!app) return null;
        const Comp = app.component;
        return (
          <Window key={win.id} win={win}
            onClose={closeWindow} onFocus={focusWindow}
            onMinimize={minimizeWindow} onMaximize={maximizeWindow} onMove={moveWindow}
            onContextMenu={(x, y) => setCtxMenu({
              x, y, items: [
                { label: win.isMaximized ? 'Restore' : 'Maximize', onClick: () => maximizeWindow(win.id) },
                { label: 'Minimize', onClick: () => minimizeWindow(win.id) },
                { separator: true },
                { label: 'Always on Top', disabled: true },
                { separator: true },
                { label: 'Close', onClick: () => closeWindow(win.id), shortcut: '⌘W' },
              ],
            })}>
            <Comp appId={win.appId} />
          </Window>
        );
      })}

      <Dock
        onOpenApp={handleOpenApp}
        openAppIds={windows.map(w => w.appId)}
        onContextMenu={(appId, x, y) => {
          const isOpen = windows.some(w => w.appId === appId);
          setCtxMenu({
            x, y, items: [
              { label: 'Open', onClick: () => handleOpenApp(appId) },
              { label: 'New Window', onClick: () => {
                const a = appRegistry[appId];
                if (a) openOrFocus(appId, a.title, a.width, a.height, true);
              } },
              { separator: true },
              { label: 'Keep in Dock', disabled: true },
              { label: 'Show All Windows', disabled: !isOpen },
              { separator: true },
              { label: 'Quit', disabled: !isOpen, onClick: () => closeAllForApp(appId) },
            ],
          });
        }}
      />

      {ctxMenu && <ContextMenu x={ctxMenu.x} y={ctxMenu.y} items={ctxMenu.items} onClose={() => setCtxMenu(null)} />}
    </div>
  );
}
