"use client";

interface IconProps {
  size?: number;
}

const wrap = (size: number, children: React.ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", flexShrink: 0 }}
  >
    {children}
  </svg>
);

// Files - Blue folder with magnifying glass
export function FilesIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="files-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#42A5F5" />
          <stop offset="1" stopColor="#1E88E5" />
        </linearGradient>
      </defs>
      <path d="M6 18 a3 3 0 0 1 3 -3 h14 l4 4 h28 a3 3 0 0 1 3 3 v28 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z" fill="url(#files-grad)" />
      <path d="M6 22 h52 v-1 a3 3 0 0 0 -3 -3 H27 l-4 -4 H9 a3 3 0 0 0 -3 3 Z" fill="#1565C0" />
      <circle cx="30" cy="38" r="9" fill="none" stroke="#fff" strokeWidth="2.5" />
      <line x1="37" y1="45" x2="44" y2="52" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  ));
}

// Terminal - Dark terminal with prompt
export function TerminalIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="4" y="8" width="56" height="48" rx="6" fill="#1E1E2E" />
      <rect x="4" y="8" width="56" height="10" rx="6" fill="#313244" />
      <circle cx="11" cy="13" r="1.5" fill="#F38BA8" />
      <circle cx="17" cy="13" r="1.5" fill="#F9E2AF" />
      <circle cx="23" cy="13" r="1.5" fill="#A6E3A1" />
      <text x="10" y="38" fontSize="13" fontFamily="monospace" fontWeight="700" fill="#A6E3A1">{">_"}</text>
      <rect x="26" y="30" width="20" height="2" rx="1" fill="#CDD6F4" opacity="0.6" />
      <rect x="10" y="44" width="30" height="2" rx="1" fill="#CDD6F4" opacity="0.4" />
    </>
  ));
}

// Browser - Globe with meridians
export function BrowserIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="browser-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#browser-grad)" />
      <ellipse cx="32" cy="32" rx="12" ry="26" fill="none" stroke="#fff" strokeWidth="1.5" />
      <line x1="6" y1="32" x2="58" y2="32" stroke="#fff" strokeWidth="1.5" />
      <path d="M10 20 Q32 12 54 20" fill="none" stroke="#fff" strokeWidth="1.5" />
      <path d="M10 44 Q32 52 54 44" fill="none" stroke="#fff" strokeWidth="1.5" />
    </>
  ));
}

// Settings - Gear icon
export function SettingsIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.5" />
      <g transform="translate(32 32)">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-3" y="-22" width="6" height="8" rx="1" fill="#6B7280" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="14" fill="#9CA3AF" />
        <circle r="6" fill="#F3F4F6" />
      </g>
    </>
  ));
}

// Code Editor - Code brackets
export function CodeIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="code-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="url(#code-grad)" />
      <text x="32" y="42" fontSize="26" fontFamily="monospace" fontWeight="700" fill="#fff" textAnchor="middle">{"{ }"}</text>
    </>
  ));
}

// Calculator
export function CalculatorIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="8" y="6" width="48" height="52" rx="8" fill="#374151" />
      <rect x="12" y="10" width="40" height="14" rx="3" fill="#10B981" />
      <g fill="#E5E7EB" fontFamily="Inter, sans-serif" fontWeight="600">
        <text x="20" y="38" fontSize="10" textAnchor="middle">7</text>
        <text x="32" y="38" fontSize="10" textAnchor="middle">8</text>
        <text x="44" y="38" fontSize="10" textAnchor="middle">9</text>
        <text x="20" y="50" fontSize="10" textAnchor="middle">4</text>
        <text x="32" y="50" fontSize="10" textAnchor="middle">5</text>
        <text x="44" y="50" fontSize="10" textAnchor="middle">6</text>
      </g>
    </>
  ));
}

// Calendar
export function CalendarIcon({ size = 48 }: IconProps) {
  const day = new Date().getDate();
  return wrap(size, (
    <>
      <rect x="6" y="10" width="52" height="48" rx="6" fill="#fff" stroke="#D1D5DB" strokeWidth="0.5" />
      <path d="M6 16 a6 6 0 0 1 6 -6 h40 a6 6 0 0 1 6 6 v8 H6 Z" fill="#EF4444" />
      <rect x="14" y="6" width="3" height="10" rx="1.5" fill="#374151" />
      <rect x="47" y="6" width="3" height="10" rx="1.5" fill="#374151" />
      <text x="32" y="48" fontSize="22" fontFamily="Inter, sans-serif" fontWeight="600" fill="#374151" textAnchor="middle">{day}</text>
    </>
  ));
}

// Notes
export function NotesIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="notes-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <rect x="8" y="6" width="48" height="52" rx="4" fill="url(#notes-grad)" />
      <rect x="14" y="14" width="28" height="2" rx="1" fill="#92400E" opacity="0.4" />
      <rect x="14" y="22" width="36" height="2" rx="1" fill="#92400E" opacity="0.4" />
      <rect x="14" y="30" width="32" height="2" rx="1" fill="#92400E" opacity="0.4" />
      <rect x="14" y="38" width="24" height="2" rx="1" fill="#92400E" opacity="0.4" />
    </>
  ));
}

