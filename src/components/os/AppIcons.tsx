import React from 'react';

// Elementary OS-style detailed app illustrations.
// Each icon is a self-contained SVG that renders at any size.

interface IconProps { size?: number }

const wrap = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
    {children}
  </svg>
);

// AppCenter — purple striped shop awning over a window/door
export function AppCenterIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="ac-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fafafa"/><stop offset="1" stopColor="#e5e5e5"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="10" fill="url(#ac-bg)" stroke="#c8c8c8" strokeWidth="0.5"/>
      {/* awning */}
      <path d="M10 18 L54 18 L52 28 L12 28 Z" fill="#7c3aed"/>
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={10 + i*6.3} y="18" width="3.1" height="10" fill="#a78bfa"/>
      ))}
      <path d="M12 28 L14 31 L18 28 L20 31 L24 28 L26 31 L30 28 L32 31 L36 28 L38 31 L42 28 L44 31 L48 28 L50 31 L52 28 Z" fill="#7c3aed"/>
      {/* window left */}
      <rect x="13" y="34" width="14" height="18" rx="1" fill="#7dd3fc" stroke="#475569" strokeWidth="0.8"/>
      <line x1="20" y1="34" x2="20" y2="52" stroke="#475569" strokeWidth="0.6"/>
      <line x1="13" y1="43" x2="27" y2="43" stroke="#475569" strokeWidth="0.6"/>
      {/* door right */}
      <rect x="33" y="34" width="14" height="20" rx="1" fill="#c2842a" stroke="#7c4a14" strokeWidth="0.8"/>
      <circle cx="44" cy="44" r="0.9" fill="#3a2208"/>
    </>
  ));
}

// Calculator — white body with +/-/×/÷ buttons
export function CalculatorIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="9" fill="#fafafa" stroke="#bdbdbd" strokeWidth="0.6"/>
      <rect x="12" y="12" width="40" height="10" rx="2" fill="#e5e7eb"/>
      <g fill="#374151" fontFamily="Inter, sans-serif" fontWeight="700">
        <text x="20" y="36" fontSize="11" textAnchor="middle">+</text>
        <text x="34" y="36" fontSize="11" textAnchor="middle">−</text>
        <text x="20" y="52" fontSize="11" textAnchor="middle">×</text>
        <text x="34" y="52" fontSize="11" textAnchor="middle">=</text>
      </g>
      <rect x="42" y="28" width="10" height="24" rx="2" fill="#10b981"/>
    </>
  ));
}

// Calendar — green tear-off with date
export function CalendarIcon({ size = 48, day = 16 }: IconProps & { day?: number }) {
  return wrap(size, (
    <>
      <rect x="6" y="10" width="52" height="48" rx="6" fill="#ffffff" stroke="#c8c8c8" strokeWidth="0.6"/>
      <path d="M6 16 a6 6 0 0 1 6 -6 h40 a6 6 0 0 1 6 6 v8 H6 Z" fill="#22c55e"/>
      <rect x="14" y="6" width="3" height="10" rx="1.5" fill="#374151"/>
      <rect x="47" y="6" width="3" height="10" rx="1.5" fill="#374151"/>
      <text x="32" y="48" fontSize="22" fontFamily="Inter, sans-serif" fontWeight="600" fill="#374151" textAnchor="middle">{day}</text>
    </>
  ));
}

// Camera — black DSLR
export function CameraIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="4" y="16" width="56" height="38" rx="6" fill="#1f1f1f"/>
      <rect x="22" y="11" width="20" height="8" rx="2" fill="#1f1f1f"/>
      <circle cx="32" cy="36" r="13" fill="#3a3a3a" stroke="#0a0a0a" strokeWidth="1.2"/>
      <circle cx="32" cy="36" r="9" fill="#1a1a1a"/>
      <circle cx="32" cy="36" r="5" fill="#0a0a0a"/>
      <circle cx="29" cy="33" r="1.6" fill="#5a8fbf" opacity="0.7"/>
      <circle cx="50" cy="22" r="1.4" fill="#ef4444"/>
      <rect x="8" y="20" width="6" height="3" rx="0.5" fill="#3a3a3a"/>
    </>
  ));
}

// Code — gray notebook with {} braces
export function CodeIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <path d="M10 8 h36 l8 8 v40 a4 4 0 0 1 -4 4 H10 a2 2 0 0 1 -2 -2 V10 a2 2 0 0 1 2 -2 Z" fill="#9ca3af"/>
      <path d="M46 8 v8 h8 Z" fill="#6b7280"/>
      <rect x="13" y="18" width="34" height="32" rx="2" fill="#f5f3e8"/>
      <text x="30" y="42" fontSize="20" fontFamily="monospace" fontWeight="700" fill="#374151" textAnchor="middle">{'{ }'}</text>
    </>
  ));
}

