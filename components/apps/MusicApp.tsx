"use client";

import { Music, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";

export default function MusicApp({ windowId }: { windowId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="h-full flex flex-col items-center justify-center"
      style={{ background: "hsl(var(--card))" }}
    >
      <Music size={48} className="mb-4 opacity-30" />
      <h2 className="text-lg font-semibold mb-6">Music Player</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-secondary">
          <SkipBack size={20} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-lg"
          style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary">
          <SkipForward size={20} />
        </button>
      </div>
      <p className="text-sm opacity-60 mt-6">No music files found</p>
    </div>
  );
}
