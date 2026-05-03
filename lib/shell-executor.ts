import { fs } from "./os/filesystem";  // Relative path from lib/shell-executor.ts to lib/os/filesystem.ts

export interface ShellContext {
  currentPath: string;
  currentUser: string;
  history: string[];
  environment: Record<string, string>;
}

export interface CommandResult {
  output: string;
  error?: string;
  success: boolean;
  exitCode: number;
}

// Parse command string into command and arguments
function parseCommand(input: string): { cmd: string; args: string[] } {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  return {
    cmd: parts[0]?.toLowerCase() || "",
    args: parts.slice(1),
  };
}

// Helper to get file size in human-readable format
function formatSize(bytes: number): string {
  if (bytes === 0) return "0B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
}

// Helper to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

// Helper to resolve absolute path
function resolvePath(path: string, currentPath: string): string {
  if (path.startsWith("/")) {
    return path;
  }
  if (path === "~") {
    return "/Users/Guest";
  }
  if (path.startsWith("~/")) {
    return "/Users/Guest" + path.slice(1);
  }
  if (path === ".") {
    return currentPath;
  }
  if (path === "..") {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  }
  return currentPath === "/" ? "/" + path : currentPath + "/" + path;
}

export class ShellExecutor {
  private context: ShellContext;

  constructor(
    initialPath = "/Users/Guest",
    initialUser = "guest"
  ) {
    this.context = {
      currentPath: initialPath,
      currentUser: initialUser,
      history: [],
      environment: {
        HOME: "/Users/Guest",
        USER: initialUser,
        PWD: initialPath,
        TERM: "leethe-terminal",
        PATH: "/System/bin:/usr/local/bin",
      },
    };
  }

  getContext(): ShellContext {
    return this.context;
  }

  getCurrentPath(): string {
    return this.context.currentPath;
  }

  async execute(input: string): Promise<CommandResult> {
    const { cmd, args } = parseCommand(input);

    if (!cmd) {
      return { output: "", success: true, exitCode: 0 };
    }

    // Add to history
    this.context.history.push(input);
    this.context.environment.PWD = this.context.currentPath;

    try {
      switch (cmd) {
        // Navigation
        case "cd":
          return this.cmd_cd(args);
        case "pwd":
          return this.cmd_pwd(args);

        // File listing
        case "ls":
        case "list":
          return this.cmd_ls(args);
        case "la":
          return this.cmd_la(args);
        case "ll":
          return this.cmd_ll(args);
        case "tree":
          return this.cmd_tree(args);

        // File operations
        case "cat":
        case "type":
          return this.cmd_cat(args);
        case "echo":
          return this.cmd_echo(args);
        case "touch":
          return this.cmd_touch(args);
        case "mkdir":
          return this.cmd_mkdir(args);
        case "rm":
        case "del":
          return this.cmd_rm(args);
        case "rmdir":
          return this.cmd_rmdir(args);
        case "cp":
        case "copy":
          return this.cmd_cp(args);
        case "mv":
        case "move":
          return this.cmd_mv(args);
        case "find":
          return this.cmd_find(args);

        // File info
        case "stat":
        case "file":
          return this.cmd_stat(args);
        case "wc":
          return this.cmd_wc(args);
        case "head":
          return this.cmd_head(args);
        case "tail":
          return this.cmd_tail(args);

        // System info
        case "whoami":
          return this.cmd_whoami(args);
        case "date":
          return this.cmd_date(args);
        case "uname":
          return this.cmd_uname(args);
        case "df":
        case "disk":
          return this.cmd_df(args);
        case "uptime":
          return this.cmd_uptime(args);
        case "version":
        case "ver":
          return this.cmd_version(args);

        // Text processing
        case "grep":
          return this.cmd_grep(args);
        case "sed":
          return this.cmd_sed(args);

        // History and shell
        case "clear":
        case "cls":
          return this.cmd_clear(args);
        case "history":
          return this.cmd_history(args);
        case "help":
        case "?":
          return this.cmd_help(args);
        case "exit":
        case "quit":
          return this.cmd_exit(args);

        // Utilities
        case "env":
          return this.cmd_env(args);
        case "time":
          return this.cmd_time(args);
        case "calc":
          return this.cmd_calc(args);

        default:
          return {
            output: "",
            error: `command not found: ${cmd}`,
            success: false,
            exitCode: 127,
          };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        output: "",
        error: message,
        success: false,
        exitCode: 1,
      };
    }
  }

