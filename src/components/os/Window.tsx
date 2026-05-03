import { useRef, useCallback } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import type { AppWindow } from '@/types/os';

interface WindowProps {
  win: AppWindow;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onContextMenu?: (x: number, y: number) => void;
  children: React.ReactNode;
}

export default function Window({ win, onClose, onFocus, onMinimize, onMaximize, onMove, onContextMenu, children }: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number; moved: boolean } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || win.isMaximized) return;
    onFocus(win.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y, moved: false };
    const onMove2 = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragRef.current.moved = true;
      onMove(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
    };
    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove2);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove2);
    document.addEventListener('mouseup', onUp);
  }, [win.id, win.x, win.y, win.isMaximized, onFocus, onMove]);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { left: 0, top: 28, width: '100vw', height: 'calc(100vh - 28px - 76px)', zIndex: win.zIndex, borderRadius: 0 }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      className="fixed overflow-hidden window-shadow flex flex-col"
      style={{ ...style, borderRadius: win.isMaximized ? 0 : 8, background: 'hsl(var(--window-bg))', border: '1px solid hsl(var(--window-border))' }}
      onMouseDown={() => onFocus(win.id)}
      onContextMenu={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-titlebar]')) {
          e.preventDefault();
          onContextMenu?.(e.clientX, e.clientY);
        }
      }}
    >
      <div
        data-titlebar
        className="h-9 flex items-center px-3 gap-2 select-none shrink-0"
        style={{
          backgroundColor: 'hsl(var(--window-header))',
          borderBottom: '1px solid hsl(var(--window-border))',
          cursor: win.isMaximized ? 'default' : 'move',
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <button onClick={() => onClose(win.id)}
          aria-label="Close"
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center group transition-colors hover:bg-red-500"
          style={{ backgroundColor: '#ff5f57' }}>
          <X size={8} className="opacity-0 group-hover:opacity-100" strokeWidth={3} color="#600" />
        </button>
        <button onClick={() => onMinimize(win.id)}
          aria-label="Minimize"
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center group transition-colors hover:bg-yellow-500"
          style={{ backgroundColor: '#febc2e' }}>
          <Minus size={8} className="opacity-0 group-hover:opacity-100" strokeWidth={3} color="#660" />
        </button>
        <button onClick={() => onMaximize(win.id)}
          aria-label="Maximize"
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center group transition-colors hover:bg-green-500"
          style={{ backgroundColor: '#28c840' }}>
          <Maximize2 size={6} className="opacity-0 group-hover:opacity-100" strokeWidth={3} color="#063" />
        </button>
        <span className="flex-1 text-center text-xs font-medium" style={{ color: 'hsl(var(--foreground))' }}>
          {win.title}
        </span>
        <div className="w-12" />
      </div>
      <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'hsl(var(--window-bg))' }}>
        {children}
      </div>
    </div>
  );
}
