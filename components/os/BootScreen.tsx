"use client";

import { useOSStore } from "@/lib/stores/os-store";

export default function BootScreen() {
  const { bootProgress } = useOSStore();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Logo */}
      <div className="mb-12">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
        >
          <rect
            x="4"
            y="4"
            width="72"
            height="72"
            rx="16"
            fill="url(#boot-gradient)"
          />
          <path
            d="M24 28h8v24h16V28h8v32H24V28z"
            fill="white"
            fillOpacity="0.95"
          />
          <defs>
            <linearGradient
              id="boot-gradient"
              x1="0"
              y1="0"
              x2="80"
              y2="80"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${bootProgress}%` }}
        />
      </div>

      {/* Status text */}
      <div className="mt-6 text-white/40 text-xs font-medium tracking-wide">
        {bootProgress < 30 && "Initializing system..."}
        {bootProgress >= 30 && bootProgress < 60 && "Loading services..."}
        {bootProgress >= 60 && bootProgress < 90 && "Preparing desktop..."}
        {bootProgress >= 90 && "Starting LeetheOS..."}
      </div>
    </div>
  );
}
