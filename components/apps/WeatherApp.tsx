"use client";

import { Cloud, MapPin } from "lucide-react";

export default function WeatherApp({ windowId }: { windowId: string }) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center"
      style={{ background: "hsl(var(--card))" }}
    >
      <Cloud size={48} className="mb-4 opacity-30" />
      <h2 className="text-lg font-semibold mb-2">Weather</h2>
      <div className="flex items-center gap-2 text-sm opacity-60 mb-6">
        <MapPin size={14} />
        <span>Location not set</span>
      </div>
      <p className="text-xs opacity-60">Enable location services to view weather</p>
    </div>
  );
}
