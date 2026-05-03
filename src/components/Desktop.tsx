import { useState, useCallback } from 'react';
import wallpaper from '@/assets/wallpaper.jpg';
import TopPanel from './os/TopPanel';
import Dock from './os/Dock';
import AppLauncher from './os/AppLauncher';
import Window from './os/Window';
import { useWindowManager } from '@/hooks/useWindowManager';
import CodeApp from './apps/CodeApp';
import TerminalApp from './apps/TerminalApp';
import FilesApp from './apps/FilesApp';
import CalendarApp from './apps/CalendarApp';
import MailApp from './apps/MailApp';

const appRegistry: Record<string, { title: string; width: number; height: number; component: React.ComponentType }> = {
  code: { title: 'code', width: 900, height: 560, component: CodeApp },
  terminal: { title: 'dani@Mini: ~/Projects/terminal', width: 700, height: 480, component: TerminalApp },
  files: { title: 'Files', width: 800, height: 500, component: FilesApp },
  calendar: { title: 'Calendar', width: 850, height: 520, component: CalendarApp },
  mail: { title: 'Mail', width: 900, height: 560, component: MailApp },
};

export default function Desktop() {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow } = useWindowManager();

  const handleOpenApp = useCallback((appId: string) => {
    const app = appRegistry[appId];
    if (app) {
      openWindow(appId, app.title, app.width, app.height);
    }
  }, [openWindow]);

  return (
    <div className="h-screen w-screen overflow-hidden relative select-none">
      {/* Wallpaper */}
      <img src={wallpaper} alt="Leethe desktop wallpaper" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />

      {/* Top panel */}
      <TopPanel onApplicationsClick={() => setLauncherOpen(!launcherOpen)} />

      {/* App launcher */}
      <AppLauncher isOpen={launcherOpen} onClose={() => setLauncherOpen(false)} onOpenApp={handleOpenApp} />

      {/* Windows */}
      {windows.map(win => {
        const app = appRegistry[win.appId];
        if (!app) return null;
        const Comp = app.component;
        return (
          <Window key={win.id} win={win}
            onClose={closeWindow} onFocus={focusWindow}
            onMinimize={minimizeWindow} onMaximize={maximizeWindow} onMove={moveWindow}>
            <Comp />
          </Window>
        );
      })}

      {/* Dock */}
      <Dock onOpenApp={handleOpenApp} openAppIds={windows.map(w => w.appId)} />
    </div>
  );
}
