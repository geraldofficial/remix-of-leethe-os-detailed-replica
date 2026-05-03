import React from 'react';

interface AppIconProps {
  size?: number;
  children: React.ReactNode;
  gradient: [string, string];
  className?: string;
}

// Elementary OS-style app icon: rounded square with gradient background + white icon
export function AppIcon({ size = 48, children, gradient, className = '' }: AppIconProps) {
  const radius = size * 0.22;
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        boxShadow: `0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
        color: 'white',
      }}
    >
      {children}
    </div>
  );
}

// Pre-built icons matching elementary OS apps from the screenshots

export function AppCenterIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#7c3aed', '#a855f7']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </AppIcon>
  );
}

export function CalculatorIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#64748b', '#94a3b8']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="12" y1="3" x2="12" y2="13" />
        <line x1="7" y1="18" x2="17" y2="18" />
      </svg>
    </AppIcon>
  );
}

export function CalendarIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#e5e7eb', '#f3f4f6']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#374151" strokeWidth="2" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="#374151" strokeWidth="2" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <rect x="7" y="13" width="3" height="3" rx="0.5" fill="#374151" />
      </svg>
    </AppIcon>
  );
}

export function CameraIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#581c87', '#7c3aed']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </AppIcon>
  );
}

export function CodeIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#d4a017', '#f0c040']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    </AppIcon>
  );
}

export function DocumentViewerIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#dc2626', '#ef4444']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    </AppIcon>
  );
}

export function FeedbackIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#16a34a', '#22c55e']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <circle cx="12" cy="16" r="0.5" fill="white" />
      </svg>
    </AppIcon>
  );
}

export function FilesIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#2563eb', '#60a5fa']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    </AppIcon>
  );
}

export function MailAppIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#e5e7eb', '#f9fafb']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </AppIcon>
  );
}

export function MapsIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#f5f0e0', '#e8e0c8']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#dc2626" strokeWidth="2" />
        <circle cx="12" cy="10" r="3" stroke="#dc2626" strokeWidth="2" />
        <path d="M1 3l7 3v15l-7-3V3z" fill="#4ade80" opacity="0.4" />
        <path d="M15 1l7 3v15l-7-3V1z" fill="#4ade80" opacity="0.4" />
      </svg>
    </AppIcon>
  );
}

export function MonitorIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#0f172a', '#1e293b']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 18 8 14 11 16 16 10 20 12" />
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="#22c55e" strokeWidth="1.5" fill="none" />
      </svg>
    </AppIcon>
  );
}

export function MultitaskingIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#1e293b', '#334155']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="2" y="4" width="8" height="7" rx="1" />
        <rect x="14" y="4" width="8" height="7" rx="1" />
        <rect x="2" y="14" width="20" height="7" rx="1" />
      </svg>
    </AppIcon>
  );
}

export function MusicIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#ea580c', '#f97316']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </AppIcon>
  );
}

export function PhotosIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#7c3aed', '#a855f7']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </AppIcon>
  );
}

export function ScreenshotIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#dc2626', '#ef4444']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M4 4h4" /><path d="M4 4v4" />
        <path d="M20 4h-4" /><path d="M20 4v4" />
        <path d="M4 20h4" /><path d="M4 20v-4" />
        <path d="M20 20h-4" /><path d="M20 20v-4" />
        <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
      </svg>
    </AppIcon>
  );
}

export function TerminalIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#1e1e2e', '#2d2d3e']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    </AppIcon>
  );
}

export function BrowserIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.5;
  return (
    <AppIcon size={size} gradient={['#0ea5e9', '#38bdf8']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
      </svg>
    </AppIcon>
  );
}

export function TasksIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#e11d48', '#f43f5e']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    </AppIcon>
  );
}

export function VideosIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#dc2626', '#ef4444']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="white">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    </AppIcon>
  );
}

export function SettingsIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.45;
  return (
    <AppIcon size={size} gradient={['#6b7280', '#9ca3af']}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </AppIcon>
  );
}

export function PlusAppIcon({ size = 48 }: { size?: number }) {
  const s = size * 0.4;
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        border: '2px dashed rgba(255,255,255,0.3)',
        color: 'rgba(255,255,255,0.5)',
      }}
    >
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  );
}
