import { useRef, useCallback, useState } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import type { AppWindow } from '@/types/os';

interface WindowProps {
  win: AppWindow;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export default function Window({ win, onClose, onFocus, onMinimize, onMaximize, onMove, children }: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    onFocus(win.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      onMove(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
    };
    const handleMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [win.id, win.x, win.y, onFocus, onMove]);

  if (win.isMinimized) return null;

  const style = win.isMaximized
    ? { left: 0, top: 28, width: '100%', height: 'calc(100% - 76px)', zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div className="fixed rounded-lg overflow-hidden window-shadow flex flex-col"
      style={style}
      onMouseDown={() => onFocus(win.id)}>
      {/* Title bar */}
      <div className="h-9 flex items-center px-3 gap-2 cursor-move select-none shrink-0"
        style={{ backgroundColor: 'hsl(var(--window-header))', borderBottom: '1px solid hsl(var(--window-border))' }}
        onMouseDown={handleMouseDown}>
        <button onClick={() => onClose(win.id)}
          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
          style={{ backgroundColor: '#ccc' }}>
          <X size={9} className="opacity-0 hover:opacity-100" />
        </button>
        <button onClick={() => onMaximize(win.id)}
          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors"
          style={{ backgroundColor: '#ccc' }}>
          <Maximize2 size={8} className="opacity-0 hover:opacity-100" />
        </button>
        <span className="flex-1 text-center text-xs font-medium" style={{ color: 'hsl(var(--foreground))' }}>
          {win.title}
        </span>
        <Maximize2 size={13} className="opacity-40 cursor-pointer" onClick={() => onMaximize(win.id)} />
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'hsl(var(--window-bg))' }}>
        {children}
      </div>
    </div>
  );
}
