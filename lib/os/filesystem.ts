"use client";

import Dexie, { type EntityTable } from "dexie";

export type FileType = "file" | "folder" | "symlink";
export type MimeType = 
  | "text/plain" 
  | "text/markdown" 
  | "text/html"
  | "text/css"
  | "text/javascript"
  | "application/json"
  | "application/pdf"
  | "image/png" 
  | "image/jpeg" 
  | "image/gif"
  | "image/svg+xml"
  | "audio/mpeg"
  | "audio/wav"
  | "video/mp4"
  | "application/octet-stream";

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  path: string;
  content?: string | ArrayBuffer;
  mimeType?: MimeType;
  size: number;
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
  owner: string;
  createdAt: Date;
  modifiedAt: Date;
  accessedAt: Date;
  isHidden: boolean;
  metadata: Record<string, unknown>;
}

export interface FileSystemDatabase extends Dexie {
  files: EntityTable<FileNode, "id">;
}

const db = new Dexie("LeetheOS-FileSystem") as FileSystemDatabase;

db.version(1).stores({
  files: "id, name, type, parentId, path, mimeType, createdAt, modifiedAt",
});

// Helper to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Helper to determine MIME type from extension
function getMimeType(filename: string): MimeType {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeMap: Record<string, MimeType> = {
    txt: "text/plain",
    md: "text/markdown",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    ts: "text/javascript",
    json: "application/json",
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    mp4: "video/mp4",
  };
  return mimeMap[ext || ""] || "application/octet-stream";
}

// Normalize path (remove trailing slashes, handle . and ..)
function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const normalized: string[] = [];
  
  for (const part of parts) {
    if (part === "..") {
      normalized.pop();
    } else if (part !== ".") {
      normalized.push(part);
    }
  }
  
  return "/" + normalized.join("/");
}

// Get parent path
function getParentPath(path: string): string {
  const normalized = normalizePath(path);
  const parts = normalized.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
}

