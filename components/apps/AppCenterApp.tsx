"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Star,
  Trash2,
  Code,
  RefreshCw,
  Grid,
  List as ListIcon,
  Info,
  X,
} from "lucide-react";
import { getAllApps, getUserApps } from "@/lib/os/app-registry";
import type { AppDefinition } from "@/lib/os/app-registry";

interface CommunityApp {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  downloads: number;
  rating: number;
  category: string;
  repoUrl: string;
  tags: string[];
  installed: boolean;
}

// Mock GitHub app registry
const COMMUNITY_APPS: CommunityApp[] = [
  {
    id: "pomodoro",
    name: "Pomodoro Timer",
    description: "Time management app using the Pomodoro technique",
    author: "github-user",
    version: "1.0.0",
    downloads: 1250,
    rating: 4.8,
    category: "productivity",
    repoUrl: "https://github.com/example/pomodoro-timer",
    tags: ["timer", "productivity", "focus"],
    installed: false,
  },
  {
    id: "todo-plus",
    name: "Todo Plus",
    description: "Advanced todo list with tags, priorities, and categories",
    author: "dev-user",
    version: "2.1.0",
    downloads: 2100,
    rating: 4.7,
    category: "productivity",
    repoUrl: "https://github.com/example/todo-plus",
    tags: ["todo", "list", "productivity"],
    installed: false,
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Feature-rich markdown editor with live preview",
    author: "markdown-dev",
    version: "1.5.2",
    downloads: 3400,
    rating: 4.9,
    category: "development",
    repoUrl: "https://github.com/example/markdown-editor",
    tags: ["markdown", "editor", "writing"],
    installed: false,
  },
  {
    id: "password-manager",
    name: "Pass Manager",
    description: "Secure password manager with encryption",
    author: "security-team",
    version: "1.2.0",
    downloads: 5600,
    rating: 4.6,
    category: "utilities",
    repoUrl: "https://github.com/example/pass-manager",
    tags: ["password", "security", "encryption"],
    installed: false,
  },
  {
    id: "pixel-art",
    name: "Pixel Art Studio",
    description: "Create pixel art and animations",
    author: "artist-dev",
    version: "1.0.1",
    downloads: 890,
    rating: 4.7,
    category: "media",
    repoUrl: "https://github.com/example/pixel-art",
    tags: ["art", "pixel", "drawing"],
    installed: false,
  },
  {
    id: "json-viewer",
    name: "JSON Viewer Pro",
    description: "View and validate JSON files with syntax highlighting",
    author: "dev-tools",
    version: "2.0.0",
    downloads: 4200,
    rating: 4.8,
    category: "development",
    repoUrl: "https://github.com/example/json-viewer",
    tags: ["json", "viewer", "developer"],
    installed: false,
  },
];

interface AppCenterAppProps {
  windowId: string;
}

