"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.log("[v0] Service Workers not supported");
      return;
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { 
          scope: "/",
          updateViaCache: "none",
        });
        console.log("[v0] Service Worker registered successfully:", registration);

        // Check for updates periodically
        const updateInterval = setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        return () => clearInterval(updateInterval);
      } catch (error) {
        console.error("[v0] Service Worker registration failed:", error);
      }
    };

    let cleanup: (() => void) | undefined;

    // Handle service worker updates
    let refreshing = false;
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    registerSW().then((cl) => {
      cleanup = cl;
    });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      if (cleanup) cleanup();
    };
  }, []);

  return null;
}
