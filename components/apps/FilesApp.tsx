"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Film,
  Code2,
  Home,
  Download,
  Star,
  Trash2,
  HardDrive,
  Search,
  ChevronRight,
  Plus,
  LayoutGrid,
  List,
  Upload,
  RefreshCw,
  Copy,
  Scissors,
  Clipboard,
  Eye,
  X,
} from "lucide-react";
import { fs, type FileNode } from "@/lib/os/filesystem";

interface FilesAppProps {
  windowId: string;
}

const sidebar = [
  { label: "Home", path: "/Users/Guest", icon: Home },
  { label: "Desktop", path: "/Users/Guest/Desktop", icon: Folder },
  { label: "Documents", path: "/Users/Guest/Documents", icon: FileText },
  { label: "Downloads", path: "/Users/Guest/Downloads", icon: Download },
  { label: "Pictures", path: "/Users/Guest/Pictures", icon: ImageIcon },
  { label: "Music", path: "/Users/Guest/Music", icon: Music },
];

function iconFor(node: FileNode) {
  const props = { size: 18, className: "flex-shrink-0" };
  
  if (node.type === "folder") {
    return <Folder {...props} className="text-blue-500" fill="currentColor" fillOpacity={0.2} />;
  }
  
  const ext = node.name.split(".").pop()?.toLowerCase();
  
  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <ImageIcon {...props} className="text-pink-500" />;
    case "mp3":
    case "wav":
    case "ogg":
      return <Music {...props} className="text-purple-500" />;
    case "mp4":
    case "webm":
    case "mov":
      return <Film {...props} className="text-orange-500" />;
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
    case "css":
    case "html":
    case "json":
      return <Code2 {...props} className="text-emerald-500" />;
    default:
      return <FileText {...props} className="text-zinc-500" />;
  }
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  
  if (d.toDateString() === now.toDateString()) return "Today";
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FilesApp({ windowId }: FilesAppProps) {
  const [currentPath, setCurrentPath] = useState("/Users/Guest");
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<FileNode | null>(null);
  const [clipboard, setClipboard] = useState<{ files: FileNode[]; mode: "copy" | "cut" } | null>(null);

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fs.readDir(currentPath);
      // Sort: folders first, then by name
      items.sort((a, b) => {
        if (a.type === "folder" && b.type !== "folder") return -1;
        if (a.type !== "folder" && b.type === "folder") return 1;
        return a.name.localeCompare(b.name);
      });
      setFiles(items);
    } catch (error) {
      console.error("[v0] Failed to load files:", error);
      setFiles([]);
    }
    setIsLoading(false);
  }, [currentPath]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "c") {
          e.preventDefault();
          handleCopy();
        } else if (e.key === "x") {
          e.preventDefault();
          handleCut();
        } else if (e.key === "v") {
          e.preventDefault();
          handlePaste();
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Enter" && selected) {
        const node = files.find((f) => f.name === selected);
        if (node) handleDoubleClick(node);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, files, clipboard]);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelected(null);
    setQuery("");
  };

  const handleDoubleClick = async (node: FileNode) => {
    if (node.type === "folder") {
      navigateTo(node.path);
    } else {
      // TODO: Open file with appropriate app
      console.log("[v0] Open file:", node.path);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    
    try {
      await fs.mkdir(`${currentPath}/${name}`);
      loadFiles();
    } catch (error) {
      alert(`Failed to create folder: ${error}`);
    }
  };

  const handleCreateFile = async () => {
    const name = prompt("Enter file name:");
    if (!name) return;
    
    try {
      await fs.writeFile(`${currentPath}/${name}`, "");
      loadFiles();
    } catch (error) {
      alert(`Failed to create file: ${error}`);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    
    const node = files.find((f) => f.name === selected);
    if (!node) return;
    
    if (!confirm(`Delete "${node.name}"?`)) return;
    
    try {
      await fs.rm(node.path, true);
      setSelected(null);
      loadFiles();
    } catch (error) {
      alert(`Failed to delete: ${error}`);
    }
  };

  const handleCopy = async () => {
    if (!selected) return;
    const node = files.find((f) => f.name === selected);
    if (node) {
      setClipboard({ files: [node], mode: "copy" });
    }
  };

  const handleCut = async () => {
    if (!selected) return;
    const node = files.find((f) => f.name === selected);
    if (node) {
      setClipboard({ files: [node], mode: "cut" });
    }
  };

  const handlePaste = async () => {
    if (!clipboard || clipboard.files.length === 0) return;
    
    try {
      for (const file of clipboard.files) {
        const destPath = `${currentPath}/${file.name}`;
        if (clipboard.mode === "copy") {
          const content = await fs.readFile(file.path);
          await fs.writeFile(destPath, content);
        } else {
          // Cut operation: copy then delete original
          const content = await fs.readFile(file.path);
          await fs.writeFile(destPath, content);
          await fs.rm(file.path, false);
        }
      }
      
      if (clipboard.mode === "cut") {
        setClipboard(null);
      }
      loadFiles();
      setSelected(null);
    } catch (error) {
      alert(`Failed to paste: ${error}`);
    }
  };

  const handlePreview = async () => {
    if (!selected) return;
    const node = files.find((f) => f.name === selected);
    if (node) {
      setPreviewFile(node);
    }
  };

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const items = e.dataTransfer.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "string" && items[i].type === "text/plain") {
        items[i].getAsString(async (filePath: string) => {
          try {
            const fileName = filePath.split("/").pop() || "file";
            const sourceNode = files.find((f) => f.path === filePath);
            if (sourceNode) {
              const content = await fs.readFile(filePath);
              await fs.writeFile(`${currentPath}/${fileName}`, content);
              loadFiles();
            }
          } catch (error) {
            console.error("[v0] Drop failed:", error);
          }
        });
      }
    }
  };

  return (
    <div className="flex h-full text-sm" style={{ background: "hsl(var(--card))" }}>
      {/* Sidebar */}
      <aside
        className="w-52 shrink-0 px-2 py-3 flex flex-col gap-0.5 overflow-auto os-scrollbar"
        style={{
          background: "hsl(var(--os-sidebar-bg))",
          borderRight: "1px solid hsl(var(--border))",
        }}
      >
        <div
          className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-1"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Favorites
        </div>
        {sidebar.map((s) => {
          const Icon = s.icon;
          const active = currentPath === s.path;
          return (
            <button
              key={s.path}
              onClick={() => navigateTo(s.path)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              style={{
                background: active ? "hsl(var(--accent) / 0.12)" : "transparent",
                color: active ? "hsl(var(--accent))" : "hsl(var(--os-sidebar-fg))",
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={15} />
              {s.label}
            </button>
          );
        })}

        <div
          className="text-[11px] font-semibold uppercase tracking-wider px-2 mt-4 mb-1"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          System
        </div>
        <button
          onClick={() => navigateTo("/System")}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors hover:bg-secondary/50"
          style={{ color: "hsl(var(--os-sidebar-fg))" }}
        >
          <HardDrive size={15} />
          System
        </button>
      </aside>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-w-0"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Toolbar */}
        <div
          className="h-11 flex items-center gap-2 px-3 shrink-0"
          style={{
            borderBottom: "1px solid hsl(var(--border))",
            background: "hsl(var(--os-toolbar-bg))",
          }}
        >
          {/* Breadcrumbs */}
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <button onClick={() => navigateTo("/")} className="hover:text-foreground">
              <Home size={13} />
            </button>
            {breadcrumbs.map((part, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight size={12} />
                <button
                  onClick={() => navigateTo("/" + breadcrumbs.slice(0, i + 1).join("/"))}
                  className="hover:text-foreground"
                  style={{
                    color: i === breadcrumbs.length - 1 ? "hsl(var(--foreground))" : undefined,
                    fontWeight: i === breadcrumbs.length - 1 ? 500 : undefined,
                  }}
                >
                  {part}
                </button>
              </span>
            ))}
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <button
            onClick={handleCreateFolder}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title="New Folder"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!selected}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
            title="Copy (Ctrl+C)"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={handleCut}
            disabled={!selected}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
            title="Cut (Ctrl+X)"
          >
            <Scissors size={14} />
          </button>
          <button
            onClick={handlePaste}
            disabled={!clipboard}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
            title="Paste (Ctrl+V)"
          >
            <Clipboard size={14} />
          </button>
          <button
            onClick={handlePreview}
            disabled={!selected}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
            title="Preview (Enter)"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={loadFiles}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          {/* View mode */}
          <div className="flex rounded-md overflow-hidden border border-border">
            <button
              onClick={() => setViewMode("list")}
              className="p-1.5 transition-colors"
              style={{ background: viewMode === "list" ? "hsl(var(--secondary))" : "transparent" }}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className="p-1.5 transition-colors"
              style={{ background: viewMode === "grid" ? "hsl(var(--secondary))" : "transparent" }}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="pl-7 pr-2 py-1.5 rounded-md text-xs outline-none w-40"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto os-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Folder size={48} className="opacity-30 mb-2" />
              <p className="text-sm">This folder is empty</p>
            </div>
          ) : viewMode === "list" ? (
            <table className="w-full text-xs">
              <thead style={{ color: "hsl(var(--muted-foreground))" }}>
                <tr className="border-b border-border">
                  <th className="text-left font-medium px-3 py-2">Name</th>
                  <th className="text-left font-medium px-3 py-2 w-24">Size</th>
                  <th className="text-left font-medium px-3 py-2 w-32">Modified</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((node) => {
                  const isSel = selected === node.name;
                  return (
                    <tr
                      key={node.id}
                      onClick={() => setSelected(node.name)}
                      onDoubleClick={() => handleDoubleClick(node)}
                      style={{
                        background: isSel ? "hsl(var(--accent) / 0.12)" : "transparent",
                        cursor: "default",
                      }}
                      className="hover:bg-secondary/40"
                    >
                      <td className="px-3 py-2 flex items-center gap-2">
                        {iconFor(node)}
                        <span className="truncate">{node.name}</span>
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {formatSize(node.size)}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {formatDate(node.modifiedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-6 gap-2 p-4">
              {filteredFiles.map((node) => {
                const isSel = selected === node.name;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelected(node.name)}
                    onDoubleClick={() => handleDoubleClick(node)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg transition-colors"
                    style={{
                      background: isSel ? "hsl(var(--accent) / 0.12)" : "transparent",
                    }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      {node.type === "folder" ? (
                        <Folder size={40} className="text-blue-500" fill="currentColor" fillOpacity={0.2} />
                      ) : (
                        iconFor(node)
                      )}
                    </div>
                    <span className="text-[11px] text-center truncate w-full">
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div
          className="h-7 px-3 flex items-center justify-between text-[11px] shrink-0"
          style={{
            borderTop: "1px solid hsl(var(--border))",
            color: "hsl(var(--muted-foreground))",
            background: "hsl(var(--os-toolbar-bg))",
          }}
        >
          <span>
            {filteredFiles.length} item{filteredFiles.length !== 1 ? "s" : ""}{clipboard && ` • Clipboard: ${clipboard.files.length} file(s)`}
          </span>
          {selected && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-500 hover:text-red-600"
            >
              <Trash2 size={12} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-card rounded-lg shadow-lg max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "hsl(var(--card))" }}
          >
            {/* Preview header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2">
                {iconFor(previewFile)}
                <span className="font-medium truncate">{previewFile.name}</span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 hover:bg-secondary rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              {previewFile.type === "folder" ? (
                <div className="text-center text-muted-foreground">
                  <Folder size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Cannot preview folder</p>
                </div>
              ) : previewFile.name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i) ? (
                <img
                  src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain"
                  onError={() => {
                    console.log("[v0] Image preview not available");
                  }}
                />
              ) : previewFile.name.match(/\.(txt|json|js|ts|tsx|jsx|css|html|md)$/i) ? (
                <div className="w-full text-sm">
                  <div
                    className="p-3 rounded-md font-mono text-xs overflow-auto"
                    style={{
                      background: "hsl(var(--secondary))",
                      color: "hsl(var(--muted-foreground))",
                      maxHeight: "400px",
                    }}
                  >
                    <p className="text-muted-foreground">[File content would be displayed here]</p>
                    <p className="text-muted-foreground text-[10px] mt-2">
                      Size: {formatSize(previewFile.size)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Preview not available for this file type</p>
                  <p className="text-xs mt-2">Size: {formatSize(previewFile.size)}</p>
                </div>
              )}
            </div>

            {/* Preview footer */}
            <div
              className="px-4 py-3 border-t flex justify-end gap-2"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <button
                onClick={() => setPreviewFile(null)}
                className="px-3 py-1.5 rounded-md text-sm hover:bg-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
