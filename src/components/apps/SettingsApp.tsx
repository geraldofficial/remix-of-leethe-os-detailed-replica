import { useState } from 'react';
import {
  Monitor, Wifi, Bluetooth, Volume2, Bell, Lock, User, Globe, Keyboard, MousePointer2,
  Palette, Battery, HardDrive, Info,
} from 'lucide-react';

const sections = [
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'displays', label: 'Displays', icon: Monitor },
  { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { key: 'bluetooth', label: 'Bluetooth', icon: Bluetooth },
  { key: 'sound', label: 'Sound', icon: Volume2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy & Security', icon: Lock },
  { key: 'accounts', label: 'Online Accounts', icon: User },
  { key: 'language', label: 'Language & Region', icon: Globe },
  { key: 'keyboard', label: 'Keyboard', icon: Keyboard },
  { key: 'mouse', label: 'Mouse & Trackpad', icon: MousePointer2 },
  { key: 'power', label: 'Power', icon: Battery },
  { key: 'storage', label: 'Storage', icon: HardDrive },
  { key: 'about', label: 'About', icon: Info },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 999,
        background: checked ? 'hsl(var(--accent))' : 'hsl(var(--border))',
        position: 'relative', transition: 'background 150ms',
      }}>
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: 999, background: '#fff',
        transition: 'left 150ms', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsApp() {
  const [active, setActive] = useState('appearance');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [accent, setAccent] = useState('blue');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [autoBrightness, setAutoBrightness] = useState(true);
  const [brightness, setBrightness] = useState(72);
  const [volume, setVolume] = useState(60);
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(false);
  const [notif, setNotif] = useState(true);
  const [dnd, setDnd] = useState(false);

  const accents = [
    { key: 'blue', color: 'hsl(207 90% 54%)' },
    { key: 'purple', color: 'hsl(280 70% 55%)' },
    { key: 'pink', color: 'hsl(330 75% 60%)' },
    { key: 'red', color: 'hsl(0 70% 55%)' },
    { key: 'orange', color: 'hsl(25 90% 55%)' },
    { key: 'yellow', color: 'hsl(45 90% 55%)' },
    { key: 'green', color: 'hsl(140 55% 45%)' },
    { key: 'teal', color: 'hsl(180 50% 45%)' },
  ];

  return (
    <div className="flex h-full text-sm" style={{ background: 'hsl(var(--card))' }}>
      <aside className="w-56 shrink-0 p-2 overflow-auto os-scrollbar"
        style={{ background: 'hsl(var(--sidebar-bg))', borderRight: '1px solid hsl(var(--border))' }}>
        {sections.map(s => {
          const Icon = s.icon;
          const isActive = s.key === active;
          return (
            <button key={s.key} onClick={() => setActive(s.key)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left mb-0.5"
              style={{
                background: isActive ? 'hsl(var(--accent) / 0.12)' : 'transparent',
                color: isActive ? 'hsl(var(--accent))' : 'hsl(var(--sidebar-fg))',
                fontWeight: isActive ? 600 : 500,
              }}>
              <Icon size={15} fill={isActive ? 'currentColor' : 'none'} fillOpacity={0.2} />{s.label}
            </button>
          );
        })}
      </aside>
      <div className="flex-1 overflow-auto os-scrollbar p-6">
        {active === 'appearance' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <Row label="Theme" hint="Choose how Leethe looks">
              <div className="flex gap-1">
                {(['light','dark','auto'] as const).map(t => (
                  <button key={t} onClick={() => setTheme(t)}
                    className="px-3 py-1 text-xs rounded-md capitalize"
                    style={{
                      background: theme === t ? 'hsl(var(--accent))' : 'hsl(var(--secondary))',
                      color: theme === t ? '#fff' : 'hsl(var(--foreground))',
                      fontWeight: 500,
                    }}>{t}</button>
                ))}
              </div>
            </Row>
            <Row label="Accent color">
              <div className="flex gap-1.5">
                {accents.map(a => (
                  <button key={a.key} onClick={() => setAccent(a.key)} aria-label={a.key}
                    style={{
                      width: 22, height: 22, borderRadius: 999, background: a.color,
                      boxShadow: accent === a.key ? `0 0 0 2px hsl(var(--card)), 0 0 0 4px ${a.color}` : 'none',
                    }} />
                ))}
              </div>
            </Row>
            <Row label="Reduce motion" hint="Minimize animations across the system">
              <Toggle checked={reduceMotion} onChange={setReduceMotion} />
            </Row>
          </div>
        )}
        {active === 'displays' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Displays</h2>
            <Row label="Brightness">
              <input type="range" min={0} max={100} value={brightness} onChange={e => setBrightness(+e.target.value)} className="w-44" />
            </Row>
            <Row label="Auto-brightness" hint="Adjust based on ambient light">
              <Toggle checked={autoBrightness} onChange={setAutoBrightness} />
            </Row>
            <Row label="Resolution">
              <select className="text-xs px-2 py-1 rounded-md" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                <option>1920 × 1080 (Default)</option><option>2560 × 1440</option><option>3840 × 2160</option>
              </select>
            </Row>
          </div>
        )}
        {active === 'sound' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Sound</h2>
            <Row label="Output volume"><input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)} className="w-44" /></Row>
            <Row label="Output device">
              <select className="text-xs px-2 py-1 rounded-md" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                <option>Built-in Speakers</option><option>HDMI Audio</option>
              </select>
            </Row>
          </div>
        )}
        {active === 'wifi' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Wi-Fi</h2>
            <Row label="Wi-Fi" hint={wifi ? 'Connected to home-5g' : 'Off'}><Toggle checked={wifi} onChange={setWifi} /></Row>
            {wifi && (
              <div className="mt-2">
                {['home-5g', 'home-2.4g', 'cafe-guest', 'office'].map((n, i) => (
                  <div key={n} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    <div className="flex items-center gap-2"><Wifi size={14} /> {n} {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'hsl(var(--accent) / 0.15)', color: 'hsl(var(--accent))' }}>Connected</span>}</div>
                    <span className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{['Excellent','Good','Fair','Good'][i]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {active === 'bluetooth' && (
          <div><h2 className="text-lg font-semibold mb-4">Bluetooth</h2>
            <Row label="Bluetooth" hint={bt ? 'Discoverable' : 'Off'}><Toggle checked={bt} onChange={setBt} /></Row></div>
        )}
        {active === 'notifications' && (
          <div><h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <Row label="Allow notifications"><Toggle checked={notif} onChange={setNotif} /></Row>
            <Row label="Do Not Disturb" hint="Silence notifications until tomorrow"><Toggle checked={dnd} onChange={setDnd} /></Row></div>
        )}
        {active === 'about' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">About this Mac</h2>
            <div className="text-xs space-y-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
              <div><span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>System:</span> Leethe OS 1.0 “Aurora”</div>
              <div><span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Kernel:</span> Linux 6.8.0-leethe</div>
              <div><span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Memory:</span> 16 GB</div>
              <div><span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Processor:</span> 8 × Generic CPU</div>
              <div><span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Graphics:</span> Integrated</div>
            </div>
          </div>
        )}
        {!['appearance','displays','sound','wifi','bluetooth','notifications','about'].includes(active) && (
          <div>
            <h2 className="text-lg font-semibold mb-1">{sections.find(s => s.key === active)?.label}</h2>
            <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Configure {sections.find(s => s.key === active)?.label.toLowerCase()} for your system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