// Document Viewer — red doc with "e"
export function DocumentViewerIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <path d="M14 6 h26 l12 12 v40 a2 2 0 0 1 -2 2 H14 a2 2 0 0 1 -2 -2 V8 a2 2 0 0 1 2 -2 Z" fill="#dc2626"/>
      <path d="M40 6 v12 h12 Z" fill="#991b1b"/>
      <text x="32" y="46" fontSize="26" fontFamily="serif" fontWeight="700" fill="#ffffff" textAnchor="middle" fontStyle="italic">e</text>
    </>
  ));
}

// Feedback — green ladybug-ish bug
export function FeedbackIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <ellipse cx="32" cy="36" rx="20" ry="22" fill="#65a30d"/>
      <ellipse cx="32" cy="36" rx="20" ry="22" fill="url(#fb-g)" opacity="0.5"/>
      <defs><radialGradient id="fb-g"><stop offset="0" stopColor="#a3e635"/><stop offset="1" stopColor="#65a30d"/></radialGradient></defs>
      <line x1="32" y1="14" x2="32" y2="58" stroke="#1a2e05" strokeWidth="1.4"/>
      <circle cx="24" cy="22" r="3" fill="#1a2e05"/>
      <circle cx="40" cy="22" r="3" fill="#1a2e05"/>
      <circle cx="24" cy="22" r="1" fill="#fff"/>
      <circle cx="40" cy="22" r="1" fill="#fff"/>
      <circle cx="22" cy="34" r="2" fill="#1a2e05"/>
      <circle cx="42" cy="34" r="2" fill="#1a2e05"/>
      <circle cx="26" cy="48" r="2" fill="#1a2e05"/>
      <circle cx="38" cy="48" r="2" fill="#1a2e05"/>
    </>
  ));
}

// Files — blue folder with magnifying glass
export function FilesIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <path d="M6 18 a3 3 0 0 1 3 -3 h14 l4 4 h28 a3 3 0 0 1 3 3 v28 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z" fill="#1e88e5"/>
      <path d="M6 22 h52 v-1 a3 3 0 0 0 -3 -3 H27 l-4 -4 H9 a3 3 0 0 0 -3 3 Z" fill="#1565c0"/>
      <circle cx="30" cy="38" r="9" fill="none" stroke="#fff" strokeWidth="2.6"/>
      <line x1="37" y1="45" x2="44" y2="52" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </>
  ));
}

// Mail — white envelope with red flag
export function MailAppIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="14" width="52" height="38" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8"/>
      <path d="M6 16 L32 36 L58 16" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
      <path d="M6 16 L32 36 L58 16 L58 18 L32 38 L6 18 Z" fill="#e5e7eb"/>
      <path d="M40 8 h14 v14 l-7 -4 l-7 4 Z" fill="#ef4444"/>
    </>
  ));
}

// Maps — map with red pin
export function MapsIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="4" y="6" width="56" height="52" rx="6" fill="#f5e9c8"/>
      <path d="M4 38 L24 24 L40 36 L60 22 L60 58 L4 58 Z" fill="#a7d99a" opacity="0.6"/>
      <path d="M4 30 Q20 28 32 36 T60 38" stroke="#9ca3af" strokeWidth="1.2" fill="none"/>
      <path d="M8 50 Q24 44 40 50 T58 48" stroke="#9ca3af" strokeWidth="1.2" fill="none"/>
      <path d="M36 18 a8 8 0 0 1 16 0 c0 8 -8 16 -8 16 s -8 -8 -8 -16 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8"/>
      <circle cx="44" cy="18" r="3" fill="#fff"/>
    </>
  ));
}

// Monitor — black screen with green heartbeat
export function MonitorIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="9" fill="#fafafa" stroke="#bdbdbd" strokeWidth="0.6"/>
      <rect x="10" y="14" width="44" height="36" rx="3" fill="#0f172a"/>
      <polyline points="12,36 20,36 24,28 28,42 32,30 36,38 42,38 52,38" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ));
}

