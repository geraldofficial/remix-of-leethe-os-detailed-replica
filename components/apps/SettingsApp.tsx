"use client";

import { useState } from "react";
import {
  Palette,
  Monitor,
  Bell,
  Lock,
  Keyboard,
  MousePointer2,
  HardDrive,
  Info,
  Wifi,
  Volume2,
  Globe,
  Layers,
} from "lucide-react";
import { useSettingsStore, ACCENT_COLORS, type AccentColor } from "@/lib/stores/settings-store";
import { useOSStore } from "@/lib/stores/os-store";

interface SettingsAppProps {
  windowId: string;
}

const sections = [
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "dock", label: "Dock & Desktop", icon: Layers },
  { key: "displays", label: "Displays", icon: Monitor },
  { key: "sound", label: "Sound", icon: Volume2 },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "wifi", label: "Network", icon: Wifi },
  { key: "keyboard", label: "Keyboard", icon: Keyboard },
  { key: "mouse", label: "Mouse & Trackpad", icon: MousePointer2 },
  { key: "privacy", label: "Privacy", icon: Lock },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "about", label: "About", icon: Info },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative transition-colors"
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "hsl(var(--accent))" : "hsl(var(--border))",
      }}
    >
      <span
        className="absolute top-1 transition-all"
        style={{
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: 10,
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid hsl(var(--border))" }}
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && (
          <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            {hint}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-48 h-1 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, hsl(var(--accent)) 0%, hsl(var(--accent)) ${((value - min) / (max - min)) * 100}%, hsl(var(--border)) ${((value - min) / (max - min)) * 100}%, hsl(var(--border)) 100%)`,
      }}
    />
  );
}

export default function SettingsApp({ windowId }: SettingsAppProps) {
  const [active, setActive] = useState("appearance");
  
  const {
    theme,
    accentColor,
    wallpaper,
    reduceMotion,
    reduceTransparency,
    dockPosition,
    dockIconSize,
    dockMagnification,
    dockAutoHide,
    showDesktopIcons,
    soundEffects,
    setTheme,
    setAccentColor,
    setWallpaper,
    setReduceMotion,
    setReduceTransparency,
    setDockPosition,
    setDockIconSize,
    setDockMagnification,
    setDockAutoHide,
    setShowDesktopIcons,
    setSoundEffects,
    resetToDefaults,
  } = useSettingsStore();

  const {
    volume,
    wifiEnabled,
    bluetoothEnabled,
    doNotDisturb,
    setVolume,
    setWifiEnabled,
    setBluetoothEnabled,
    setDoNotDisturb,
  } = useOSStore();

  return (
    <div className="flex h-full text-sm" style={{ background: "hsl(var(--card))" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 p-2 overflow-auto os-scrollbar"
        style={{
          background: "hsl(var(--os-sidebar-bg))",
          borderRight: "1px solid hsl(var(--border))",
        }}
      >
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = s.key === active;
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left mb-0.5 transition-colors"
              style={{
                background: isActive ? "hsl(var(--accent) / 0.12)" : "transparent",
                color: isActive ? "hsl(var(--accent))" : "hsl(var(--os-sidebar-fg))",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon size={16} />
              {s.label}
            </button>
          );
        })}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto os-scrollbar p-6">
        {active === "appearance" && (
          <div>
            <h2 className="text-lg font-semibold mb-5">Appearance</h2>
            
            <Row label="Theme" hint="Choose how LeetheOS looks">
              <div className="flex gap-1">
                {(["light", "dark", "auto"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className="px-4 py-1.5 text-xs rounded-md capitalize transition-colors"
                    style={{
                      background: theme === t ? "hsl(var(--accent))" : "hsl(var(--secondary))",
                      color: theme === t ? "#fff" : "hsl(var(--foreground))",
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Row>

            <Row label="Accent Color" hint="Used throughout the system">
              <div className="flex gap-2">
                {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    aria-label={color}
                    className="transition-transform hover:scale-110"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      background: ACCENT_COLORS[color].hex,
                      boxShadow:
                        accentColor === color
                          ? `0 0 0 2px hsl(var(--card)), 0 0 0 4px ${ACCENT_COLORS[color].hex}`
                          : "none",
                    }}
                  />
                ))}
              </div>
            </Row>

            <Row label="Reduce Motion" hint="Minimize animations">
              <Toggle checked={reduceMotion} onChange={setReduceMotion} />
            </Row>

            <Row label="Reduce Transparency" hint="Use solid backgrounds">
              <Toggle checked={reduceTransparency} onChange={setReduceTransparency} />
            </Row>
          </div>
        )}

        {active === "dock" && (
          <div>
            <h2 className="text-lg font-semibold mb-5">Dock & Desktop</h2>

            <Row label="Dock Position">
              <div className="flex gap-1">
                {(["bottom", "left", "right"] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setDockPosition(pos)}
                    className="px-3 py-1.5 text-xs rounded-md capitalize transition-colors"
                    style={{
                      background: dockPosition === pos ? "hsl(var(--accent))" : "hsl(var(--secondary))",
                      color: dockPosition === pos ? "#fff" : "hsl(var(--foreground))",
                    }}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </Row>

            <Row label="Icon Size" hint={`${dockIconSize}px`}>
              <Slider value={dockIconSize} onChange={setDockIconSize} min={32} max={72} />
            </Row>

            <Row label="Magnification" hint="Enlarge icons on hover">
              <Toggle checked={dockMagnification} onChange={setDockMagnification} />
            </Row>

            <Row label="Auto-hide Dock" hint="Hide when not in use">
              <Toggle checked={dockAutoHide} onChange={setDockAutoHide} />
            </Row>

            <Row label="Show Desktop Icons">
              <Toggle checked={showDesktopIcons} onChange={setShowDesktopIcons} />
            </Row>
          </div>
        )}

        {active === "sound" && (
          <div>
            <h2 className="text-lg font-semibold mb-5">Sound</h2>

            <Row label="Output Volume" hint={`${volume}%`}>
              <Slider value={volume} onChange={setVolume} />
            </Row>

            <Row label="Sound Effects" hint="Play sounds for actions">
              <Toggle checked={soundEffects} onChange={setSoundEffects} />
            </Row>

            <Row label="Output Device">
              <select
                className="text-xs px-3 py-1.5 rounded-md"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <option>Built-in Speakers</option>
                <option>HDMI Audio</option>
              </select>
            </Row>
          </div>
        )}

        {active === "notifications" && (
          <div>
            <h2 className="text-lg font-semibold mb-5">Notifications</h2>

            <Row label="Do Not Disturb" hint="Silence all notifications">
              <Toggle checked={doNotDisturb} onChange={setDoNotDisturb} />
            </Row>
          </div>
        )}

        {active === "wifi" && (
          <div>
            <h2 className="text-lg font-semibold mb-5">Network</h2>

            <Row label="Wi-Fi" hint={wifiEnabled ? "Connected to home-5g" : "Off"}>
              <Toggle checked={wifiEnabled} onChange={setWifiEnabled} />
            </Row>

            <Row label="Bluetooth" hint={bluetoothEnabled ? "Discoverable" : "Off"}>
              <Toggle checked={bluetoothEnabled} onChange={setBluetoothEnabled} />
            </Row>

            {wifiEnabled && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Available Networks</h3>
                {["home-5g", "home-2.4g", "cafe-guest", "office"].map((network, i) => (
                  <div
                    key={network}
                    className="flex items-center justify-between py-2"
                    style={{ borderBottom: "1px solid hsl(var(--border))" }}
                  >
                    <div className="flex items-center gap-2">
                      <Wifi size={14} />
                      <span>{network}</span>
                      {i === 0 && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            background: "hsl(var(--accent) / 0.15)",
                            color: "hsl(var(--accent))",
                          }}
                        >
                          Connected
                        </span>
                      )}
                    </div>
                    <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {["Excellent", "Good", "Fair", "Good"][i]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === "storage" && (
          <div>
            <h2 className="text-lg font-semibold mb-5">Storage</h2>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Used</span>
                <span>12.4 MB of 1 GB</span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ background: "hsl(var(--border))" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "1.24%",
                    background: "hsl(var(--accent))",
                  }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Documents</span>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>5.2 MB</span>
              </div>
              <div className="flex justify-between">
                <span>Applications</span>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>3.1 MB</span>
              </div>
              <div className="flex justify-between">
                <span>System</span>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>4.1 MB</span>
              </div>
            </div>

            <button
              className="mt-6 px-4 py-2 text-sm rounded-md"
              style={{
                background: "hsl(var(--destructive))",
                color: "#fff",
              }}
              onClick={() => {
                if (confirm("Clear all temporary files?")) {
                  // Clear temp files
                }
              }}
            >
              Clear Cache
            </button>
          </div>
        )}

        {active === "about" && (
          <div>
            <h2 className="text-lg font-semibold mb-5">About LeetheOS</h2>

            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                }}
              >
                <span className="text-3xl font-bold text-white">L</span>
              </div>
              <div>
                <div className="text-xl font-semibold">LeetheOS</div>
                <div className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Version 1.0.0 &quot;Aurora&quot;
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Kernel</span>
                <span>LeetheOS-Web 1.0</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Build</span>
                <span>2024.05.01</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Memory</span>
                <span>16 GB</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Processor</span>
                <span>Virtual CPU</span>
              </div>
            </div>

            <button
              className="mt-6 px-4 py-2 text-sm rounded-md transition-colors hover:bg-secondary"
              style={{ border: "1px solid hsl(var(--border))" }}
              onClick={resetToDefaults}
            >
              Reset All Settings
            </button>
          </div>
        )}

        {!["appearance", "dock", "sound", "notifications", "wifi", "storage", "about"].includes(active) && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {sections.find((s) => s.key === active)?.label}
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Configure {sections.find((s) => s.key === active)?.label.toLowerCase()} settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
