import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
}

/**
 * Untitled UI–style empty state: featured icon (circular concentric rings),
 * title, supporting text, optional primary + secondary CTA.
 */
export default function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-8 py-12 select-none">
      <div className="relative mb-5" aria-hidden>
        {/* concentric rings */}
        <div className="absolute inset-0 -m-12 rounded-full" style={{ border: '1px solid hsl(var(--border))', opacity: 0.4 }} />
        <div className="absolute inset-0 -m-8 rounded-full" style={{ border: '1px solid hsl(var(--border))', opacity: 0.6 }} />
        <div className="absolute inset-0 -m-4 rounded-full" style={{ border: '1px solid hsl(var(--border))', opacity: 0.8 }} />
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'hsl(var(--foreground))' }}>{title}</h3>
      {description && (
        <p className="text-xs max-w-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 mt-5">
          {secondaryAction && (
            <button onClick={secondaryAction.onClick}
              className="px-3 py-1.5 text-xs rounded-md font-medium transition-colors hover:bg-secondary"
              style={{ border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))', background: 'hsl(var(--card))' }}>
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <button onClick={action.onClick}
              className="px-3 py-1.5 text-xs rounded-md font-medium transition-opacity hover:opacity-90"
              style={{ background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
