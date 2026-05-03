"use client";

import { Globe, ArrowLeft, ArrowRight, RotateCw, Home } from "lucide-react";
import { useState } from "react";

export default function BrowserApp({ windowId }: { windowId: string }) {
  const [url, setUrl] = useState("https://example.com");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  return (
    <div className="h-full flex flex-col" style={{ background: "hsl(var(--card))" }}>
      {/* Toolbar */}
      <div className="p-3 border-b flex items-center gap-2">
        <button className="p-1.5 rounded hover:bg-secondary" disabled>
          <ArrowLeft size={16} className="opacity-50" />
        </button>
        <button className="p-1.5 rounded hover:bg-secondary" disabled>
          <ArrowRight size={16} className="opacity-50" />
        </button>
        <button className="p-1.5 rounded hover:bg-secondary">
          <RotateCw size={16} />
        </button>
        <div className="flex-1 flex items-center px-3 rounded" style={{ background: "hsl(var(--secondary))" }}>
          <Globe size={14} className="opacity-60 mr-2" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent outline-none py-1.5 text-sm"
            placeholder="Enter URL"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <Globe size={48} className="mb-4 opacity-30" />
        <h2 className="text-lg font-semibold mb-2">Web Browser</h2>
        <p className="text-sm opacity-60 mb-4">
          This is a demo browser window. In a full implementation, it would display web content.
        </p>
        <div style={{ background: "hsl(var(--secondary))", borderRadius: "8px" }} className="p-4 text-xs opacity-70 max-w-xs">
          URL: {url}
        </div>
      </div>
    </div>
  );
}
