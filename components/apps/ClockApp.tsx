"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function ClockApp({ windowId }: { windowId: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div
      className="h-full flex flex-col items-center justify-center"
      style={{ background: "hsl(var(--card))" }}
    >
      <div className="text-center">
        <div className="mb-4">
          <Clock size={48} className="mx-auto opacity-70" />
        </div>
        <div className="text-6xl font-mono font-bold mb-4">
          {hours}:{minutes}:{seconds}
        </div>
        <div className="text-lg opacity-70">
          {time.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
