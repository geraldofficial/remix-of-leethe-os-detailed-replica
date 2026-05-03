import { useRef, useCallback } from 'react';
import { X, Minus, Square, Copy } from 'lucide-react';
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
    if ((e.target as HTMLElement).closest('[data-window-control]')) return;
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
    ? { left: 0, top: 28, width: '100vw', height: 'calc(100vh - 28px)', zIndex: win.zIndex, borderRadius: 0 }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  const ctrlBase: React.CSSProperties = {
    width: 32, height: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 6, color: 'hsl(var(--muted-foreground))', transition: 'all 120ms',
    cursor: 'pointer',
  };

  return (
    <div
      className="fixed overflow-hidden window-shadow flex flex-col"
      style={{ ...style, borderRadius: win.isMaximized ? 0 : 10, background: 'hsl(var(--window-bg))', border: '1px solid hsl(var(--window-border))' }}
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
        className="h-10 flex items-center pl-4 pr-2 gap-2 select-none shrink-0"
        style={{
          backgroundColor: 'hsl(var(--window-header))',
          borderBottom: '1px solid hsl(var(--window-border))',
          cursor: win.isMaximized ? 'default' : 'move',
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <span className="flex-1 text-[13px] font-medium truncate" style={{ color: 'hsl(var(--foreground))' }}>
          {win.title}
        </span>
        <div data-window-control className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Minimize"
            title="Minimize"
            onClick={() => onMinimize(win.id)}
            style={ctrlBase}
            onMouseEnter={e => { e.currentTarget.style.background = 'hsl(var(--secondary))'; e.currentTarget.style.color = 'hsl(var(--foreground))'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(var(--muted-foreground))'; }}
          >
            <Minus size={15} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            onClick={() => onMaximize(win.id)}
            style={ctrlBase}
            onMouseEnter={e => { e.currentTarget.style.background = 'hsl(var(--secondary))'; e.currentTarget.style.color = 'hsl(var(--foreground))'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(var(--muted-foreground))'; }}
          >
            {win.isMaximized ? <Copy size={13} strokeWidth={2.2} /> : <Square size={12} strokeWidth={2.2} />}
          </button>
          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={() => onClose(win.id)}
            style={ctrlBase}
            onMouseEnter={e => { e.currentTarget.style.background = '#e81123'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(var(--muted-foreground))'; }}
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'hsl(var(--window-bg))' }}>
        {children}
      </div>
    </div>
  );
}
