import { useState } from 'react';
import { FileText, Search, Globe, Mail, CheckSquare, FolderOpen, Music, Play, Image, Settings, Columns2, Plus } from 'lucide-react';

interface DockProps {
  onOpenApp: (appId: string) => void;
}

const dockApps = [
  { id: 'files', icon: <FolderOpen size={28} />, color: '#4a90d9' },
  { id: 'search', icon: <Search size={28} />, color: '#5ba749' },
  { id: 'browser', icon: <Globe size={28} />, color: '#34a853' },
  { id: 'mail', icon: <Mail size={28} />, color: '#4285f4' },
  { id: 'tasks', icon: <CheckSquare size={28} />, color: '#e84393' },
  { id: 'files', icon: <FolderOpen size={28} />, color: '#6c8ca0' },
  { id: 'music', icon: <Music size={28} />, color: '#f97316' },
  { id: 'videos', icon: <Play size={28} />, color: '#ef4444' },
  { id: 'photos', icon: <Image size={28} />, color: '#8b5cf6' },
  { id: 'code', icon: <FileText size={28} />, color: '#6b7280' },
  { id: 'settings', icon: <Settings size={28} />, color: '#6b7280' },
  { id: 'multitasking', icon: <Columns2 size={28} />, color: '#1e293b' },
  { id: 'plus', icon: <Plus size={28} />, color: '#94a3b8' },
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
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 px-2 py-1.5 rounded-xl z-50"
      style={{ backgroundColor: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(20px)' }}>
      {dockApps.map((app, i) => {
        const isHovered = hoveredIdx === i;
        const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - i) === 1;
        const scale = isHovered ? 1.5 : isNeighbor ? 1.2 : 1;

        return (
          <button key={i}
            className={`flex items-center justify-center rounded-lg transition-transform duration-150 ${bouncingIdx === i ? 'dock-bounce' : ''}`}
            style={{
              width: 44, height: 44,
              transform: `scale(${scale})`,
              transformOrigin: 'bottom center',
              color: app.color,
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
