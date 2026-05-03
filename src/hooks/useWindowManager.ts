import { useState, useCallback } from 'react';
import type { AppWindow } from '@/types/os';

let nextZ = 10;

export function useWindowManager() {
  const [windows, setWindows] = useState<AppWindow[]>([]);

  const openWindow = useCallback((appId: string, title: string, width: number, height: number) => {
    const id = `${appId}-${Date.now()}`;
    const x = 80 + Math.random() * 200;
    const y = 60 + Math.random() * 100;
    nextZ++;
    setWindows(prev => [...prev, { id, appId, title, x, y, width, height, isMinimized: false, isMaximized: false, zIndex: nextZ }]);
    return id;
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    nextZ++;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ } : w));
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

  return { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow };
}
