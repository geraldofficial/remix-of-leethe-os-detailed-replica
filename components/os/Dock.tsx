"use client";

import { useState, useEffect, useRef } from "react";
import { useOSStore } from "@/lib/stores/os-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { getApp, getAllApps } from "@/lib/os/app-registry";

interface DockProps {
  onOpenApp: (appId: string) => void;
  openAppIds?: string[];
  onContextMenu?: (appId: string, x: number, y: number) => void;
  visible?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Dock({
  onOpenApp,
  openAppIds = [],
  onContextMenu,
  visible = true,
  onMouseEnter,
  onMouseLeave,
}: DockProps) {
  const { pinnedApps } = useOSStore();
  const { dockIconSize, dockMagnification, dockPosition, animationSpeed, reduceMotion } = useSettingsStore();
  
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Build dock items from pinned apps + open but not pinned
  const dockItems = [
    ...pinnedApps.map((appId) => ({ appId, isPinned: true })),
    ...openAppIds
      .filter((appId) => !pinnedApps.includes(appId))
      .map((appId) => ({ appId, isPinned: false })),
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible || dockItems.length === 0) return;

      const isHorizontal = dockPosition === "bottom";
      const isLeftArrow = e.key === "ArrowLeft";
      const isRightArrow = e.key === "ArrowRight";
      const isUpArrow = e.key === "ArrowUp";
      const isDownArrow = e.key === "ArrowDown";

      let newIdx: number | null = null;

      if (isHorizontal) {
        // Bottom dock: left/right arrow keys
        if (isLeftArrow || isUpArrow) {
          e.preventDefault();
          newIdx = selectedIdx === null ? dockItems.length - 1 : Math.max(0, selectedIdx - 1);
        } else if (isRightArrow || isDownArrow) {
          e.preventDefault();
          newIdx = selectedIdx === null ? 0 : Math.min(dockItems.length - 1, selectedIdx + 1);
        }
      } else {
        // Vertical dock (left/right): up/down arrow keys
        if (isUpArrow || isLeftArrow) {
          e.preventDefault();
          newIdx = selectedIdx === null ? dockItems.length - 1 : Math.max(0, selectedIdx - 1);
        } else if (isDownArrow || isRightArrow) {
          e.preventDefault();
          newIdx = selectedIdx === null ? 0 : Math.min(dockItems.length - 1, selectedIdx + 1);
        }
      }

      if (e.key === "Enter" && selectedIdx !== null) {
        e.preventDefault();
        const item = dockItems[selectedIdx];
        handleClick({ preventDefault: () => {}, stopPropagation: () => {} } as any, item.appId, selectedIdx);
        setSelectedIdx(null);
      }

      if (e.key === "Escape") {
        setSelectedIdx(null);
      }

      if (newIdx !== null) {
        setSelectedIdx(newIdx);
        setHoveredIdx(newIdx);
        buttonsRef.current[newIdx]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, visible, dockItems, dockPosition]);

  const handleClick = (e: React.MouseEvent, appId: string, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setBouncingIdx(idx);
    setTimeout(() => setBouncingIdx(null), 500);
    onOpenApp(appId);
  };

  const getTransform = () => {
    if (dockPosition === "left") {
      return `translateX(${visible ? "0" : "calc(-100% - 24px)"})`;
    }
    if (dockPosition === "right") {
      return `translateX(${visible ? "0" : "calc(100% + 24px)"})`;
    }
    return `translateX(-50%) translateY(${visible ? "0" : "calc(100% + 24px)"})`;
  };

  const getContainerStyle = (): React.CSSProperties => {
    const animSpeedMultiplier = animationSpeed === "fast" ? 0.7 : animationSpeed === "reduced" ? 1.4 : 1;
    const transitionDuration = 280 * animSpeedMultiplier;
    
    const base: React.CSSProperties = {
      transform: getTransform(),
      transition: `transform ${transitionDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      gap: 6,
      padding: "8px 12px",
      borderRadius: 16,
      backgroundColor: "rgba(28, 28, 30, 0.65)",
      backdropFilter: "blur(30px) saturate(180%)",
      WebkitBackdropFilter: "blur(30px) saturate(180%)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.08)",
    };

    if (dockPosition === "left") {
      return {
        ...base,
        position: "fixed",
        left: 12,
        top: "50%",
        transform: `translateY(-50%) ${getTransform()}`,
        flexDirection: "column",
      };
    }
    
    if (dockPosition === "right") {
      return {
        ...base,
        position: "fixed",
        right: 12,
        top: "50%",
        transform: `translateY(-50%) ${getTransform()}`,
        flexDirection: "column",
      };
    }

    return {
      ...base,
      position: "fixed",
      left: "50%",
      bottom: 12,
    };
  };

  return (
    <div
      className={`flex items-${dockPosition === "bottom" ? "end" : "center"} z-50`}
      style={getContainerStyle()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        setHoveredIdx(null);
        onMouseLeave?.();
      }}
    >
      {dockItems.map((item, i) => {
        const app = getApp(item.appId);
        if (!app) return null;
        
        const Icon = app.icon;
        const isHovered = hoveredIdx === i;
        const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - i) === 1;
        const isOpen = openAppIds.includes(item.appId);
        
        let scale = 1;
        if (dockMagnification) {
          scale = isHovered ? 1.3 : isNeighbor ? 1.12 : 1;
        }

        return (
          <button
            key={`${item.appId}-${i}`}
            type="button"
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            aria-label={app.name}
            title={app.name}
            className={`relative flex flex-col items-center ease-out ${
              bouncingIdx === i ? "dock-bounce" : ""
            } ${selectedIdx === i ? "ring-2 ring-blue-400" : ""}`}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: dockPosition === "bottom" ? "bottom center" : "center",
              padding: "0 2px",
              transitionDuration: reduceMotion ? "0ms" : "200ms",
              transitionProperty: "transform",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => {
              setHoveredIdx(null);
              if (selectedIdx !== i) setSelectedIdx(null);
            }}
            onClick={(e) => handleClick(e, item.appId, i)}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu?.(item.appId, e.clientX, e.clientY);
            }}
          >
            {/* Tooltip */}
            {isHovered && (
              <span
                aria-hidden
                className="absolute whitespace-nowrap pointer-events-none"
                style={{
                  ...(dockPosition === "bottom"
                    ? { bottom: dockIconSize + 14, left: "50%", transform: "translateX(-50%)" }
                    : dockPosition === "left"
                    ? { left: dockIconSize + 14, top: "50%", transform: "translateY(-50%)" }
                    : { right: dockIconSize + 14, top: "50%", transform: "translateY(-50%)" }),
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "rgba(20, 20, 22, 0.95)",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {app.name}
              </span>
            )}
            
            {/* Icon */}
            <div style={{ width: dockIconSize, height: dockIconSize }}>
              <Icon size={dockIconSize} />
            </div>
            
            {/* Running indicator */}
            <span
              aria-hidden
              className="absolute transition-all duration-150"
              style={{
                ...(dockPosition === "bottom"
                  ? { bottom: -6, left: "50%", transform: "translateX(-50%)" }
                  : dockPosition === "left"
                  ? { left: -6, top: "50%", transform: "translateY(-50%)" }
                  : { right: -6, top: "50%", transform: "translateY(-50%)" }),
                width: 4,
                height: 4,
                borderRadius: 999,
                background: isOpen ? "rgba(255,255,255,0.95)" : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
