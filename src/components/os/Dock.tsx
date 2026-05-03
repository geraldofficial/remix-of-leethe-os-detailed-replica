import { useState } from 'react';
import {
  FilesIcon, BrowserIcon, MailAppIcon, TasksIcon, MusicIcon,
  VideosIcon, PhotosIcon, CodeIcon, SettingsIcon, MultitaskingIcon,
  PlusAppIcon, TerminalIcon, AppCenterIcon, CalendarIcon
} from './AppIcons';

interface DockProps {
  onOpenApp: (appId: string) => void;
  openAppIds?: string[];
  onContextMenu?: (appId: string, x: number, y: number) => void;
  visible?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

type DockItem = { id: string; label: string; icon: (size: number) => React.ReactNode; group: number };

const ICON_SIZE = 44;

const dockItems: DockItem[] = [
  { id: 'multitasking', label: 'Multitasking View', icon: s => <MultitaskingIcon size={s} />, group: 0 },
  { id: 'files',        label: 'Files',             icon: s => <FilesIcon size={s} />,         group: 0 },
  { id: 'browser',      label: 'Web',               icon: s => <BrowserIcon size={s} />,       group: 0 },
  { id: 'mail',         label: 'Mail',              icon: s => <MailAppIcon size={s} />,       group: 0 },
  { id: 'tasks',        label: 'Tasks',             icon: s => <TasksIcon size={s} />,         group: 0 },
  { id: 'calendar',     label: 'Calendar',          icon: s => <CalendarIcon size={s} />,      group: 1 },
  { id: 'music',        label: 'Music',             icon: s => <MusicIcon size={s} />,         group: 1 },
  { id: 'videos',       label: 'Videos',            icon: s => <VideosIcon size={s} />,        group: 1 },
  { id: 'photos',       label: 'Photos',            icon: s => <PhotosIcon size={s} />,        group: 1 },
  { id: 'code',         label: 'Code',              icon: s => <CodeIcon size={s} />,          group: 1 },
  { id: 'terminal',     label: 'Terminal',          icon: s => <TerminalIcon size={s} />,      group: 2 },
  { id: 'settings',     label: 'System Settings',   icon: s => <SettingsIcon size={s} />,      group: 2 },
  { id: 'appcenter',    label: 'AppCenter',         icon: s => <AppCenterIcon size={s} />,     group: 2 },
  { id: 'plus',         label: 'Add App',           icon: s => <PlusAppIcon size={s} />,       group: 2 },
];

export default function Dock({ onOpenApp, openAppIds = [], onContextMenu, visible = true, onMouseEnter, onMouseLeave }: DockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);

  const handleClick = (e: React.MouseEvent, appId: string, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setBouncingIdx(idx);
    setTimeout(() => setBouncingIdx(null), 400);
    onOpenApp(appId);
  };

  const rendered: React.ReactNode[] = [];
  dockItems.forEach((item, i) => {
    const prev = dockItems[i - 1];
    if (prev && prev.group !== item.group) {
      rendered.push(
        <div key={`sep-${i}`} aria-hidden
          style={{ width: 1, height: ICON_SIZE * 0.7, background: 'rgba(255,255,255,0.14)', margin: '0 4px', alignSelf: 'center' }} />
      );
    }
    const isHovered = hoveredIdx === i;
    const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - i) === 1;
    const scale = isHovered ? 1.28 : isNeighbor ? 1.1 : 1;
    const isOpen = openAppIds.includes(item.id);

    rendered.push(
      <button
        key={item.id}
        type="button"
        aria-label={item.label}
        title={item.label}
        className={`relative flex flex-col items-center transition-transform duration-200 ease-out ${bouncingIdx === i ? 'dock-bounce' : ''}`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center', padding: '0 2px' }}
        onMouseEnter={() => setHoveredIdx(i)}
        onMouseLeave={() => setHoveredIdx(null)}
        onClick={(e) => handleClick(e, item.id, i)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(item.id, e.clientX, e.clientY); }}
      >
        {/* Tooltip */}
        {isHovered && (
          <span
            aria-hidden
            style={{
              position: 'absolute', bottom: ICON_SIZE + 14, left: '50%', transform: 'translateX(-50%)',
              padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
              background: 'rgba(20,20,22,0.92)', color: '#fff', whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)', pointerEvents: 'none',
            }}
          >
            {item.label}
          </span>
        )}
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
      className="fixed left-1/2 flex items-end z-50"
      style={{
        bottom: 12,
        transform: `translateX(-50%) translateY(${visible ? '0' : 'calc(100% + 24px)'})`,
        transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        gap: 6,
        padding: '8px 12px',
        borderRadius: 16,
        backgroundColor: 'rgba(28, 28, 30, 0.55)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => { setHoveredIdx(null); onMouseLeave?.(); }}
    >
      {rendered}
    </div>
  );
}