// Multitasking — blue tiled windows
export function MultitaskingIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="9" fill="#fafafa" stroke="#bdbdbd" strokeWidth="0.6"/>
      <rect x="11" y="11" width="20" height="14" rx="1.5" fill="#3b82f6"/>
      <rect x="11" y="11" width="20" height="3" rx="1.5" fill="#1d4ed8"/>
      <rect x="33" y="11" width="20" height="14" rx="1.5" fill="#60a5fa"/>
      <rect x="33" y="11" width="20" height="3" rx="1.5" fill="#2563eb"/>
      <rect x="11" y="27" width="42" height="26" rx="1.5" fill="#3b82f6"/>
      <rect x="11" y="27" width="42" height="3" rx="1.5" fill="#1d4ed8"/>
      <rect x="14" y="33" width="36" height="17" rx="1" fill="#dbeafe"/>
    </>
  ));
}

// Music — orange with white note
export function MusicIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="#f97316"/>
      <rect x="6" y="6" width="52" height="26" rx="11" fill="#fb923c"/>
      <path d="M28 18 L46 14 L46 40 a6 6 0 1 1 -3 -5 V22 L31 25 V44 a6 6 0 1 1 -3 -5 Z" fill="#fff"/>
    </>
  ));
}

// Photos — sunset photo
export function PhotosIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="ph-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7c3aed"/><stop offset="0.6" stopColor="#ec4899"/><stop offset="1" stopColor="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect x="4" y="6" width="56" height="52" rx="4" fill="#fff" stroke="#9ca3af" strokeWidth="0.8" transform="rotate(-3 32 32)"/>
      <g transform="rotate(-3 32 32)">
        <rect x="6" y="8" width="52" height="44" fill="url(#ph-sky)"/>
        <circle cx="44" cy="32" r="6" fill="#fde047"/>
        <path d="M6 40 Q20 30 32 38 T58 36 L58 52 L6 52 Z" fill="#1e293b"/>
        <path d="M14 52 L18 36 L20 36 L20 32 L22 32 L22 36 L26 52 Z" fill="#0f172a"/>
      </g>
    </>
  ));
}

// Screenshot — dashed selection rectangle with crosshair
export function ScreenshotIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="9" fill="#fafafa" stroke="#bdbdbd" strokeWidth="0.6"/>
      <rect x="14" y="14" width="36" height="36" rx="2" fill="none" stroke="#1f2937" strokeWidth="2.4" strokeDasharray="4 3"/>
      <circle cx="32" cy="32" r="5" fill="#dc2626"/>
      <circle cx="32" cy="32" r="2" fill="#fff"/>
    </>
  ));
}

// Terminal — dark with prompt
export function TerminalIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="4" y="8" width="56" height="48" rx="6" fill="#2d2d3e"/>
      <rect x="4" y="8" width="56" height="10" rx="6" fill="#1e1e2e"/>
      <circle cx="11" cy="13" r="1.4" fill="#ef4444"/>
      <circle cx="16" cy="13" r="1.4" fill="#eab308"/>
      <circle cx="21" cy="13" r="1.4" fill="#22c55e"/>
      <text x="10" y="36" fontSize="11" fontFamily="monospace" fontWeight="700" fill="#22c55e">{'>_'}</text>
    </>
  ));
}

// Browser — earth/globe
export function BrowserIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <circle cx="32" cy="32" r="26" fill="#0ea5e9"/>
      <path d="M32 6 a26 26 0 0 1 0 52" fill="none" stroke="#fff" strokeWidth="1.5"/>
      <ellipse cx="32" cy="32" rx="12" ry="26" fill="none" stroke="#fff" strokeWidth="1.5"/>
      <line x1="6" y1="32" x2="58" y2="32" stroke="#fff" strokeWidth="1.5"/>
      <path d="M10 20 Q32 12 54 20" fill="none" stroke="#fff" strokeWidth="1.5"/>
      <path d="M10 44 Q32 52 54 44" fill="none" stroke="#fff" strokeWidth="1.5"/>
    </>
  ));
}

// Tasks — red checkbox app
export function TasksIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.8"/>
      <path d="M16 32 L28 44 L48 20" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ));
}

// Videos — red play
export function VideosIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="#dc2626"/>
      <path d="M24 18 L48 32 L24 46 Z" fill="#fff"/>
    </>
  ));
}

// Settings — gear
export function SettingsIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="#fafafa" stroke="#bdbdbd" strokeWidth="0.6"/>
      <g transform="translate(32 32)">
        {Array.from({length:8}).map((_,i)=>(
          <rect key={i} x="-3" y="-22" width="6" height="8" rx="1" fill="#6b7280" transform={`rotate(${i*45})`}/>
        ))}
        <circle r="14" fill="#9ca3af"/>
        <circle r="6" fill="#fafafa"/>
      </g>
    </>
  ));
}

// Plus app — dashed add
export function PlusAppIcon({ size = 48 }: IconProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      border: '2px dashed rgba(255,255,255,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size*0.4} height={size*0.4} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
  );
}
