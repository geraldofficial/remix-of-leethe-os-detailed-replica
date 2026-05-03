import { useState } from 'react';
import { Inbox, Send, FileText, Star, Trash2, Mail as MailIcon, Search, Reply, Forward, Archive } from 'lucide-react';

type Msg = { id: string; from: string; subject: string; preview: string; body: string; time: string; unread: boolean; starred: boolean };

const seed: Msg[] = [
  { id: '1', from: 'Leethe Team', subject: 'Welcome to Leethe OS', preview: 'Thanks for trying Leethe. Here are a few things to try first…', body: 'Thanks for trying Leethe.\n\nHere are a few things to try first:\n• Pin your favorite apps to the dock\n• Open a terminal and run `help`\n• Customize your wallpaper from System Settings\n\n— The Leethe Team', time: '09:14', unread: true, starred: true },
  { id: '2', from: 'GitHub', subject: '[leethe-os] PR #128 merged', preview: 'Your pull request "Add dock auto-hide" has been merged.', body: 'Your pull request "Add dock auto-hide" has been merged into main.', time: '08:02', unread: true, starred: false },
  { id: '3', from: 'Sam Rivera', subject: 'Lunch on Tuesday?', preview: 'Hey — free for lunch at the new ramen place?', body: 'Hey — free for lunch at the new ramen place? 12:30 works for me.', time: 'Yesterday', unread: false, starred: false },
  { id: '4', from: 'Newsletter', subject: 'Weekly design digest', preview: 'This week: type scales, motion principles and more.', body: 'This week in design: type scales, motion principles and a deep dive into spatial UI.', time: 'May 1', unread: false, starred: false },
];

const folders = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'starred', label: 'Starred', icon: Star },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'drafts', label: 'Drafts', icon: FileText },
  { key: 'trash', label: 'Trash', icon: Trash2 },
];

export default function MailApp() {
  const [folder, setFolder] = useState('inbox');
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [query, setQuery] = useState('');

  const filtered = msgs.filter(m => {
    if (folder === 'starred' && !m.starred) return false;
    if (folder === 'sent' || folder === 'drafts' || folder === 'trash') return false;
    return m.subject.toLowerCase().includes(query.toLowerCase()) || m.from.toLowerCase().includes(query.toLowerCase());
  });
  const selected = msgs.find(m => m.id === selectedId) ?? null;

  const open = (id: string) => {
    setSelectedId(id);
    setMsgs(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
  };

  return (
    <div className="flex h-full text-sm" style={{ background: 'hsl(var(--card))' }}>
      <aside className="w-44 shrink-0 p-2 flex flex-col gap-0.5"
        style={{ background: 'hsl(var(--sidebar-bg))', borderRight: '1px solid hsl(var(--border))' }}>
        <button className="px-3 py-1.5 mb-2 rounded-md text-xs font-semibold text-white"
          style={{ background: 'hsl(var(--accent))' }}>Compose</button>
        {folders.map(f => {
          const Icon = f.icon;
          const active = folder === f.key;
          const count = f.key === 'inbox' ? msgs.filter(m => m.unread).length : 0;
          return (
            <button key={f.key} onClick={() => setFolder(f.key)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-left"
              style={{
                background: active ? 'hsl(var(--accent) / 0.12)' : 'transparent',
                color: active ? 'hsl(var(--accent))' : 'hsl(var(--sidebar-fg))',
                fontWeight: active ? 600 : 500,
              }}>
              <Icon size={14} fill={active ? 'currentColor' : 'none'} fillOpacity={0.2} />
              <span className="flex-1">{f.label}</span>
              {count > 0 && <span className="text-[10px] font-semibold">{count}</span>}
            </button>
          );
        })}
      </aside>

      <div className="w-72 shrink-0 flex flex-col" style={{ borderRight: '1px solid hsl(var(--border))' }}>
        <div className="h-11 flex items-center px-3 shrink-0" style={{ borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--toolbar-bg))' }}>
          <Search size={13} className="opacity-60 mr-2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search mail"
            className="flex-1 bg-transparent outline-none text-xs" />
        </div>
        <div className="flex-1 overflow-auto os-scrollbar">
          {filtered.length === 0 && <div className="p-6 text-xs text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>Nothing here.</div>}
          {filtered.map(m => {
            const sel = m.id === selectedId;
            return (
              <button key={m.id} onClick={() => open(m.id)}
                className="w-full text-left px-3 py-2.5 flex flex-col gap-0.5"
                style={{ background: sel ? 'hsl(var(--accent) / 0.10)' : 'transparent', borderBottom: '1px solid hsl(var(--border))' }}>
                <div className="flex items-center gap-2">
                  {m.unread && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'hsl(var(--accent))' }} />}
                  <span className="text-xs font-semibold flex-1 truncate">{m.from}</span>
                  <span className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{m.time}</span>
                </div>
                <div className="text-xs truncate" style={{ fontWeight: m.unread ? 600 : 500 }}>{m.subject}</div>
                <div className="text-[11px] truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{m.preview}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <>
            <div className="h-11 flex items-center gap-2 px-3 shrink-0" style={{ borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--toolbar-bg))' }}>
              <button className="p-1.5 rounded hover:bg-secondary" title="Reply"><Reply size={14} /></button>
              <button className="p-1.5 rounded hover:bg-secondary" title="Forward"><Forward size={14} /></button>
              <button className="p-1.5 rounded hover:bg-secondary" title="Archive"><Archive size={14} /></button>
              <button className="p-1.5 rounded hover:bg-secondary" title="Delete"><Trash2 size={14} /></button>
            </div>
            <div className="p-5 overflow-auto os-scrollbar flex-1">
              <h2 className="text-lg font-semibold mb-1">{selected.subject}</h2>
              <div className="text-xs mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{selected.from}</span> · {selected.time}
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{selected.body}</pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <MailIcon size={16} className="mr-2" /> Select a message
          </div>
        )}
      </div>
    </div>
  );
}
