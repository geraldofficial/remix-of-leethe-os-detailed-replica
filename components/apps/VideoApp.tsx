"use client";

import { Film } from "lucide-react";

export default function VideoApp({ windowId }: { windowId: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background: "hsl(var(--card))" }}>
      <Film size={48} className="mb-4 opacity-30" />
      <h2 className="text-lg font-semibold mb-2">Videos</h2>
      <p className="text-sm opacity-60">No videos in your library</p>
    </div>
  );
}
