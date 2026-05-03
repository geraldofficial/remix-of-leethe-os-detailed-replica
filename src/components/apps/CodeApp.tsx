import { useState } from 'react';
import { FileCode2, FileText, FolderOpen, Play, Save } from 'lucide-react';

type CodeFile = { name: string; lang: string; content: string };

const initial: CodeFile[] = [
  { name: 'main.ts', lang: 'ts', content: `// Welcome to Leethe Code\nimport { greet } from './lib';\n\nconst user = 'world';\nconsole.log(greet(user));\n` },
  { name: 'lib.ts', lang: 'ts', content: `export function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n` },
  { name: 'README.md', lang: 'md', content: `# leethe-os\n\nA minimal hand-crafted desktop running in your browser.\n` },
];

export default function CodeApp() {
  const [files, setFiles] = useState<CodeFile[]>(initial);
  const [active, setActive] = useState(0);

  const update = (content: string) => setFiles(prev => prev.map((f, i) => i === active ? { ...f, content } : f));

  return (
    <div className="flex h-full text-sm" style={{ background: 'hsl(var(--card))' }}>
      <aside className="w-48 shrink-0 p-2"
        style={{ background: 'hsl(var(--sidebar-bg))', borderRight: '1px solid hsl(var(--border))' }}>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2 py-1.5"
          style={{ color: 'hsl(var(--muted-foreground))' }}>
          <FolderOpen size={12} fill="currentColor" fillOpacity={0.2} /> Project
        </div>
        {files.map((f, i) => {
          const Icon = f.lang === 'md' ? FileText : FileCode2;
          const sel = i === active;
          return (
            <button key={f.name} onClick={() => setActive(i)}
              className="w-full flex items-center gap-2 px-2 py-1 rounded text-left text-xs"
              style={{
                background: sel ? 'hsl(var(--accent) / 0.12)' : 'transparent',
                color: sel ? 'hsl(var(--accent))' : 'hsl(var(--sidebar-fg))',
                fontWeight: sel ? 600 : 500,
              }}>
              <Icon size={13} fill={sel ? 'currentColor' : 'none'} fillOpacity={0.2} />{f.name}
            </button>
          );
        })}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-9 flex items-center px-3 gap-2 shrink-0" style={{ borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--toolbar-bg))' }}>
          <span className="text-xs font-medium">{files[active].name}</span>
          <div className="flex-1" />
          <button className="text-xs px-2 py-0.5 rounded hover:bg-secondary flex items-center gap-1"><Save size={11} /> Save</button>
          <button className="text-xs px-2 py-0.5 rounded text-white flex items-center gap-1" style={{ background: 'hsl(var(--accent))' }}><Play size={11} fill="#fff" /> Run</button>
        </div>
        <textarea value={files[active].content} onChange={e => update(e.target.value)}
          spellCheck={false}
          className="flex-1 outline-none p-4 font-mono text-xs resize-none os-scrollbar"
          style={{ background: 'hsl(var(--card))', color: 'hsl(var(--foreground))', lineHeight: 1.6 }} />
      </div>
    </div>
  );
}