  // Navigation commands
  private async cmd_cd(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      this.context.currentPath = "/Users/Guest";
      return { output: "", success: true, exitCode: 0 };
    }

    const targetPath = resolvePath(args[0], this.context.currentPath);
    const exists = await fs.exists(targetPath);

    if (!exists) {
      return {
        output: "",
        error: `cd: no such file or directory: ${args[0]}`,
        success: false,
        exitCode: 1,
      };
    }

    const stat = await fs.stat(targetPath);
    if (stat?.type !== "folder") {
      return {
        output: "",
        error: `cd: not a directory: ${args[0]}`,
        success: false,
        exitCode: 1,
      };
    }

    this.context.currentPath = targetPath;
    return { output: "", success: true, exitCode: 0 };
  }

  private cmd_pwd(): Promise<CommandResult> {
    return Promise.resolve({
      output: this.context.currentPath,
      success: true,
      exitCode: 0,
    });
  }

  // File listing commands
  private async cmd_ls(args: string[]): Promise<CommandResult> {
    const path =
      args.length > 0
        ? resolvePath(args[0], this.context.currentPath)
        : this.context.currentPath;

    const exists = await fs.exists(path);
    if (!exists) {
      return {
        output: "",
        error: `ls: cannot access '${args[0] || "."}': No such file or directory`,
        success: false,
        exitCode: 2,
      };
    }

    const files = await fs.readDir(path);
    const names = files
      .filter((f) => !f.isHidden)
      .map((f) => (f.type === "folder" ? f.name + "/" : f.name))
      .sort();

    return {
      output: names.length > 0 ? names.join("\n") : "",
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_la(args: string[]): Promise<CommandResult> {
    const path =
      args.length > 0
        ? resolvePath(args[0], this.context.currentPath)
        : this.context.currentPath;

    const exists = await fs.exists(path);
    if (!exists) {
      return {
        output: "",
        error: `ls: cannot access '${args[0] || "."}': No such file or directory`,
        success: false,
        exitCode: 2,
      };
    }

    const files = await fs.readDir(path);
    const names = files
      .map((f) => (f.type === "folder" ? f.name + "/" : f.name))
      .sort();

    return {
      output: names.length > 0 ? names.join("\n") : "",
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_ll(args: string[]): Promise<CommandResult> {
    const path =
      args.length > 0
        ? resolvePath(args[0], this.context.currentPath)
        : this.context.currentPath;

    const exists = await fs.exists(path);
    if (!exists) {
      return {
        output: "",
        error: `ls: cannot access '${args[0] || "."}': No such file or directory`,
        success: false,
        exitCode: 2,
      };
    }

    const files = await fs.readDir(path);
    const sorted = files.filter((f) => !f.isHidden).sort((a, b) => a.name.localeCompare(b.name));

    const lines = sorted.map((f) => {
      const typeStr = f.type === "folder" ? "d" : "-";
      const permStr = `${f.permissions.read ? "r" : "-"}${f.permissions.write ? "w" : "-"}${
        f.permissions.execute ? "x" : "-"
      }`;
      return `${typeStr}${permStr} ${f.owner} ${formatSize(f.size).padEnd(6)} ${formatDate(
        f.modifiedAt
      ).padEnd(20)} ${f.name}${f.type === "folder" ? "/" : ""}`;
    });

    return {
      output: lines.join("\n"),
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_tree(args: string[]): Promise<CommandResult> {
    const path =
      args.length > 0
        ? resolvePath(args[0], this.context.currentPath)
        : this.context.currentPath;

    const exists = await fs.exists(path);
    if (!exists) {
      return {
        output: "",
        error: `tree: cannot access '${args[0] || "."}': No such file or directory`,
        success: false,
        exitCode: 2,
      };
    }

    const lines: string[] = [];
    const buildTree = async (
      dirPath: string,
      prefix = "",
      isLast = true
    ): Promise<void> => {
      const files = await fs.readDir(dirPath);
      const sorted = files
        .filter((f) => !f.isHidden)
        .sort((a, b) => a.name.localeCompare(b.name));

      for (let i = 0; i < sorted.length; i++) {
        const file = sorted[i];
        const isLastFile = i === sorted.length - 1;
        const connector = isLastFile ? "└── " : "├── ";
        const name = file.type === "folder" ? file.name + "/" : file.name;
        lines.push(prefix + connector + name);

        if (file.type === "folder") {
          const newPrefix = prefix + (isLastFile ? "    " : "│   ");
          await buildTree(file.path, newPrefix, isLastFile);
        }
      }
    };

    const rootStat = await fs.stat(path);
    if (rootStat?.type === "folder") {
      lines.push((path === "/" ? "/" : path.split("/").pop()) + "/");
      await buildTree(path);
    }

    return {
      output: lines.join("\n"),
      success: true,
      exitCode: 0,
    };
  }

  // File content commands
  private async cmd_cat(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "cat: missing file argument",
        success: false,
        exitCode: 1,
      };
    }

    const filePath = resolvePath(args[0], this.context.currentPath);
    const content = await fs.readFile(filePath);
    const text =
      typeof content === "string" ? content : new TextDecoder().decode(content);

    return { output: text, success: true, exitCode: 0 };
  }

  private cmd_echo(args: string[]): Promise<CommandResult> {
    const output = args.join(" ");
    return Promise.resolve({
      output,
      success: true,
      exitCode: 0,
    });
  }

  private async cmd_touch(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "touch: missing file argument",
        success: false,
        exitCode: 1,
      };
    }

    const filePath = resolvePath(args[0], this.context.currentPath);
    const exists = await fs.exists(filePath);

    if (!exists) {
      await fs.writeFile(filePath, "");
    }

    return { output: "", success: true, exitCode: 0 };
  }

  private async cmd_mkdir(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "mkdir: missing directory argument",
        success: false,
        exitCode: 1,
      };
    }

    const dirPath = resolvePath(args[0], this.context.currentPath);
    const recursive = args.includes("-p");

    await fs.mkdir(dirPath, recursive);
    return { output: "", success: true, exitCode: 0 };
  }

  private async cmd_rm(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "rm: missing file argument",
        success: false,
        exitCode: 1,
      };
    }

    const filePath = resolvePath(args[0], this.context.currentPath);
    const recursive = args.includes("-r") || args.includes("-rf");

    await fs.rm(filePath, recursive);
    return { output: "", success: true, exitCode: 0 };
  }

  private async cmd_rmdir(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "rmdir: missing directory argument",
        success: false,
        exitCode: 1,
      };
    }

    const dirPath = resolvePath(args[0], this.context.currentPath);
    await fs.rm(dirPath, false);
    return { output: "", success: true, exitCode: 0 };
  }

  private async cmd_cp(args: string[]): Promise<CommandResult> {
    if (args.length < 2) {
      return {
        output: "",
        error: "cp: missing file operand",
        success: false,
        exitCode: 1,
      };
    }

    const src = resolvePath(args[0], this.context.currentPath);
    const dest = resolvePath(args[1], this.context.currentPath);

    await fs.cp(src, dest);
    return { output: "", success: true, exitCode: 0 };
  }

  private async cmd_mv(args: string[]): Promise<CommandResult> {
    if (args.length < 2) {
      return {
        output: "",
        error: "mv: missing file operand",
        success: false,
        exitCode: 1,
      };
    }

    const src = resolvePath(args[0], this.context.currentPath);
    const dest = resolvePath(args[1], this.context.currentPath);

    await fs.mv(src, dest);
    return { output: "", success: true, exitCode: 0 };
  }

  private async cmd_find(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "find: missing pattern argument",
        success: false,
        exitCode: 1,
      };
    }

    const path =
      args.length > 1
        ? resolvePath(args[0], this.context.currentPath)
        : this.context.currentPath;
    const pattern = args.length > 1 ? args[1] : args[0];

    const results = await fs.search(pattern, path);
    const lines = results.map((f) => f.path);

    return {
      output: lines.join("\n"),
      success: true,
      exitCode: 0,
    };
  }

  // File info commands
  private async cmd_stat(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "stat: missing file argument",
        success: false,
        exitCode: 1,
      };
    }

    const filePath = resolvePath(args[0], this.context.currentPath);
    const stat = await fs.stat(filePath);

    if (!stat) {
      return {
        output: "",
        error: `stat: cannot stat '${args[0]}': No such file or directory`,
        success: false,
        exitCode: 1,
      };
    }

    const lines = [
      `  File: ${stat.path}`,
      `  Size: ${stat.size} bytes (${formatSize(stat.size)})`,
      `  Type: ${stat.type}`,
      `  Owner: ${stat.owner}`,
      `  Permissions: ${stat.permissions.read ? "r" : "-"}${stat.permissions.write ? "w" : "-"}${
        stat.permissions.execute ? "x" : "-"
      }`,
      `  Created: ${formatDate(stat.createdAt)}`,
      `  Modified: ${formatDate(stat.modifiedAt)}`,
      `  Accessed: ${formatDate(stat.accessedAt)}`,
    ];

    return {
      output: lines.join("\n"),
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_wc(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "wc: missing file argument",
        success: false,
        exitCode: 1,
      };
    }

    const filePath = resolvePath(args[0], this.context.currentPath);
    const content = await fs.readFile(filePath);
    const text =
      typeof content === "string" ? content : new TextDecoder().decode(content);

    const lines = text.split("\n").length - 1;
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const chars = text.length;

    return {
      output: `${lines} ${words} ${chars} ${args[0]}`,
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_head(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "head: missing file argument",
        success: false,
        exitCode: 1,
      };
    }

    const filePath = resolvePath(args[0], this.context.currentPath);
    const content = await fs.readFile(filePath);
    const text =
      typeof content === "string" ? content : new TextDecoder().decode(content);

    const lines = text.split("\n").slice(0, 10).join("\n");
    return {
      output: lines,
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_tail(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "tail: missing file argument",
        success: false,
        exitCode: 1,
      };
    }

    const filePath = resolvePath(args[0], this.context.currentPath);
    const content = await fs.readFile(filePath);
    const text =
      typeof content === "string" ? content : new TextDecoder().decode(content);

    const lines = text.split("\n").slice(-10).join("\n");
    return {
      output: lines,
      success: true,
      exitCode: 0,
    };
  }

  // System info commands
  private cmd_whoami(): Promise<CommandResult> {
    return Promise.resolve({
      output: this.context.currentUser,
      success: true,
      exitCode: 0,
    });
  }

  private cmd_date(): Promise<CommandResult> {
    return Promise.resolve({
      output: new Date().toString(),
      success: true,
      exitCode: 0,
    });
  }

  private cmd_uname(): Promise<CommandResult> {
    return Promise.resolve({
      output: "LeetheOS 1.0.0",
      success: true,
      exitCode: 0,
    });
  }

  private async cmd_df(): Promise<CommandResult> {
    const usage = await fs.getDiskUsage();
    const percent = Math.round((usage.used / usage.total) * 100);
    const output = [
      "Filesystem   Size      Used      Avail    Use%",
      `local        ${formatSize(usage.total)} ${formatSize(usage.used)} ${formatSize(
        usage.total - usage.used
      )} ${percent}%`,
    ].join("\n");

    return {
      output,
      success: true,
      exitCode: 0,
    };
  }

  private cmd_uptime(): Promise<CommandResult> {
    const time = Math.floor(performance.now() / 1000);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    return Promise.resolve({
      output: `up ${hours}h ${minutes}m`,
      success: true,
      exitCode: 0,
    });
  }

  private cmd_version(): Promise<CommandResult> {
    return Promise.resolve({
      output: "LeetheOS v1.0.0\nTerminal v1.0.0",
      success: true,
      exitCode: 0,
    });
  }

  // Text processing commands
  private async cmd_grep(args: string[]): Promise<CommandResult> {
    if (args.length < 2) {
      return {
        output: "",
        error: "grep: missing pattern or file argument",
        success: false,
        exitCode: 1,
      };
    }

    const pattern = args[0];
    const filePath = resolvePath(args[1], this.context.currentPath);
    const content = await fs.readFile(filePath);
    const text =
      typeof content === "string" ? content : new TextDecoder().decode(content);

    const regex = new RegExp(pattern, "g");
    const matches = text.split("\n").filter((line) => regex.test(line));

    return {
      output: matches.join("\n"),
      success: true,
      exitCode: 0,
    };
  }

  private cmd_sed(args: string[]): Promise<CommandResult> {
    // Simplified sed - just a placeholder
    return Promise.resolve({
      output: "sed: not implemented in this terminal",
      success: false,
      exitCode: 1,
    });
  }

  // Shell control commands
  private cmd_clear(): Promise<CommandResult> {
    return Promise.resolve({
      output: "CLEAR_SCREEN",
      success: true,
      exitCode: 0,
    });
  }

  private cmd_history(): Promise<CommandResult> {
    const lines = this.context.history
      .map((cmd, i) => `${i + 1} ${cmd}`)
      .join("\n");

    return Promise.resolve({
      output: lines,
      success: true,
      exitCode: 0,
    });
  }

  private cmd_help(): Promise<CommandResult> {
    const commands = [
      "Navigation:",
      "  cd [dir]              - Change directory",
      "  pwd                   - Print working directory",
      "",
      "File Listing:",
      "  ls                    - List files",
      "  la                    - List all files (including hidden)",
      "  ll                    - Long format listing",
      "  tree                  - Show directory tree",
      "",
      "File Operations:",
      "  cat [file]            - Display file contents",
      "  touch [file]          - Create empty file",
      "  mkdir [dir]           - Create directory",
      "  rm [file]             - Remove file",
      "  rmdir [dir]           - Remove directory",
      "  cp [src] [dest]       - Copy file",
      "  mv [src] [dest]       - Move/rename file",
      "  find [pattern]        - Search for files",
      "",
      "File Information:",
      "  stat [file]           - Show file info",
      "  wc [file]             - Count lines/words/chars",
      "  head [file]           - Show first 10 lines",
      "  tail [file]           - Show last 10 lines",
      "",
      "System:",
      "  whoami                - Show current user",
      "  date                  - Show current date/time",
      "  uname                 - Show OS info",
      "  df                    - Show disk usage",
      "  uptime                - Show uptime",
      "  version               - Show version info",
      "",
      "Text Processing:",
      "  grep [pattern] [file] - Search text in file",
      "  echo [text]           - Print text",
      "",
      "Shell:",
      "  clear                 - Clear screen",
      "  history               - Show command history",
      "  help                  - Show this help",
      "  exit                  - Exit terminal",
    ];

    return Promise.resolve({
      output: commands.join("\n"),
      success: true,
      exitCode: 0,
    });
  }

  private cmd_exit(): Promise<CommandResult> {
    return Promise.resolve({
      output: "exit",
      success: true,
      exitCode: 0,
    });
  }

  // Utility commands
  private cmd_env(): Promise<CommandResult> {
    const lines = Object.entries(this.context.environment).map(
      ([key, value]) => `${key}=${value}`
    );
    return Promise.resolve({
      output: lines.join("\n"),
      success: true,
      exitCode: 0,
    });
  }

  private async cmd_time(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "time: missing command",
        success: false,
        exitCode: 1,
      };
    }

    const start = performance.now();
    // Note: In a real shell, this would execute a command
    // For now, just return timing info
    const end = performance.now();

    return {
      output: `real ${((end - start) / 1000).toFixed(3)}s`,
      success: true,
      exitCode: 0,
    };
  }

  private cmd_calc(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return Promise.resolve({
        output: "",
        error: "calc: missing expression",
        success: false,
        exitCode: 1,
      });
    }

    try {
      const expr = args.join(" ");
      // Simple calculator - evaluate mathematical expressions
      // Using Function constructor for safety
      const result = Function('"use strict"; return (' + expr + ")")();
      return Promise.resolve({
        output: String(result),
        success: true,
        exitCode: 0,
      });
    } catch (error) {
      return Promise.resolve({
        output: "",
        error: "calc: invalid expression",
        success: false,
        exitCode: 1,
      });
    }
  }
}

export default ShellExecutor;
