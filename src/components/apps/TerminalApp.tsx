import { useState, useRef, useEffect } from 'react';

export default function TerminalApp() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const prompt = (
    <>
      <span className="term-green">user@leethe</span>
      <span className="term-white">:</span>
      <span className="term-blue">~</span>
      <span className="term-yellow">$ </span>
    </>
  );

  const run = (cmd: string) => {
    const c = cmd.trim();
    let out = '';
    if (c === 'help') out = 'Available commands: help, clear, echo, whoami, date';
    else if (c === 'clear') { setHistory([]); return; }
    else if (c.startsWith('echo ')) out = c.slice(5);
    else if (c === 'whoami') out = 'user';
    else if (c === 'date') out = new Date().toString();
    else if (c === '') out = '';
    else out = `command not found: ${c}`;
    setHistory(h => [...h, `$ ${cmd}`, ...(out ? [out] : [])]);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'hsl(var(--terminal-bg))' }}
      onClick={() => inputRef.current?.focus()}>
      <div className="flex-1 p-4 font-mono text-xs overflow-auto os-scrollbar" style={{ color: 'hsl(var(--terminal-fg))' }}>
        <div className="term-white opacity-60 mb-3">Welcome to Leethe Terminal. Type 'help' for commands.</div>
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'term-white' : 'term-white opacity-80'}>{line}</div>
        ))}
        <div className="flex items-center">
          {prompt}
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { run(input); setInput(''); }
            }}
            className="flex-1 bg-transparent outline-none term-white ml-1"
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
