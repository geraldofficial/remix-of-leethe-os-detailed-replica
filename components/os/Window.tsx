"use client";

import { useRef, useCallback, useState } from "react";
import { X, Minus, Square, Copy } from "lucide-react";
import type { AppWindow, SnapPosition } from "@/lib/stores/os-store";
import { useSettingsStore } from "@/lib/stores/settings-store";

interface WindowProps {
  win: AppWindow;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onSnap: (id: string, position: SnapPosition) => void;
  onContextMenu?: (x: number, y: number) => void;
  children: React.ReactNode;
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;

export default function Window({
  win,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  onSnap,
  onContextMenu,
  children,
}: WindowProps) {
  const { reduceMotion } = useSettingsStore();
  const [snapPreview, setSnapPreview] = useState<SnapPosition>(null);
  
  const dragRef = useRef<{
    startX: number;
    startY: number;
    winX: number;
    winY: number;
    moved: boolean;
  } | null>(null);
  
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    winX: number;
    winY: number;
    winWidth: number;
    winHeight: number;
    direction: ResizeDirection;
  } | null>(null);

  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || win.isMaximized) return;
      if ((e.target as HTMLElement).closest("[data-window-control]")) return;
      
      onFocus(win.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
        moved: false,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        
        if (Math.abs(dx) + Math.abs(dy) > 3) {
          dragRef.current.moved = true;
        }
        
        const newX = Math.max(0, dragRef.current.winX + dx);
        const newY = Math.max(28, dragRef.current.winY + dy); // Keep below topbar
        onMove(win.id, newX, newY);

        // Detect snap zones (30px threshold from edges)
        const snapThreshold = 30;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight - 28;
        
        let preview: SnapPosition = null;
        if (newX < snapThreshold) {
          preview = "left";
        } else if (newX + win.width > viewportWidth - snapThreshold) {
          preview = "right";
        }
        
        setSnapPreview(preview);
      };

      const handleMouseUp = () => {
        if (dragRef.current?.moved && snapPreview) {
          onSnap(win.id, snapPreview);
        }
        setSnapPreview(null);
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [win.id, win.x, win.y, win.isMaximized, onFocus, onMove]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      if (win.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      
      setIsResizing(true);
      onFocus(win.id);
      
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
        winWidth: win.width,
        winHeight: win.height,
        direction,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!resizeRef.current) return;
        
        const dx = ev.clientX - resizeRef.current.startX;
        const dy = ev.clientY - resizeRef.current.startY;
        const dir = resizeRef.current.direction;
        
        let newWidth = resizeRef.current.winWidth;
        let newHeight = resizeRef.current.winHeight;
        let newX = resizeRef.current.winX;
        let newY = resizeRef.current.winY;

        if (dir?.includes("e")) newWidth += dx;
        if (dir?.includes("w")) {
          newWidth -= dx;
          newX += dx;
        }
        if (dir?.includes("s")) newHeight += dy;
        if (dir?.includes("n")) {
          newHeight -= dy;
          newY += dy;
        }

        // Apply minimum constraints
        if (newWidth >= win.minWidth) {
          onResize(win.id, newWidth, newHeight);
          if (dir?.includes("w")) onMove(win.id, newX, win.y);
        }
        if (newHeight >= win.minHeight) {
          onResize(win.id, win.width, newHeight);
          if (dir?.includes("n")) onMove(win.id, win.x, newY);
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        resizeRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [win, onFocus, onMove, onResize]
  );

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        left: 0,
        top: 28,
        width: "100vw",
        height: "calc(100vh - 28px)",
        zIndex: win.zIndex,
        borderRadius: 0,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <>
      {/* Snap preview */}
      {snapPreview && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: snapPreview === "left" ? 0 : snapPreview === "right" ? "50%" : 0,
            top: 28,
            width: snapPreview === "left" || snapPreview === "right" ? "50%" : "100%",
            height: "calc(100vh - 28px)",
            backgroundColor: "rgba(100, 150, 255, 0.1)",
            border: "2px solid rgba(100, 150, 255, 0.3)",
            zIndex: win.zIndex - 1,
            borderRadius: 0,
          }}
        />
      )}

      <div
        className={`fixed overflow-hidden window-shadow flex flex-col ${
          reduceMotion ? "" : "window-open"
        } ${isResizing ? "dragging" : ""} transition-all ${
          snapPreview ? "opacity-50" : ""
        }`}
        style={{
          ...style,
          borderRadius: win.isMaximized ? 0 : 10,
          background: "hsl(var(--os-window-bg))",
          border: win.isMaximized ? "none" : "1px solid hsl(var(--os-window-border))",
          transition: snapPreview ? "none" : "border-color 0.2s ease",
        }}
        onMouseDown={() => onFocus(win.id)}
        onContextMenu={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("[data-titlebar]")) {
            e.preventDefault();
            onContextMenu?.(e.clientX, e.clientY);
          }
        }}
      >
      {/* Title bar */}
      <div
        data-titlebar
        className="h-10 flex items-center pl-4 pr-2 gap-2 select-none shrink-0"
        style={{
          backgroundColor: "hsl(var(--os-window-header))",
          borderBottom: "1px solid hsl(var(--os-window-border))",
          cursor: win.isMaximized ? "default" : "move",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <span
          className="flex-1 text-[13px] font-medium truncate"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {win.title}
        </span>
        
        {/* Window controls */}
        <div data-window-control className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Minimize"
            title="Minimize"
            onClick={() => onMinimize(win.id)}
            className="w-8 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Minus size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label={win.isMaximized ? "Restore" : "Maximize"}
            title={win.isMaximized ? "Restore" : "Maximize"}
            onClick={() => onMaximize(win.id)}
            className="w-8 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {win.isMaximized ? (
              <Copy size={13} strokeWidth={2} />
            ) : (
              <Square size={12} strokeWidth={2} />
            )}
          </button>
          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={() => onClose(win.id)}
            className="w-8 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-red-500 hover:text-white transition-colors"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-hidden"
        style={{ backgroundColor: "hsl(var(--os-window-bg))" }}
      >
        {children}
      </div>

      {/* Resize handles */}
      {!win.isMaximized && (
        <>
          {/* Edges */}
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
          
          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
        </>
      )}
      </div>
    </>
  );
}
