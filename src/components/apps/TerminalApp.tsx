'use client';

import { useState, useRef, useEffect } from 'react';
import ShellExecutor from '../../../lib/shell-executor';

export default function TerminalApp() {
  const [history, setHistory] = useState<{ type: 'command' | 'output' | 'error'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<ShellExecutor | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize shell executor
  useEffect(() => {
    if (!shellRef.current) {
      shellRef.current = new ShellExecutor();
      setHistory([
        { type: 'output', content: 'Welcome to LeetheOS Terminal v1.0.0' },
        { type: 'output', content: 'Type "help" for a list of commands.' },
      ]);
      setInitialized(true);
    }
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getCurrentPath = (): string => {
    return shellRef.current?.getCurrentPath() || '~';
  };

  const prompt = (
    <>
      <span className="term-green">guest@leethe</span>
      <span className="term-white">:</span>
      <span className="term-blue">{getCurrentPath()}</span>
      <span className="term-yellow">$ </span>
    </>
  );

  const runCommand = async (cmd: string) => {
    if (!shellRef.current) return;

    // Show command
    setHistory((h) => [...h, { type: 'command', content: `$ ${cmd}` }]);

    // Handle special case for exit
    if (cmd.trim().toLowerCase() === 'exit') {
      setHistory((h) => [...h, { type: 'output', content: 'Exiting terminal...' }]);
      return;
    }

    // Execute command
    const result = await shellRef.current.execute(cmd);

    // Special handling for clear
    if (result.output === 'CLEAR_SCREEN') {
      setHistory([]);
      return;
    }

    // Show output
    if (result.output) {
      setHistory((h) => [...h, { type: 'output', content: result.output }]);
    }

    // Show error if any
    if (result.error) {
      setHistory((h) => [...h, { type: 'error', content: result.error }]);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input;
      setInput('');
      await runCommand(cmd);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion could be added here
    }
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'hsl(var(--terminal-bg))' }}>
        <div style={{ color: 'hsl(var(--terminal-fg))' }}>Loading Terminal...</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'hsl(var(--terminal-bg))' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 p-4 font-mono text-xs overflow-auto os-scrollbar" style={{ color: 'hsl(var(--terminal-fg))' }}>
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'command'
                ? 'term-white mb-1'
                : line.type === 'error'
                  ? 'term-red mb-1'
                  : 'term-white opacity-80 mb-1'
            }
          >
            {line.content}
          </div>
        ))}
        <div className="flex items-center">
          {prompt}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none term-white ml-1 caret-white"
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
