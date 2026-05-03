"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/lib/stores/os-store";
import { fs } from "@/lib/os/filesystem";
import Desktop from "@/components/os/Desktop";
import BootScreen from "@/components/os/BootScreen";

export default function Home() {
  const { isBooted, boot } = useOSStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      // Initialize filesystem
      await fs.init();
      setIsInitialized(true);
      
      // Start boot sequence
      await boot();
    }
    
    initialize();
  }, [boot]);

  if (!isInitialized || !isBooted) {
    return <BootScreen />;
  }

  return <Desktop />;
}
