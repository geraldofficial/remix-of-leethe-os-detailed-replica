"use client";

import { Camera } from "lucide-react";

export default function CameraApp({ windowId }: { windowId: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background: "hsl(var(--card))" }}>
      <Camera size={48} className="mb-4 opacity-30" />
      <h2 className="text-lg font-semibold mb-2">Camera</h2>
      <p className="text-sm opacity-60">Camera access not available</p>
    </div>
  );
}
