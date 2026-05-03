"use client";

import { Image as ImageIcon } from "lucide-react";

export default function PhotosApp({ windowId }: { windowId: string }) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center"
      style={{ background: "hsl(var(--card))" }}
    >
      <ImageIcon size={48} className="mb-4 opacity-30" />
      <h2 className="text-lg font-semibold mb-2">Photos</h2>
      <p className="text-sm opacity-60">No photos in your library yet</p>
    </div>
  );
}
