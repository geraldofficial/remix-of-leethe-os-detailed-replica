"use client";

import { Mail, Send } from "lucide-react";

export default function MailApp({ windowId }: { windowId: string }) {
  return (
    <div className="h-full flex flex-col" style={{ background: "hsl(var(--card))" }}>
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-lg font-semibold">Mail</h1>
        <button
          className="p-1.5 rounded-md"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          <Send size={16} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <Mail size={48} className="mx-auto mb-4 opacity-30" />
          <h2 className="text-lg font-semibold mb-2">No Emails</h2>
          <p className="text-sm opacity-60">Your inbox is empty</p>
        </div>
      </div>
    </div>
  );
}
