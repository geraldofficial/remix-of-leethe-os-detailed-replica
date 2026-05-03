"use client";

import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "@/lib/stores/settings-store";
import type { MenuItem } from "@/lib/types";

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme } = useSettingsStore();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  
  // Filter to interactive items only (skip separators)
  const interactiveItems = items.filter((item) => !item.separator);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev + 1) % interactiveItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev === 0 ? interactiveItems.length - 1 : prev - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = interactiveItems[selectedIdx];
        if (item && !item.disabled) {
          item.onClick?.();
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, selectedIdx, interactiveItems]);

  // Adjust position if menu would go off screen
  useEffect(() => {
    if (!menuRef.current) return;
    
    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    if (x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 8;
    }
    
    if (y + rect.height > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 8;
    }
    
    menuRef.current.style.left = `${adjustedX}px`;
    menuRef.current.style.top = `${adjustedY}px`;
  }, [x, y]);

  // Determine colors based on theme
  const isDark = theme === "dark" || (theme === "auto" && 
    typeof window !== "undefined" && 
    window.matchMedia("(prefers-color-scheme: dark)").matches);

  const bgColor = isDark ? "rgba(28, 28, 30, 0.95)" : "rgba(255, 255, 255, 0.98)";
  const textColor = isDark ? "#f5f5f7" : "#1d1d1f";
  const disabledColor = isDark ? "#86868b" : "#999";
  const hoverBg = isDark ? "rgba(100, 150, 255, 0.3)" : "#0071e3";
  const hoverText = isDark ? "#f5f5f7" : "#fff";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const separatorColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[180px] rounded-lg py-1.5 animate-in fade-in slide-in-from-top-2 duration-100"
      style={{
        left: x,
        top: y,
        backgroundColor: bgColor,
        backdropFilter: "blur(20px)",
        boxShadow: isDark 
          ? "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)"
          : "0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        color: textColor,
      }}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return (
            <div
              key={`sep-${index}`}
              className="my-1.5 mx-2 h-px"
              style={{ backgroundColor: separatorColor }}
            />
          );
        }

        const itemIndex = items.slice(0, index).filter((i) => !i.separator).length;
        const isSelected = selectedIdx === itemIndex;

        return (
          <button
            key={item.label}
            onClick={() => {
              if (!item.disabled) {
                item.onClick?.();
                onClose();
              }
            }}
            onMouseEnter={() => setSelectedIdx(itemIndex)}
            disabled={item.disabled}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-left transition-colors duration-75"
            style={{
              color: item.disabled ? disabledColor : isSelected ? hoverText : textColor,
              backgroundColor: isSelected && !item.disabled ? hoverBg : "transparent",
              cursor: item.disabled ? "not-allowed" : "pointer",
            }}
          >
            <span className="flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
            {item.shortcut && (
              <span className="text-xs ml-4" style={{ opacity: item.disabled ? 0.4 : 0.5 }}>
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
