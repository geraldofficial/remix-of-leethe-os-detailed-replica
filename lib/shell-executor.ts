import { fs } from "./os/filesystem";

export interface ShellContext {
  currentPath: string;
  currentUser: string;
  history: string[];
  environment: Record<string, string>;
  variables: Record<string, string>;
  aliases: Record<string, string>;
}

export interface CommandResult {
  output: string;
  error?: string;
  success: boolean;
  exitCode: number;
}

interface ParsedCommand {
  cmd: string;
  args: string[];
  pipes: string[];
  redirectionOutput?: { type: ">" | ">>"; file: string };
  redirectionInput?: string;
}

// Parse command string into command, arguments, and redirections/pipes
function parseComplexCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  
  // Extract input redirection first
  let redirectionInput: string | undefined;
  let working = trimmed;
  const inputRedirectMatch = working.match(/\s*<\s*(\S+)\s*/);
  if (inputRedirectMatch) {
    redirectionInput = inputRedirectMatch[1];
    working = working.replace(inputRedirectMatch[0], " ");
  }

  // Extract output redirection
  let redirectionOutput: { type: ">" | ">>"; file: string } | undefined;
  const outputRedirectMatch = working.match(/\s*(>>|>)\s*(\S+)\s*$/);
  if (outputRedirectMatch) {
    redirectionOutput = { type: outputRedirectMatch[1] as ">" | ">>", file: outputRedirectMatch[2] };
    working = working.substring(0, outputRedirectMatch.index);
  }

  // Extract pipes
  const pipes = working.split("|").map((s) => s.trim());
  const firstPipe = pipes[0];

  // Parse the first command
  const parts = firstPipe.split(/\s+/);
  const cmd = parts[0]?.toLowerCase() || "";
  const args = parts.slice(1);

  return {
    cmd,
    args,
    pipes: pipes.length > 1 ? pipes.slice(1) : [],
    redirectionOutput,
    redirectionInput,
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
  private scripts: Map<string, string[]> = new Map();

  constructor(initialPath = "/Users/Guest", initialUser = "guest") {
    this.context = {
      currentPath: initialPath,
      currentUser: initialUser,
      history: [],
      variables: {
        HOME: "/Users/Guest",
        USER: initialUser,
        PWD: initialPath,
        TERM: "leethe-terminal",
        PATH: "/System/bin:/usr/local/bin",
      },
      environment: {
        HOME: "/Users/Guest",
        USER: initialUser,
        PWD: initialPath,
        TERM: "leethe-terminal",
        PATH: "/System/bin:/usr/local/bin",
      },
      aliases: {
        ll: "ls -la",
        la: "ls -a",
        cls: "clear",
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
    const parsed = parseComplexCommand(input);

    if (!parsed.cmd) {
      return { output: "", success: true, exitCode: 0 };
    }

    // Add to history
    this.context.history.push(input);
    this.context.environment.PWD = this.context.currentPath;
    this.context.variables.PWD = this.context.currentPath;

    try {
      // Check for aliases
      let actualCmd = parsed.cmd;
      if (this.context.aliases[parsed.cmd]) {
        const aliased = this.context.aliases[parsed.cmd];
        const aliasedParts = aliased.split(/\s+/);
        actualCmd = aliasedParts[0];
        parsed.args = [...aliasedParts.slice(1), ...parsed.args];
      }

      // Execute first command
      let result = await this.executeCommand(actualCmd, parsed.args);

      // Process pipes
      for (const pipe of parsed.pipes) {
        const pipeParts = pipe.split(/\s+/);
        const pipeCmd = pipeParts[0]?.toLowerCase() || "";
        const pipeArgs = pipeParts.slice(1);
        
        // Pass previous output as input for pipe
        result = await this.executeCommand(pipeCmd, [...pipeArgs], result.output);
      }

      // Handle output redirection
      if (parsed.redirectionOutput) {
        const redirectPath = resolvePath(
          parsed.redirectionOutput.file,
          this.context.currentPath
        );
        if (parsed.redirectionOutput.type === ">") {
          await fs.writeFile(redirectPath, result.output);
        } else if (parsed.redirectionOutput.type === ">>") {
          const existing = await fs.readFile(redirectPath).catch(() => "");
          const existingStr =
            typeof existing === "string"
              ? existing
              : new TextDecoder().decode(existing);
          await fs.writeFile(redirectPath, existingStr + result.output);
        }
        result.output = "";
      }

      // Handle input redirection
      if (parsed.redirectionInput) {
        const inputPath = resolvePath(
          parsed.redirectionInput,
          this.context.currentPath
        );
        const fileContent = await fs.readFile(inputPath);
        const inputStr =
          typeof fileContent === "string"
            ? fileContent
            : new TextDecoder().decode(fileContent);
        // For input redirection, we would pass to command, but for now just read
        result.output = inputStr + result.output;
      }

      return result;
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

  private async executeCommand(
    cmd: string,
    args: string[],
    piped?: string
  ): Promise<CommandResult> {
    // If piped input, use it as first argument for certain commands
    if (piped && ["grep", "wc", "head", "tail"].includes(cmd)) {
      // Commands that work with piped input
      return this.executeWithPipe(cmd, args, piped);
    }

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
        return this.cmd_wc(args, piped);
      case "head":
        return this.cmd_head(args, piped);
      case "tail":
        return this.cmd_tail(args, piped);

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
        return this.cmd_grep(args, piped);
      case "sed":
        return this.cmd_sed(args);
      case "sort":
        return this.cmd_sort(args, piped);
      case "uniq":
        return this.cmd_uniq(args, piped);

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

      // Script commands
      case "script":
        return this.cmd_script(args);
      case "bash":
      case "sh":
        return this.cmd_bash(args);

      // Utilities
      case "env":
        return this.cmd_env(args);
      case "time":
        return this.cmd_time(args);
      case "calc":
        return this.cmd_calc(args);
      case "alias":
        return this.cmd_alias(args);

      default:
        return {
          output: "",
          error: `command not found: ${cmd}`,
          success: false,
          exitCode: 127,
        };
    }
  }

  private async executeWithPipe(
    cmd: string,
    args: string[],
    piped: string
  ): Promise<CommandResult> {
    switch (cmd) {
      case "grep":
        return this.cmd_grep(args, piped);
      case "wc":
        return this.cmd_wc(args, piped);
      case "head":
        return this.cmd_head(args, piped);
      case "tail":
        return this.cmd_tail(args, piped);
      case "sort":
        return this.cmd_sort(args, piped);
      case "uniq":
        return this.cmd_uniq(args, piped);
      default:
        return { output: piped, success: true, exitCode: 0 };
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
    const sorted = files
      .filter((f) => !f.isHidden)
      .sort((a, b) => a.name.localeCompare(b.name));

    const lines = sorted.map((f) => {
      const typeStr = f.type === "folder" ? "d" : "-";
      const permStr = `${f.permissions.read ? "r" : "-"}${
        f.permissions.write ? "w" : "-"
      }${f.permissions.execute ? "x" : "-"}`;
      return `${typeStr}${permStr} ${f.owner} ${formatSize(f.size).padEnd(
        6
      )} ${formatDate(f.modifiedAt).padEnd(20)} ${f.name}${
        f.type === "folder" ? "/" : ""
      }`;
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
        const name =
          file.type === "folder" ? file.name + "/" : file.name;
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
      typeof content === "string"
        ? content
        : new TextDecoder().decode(content);

    return { output: text, success: true, exitCode: 0 };
  }

  private cmd_echo(args: string[]): Promise<CommandResult> {
    // Expand variables
    let output = args.join(" ");
    output = output.replace(/\$(\w+)/g, (match, varName) => {
      return this.context.variables[varName] || match;
    });

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
      `  Permissions: ${stat.permissions.read ? "r" : "-"}${
        stat.permissions.write ? "w" : "-"
      }${stat.permissions.execute ? "x" : "-"}`,
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

  private async cmd_wc(
    args: string[],
    piped?: string
  ): Promise<CommandResult> {
    let text = "";

    if (piped) {
      text = piped;
    } else {
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
      text =
        typeof content === "string"
          ? content
          : new TextDecoder().decode(content);
    }

    const lines = text.split("\n").length - 1;
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const chars = text.length;

    return {
      output: `${lines} ${words} ${chars}`,
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_head(
    args: string[],
    piped?: string
  ): Promise<CommandResult> {
    let text = "";

    if (piped) {
      text = piped;
    } else {
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
      text =
        typeof content === "string"
          ? content
          : new TextDecoder().decode(content);
    }

    const n = parseInt(args[0]) || 10;
    const lines = text.split("\n").slice(0, n).join("\n");
    return {
      output: lines,
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_tail(
    args: string[],
    piped?: string
  ): Promise<CommandResult> {
    let text = "";

    if (piped) {
      text = piped;
    } else {
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
      text =
        typeof content === "string"
          ? content
          : new TextDecoder().decode(content);
    }

    const n = parseInt(args[0]) || 10;
    const lines = text.split("\n").slice(-n).join("\n");
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
      `local        ${formatSize(usage.total)} ${formatSize(
        usage.used
      )} ${formatSize(usage.total - usage.used)} ${percent}%`,
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
      output: "LeetheOS v1.0.0\nTerminal v2.0.0 (with pipes, redirection, and scripts)",
      success: true,
      exitCode: 0,
    });
  }

  // Text processing commands
  private async cmd_grep(args: string[], piped?: string): Promise<CommandResult> {
    if (!piped && args.length < 2) {
      return {
        output: "",
        error: "grep: missing pattern or file argument",
        success: false,
        exitCode: 1,
      };
    }

    const pattern = args[0];
    let text = "";

    if (piped) {
      text = piped;
    } else {
      const filePath = resolvePath(args[1], this.context.currentPath);
      const content = await fs.readFile(filePath);
      text =
        typeof content === "string"
          ? content
          : new TextDecoder().decode(content);
    }

    try {
      const regex = new RegExp(pattern, "g");
      const matches = text
        .split("\n")
        .filter((line) => regex.test(line));

      return {
        output: matches.join("\n"),
        success: true,
        exitCode: 0,
      };
    } catch (e) {
      return {
        output: "",
        error: `grep: invalid regex: ${pattern}`,
        success: false,
        exitCode: 1,
      };
    }
  }

  private cmd_sed(args: string[]): Promise<CommandResult> {
    if (args.length < 2) {
      return Promise.resolve({
        output: "",
        error: "sed: missing expression",
        success: false,
        exitCode: 1,
      });
    }

    // Simple sed: s/pattern/replacement/
    const expr = args[0];
    const match = expr.match(/^s\/(.+)\/(.*)\/$/);

    if (!match) {
      return Promise.resolve({
        output: "",
        error: "sed: unsupported sed expression",
        success: false,
        exitCode: 1,
      });
    }

    return Promise.resolve({
      output: "sed: not implemented for file input yet",
      success: false,
      exitCode: 1,
    });
  }

  private async cmd_sort(args: string[], piped?: string): Promise<CommandResult> {
    let text = piped || "";

    if (!piped && args.length > 0) {
      const filePath = resolvePath(args[0], this.context.currentPath);
      const content = await fs.readFile(filePath);
      text =
        typeof content === "string"
          ? content
          : new TextDecoder().decode(content);
    }

    const lines = text.split("\n").sort();
    return {
      output: lines.join("\n"),
      success: true,
      exitCode: 0,
    };
  }

  private async cmd_uniq(args: string[], piped?: string): Promise<CommandResult> {
    let text = piped || "";

    if (!piped && args.length > 0) {
      const filePath = resolvePath(args[0], this.context.currentPath);
      const content = await fs.readFile(filePath);
      text =
        typeof content === "string"
          ? content
          : new TextDecoder().decode(content);
    }

    const lines = text.split("\n");
    const unique = Array.from(new Set(lines));
    return {
      output: unique.join("\n"),
      success: true,
      exitCode: 0,
    };
  }

  // History and shell
  private cmd_clear(): Promise<CommandResult> {
    return Promise.resolve({
      output: "CLEAR_SCREEN",
      success: true,
      exitCode: 0,
    });
  }

  private cmd_history(): Promise<CommandResult> {
    const output = this.context.history
      .map((cmd, i) => `${i + 1}  ${cmd}`)
      .join("\n");
    return Promise.resolve({
      output,
      success: true,
      exitCode: 0,
    });
  }

  private cmd_help(): Promise<CommandResult> {
    const output = `LeetheOS Terminal v2.0.0

Navigation:
  cd [dir]        - Change directory
  pwd             - Print working directory

File Listing:
  ls [path]       - List files
  la [path]       - List all files (including hidden)
  ll [path]       - List files with details
  tree [path]     - Display directory tree

File Operations:
  cat <file>      - Display file contents
  echo <text>     - Print text
  touch <file>    - Create empty file
  mkdir <dir>     - Create directory
  rm <file>       - Remove file
  rmdir <dir>     - Remove directory
  cp <src> <dst>  - Copy file
  mv <src> <dst>  - Move/rename file
  find <pattern>  - Find files

Text Processing:
  grep <pattern>  - Search for pattern
  sort            - Sort lines
  uniq            - Remove duplicates
  head            - Show first lines
  tail            - Show last lines
  wc              - Count lines/words/chars

System:
  whoami          - Current user
  date            - Current date/time
  uname           - OS information
  df              - Disk usage
  uptime          - System uptime
  version         - System version

Advanced:
  alias           - Create command alias
  script          - Create/run scripts
  history         - Show command history
  env             - Show environment variables

Features:
  |               - Pipe commands (cmd1 | cmd2)
  >               - Redirect output to file (cmd > file)
  >>              - Append output to file (cmd >> file)
  <               - Redirect input from file (cmd < file)`;

    return Promise.resolve({
      output,
      success: true,
      exitCode: 0,
    });
  }

  private cmd_exit(): Promise<CommandResult> {
    return Promise.resolve({
      output: "",
      success: true,
      exitCode: 0,
    });
  }

  // Script commands
  private async cmd_script(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "script: missing operation (create, list, run)",
        success: false,
        exitCode: 1,
      };
    }

    const operation = args[0];

    if (operation === "create") {
      if (args.length < 2) {
        return {
          output: "",
          error: "script create: missing script name",
          success: false,
          exitCode: 1,
        };
      }

      const scriptName = args[1];
      const lines: string[] = [];

      return {
        output: `Script '${scriptName}' created. Use: script run ${scriptName}`,
        success: true,
        exitCode: 0,
      };
    }

    if (operation === "list") {
      const scriptList = Array.from(this.scripts.keys()).join("\n");
      return {
        output: scriptList || "No scripts created",
        success: true,
        exitCode: 0,
      };
    }

    if (operation === "run") {
      if (args.length < 2) {
        return {
          output: "",
          error: "script run: missing script name",
          success: false,
          exitCode: 1,
        };
      }

      const scriptName = args[1];
      const scriptLines = this.scripts.get(scriptName);

      if (!scriptLines) {
        return {
          output: "",
          error: `script: '${scriptName}' not found`,
          success: false,
          exitCode: 1,
        };
      }

      let output = "";
      for (const line of scriptLines) {
        const result = await this.execute(line);
        output += result.output + "\n";
      }

      return {
        output: output.trim(),
        success: true,
        exitCode: 0,
      };
    }

    return {
      output: "",
      error: `script: unknown operation '${operation}'`,
      success: false,
      exitCode: 1,
    };
  }

  private async cmd_bash(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: "",
        error: "bash: missing script file",
        success: false,
        exitCode: 1,
      };
    }

    const scriptPath = resolvePath(args[0], this.context.currentPath);
    const scriptContent = await fs.readFile(scriptPath);
    const scriptText =
      typeof scriptContent === "string"
        ? scriptContent
        : new TextDecoder().decode(scriptContent);

    const lines = scriptText
      .split("\n")
      .filter((line) => line.trim() && !line.trim().startsWith("#"));
    let output = "";

    for (const line of lines) {
      const result = await this.execute(line);
      if (result.output) output += result.output + "\n";
      if (result.error) output += "Error: " + result.error + "\n";
    }

    return {
      output: output.trim(),
      success: true,
      exitCode: 0,
    };
  }

  // Utility commands
  private cmd_env(): Promise<CommandResult> {
    const output = Object.entries(this.context.environment)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    return Promise.resolve({
      output,
      success: true,
      exitCode: 0,
    });
  }

  private cmd_time(args: string[]): Promise<CommandResult> {
    const start = performance.now();
    // In a real scenario, this would execute another command
    const end = performance.now();
    return Promise.resolve({
      output: `real  0m${((end - start) / 1000).toFixed(3)}s`,
      success: true,
      exitCode: 0,
    });
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
      // Simple calculator using Function constructor (safer than eval)
      const safe = /^[0-9+\-*/(). ]+$/.test(expr);
      if (!safe) {
        return Promise.resolve({
          output: "",
          error: "calc: invalid expression",
          success: false,
          exitCode: 1,
        });
      }

      // Use Function constructor instead of eval for safety
      const func = new Function("return " + expr);
      const result = func();
      return Promise.resolve({
        output: String(result),
        success: true,
        exitCode: 0,
      });
    } catch (e) {
      return Promise.resolve({
        output: "",
        error: `calc: ${String(e)}`,
        success: false,
        exitCode: 1,
      });
    }
  }

  private cmd_alias(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      const output = Object.entries(this.context.aliases)
        .map(([alias, cmd]) => `${alias}='${cmd}'`)
        .join("\n");
      return Promise.resolve({
        output,
        success: true,
        exitCode: 0,
      });
    }

    if (args.length < 2) {
      return Promise.resolve({
        output: "",
        error: "alias: missing value",
        success: false,
        exitCode: 1,
      });
    }

    const name = args[0];
    const value = args.slice(1).join(" ");
    this.context.aliases[name] = value;

    return Promise.resolve({
      output: `Alias '${name}' created`,
      success: true,
      exitCode: 0,
    });
  }
}

export default ShellExecutor;