export default function AppCenterApp({ windowId }: AppCenterAppProps) {
  const [view, setView] = useState<"browse" | "installed">("browse");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [apps, setApps] = useState<CommunityApp[]>(COMMUNITY_APPS);
  const [selectedApp, setSelectedApp] = useState<CommunityApp | null>(null);
  const [installedApps, setInstalledApps] = useState<string[]>([]);

  useEffect(() => {
    // Load installed apps
    const userApps = getUserApps();
    setInstalledApps(userApps.map((app) => app.id));
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory ||
      app.category.toLowerCase() === selectedCategory.toLowerCase();

    if (view === "installed") {
      return matchesSearch && matchesCategory && installedApps.includes(app.id);
    }

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "productivity",
    "development",
    "media",
    "utilities",
    "games",
  ];

  const handleInstall = (appId: string) => {
    if (!installedApps.includes(appId)) {
      setInstalledApps([...installedApps, appId]);
      // In a real scenario, this would download and install from GitHub
      alert(`Installing app: ${appId}\n\nIn a real implementation, this would:\n1. Clone from GitHub\n2. Build the app\n3. Register it in the system`);
    }
  };

  const handleUninstall = (appId: string) => {
    setInstalledApps(installedApps.filter((id) => id !== appId));
    alert(`Uninstalled: ${appId}`);
  };

  return (
    <div className="flex h-full flex-col" style={{ background: "hsl(var(--card))" }}>
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold">App Center</h1>
            <p className="text-xs opacity-70">
              Discover and manage community applications
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
            >
              {viewMode === "grid" ? (
                <ListIcon size={18} />
              ) : (
                <Grid size={18} />
              )}
            </button>
            <button
              onClick={() => setApps([...COMMUNITY_APPS])}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("browse")}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              view === "browse"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            Browse Apps
          </button>
          <button
            onClick={() => setView("installed")}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              view === "installed"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            Installed ({installedApps.length})
          </button>
        </div>

        {/* Search and filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-2.5 top-2.5"
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md text-sm border"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--secondary))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div
        className="px-4 py-2 flex gap-2 overflow-x-auto text-xs border-b"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(
                category === "All"
                  ? null
                  : category.toLowerCase()
              )
            }
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              (category === "All" && !selectedCategory) ||
              selectedCategory === category.toLowerCase()
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Apps Grid/List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredApps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <Code size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm opacity-70">No apps found</p>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="p-3 rounded-lg border hover:border-primary hover:bg-secondary/50 transition-colors text-left"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <Code size={24} className="opacity-70" />
                  {installedApps.includes(app.id) && (
                    <div
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                      }}
                    >
                      Installed
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm line-clamp-1">
                  {app.name}
                </h3>
                <p className="text-xs opacity-60 line-clamp-2 mb-2">
                  {app.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400" />
                    <span>{app.rating}</span>
                  </div>
                  <span className="opacity-60">{app.downloads} downloads</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="w-full p-3 rounded-lg border hover:border-primary hover:bg-secondary/50 transition-colors text-left flex items-center justify-between"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Code size={16} className="opacity-70" />
                    <h3 className="font-semibold text-sm">{app.name}</h3>
                    {installedApps.includes(app.id) && (
                      <div
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "hsl(var(--primary))",
                          color: "hsl(var(--primary-foreground))",
                        }}
                      >
                        Installed
                      </div>
                    )}
                  </div>
                  <p className="text-xs opacity-60">{app.description}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400" />
                    <span className="text-xs">{app.rating}</span>
                  </div>
                  <span className="text-xs opacity-60">{app.downloads}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* App Details Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-card rounded-lg shadow-lg max-w-md w-full mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "hsl(var(--card))" }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between p-4 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(var(--secondary))" }}
                >
                  <Code size={24} />
                </div>
                <div>
                  <h2 className="font-semibold">{selectedApp.name}</h2>
                  <p className="text-xs opacity-70">by {selectedApp.author}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 hover:bg-secondary rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 overflow-auto space-y-3">
              <div>
                <p className="text-sm opacity-80">{selectedApp.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="opacity-60">Version</p>
                  <p className="font-semibold">{selectedApp.version}</p>
                </div>
                <div>
                  <p className="opacity-60">Downloads</p>
                  <p className="font-semibold">{selectedApp.downloads}</p>
                </div>
                <div>
                  <p className="opacity-60">Rating</p>
                  <p className="font-semibold">
                    {selectedApp.rating} ⭐
                  </p>
                </div>
                <div>
                  <p className="opacity-60">Category</p>
                  <p className="font-semibold capitalize">
                    {selectedApp.category}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs opacity-60 mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {selectedApp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "hsl(var(--secondary))" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs opacity-60 mb-1">Repository</p>
                <a
                  href={selectedApp.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate"
                >
                  {selectedApp.repoUrl}
                </a>
              </div>
            </div>

            {/* Actions */}
            <div
              className="p-4 border-t flex gap-2"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {installedApps.includes(selectedApp.id) ? (
                <button
                  onClick={() => {
                    handleUninstall(selectedApp.id);
                    setSelectedApp(null);
                  }}
                  className="flex-1 px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  Uninstall
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleInstall(selectedApp.id);
                    setSelectedApp(null);
                  }}
                  className="flex-1 px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  <Download size={14} />
                  Install
                </button>
              )}
              <button
                onClick={() => setSelectedApp(null)}
                className="flex-1 px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
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
