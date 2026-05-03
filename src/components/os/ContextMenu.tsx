import { useEffect } from 'react';

export interface MenuItem {
  label?: string;
  separator?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  shortcut?: string;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener('click', handler);
    window.addEventListener('contextmenu', handler);
    window.addEventListener('keydown', (e) => e.key === 'Escape' && onClose());
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('contextmenu', handler);
    };
  }, [onClose]);

  return (
    <div
      className="fixed z-[9999] py-1 min-w-[180px] rounded-md text-xs"
      style={{
        left: x, top: y,
        background: 'rgba(252,252,252,0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid hsl(var(--border))',
        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        color: 'hsl(var(--foreground))',
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      {items.map((item, i) =>
        item.separator ? (
          <div key={i} className="my-1 mx-2" style={{ borderTop: '1px solid hsl(var(--border))' }} />
        ) : (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => { item.onClick?.(); onClose(); }}
            className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors"
          >
            <span>{item.label}</span>
            {item.shortcut && <span className="opacity-50 ml-4 text-[10px]">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );
}
