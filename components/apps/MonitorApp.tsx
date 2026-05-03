"use client";

import { Activity, Cpu, Zap, HardDrive } from "lucide-react";
import { useState, useEffect } from "react";

export default function MonitorApp({ windowId }: { windowId: string }) {
  const [stats, setStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    processes: 0,
    uptime: 0,
  });

  useEffect(() => {
    // Simulate system stats
    setStats({
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      processes: Math.floor(Math.random() * 50) + 10,
      uptime: Math.floor(Math.random() * 86400),
    });
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4" style={{ background: "hsl(var(--card))" }}>
      <h1 className="text-lg font-semibold">System Monitor</h1>

      <div className="grid grid-cols-2 gap-3">
        {/* CPU */}
        <div
          className="p-3 rounded-lg border"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={18} className="opacity-70" />
            <span className="text-sm font-semibold">CPU</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stats.cpuUsage}%</div>
          <div
            className="w-full h-2 rounded-full"
            style={{
              background: "hsl(var(--secondary))",
              overflow: "hidden",
            }}
          >
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${stats.cpuUsage}%` }}
            />
          </div>
        </div>

        {/* Memory */}
        <div
          className="p-3 rounded-lg border"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="opacity-70" />
            <span className="text-sm font-semibold">Memory</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stats.memoryUsage}%</div>
          <div
            className="w-full h-2 rounded-full"
            style={{
              background: "hsl(var(--secondary))",
              overflow: "hidden",
            }}
          >
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${stats.memoryUsage}%` }}
            />
          </div>
        </div>

        {/* Processes */}
        <div
          className="p-3 rounded-lg border"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity size={18} className="opacity-70" />
            <span className="text-sm font-semibold">Processes</span>
          </div>
          <div className="text-2xl font-bold">{stats.processes}</div>
        </div>

        {/* Uptime */}
        <div
          className="p-3 rounded-lg border"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={18} className="opacity-70" />
            <span className="text-sm font-semibold">Uptime</span>
          </div>
          <div className="text-lg font-bold">{formatUptime(stats.uptime)}</div>
        </div>
      </div>
    </div>
  );
}