// Photos
export function PhotosIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="photos-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="0.5" stopColor="#EC4899" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect x="4" y="6" width="56" height="52" rx="6" fill="#fff" stroke="#D1D5DB" strokeWidth="0.5" />
      <rect x="8" y="10" width="48" height="40" rx="2" fill="url(#photos-sky)" />
      <circle cx="42" cy="20" r="5" fill="#FDE047" />
      <path d="M8 38 Q22 26 32 34 T56 32 L56 50 L8 50 Z" fill="#1E293B" />
    </>
  ));
}

// Music
export function MusicIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="music-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FB923C" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="url(#music-grad)" />
      <path d="M26 20 L44 16 L44 40 a6 6 0 1 1 -3 -5 V24 L29 27 V44 a6 6 0 1 1 -3 -5 Z" fill="#fff" />
    </>
  ));
}

// Clock
export function ClockIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <circle cx="32" cy="32" r="26" fill="#1F2937" />
      <circle cx="32" cy="32" r="22" fill="#374151" />
      <circle cx="32" cy="32" r="2" fill="#fff" />
      <line x1="32" y1="32" x2="32" y2="16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="32" x2="44" y2="32" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <circle
          key={angle}
          cx={32 + 18 * Math.cos((angle - 90) * Math.PI / 180)}
          cy={32 + 18 * Math.sin((angle - 90) * Math.PI / 180)}
          r={angle % 90 === 0 ? 2 : 1}
          fill="#9CA3AF"
        />
      ))}
    </>
  ));
}

// Weather
export function WeatherIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="weather-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="url(#weather-grad)" />
      <circle cx="28" cy="28" r="10" fill="#FDE047" />
      <path d="M16 42 a10 10 0 0 1 10 -10 h16 a8 8 0 0 1 0 16 H26 a10 10 0 0 1 -10 -6 Z" fill="#fff" />
    </>
  ));
}

// App Center
export function AppCenterIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <defs>
        <linearGradient id="appcenter-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="url(#appcenter-grad)" />
      <rect x="14" y="14" width="14" height="14" rx="3" fill="#fff" opacity="0.9" />
      <rect x="36" y="14" width="14" height="14" rx="3" fill="#fff" opacity="0.7" />
      <rect x="14" y="36" width="14" height="14" rx="3" fill="#fff" opacity="0.7" />
      <rect x="36" y="36" width="14" height="14" rx="3" fill="#fff" opacity="0.5" />
    </>
  ));
}

// Text Editor
export function TextEditorIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="8" y="6" width="48" height="52" rx="4" fill="#fff" stroke="#D1D5DB" strokeWidth="0.5" />
      <rect x="14" y="14" width="32" height="3" rx="1" fill="#3B82F6" />
      <rect x="14" y="22" width="28" height="2" rx="1" fill="#9CA3AF" />
      <rect x="14" y="28" width="36" height="2" rx="1" fill="#9CA3AF" />
      <rect x="14" y="34" width="24" height="2" rx="1" fill="#9CA3AF" />
      <rect x="14" y="40" width="32" height="2" rx="1" fill="#9CA3AF" />
      <rect x="14" y="46" width="20" height="2" rx="1" fill="#9CA3AF" />
    </>
  ));
}

// Tasks/Todo
export function TasksIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="#fff" stroke="#D1D5DB" strokeWidth="0.5" />
      <path d="M16 32 L26 42 L48 20" fill="none" stroke="#10B981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ));
}

// Mail
export function MailIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="12" width="52" height="40" rx="4" fill="#fff" stroke="#D1D5DB" strokeWidth="0.5" />
      <path d="M6 16 L32 36 L58 16" fill="none" stroke="#D1D5DB" strokeWidth="1.5" />
      <path d="M6 16 L32 36 L58 16 L58 18 L32 38 L6 18 Z" fill="#E5E7EB" />
      <path d="M42 8 h12 v12 l-6 -4 l-6 4 Z" fill="#EF4444" />
    </>
  ));
}

// Video Player
export function VideoIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="11" fill="#DC2626" />
      <path d="M24 18 L48 32 L24 46 Z" fill="#fff" />
    </>
  ));
}

// Camera
export function CameraIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="4" y="16" width="56" height="38" rx="6" fill="#1F2937" />
      <rect x="22" y="10" width="20" height="8" rx="2" fill="#1F2937" />
      <circle cx="32" cy="35" r="12" fill="#374151" />
      <circle cx="32" cy="35" r="8" fill="#1F2937" />
      <circle cx="30" cy="33" r="2" fill="#60A5FA" opacity="0.6" />
      <circle cx="50" cy="22" r="2" fill="#EF4444" />
    </>
  ));
}

// System Monitor
export function MonitorIcon({ size = 48 }: IconProps) {
  return wrap(size, (
    <>
      <rect x="6" y="6" width="52" height="52" rx="9" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.5" />
      <rect x="10" y="14" width="44" height="36" rx="3" fill="#0F172A" />
      <polyline points="14,36 22,36 26,26 30,42 34,30 38,38 46,38" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ));
}

// Plus/Add App
export function PlusAppIcon({ size = 48 }: IconProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        border: "2px dashed rgba(255,255,255,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.4}
        height={size * 0.4}
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  );
}
