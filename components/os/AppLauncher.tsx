"use client";

import { useState, useEffect, useRef } from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { getAllApps } from "@/lib/os/app-registry";

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export default function AppLauncher({ isOpen, onClose, onOpenApp }: AppLauncherProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const inputRef = useRef<HTMLInputElement>(null);

  const apps = getAllApps();
  const filtered = apps.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase()) ||
    app.description.toLowerCase().includes(query.toLowerCase())
  );
  
  const perPage = viewMode === "grid" ? 15 : 10;
  const pageApps = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setPage(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && page > 0) {
        setPage((p) => p - 1);
      } else if (e.key === "ArrowRight" && page < totalPages - 1) {
        setPage((p) => p + 1);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, page, totalPages, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute top-7 left-0 rounded-br-xl p-5 fade-in"
        style={{
          backgroundColor: "rgba(250, 250, 250, 0.98)",
          backdropFilter: "blur(20px)",
          width: 720,
          maxHeight: "calc(100vh - 80px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          {/* View toggles */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid #d1d5db" }}
          >
            <button
              className="p-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "grid" ? "#e5e7eb" : "#f3f4f6",
              }}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid
                size={14}
                color={viewMode === "grid" ? "#374151" : "#9ca3af"}
              />
            </button>
            <button
              className="p-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "list" ? "#e5e7eb" : "#f3f4f6",
              }}
              onClick={() => setViewMode("list")}
            >
              <List
                size={14}
                color={viewMode === "list" ? "#374151" : "#9ca3af"}
              />
            </button>
          </div>
          
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9ca3af" }}
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search applications..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: "1px solid #d1d5db",
                backgroundColor: "white",
              }}
            />
          </div>
        </div>

        {/* Apps */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-5 gap-x-2 gap-y-4">
            {pageApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-black/5 transition-colors"
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                >
                  <Icon size={48} />
                  <span
                    className="text-xs text-center leading-tight line-clamp-2"
                    style={{ color: "#374151" }}
                  >
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {pageApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors text-left"
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                >
                  <Icon size={32} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#374151" }}>
                      {app.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {app.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {pageApps.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No applications found</p>
          </div>
        )}

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: i === page ? "#374151" : "#d1d5db",
                }}
              />
            ))}
          </div>
        )}

        {/* Footer hint */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-muted-foreground text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}