// Initialize filesystem with default structure
export async function initializeFileSystem(): Promise<void> {
  const rootExists = await db.files.where("path").equals("/").first();
  if (rootExists) return;

  const now = new Date();
  const defaultPerms = { read: true, write: true, execute: false };
  const systemPerms = { read: true, write: false, execute: false };

  const rootNode: FileNode = {
    id: "root",
    name: "/",
    type: "folder",
    parentId: null,
    path: "/",
    size: 0,
    permissions: systemPerms,
    owner: "system",
    createdAt: now,
    modifiedAt: now,
    accessedAt: now,
    isHidden: false,
    metadata: {},
  };

  const systemFolders: Omit<FileNode, "id">[] = [
    // System directories
    { name: "System", type: "folder", parentId: "root", path: "/System", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Applications", type: "folder", parentId: "system", path: "/System/Applications", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Library", type: "folder", parentId: "system", path: "/System/Library", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Themes", type: "folder", parentId: "library", path: "/System/Library/Themes", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Wallpapers", type: "folder", parentId: "library", path: "/System/Library/Wallpapers", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Icons", type: "folder", parentId: "library", path: "/System/Library/Icons", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Sounds", type: "folder", parentId: "library", path: "/System/Library/Sounds", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    
    // User directories
    { name: "Users", type: "folder", parentId: "root", path: "/Users", size: 0, permissions: systemPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Guest", type: "folder", parentId: "users", path: "/Users/Guest", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Desktop", type: "folder", parentId: "guest", path: "/Users/Guest/Desktop", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Documents", type: "folder", parentId: "guest", path: "/Users/Guest/Documents", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Downloads", type: "folder", parentId: "guest", path: "/Users/Guest/Downloads", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Pictures", type: "folder", parentId: "guest", path: "/Users/Guest/Pictures", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Music", type: "folder", parentId: "guest", path: "/Users/Guest/Music", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Videos", type: "folder", parentId: "guest", path: "/Users/Guest/Videos", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    { name: "Applications", type: "folder", parentId: "guest", path: "/Users/Guest/Applications", size: 0, permissions: defaultPerms, owner: "guest", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
    
    // Temp directory
    { name: "tmp", type: "folder", parentId: "root", path: "/tmp", size: 0, permissions: defaultPerms, owner: "system", createdAt: now, modifiedAt: now, accessedAt: now, isHidden: false, metadata: {} },
  ];

  // Add sample files
  const sampleFiles: Omit<FileNode, "id">[] = [
    {
      name: "Welcome.txt",
      type: "file",
      parentId: "desktop",
      path: "/Users/Guest/Desktop/Welcome.txt",
      content: `Welcome to LeetheOS!

This is your new web-based operating system. Here are some things you can do:

1. Open the Terminal to run commands
2. Use the Files app to manage your documents
3. Explore the App Center to install new apps
4. Customize your experience in Settings

Enjoy your stay!

- The LeetheOS Team`,
      mimeType: "text/plain",
      size: 350,
      permissions: defaultPerms,
      owner: "guest",
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
      isHidden: false,
      metadata: {},
    },
    {
      name: "README.md",
      type: "file",
      parentId: "documents",
      path: "/Users/Guest/Documents/README.md",
      content: `# LeetheOS Documentation

## Getting Started

LeetheOS is a fully-functional web operating system with:

- **Virtual Filesystem** - Create, edit, and organize files
- **Terminal** - Run commands with 30+ built-in utilities
- **App Center** - Install community apps from GitHub
- **Customization** - Themes, wallpapers, and settings

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘ + Space | Open Launcher |
| ⌘ + W | Close Window |
| ⌘ + M | Minimize Window |
| ⌘ + Q | Quit App |
| ⌃ + ⌥ + T | Open Terminal |

## Terminal Commands

Type \`help\` in the Terminal to see all available commands.
`,
      mimeType: "text/markdown",
      size: 650,
      permissions: defaultPerms,
      owner: "guest",
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
      isHidden: false,
      metadata: {},
    },
    {
      name: "notes.txt",
      type: "file",
      parentId: "documents",
      path: "/Users/Guest/Documents/notes.txt",
      content: "My personal notes...\n\n- TODO: Explore LeetheOS features\n- Learn terminal commands\n- Customize my desktop",
      mimeType: "text/plain",
      size: 120,
      permissions: defaultPerms,
      owner: "guest",
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
      isHidden: false,
      metadata: {},
    },
  ];

  await db.files.add(rootNode);
  
  for (const folder of systemFolders) {
    await db.files.add({ ...folder, id: generateId() });
  }
  
  for (const file of sampleFiles) {
    await db.files.add({ ...file, id: generateId() });
  }
}

// File System API
export const fs = {
  // Initialize
  init: initializeFileSystem,

  // Read operations
  async readDir(path: string): Promise<FileNode[]> {
    const normalized = normalizePath(path);
    const parent = await db.files.where("path").equals(normalized).first();
    if (!parent || parent.type !== "folder") {
      throw new Error(`Not a directory: ${normalized}`);
    }
    
    const children = await db.files
      .where("path")
      .startsWith(normalized === "/" ? "/" : normalized + "/")
      .toArray();
    
    // Only return direct children
    return children.filter((node) => {
      const relativePath = node.path.slice(normalized.length);
      const parts = relativePath.split("/").filter(Boolean);
      return parts.length === 1;
    });
  },

  async readFile(path: string): Promise<string | ArrayBuffer> {
    const normalized = normalizePath(path);
    const file = await db.files.where("path").equals(normalized).first();
    
    if (!file) {
      throw new Error(`File not found: ${normalized}`);
    }
    if (file.type !== "file") {
      throw new Error(`Not a file: ${normalized}`);
    }
    if (!file.permissions.read) {
      throw new Error(`Permission denied: ${normalized}`);
    }
    
    // Update accessed time
    await db.files.update(file.id, { accessedAt: new Date() });
    
    return file.content ?? "";
  },

  async stat(path: string): Promise<FileNode | null> {
    const normalized = normalizePath(path);
    return db.files.where("path").equals(normalized).first() ?? null;
  },

  async exists(path: string): Promise<boolean> {
    const normalized = normalizePath(path);
    const file = await db.files.where("path").equals(normalized).first();
    return !!file;
  },

  // Write operations
  async writeFile(path: string, content: string | ArrayBuffer): Promise<void> {
    const normalized = normalizePath(path);
    const existing = await db.files.where("path").equals(normalized).first();
    const now = new Date();
    
    if (existing) {
      if (existing.type !== "file") {
        throw new Error(`Not a file: ${normalized}`);
      }
      if (!existing.permissions.write) {
        throw new Error(`Permission denied: ${normalized}`);
      }
      
      await db.files.update(existing.id, {
        content,
        size: typeof content === "string" ? content.length : content.byteLength,
        modifiedAt: now,
        accessedAt: now,
      });
    } else {
      // Create new file
      const parentPath = getParentPath(normalized);
      const parent = await db.files.where("path").equals(parentPath).first();
      
      if (!parent || parent.type !== "folder") {
        throw new Error(`Parent directory not found: ${parentPath}`);
      }
      
      const name = normalized.split("/").pop() || "";
      
      await db.files.add({
        id: generateId(),
        name,
        type: "file",
        parentId: parent.id,
        path: normalized,
        content,
        mimeType: getMimeType(name),
        size: typeof content === "string" ? content.length : content.byteLength,
        permissions: { read: true, write: true, execute: false },
        owner: "guest",
        createdAt: now,
        modifiedAt: now,
        accessedAt: now,
        isHidden: name.startsWith("."),
        metadata: {},
      });
    }
  },

  async mkdir(path: string, recursive = false): Promise<void> {
    const normalized = normalizePath(path);
    
    if (await fs.exists(normalized)) {
      throw new Error(`Already exists: ${normalized}`);
    }
    
    const parentPath = getParentPath(normalized);
    let parent = await db.files.where("path").equals(parentPath).first();
    
    if (!parent && recursive) {
      await fs.mkdir(parentPath, true);
      parent = await db.files.where("path").equals(parentPath).first();
    }
    
    if (!parent || parent.type !== "folder") {
      throw new Error(`Parent directory not found: ${parentPath}`);
    }
    
    const name = normalized.split("/").pop() || "";
    const now = new Date();
    
    await db.files.add({
      id: generateId(),
      name,
      type: "folder",
      parentId: parent.id,
      path: normalized,
      size: 0,
      permissions: { read: true, write: true, execute: true },
      owner: "guest",
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
      isHidden: name.startsWith("."),
      metadata: {},
    });
  },

  async rm(path: string, recursive = false): Promise<void> {
    const normalized = normalizePath(path);
    const node = await db.files.where("path").equals(normalized).first();
    
    if (!node) {
      throw new Error(`Not found: ${normalized}`);
    }
    
    if (node.type === "folder") {
      const children = await fs.readDir(normalized);
      
      if (children.length > 0 && !recursive) {
        throw new Error(`Directory not empty: ${normalized}`);
      }
      
      if (recursive) {
        for (const child of children) {
          await fs.rm(child.path, true);
        }
      }
    }
    
    await db.files.delete(node.id);
  },

  async mv(src: string, dest: string): Promise<void> {
    const srcNorm = normalizePath(src);
    const destNorm = normalizePath(dest);
    
    const node = await db.files.where("path").equals(srcNorm).first();
    if (!node) {
      throw new Error(`Not found: ${srcNorm}`);
    }
    
    // Check if destination is a directory
    const destNode = await db.files.where("path").equals(destNorm).first();
    let finalPath = destNorm;
    
    if (destNode?.type === "folder") {
      finalPath = destNorm + "/" + node.name;
    }
    
    const newParentPath = getParentPath(finalPath);
    const newParent = await db.files.where("path").equals(newParentPath).first();
    
    if (!newParent || newParent.type !== "folder") {
      throw new Error(`Destination directory not found: ${newParentPath}`);
    }
    
    const newName = finalPath.split("/").pop() || node.name;
    
    await db.files.update(node.id, {
      name: newName,
      path: finalPath,
      parentId: newParent.id,
      modifiedAt: new Date(),
    });
    
    // Update paths of children if it's a folder
    if (node.type === "folder") {
      const children = await db.files
        .where("path")
        .startsWith(srcNorm + "/")
        .toArray();
      
      for (const child of children) {
        const newChildPath = child.path.replace(srcNorm, finalPath);
        await db.files.update(child.id, { path: newChildPath });
      }
    }
  },

  async cp(src: string, dest: string): Promise<void> {
    const srcNorm = normalizePath(src);
    const destNorm = normalizePath(dest);
    
    const node = await db.files.where("path").equals(srcNorm).first();
    if (!node) {
      throw new Error(`Not found: ${srcNorm}`);
    }
    
    if (node.type === "folder") {
      throw new Error("Cannot copy directories (use cp -r)");
    }
    
    // Check if destination is a directory
    const destNode = await db.files.where("path").equals(destNorm).first();
    let finalPath = destNorm;
    
    if (destNode?.type === "folder") {
      finalPath = destNorm + "/" + node.name;
    }
    
    const newParentPath = getParentPath(finalPath);
    const newParent = await db.files.where("path").equals(newParentPath).first();
    
    if (!newParent || newParent.type !== "folder") {
      throw new Error(`Destination directory not found: ${newParentPath}`);
    }
    
    const now = new Date();
    const newName = finalPath.split("/").pop() || node.name;
    
    await db.files.add({
      ...node,
      id: generateId(),
      name: newName,
      path: finalPath,
      parentId: newParent.id,
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
    });
  },

  async search(pattern: string, startPath = "/"): Promise<FileNode[]> {
    const normalized = normalizePath(startPath);
    const regex = new RegExp(pattern.replace(/\*/g, ".*"), "i");
    
    const allFiles = await db.files
      .where("path")
      .startsWith(normalized)
      .toArray();
    
    return allFiles.filter((node) => regex.test(node.name));
  },

  // Get disk usage
  async getDiskUsage(): Promise<{ used: number; total: number }> {
    const allFiles = await db.files.toArray();
    const used = allFiles.reduce((sum, file) => sum + file.size, 0);
    return { used, total: 1024 * 1024 * 1024 }; // 1GB virtual disk
  },
};

export default fs;
