"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/lib/stores/settings-store";

export default function DesktopBackground() {
  const { wallpaper, theme } = useSettingsStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload image to check if it loads successfully
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      console.warn(`[v0] Failed to load wallpaper: ${wallpaper}`);
      setIsLoaded(false);
    };

    img.src = wallpaper;
  }, [wallpaper]);

  // Determine background color based on theme
  const bgColor = theme === "dark" || (theme === "auto" && 
    typeof window !== "undefined" && 
    window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? "rgb(10, 10, 10)"
    : "rgb(240, 240, 245)";

  return (
    <div
      className="fixed inset-0 -z-50"
      style={{
        backgroundImage: isLoaded ? `url('${wallpaper}')` : "none",
        backgroundColor: !isLoaded ? bgColor : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Optional blur overlay for acrylic effect */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: isLoaded ? "blur(0px)" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        }}
      />
    </div>
  );
}
