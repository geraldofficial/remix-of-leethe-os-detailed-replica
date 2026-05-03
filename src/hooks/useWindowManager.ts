import { useState, useCallback } from 'react';
import type { AppWindow } from '@/types/os';

let nextZ = 10;

export function useWindowManager() {
  const [windows, setWindows] = useState<AppWindow[]>([]);

  const openWindow = useCallback((appId: string, title: string, width: number, height: number) => {
    nextZ++;
    const id = `${appId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const offset = (windows.length % 6) * 24;
    const x = 120 + offset;
    const y = 80 + offset;
    setWindows(prev => [...prev, { id, appId, title, x, y, width, height, isMinimized: false, isMaximized: false, zIndex: nextZ }]);
    return id;
  }, [windows.length]);

  const focusWindow = useCallback((id: string) => {
    nextZ++;
    const z = nextZ;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: z, isMinimized: false } : w));
  }, []);

  const openOrFocus = useCallback((appId: string, title: string, width: number, height: number, forceNew = false) => {
    setWindows(prev => {
      if (!forceNew) {
        const existing = prev.find(w => w.appId === appId);
        if (existing) {
          nextZ++;
          return prev.map(w => w.id === existing.id ? { ...w, zIndex: nextZ, isMinimized: false } : w);
        }
      }
      nextZ++;
      const id = `${appId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const offset = (prev.length % 6) * 24;
      return [...prev, { id, appId, title, x: 120 + offset, y: 80 + offset, width, height, isMinimized: false, isMaximized: false, zIndex: nextZ }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const closeAllForApp = useCallback((appId: string) => {
    setWindows(prev => prev.filter(w => w.appId !== appId));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  return { windows, openWindow, openOrFocus, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow, closeAllForApp };
}
