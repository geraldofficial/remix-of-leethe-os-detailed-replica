import { useState } from 'react';
import {
  FilesIcon, BrowserIcon, MailAppIcon, TasksIcon, MusicIcon,
  VideosIcon, PhotosIcon, CodeIcon, SettingsIcon, MultitaskingIcon, PlusAppIcon, TerminalIcon
} from './AppIcons';

interface DockProps {
  onOpenApp: (appId: string) => void;
}

const dockApps = [
  { id: 'files', icon: <FilesIcon size={42} /> },
  { id: 'terminal', icon: <TerminalIcon size={42} /> },
  { id: 'browser', icon: <BrowserIcon size={42} /> },
  { id: 'mail', icon: <MailAppIcon size={42} /> },
  { id: 'tasks', icon: <TasksIcon size={42} /> },
  { id: 'files', icon: <FilesIcon size={42} /> },
  { id: 'music', icon: <MusicIcon size={42} /> },
  { id: 'videos', icon: <VideosIcon size={42} /> },
  { id: 'photos', icon: <PhotosIcon size={42} /> },
  { id: 'code', icon: <CodeIcon size={42} /> },
  { id: 'settings', icon: <SettingsIcon size={42} /> },
  { id: 'multitasking', icon: <MultitaskingIcon size={42} /> },
  { id: 'plus', icon: <PlusAppIcon size={42} /> },
];

export default function Dock({ onOpenApp }: DockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);

  const handleClick = (appId: string, idx: number) => {
    setBouncingIdx(idx);
    setTimeout(() => setBouncingIdx(null), 400);
    onOpenApp(appId);
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-2 rounded-2xl z-50"
      style={{ backgroundColor: 'rgba(30, 30, 30, 0.75)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}>
      {dockApps.map((app, i) => {
        const isHovered = hoveredIdx === i;
        const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - i) === 1;
        const scale = isHovered ? 1.45 : isNeighbor ? 1.15 : 1;

        return (
          <button key={i}
            className={`transition-transform duration-150 ${bouncingIdx === i ? 'dock-bounce' : ''}`}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'bottom center',
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => handleClick(app.id, i)}
          >
            {app.icon}
          </button>
        );
      })}
    </div>
  );
}
