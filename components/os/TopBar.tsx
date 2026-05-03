"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Bluetooth,
  BluetoothOff,
  Moon,
  Sun,
  Bell,
  BellOff,
  ChevronDown,
} from "lucide-react";
import { useOSStore } from "@/lib/stores/os-store";
import { useSettingsStore } from "@/lib/stores/settings-store";

interface TopBarProps {
  onApplicationsClick: () => void;
}

export default function TopBar({ onApplicationsClick }: TopBarProps) {
  const [time, setTime] = useState(new Date());
  const [showControlCenter, setShowControlCenter] = useState(false);
  
  const {
    volume,
    wifiEnabled,
    bluetoothEnabled,
    doNotDisturb,
    notifications,
    setVolume,
    setWifiEnabled,
    setBluetoothEnabled,
    setDoNotDisturb,
  } = useOSStore();
  
  const { theme, setTheme } = useSettingsStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}  ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div
        className="h-7 flex items-center justify-between px-4 text-[13px] font-medium select-none relative z-50"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.75)",
          color: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {/* Left: Applications menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onApplicationsClick}
            className="flex items-center gap-1.5 hover:bg-white/10 transition-colors px-2 py-0.5 rounded"
          >
            <Search size={12} />
            <span>Applications</span>
          </button>
        </div>

        {/* Center: Date/Time */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center text-xs opacity-90 font-medium">
          {formatDate(time)}
        </div>

        {/* Right: Status icons */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="relative p-1 rounded hover:bg-white/10 transition-colors"
            onClick={() => setDoNotDisturb(!doNotDisturb)}
          >
            {doNotDisturb ? (
              <BellOff size={14} className="opacity-60" />
            ) : (
              <Bell size={14} className="opacity-80" />
            )}
            {unreadCount > 0 && !doNotDisturb && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Volume */}
          <button
            className="p-1 rounded hover:bg-white/10 transition-colors"
            onClick={() => setVolume(volume > 0 ? 0 : 75)}
          >
            {volume === 0 ? (
              <VolumeX size={14} className="opacity-60" />
            ) : (
              <Volume2 size={14} className="opacity-80" />
            )}
          </button>

          {/* WiFi */}
          <button
            className="p-1 rounded hover:bg-white/10 transition-colors"
            onClick={() => setWifiEnabled(!wifiEnabled)}
          >
            {wifiEnabled ? (
              <Wifi size={14} className="opacity-80" />
            ) : (
              <WifiOff size={14} className="opacity-60" />
            )}
          </button>

          {/* Bluetooth */}
          <button
            className="p-1 rounded hover:bg-white/10 transition-colors"
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          >
            {bluetoothEnabled ? (
              <Bluetooth size={14} className="opacity-80" />
            ) : (
              <BluetoothOff size={14} className="opacity-60" />
            )}
          </button>

          {/* Battery */}
          <div className="flex items-center gap-0.5 opacity-80">
            <BatteryCharging size={14} />
            <span className="text-[10px]">100%</span>
          </div>

          {/* Control Center toggle */}
          <button
            className="p-1 rounded hover:bg-white/10 transition-colors"
            onClick={() => setShowControlCenter(!showControlCenter)}
          >
            <ChevronDown size={14} className={`transition-transform ${showControlCenter ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Control Center Dropdown */}
      {showControlCenter && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowControlCenter(false)}
          />
          <div
            className="fixed top-8 right-2 w-72 rounded-xl p-4 z-50 fade-in"
            style={{
              backgroundColor: "rgba(30, 30, 30, 0.95)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Quick toggles */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setWifiEnabled(!wifiEnabled)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  wifiEnabled ? "bg-blue-500" : "bg-white/10"
                }`}
              >
                <Wifi size={16} />
                <span className="text-xs font-medium">Wi-Fi</span>
              </button>
              <button
                onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  bluetoothEnabled ? "bg-blue-500" : "bg-white/10"
                }`}
              >
                <Bluetooth size={16} />
                <span className="text-xs font-medium">Bluetooth</span>
              </button>
              <button
                onClick={() => setDoNotDisturb(!doNotDisturb)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  doNotDisturb ? "bg-purple-500" : "bg-white/10"
                }`}
              >
                <Moon size={16} />
                <span className="text-xs font-medium">Focus</span>
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 p-3 rounded-lg bg-white/10 transition-colors hover:bg-white/20"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="text-xs font-medium">
                  {theme === "dark" ? "Light" : "Dark"}
                </span>
              </button>
            </div>

            {/* Volume slider */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={14} className="opacity-60" />
                <span className="text-xs text-white/60">Volume</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none bg-white/20 accent-blue-500"
              />
            </div>

            {/* Display info */}
            <div className="pt-3 border-t border-white/10 text-xs text-white/50">
              <div className="flex justify-between">
                <span>Battery</span>
                <span>100% - Charging</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
