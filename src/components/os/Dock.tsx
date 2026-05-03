import { useState } from 'react';
import {
  FilesIcon, BrowserIcon, MailAppIcon, TasksIcon, MusicIcon,
  VideosIcon, PhotosIcon, CodeIcon, SettingsIcon, MultitaskingIcon, PlusAppIcon, TerminalIcon, AppCenterIcon
} from './AppIcons';

interface DockProps {
  onOpenApp: (appId: string) => void;
  openAppIds?: string[];
}

type DockItem = { id: string; icon: (size: number) => React.ReactNode; group: number };

const ICON_SIZE = 44;

const dockItems: DockItem[] = [
  // Group 1 — system / multitasking
  { id: 'multitasking', icon: s => <MultitaskingIcon size={s} />, group: 0 },
  { id: 'files', icon: s => <FilesIcon size={s} />, group: 0 },
  { id: 'browser', icon: s => <BrowserIcon size={s} />, group: 0 },
  { id: 'mail', icon: s => <MailAppIcon size={s} />, group: 0 },
  { id: 'tasks', icon: s => <TasksIcon size={s} />, group: 0 },
  // Group 2 — productivity
  { id: 'calendar', icon: s => <FilesIcon size={s} />, group: 1 },
  { id: 'music', icon: s => <MusicIcon size={s} />, group: 1 },
  { id: 'videos', icon: s => <VideosIcon size={s} />, group: 1 },
  { id: 'photos', icon: s => <PhotosIcon size={s} />, group: 1 },
  { id: 'code', icon: s => <CodeIcon size={s} />, group: 1 },
  // Group 3 — system
  { id: 'settings', icon: s => <SettingsIcon size={s} />, group: 2 },
  { id: 'appcenter', icon: s => <AppCenterIcon size={s} />, group: 2 },
  { id: 'plus', icon: s => <PlusAppIcon size={s} />, group: 2 },
];

export default function Dock({ onOpenApp, openAppIds = [] }: DockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);

  const handleClick = (appId: string, idx: number) => {
    setBouncingIdx(idx);
    setTimeout(() => setBouncingIdx(null), 400);
    onOpenApp(appId);
  };

  // Render with subtle group separators
  const rendered: React.ReactNode[] = [];
  dockItems.forEach((item, i) => {
    const prev = dockItems[i - 1];
    if (prev && prev.group !== item.group) {
      rendered.push(
        <div key={`sep-${i}`} aria-hidden
          style={{ width: 1, height: ICON_SIZE * 0.7, background: 'rgba(255,255,255,0.12)', margin: '0 6px' }} />
      );
    }
    const isHovered = hoveredIdx === i;
    const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - i) === 1;
    const scale = isHovered ? 1.32 : isNeighbor ? 1.12 : 1;
    const isOpen = openAppIds.includes(item.id);

    rendered.push(
      <button
        key={i}
        aria-label={item.id}
        className={`relative flex flex-col items-center transition-transform duration-200 ease-out ${bouncingIdx === i ? 'dock-bounce' : ''}`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center', padding: '0 2px' }}
        onMouseEnter={() => setHoveredIdx(i)}
        onMouseLeave={() => setHoveredIdx(null)}
        onClick={() => handleClick(item.id, i)}
      >
        {item.icon(ICON_SIZE)}
        <span
          aria-hidden
          style={{
            position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
            width: 4, height: 4, borderRadius: 999,
            background: isOpen ? 'rgba(255,255,255,0.95)' : 'transparent',
            transition: 'background 150ms',
          }}
        />
      </button>
    );
  });

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 flex items-end z-50"
      style={{
        gap: 6,
        padding: '8px 12px',
        borderRadius: 16,
        backgroundColor: 'rgba(28, 28, 30, 0.55)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {rendered}
    </div>
  );
}
