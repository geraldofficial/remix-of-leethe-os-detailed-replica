/**
 * Multi-monitor utilities for detecting displays and their bounds
 */

export interface DisplayInfo {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  availTop: number;
  availLeft: number;
  isPrimary: boolean;
}

/**
 * Get information about the current display
 */
export function getCurrentDisplay(): DisplayInfo {
  if (typeof window === "undefined") {
    return {
      index: 0,
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      availWidth: 1920,
      availHeight: 1080,
      availTop: 0,
      availLeft: 0,
      isPrimary: true,
    };
  }

  const screen = window.screen;
  return {
    index: 0,
    x: screen.availLeft,
    y: screen.availTop,
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    availTop: screen.availTop,
    availLeft: screen.availLeft,
    isPrimary: true,
  };
}

/**
 * Get all available displays (requires ScreenDetails API - currently limited support)
 * Falls back to single display info
 */
export async function getAllDisplays(): Promise<DisplayInfo[]> {
  if (typeof window === "undefined") {
    return [getCurrentDisplay()];
  }

  // Check if ScreenDetails API is available (experimental)
  if ("getScreenDetails" in window.screen) {
    try {
      const screenDetails = await (window.screen as any).getScreenDetails();
      return screenDetails.screens.map((screen: any, index: number) => ({
        index,
        x: screen.availLeft,
        y: screen.availTop,
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        availTop: screen.availTop,
        availLeft: screen.availLeft,
        isPrimary: screenDetails.currentScreen === screen,
      }));
    } catch (error) {
      console.warn("[v0] ScreenDetails API failed, falling back to single display", error);
      return [getCurrentDisplay()];
    }
  }

  // Fallback: return only current display
  return [getCurrentDisplay()];
}

/**
 * Get the display that contains the given point
 */
export function getDisplayAt(x: number, y: number, displays: DisplayInfo[]): DisplayInfo {
  const display = displays.find(
    (d) => x >= d.availLeft && x < d.availLeft + d.availWidth &&
           y >= d.availTop && y < d.availTop + d.availHeight
  );
  return display || displays[0];
}

/**
 * Get the display that a window is primarily on
 * (based on where most of the window is)
 */
export function getDisplayForWindow(
  windowX: number,
  windowY: number,
  windowWidth: number,
  windowHeight: number,
  displays: DisplayInfo[]
): DisplayInfo {
  // Center point of the window
  const centerX = windowX + windowWidth / 2;
  const centerY = windowY + windowHeight / 2;
  return getDisplayAt(centerX, centerY, displays);
}

/**
 * Clamp a window to the bounds of a display
 */
export function clampWindowToDisplay(
  x: number,
  y: number,
  width: number,
  height: number,
  display: DisplayInfo,
  topbarHeight: number = 28
): { x: number; y: number; width: number; height: number } {
  const minX = display.availLeft;
  const minY = display.availTop + topbarHeight;
  const maxX = display.availLeft + display.availWidth - width;
  const maxY = display.availTop + display.availHeight - height;

  return {
    x: Math.max(minX, Math.min(x, maxX)),
    y: Math.max(minY, Math.min(y, maxY)),
    width: Math.min(width, display.availWidth),
    height: Math.min(height, display.availHeight - topbarHeight),
  };
}

/**
 * Check if the system prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration multiplier based on animation speed setting
 */
export function getAnimationDuration(speed: "normal" | "reduced" | "fast"): number {
  switch (speed) {
    case "reduced":
      return 0.5;
    case "fast":
      return 1.3;
    case "normal":
    default:
      return 1.0;
  }
}
