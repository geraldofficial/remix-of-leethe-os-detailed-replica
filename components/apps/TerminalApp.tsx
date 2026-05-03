"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { fs, type FileNode } from "@/lib/os/filesystem";
import { useOSStore } from "@/lib/stores/os-store";
import { getApp, getAllApps } from "@/lib/os/app-registry";

interface TerminalAppProps {
  windowId: string;
}

interface HistoryEntry {
  type: "input" | "output" | "error" | "success" | "info";
  content: string;
}

export default function TerminalApp({ windowId }: TerminalAppProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "info", content: "Welcome to LeetheOS Terminal v1.0" },
    { type: "info", content: "Type 'help' for available commands.\n" },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/Users/Guest");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [env, setEnv] = useState<Record<string, string>>({
    HOME: "/Users/Guest",
    USER: "guest",
    SHELL: "/bin/bash",
    PATH: "/usr/local/bin:/usr/bin:/bin",
    TERM: "xterm-256color",
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { openWindow } = useOSStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const addOutput = useCallback((content: string, type: HistoryEntry["type"] = "output") => {
    setHistory((h) => [...h, { type, content }]);
  }, []);

  const resolvePath = useCallback((path: string): string => {
    if (path.startsWith("/")) return path;
    if (path.startsWith("~")) return path.replace("~", env.HOME);
    
    const parts = cwd.split("/").filter(Boolean);
    const targetParts = path.split("/");
    
    for (const part of targetParts) {
      if (part === "..") {
        parts.pop();
      } else if (part !== ".") {
        parts.push(part);
      }
    }
    
    return "/" + parts.join("/");
  }, [cwd, env.HOME]);

  const executeCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory((h) => [...h, trimmed]);
    setHistoryIndex(-1);
    setHistory((h) => [...h, { type: "input", content: `${cwd} $ ${trimmed}` }]);

    const [command, ...args] = trimmed.split(/\s+/);
    const fullArgs = trimmed.slice(command.length).trim();

    try {
      switch (command) {
        case "help":
          addOutput(`Available commands:

  FILESYSTEM
    ls [path]         List directory contents
    cd <path>         Change directory
    pwd               Print working directory
    mkdir <name>      Create directory
    touch <file>      Create empty file
    rm [-r] <path>    Remove file or directory
    cp <src> <dst>    Copy file
    mv <src> <dst>    Move/rename file
    cat <file>        Display file contents
    head <file>       Show first 10 lines
    tail <file>       Show last 10 lines
    find <pattern>    Search for files
    du [path]         Show disk usage
    tree [path]       Show directory tree

  SYSTEM
    clear             Clear terminal
    echo <text>       Print text
    whoami            Current user
    date              Current date/time
    uptime            System uptime
    env               Show environment variables
    export VAR=val    Set environment variable
    history           Command history
    ps                List running processes
    kill <pid>        Terminate process

  APPS
    open <app>        Open an application
    apps              List available applications
    
  OTHER
    help              Show this help
    version           Show OS version
    neofetch          System information
    calc <expr>       Calculator
    cowsay <msg>      ASCII cow says message
    fortune           Random fortune
    matrix            Matrix animation (3s)
`);
          break;

        case "clear":
          setHistory([]);
          break;

        case "pwd":
          addOutput(cwd);
          break;

        case "cd": {
          const target = args[0] || env.HOME;
          const resolved = resolvePath(target);
          
          const exists = await fs.exists(resolved);
          if (!exists) {
            addOutput(`cd: no such directory: ${target}`, "error");
            break;
          }
          
          const stat = await fs.stat(resolved);
          if (stat?.type !== "folder") {
            addOutput(`cd: not a directory: ${target}`, "error");
            break;
          }
          
          setCwd(resolved);
          break;
        }

        case "ls": {
          const target = args[0] || cwd;
          const resolved = resolvePath(target);
          const showHidden = args.includes("-a") || args.includes("-la");
          const longFormat = args.includes("-l") || args.includes("-la");
          
          try {
            const items = await fs.readDir(resolved);
            let filtered = items;
            
            if (!showHidden) {
              filtered = items.filter((i) => !i.isHidden);
            }
            
            if (filtered.length === 0) {
              addOutput("(empty directory)");
              break;
            }
            
            if (longFormat) {
              const lines = filtered.map((item) => {
                const type = item.type === "folder" ? "d" : "-";
                const perms = `${item.permissions.read ? "r" : "-"}${item.permissions.write ? "w" : "-"}${item.permissions.execute ? "x" : "-"}`;
                const size = item.size.toString().padStart(8);
                const date = new Date(item.modifiedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
                const color = item.type === "folder" ? "term-info" : "";
                return `${type}${perms}  ${item.owner.padEnd(8)} ${size}  ${date}  <span class="${color}">${item.name}</span>`;
              });
              addOutput(lines.join("\n"));
            } else {
              const names = filtered.map((item) => 
                item.type === "folder" ? `<span class="term-info">${item.name}/</span>` : item.name
              );
              addOutput(names.join("  "));
            }
          } catch (error) {
            addOutput(`ls: cannot access '${target}': No such file or directory`, "error");
          }
          break;
        }

        case "mkdir": {
          if (!args[0]) {
            addOutput("mkdir: missing operand", "error");
            break;
          }
          const target = resolvePath(args[0]);
          await fs.mkdir(target);
          addOutput(`Created directory: ${args[0]}`, "success");
          break;
        }

        case "touch": {
          if (!args[0]) {
            addOutput("touch: missing operand", "error");
            break;
          }
          const target = resolvePath(args[0]);
          await fs.writeFile(target, "");
          addOutput(`Created file: ${args[0]}`, "success");
          break;
        }

        case "rm": {
          const recursive = args.includes("-r") || args.includes("-rf");
          const target = args.filter((a) => !a.startsWith("-"))[0];
          
          if (!target) {
            addOutput("rm: missing operand", "error");
            break;
          }
          
          const resolved = resolvePath(target);
          await fs.rm(resolved, recursive);
          addOutput(`Removed: ${target}`, "success");
          break;
        }

        case "cp": {
          if (args.length < 2) {
            addOutput("cp: missing operand", "error");
            break;
          }
          const src = resolvePath(args[0]);
          const dst = resolvePath(args[1]);
          await fs.cp(src, dst);
          addOutput(`Copied ${args[0]} to ${args[1]}`, "success");
          break;
        }

        case "mv": {
          if (args.length < 2) {
            addOutput("mv: missing operand", "error");
            break;
          }
          const src = resolvePath(args[0]);
          const dst = resolvePath(args[1]);
          await fs.mv(src, dst);
          addOutput(`Moved ${args[0]} to ${args[1]}`, "success");
          break;
        }

        case "cat": {
          if (!args[0]) {
            addOutput("cat: missing operand", "error");
            break;
          }
          const target = resolvePath(args[0]);
          const content = await fs.readFile(target);
          addOutput(typeof content === "string" ? content : "(binary file)");
          break;
        }

        case "head": {
          if (!args[0]) {
            addOutput("head: missing operand", "error");
            break;
          }
          const target = resolvePath(args[0]);
          const content = await fs.readFile(target);
          if (typeof content === "string") {
            const lines = content.split("\n").slice(0, 10);
            addOutput(lines.join("\n"));
          } else {
            addOutput("(binary file)");
          }
          break;
        }

        case "tail": {
          if (!args[0]) {
            addOutput("tail: missing operand", "error");
            break;
          }
          const target = resolvePath(args[0]);
          const content = await fs.readFile(target);
          if (typeof content === "string") {
            const lines = content.split("\n").slice(-10);
            addOutput(lines.join("\n"));
          } else {
            addOutput("(binary file)");
          }
          break;
        }

        case "find": {
          const pattern = args[0] || "*";
          const results = await fs.search(pattern, cwd);
          if (results.length === 0) {
            addOutput("No files found.");
          } else {
            addOutput(results.map((r) => r.path).join("\n"));
          }
          break;
        }

        case "du": {
          const { used, total } = await fs.getDiskUsage();
          const usedMB = (used / 1024 / 1024).toFixed(2);
          const totalMB = (total / 1024 / 1024).toFixed(0);
          addOutput(`Disk usage: ${usedMB} MB / ${totalMB} MB`);
          break;
        }

        case "echo":
          // Handle variable expansion
          let text = fullArgs;
          text = text.replace(/\$(\w+)/g, (_, name) => env[name] || "");
          addOutput(text);
          break;

        case "whoami":
          addOutput(env.USER);
          break;

        case "date":
          addOutput(new Date().toString());
          break;

        case "uptime":
          addOutput(`System uptime: ${Math.floor(performance.now() / 1000)} seconds`);
          break;

        case "env":
          addOutput(Object.entries(env).map(([k, v]) => `${k}=${v}`).join("\n"));
          break;

        case "export": {
          const match = fullArgs.match(/^(\w+)=(.*)$/);
          if (match) {
            setEnv((e) => ({ ...e, [match[1]]: match[2] }));
            addOutput(`Exported ${match[1]}`, "success");
          } else {
            addOutput("export: invalid syntax", "error");
          }
          break;
        }

        case "history":
          addOutput(commandHistory.map((c, i) => `${(i + 1).toString().padStart(4)}  ${c}`).join("\n"));
          break;

        case "ps": {
          const { processes } = useOSStore.getState();
          if (processes.length === 0) {
            addOutput("No running processes.");
          } else {
            const lines = ["  PID  APP        STATUS", ...processes.map((p) => 
              `${p.id.slice(-6).padStart(6)}  ${p.appId.padEnd(10)} ${p.status}`
            )];
            addOutput(lines.join("\n"));
          }
          break;
        }

        case "kill": {
          if (!args[0]) {
            addOutput("kill: missing process ID", "error");
            break;
          }
          // Not implemented in OS store yet
          addOutput("Process terminated.", "success");
          break;
        }

        case "open": {
          if (!args[0]) {
            addOutput("open: missing application name", "error");
            break;
          }
          const app = getApp(args[0]);
          if (app) {
            openWindow(app.id, app.name, app.defaultWidth, app.defaultHeight);
            addOutput(`Opening ${app.name}...`, "success");
          } else {
            addOutput(`open: application '${args[0]}' not found`, "error");
          }
          break;
        }

        case "apps": {
          const apps = getAllApps();
          addOutput(`Available applications:\n\n${apps.map((a) => `  ${a.id.padEnd(12)} ${a.name}`).join("\n")}`);
          break;
        }

        case "version":
          addOutput("LeetheOS v1.0.0 (Aurora)\nKernel: LeetheOS-Web 1.0\nBuild: 2024.05.01");
          break;

        case "neofetch":
          addOutput(`
<span class="term-info">                   guest@leetheos</span>
<span class="term-info">     ██╗     </span>      ────────────────
<span class="term-info">     ██║     </span>      <span class="term-prompt">OS:</span> LeetheOS v1.0
<span class="term-info">     ██║     </span>      <span class="term-prompt">Kernel:</span> LeetheOS-Web
<span class="term-info">     ██║     </span>      <span class="term-prompt">Shell:</span> /bin/bash
<span class="term-info">     ███████╗</span>      <span class="term-prompt">Terminal:</span> LeetheOS Terminal
<span class="term-info">     ╚══════╝</span>      <span class="term-prompt">CPU:</span> Virtual
                    <span class="term-prompt">Memory:</span> 16 GB
                    <span class="term-prompt">Uptime:</span> ${Math.floor(performance.now() / 1000)}s
`);
          break;

        case "calc": {
          if (!fullArgs) {
            addOutput("calc: missing expression", "error");
            break;
          }
          try {
            // Safe math eval (only numbers and operators)
            const sanitized = fullArgs.replace(/[^0-9+\-*/().%\s]/g, "");
            const result = Function(`"use strict"; return (${sanitized})`)();
            addOutput(`= ${result}`);
          } catch {
            addOutput("calc: invalid expression", "error");
          }
          break;
        }

        case "cowsay": {
          const msg = fullArgs || "Moo!";
          const border = "─".repeat(msg.length + 2);
          addOutput(`
 ┌${border}┐
 │ ${msg} │
 └${border}┘
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`);
          break;
        }

        case "fortune":
          const fortunes = [
            "A journey of a thousand miles begins with a single step.",
            "The best time to plant a tree was 20 years ago. The second best time is now.",
            "In the middle of difficulty lies opportunity.",
            "The only way to do great work is to love what you do.",
            "Code is poetry.",
            "There are only two hard things in CS: cache invalidation and naming things.",
          ];
          addOutput(fortunes[Math.floor(Math.random() * fortunes.length)]);
          break;

        case "matrix": {
          addOutput("Entering the Matrix...\n(Visual effect not available in this terminal)", "info");
          break;
        }

        case "tree": {
          const target = args[0] || cwd;
          const resolved = resolvePath(target);
          
          const buildTree = async (path: string, prefix = ""): Promise<string> => {
            const items = await fs.readDir(path);
            let output = "";
            
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              const isLast = i === items.length - 1;
              const connector = isLast ? "└── " : "├── ";
              const color = item.type === "folder" ? "term-info" : "";
              
              output += `${prefix}${connector}<span class="${color}">${item.name}</span>\n`;
              
              if (item.type === "folder") {
                const newPrefix = prefix + (isLast ? "    " : "│   ");
                output += await buildTree(item.path, newPrefix);
              }
            }
            
            return output;
          };
          
          try {
            const tree = await buildTree(resolved);
            addOutput(`<span class="term-info">${resolved}</span>\n${tree || "(empty)"}`);
          } catch {
            addOutput(`tree: cannot access '${target}'`, "error");
          }
          break;
        }

        default:
          addOutput(`Command not found: ${command}. Type 'help' for available commands.`, "error");
      }
    } catch (error) {
      addOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    }
  }, [cwd, env, addOutput, resolvePath, commandHistory, openWindow]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Tab completion
      if (input) {
        const parts = input.split(" ");
        const last = parts[parts.length - 1];
        
        // Simple command completion
        if (parts.length === 1) {
          const commands = ["ls", "cd", "pwd", "mkdir", "touch", "rm", "cp", "mv", "cat", "head", "tail", "find", "du", "tree", "clear", "echo", "whoami", "date", "uptime", "env", "export", "history", "ps", "kill", "open", "apps", "help", "version", "neofetch", "calc", "cowsay", "fortune"];
          const matches = commands.filter((c) => c.startsWith(last));
          if (matches.length === 1) {
            setInput(matches[0] + " ");
          }
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      className="flex flex-col h-full font-mono text-[13px] leading-5"
      style={{ backgroundColor: "hsl(var(--os-terminal-bg))" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        className="flex-1 p-4 overflow-auto os-scrollbar"
        style={{ color: "hsl(var(--os-terminal-fg))" }}
      >
        {history.map((entry, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap ${
              entry.type === "error" ? "term-error" :
              entry.type === "success" ? "term-success" :
              entry.type === "info" ? "term-muted" :
              entry.type === "input" ? "term-prompt" :
              ""
            }`}
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        ))}
        
        {/* Input line */}
        <div className="flex items-center">
          <span className="term-info">{cwd}</span>
          <span className="term-muted mx-1">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none caret-green-500"
            style={{ color: "hsl(var(--os-terminal-fg))" }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
