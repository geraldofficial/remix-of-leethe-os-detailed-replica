import { useState } from 'react';
import { Folder, FileText, Image as ImageIcon, Music, Film, Code2, Home, Download, Star, Trash2, HardDrive, Search, ChevronRight } from 'lucide-react';

type FileItem = { name: string; type: 'folder' | 'image' | 'doc' | 'audio' | 'video' | 'code'; size?: string; modified: string };

const tree: Record<string, FileItem[]> = {
  Home: [
    { name: 'Documents', type: 'folder', modified: 'Apr 22' },
    { name: 'Downloads', type: 'folder', modified: 'May 1' },
    { name: 'Pictures', type: 'folder', modified: 'Mar 14' },
    { name: 'Music', type: 'folder', modified: 'Feb 02' },
    { name: 'Projects', type: 'folder', modified: 'May 3' },
    { name: 'Notes.txt', type: 'doc', size: '2 KB', modified: 'Today' },
    { name: 'screenshot.png', type: 'image', size: '412 KB', modified: 'Yesterday' },
  ],
  Documents: [
    { name: 'Resume.pdf', type: 'doc', size: '184 KB', modified: 'Apr 18' },
    { name: 'Invoice-2026-04.pdf', type: 'doc', size: '92 KB', modified: 'Apr 30' },
    { name: 'Reading list.md', type: 'doc', size: '3 KB', modified: 'Apr 12' },
  ],
  Downloads: [
    { name: 'leethe-os.iso', type: 'doc', size: '1.4 GB', modified: 'May 1' },
    { name: 'wallpaper-pack.zip', type: 'doc', size: '38 MB', modified: 'Apr 28' },
  ],
  Pictures: [
    { name: 'sunset.jpg', type: 'image', size: '2.1 MB', modified: 'Mar 02' },
    { name: 'avatar.png', type: 'image', size: '88 KB', modified: 'Jan 14' },
    { name: 'mountains.jpg', type: 'image', size: '3.4 MB', modified: 'Mar 14' },
  ],
  Music: [
    { name: 'lofi-beat.mp3', type: 'audio', size: '4 MB', modified: 'Feb 02' },
    { name: 'focus-mix.mp3', type: 'audio', size: '11 MB', modified: 'Feb 02' },
  ],
  Projects: [
    { name: 'leethe-os', type: 'folder', modified: 'Today' },
    { name: 'README.md', type: 'code', size: '6 KB', modified: 'Today' },
  ],
};

const sidebar: { label: string; key: string; icon: any }[] = [
  { label: 'Home', key: 'Home', icon: Home },
  { label: 'Documents', key: 'Documents', icon: FileText },
  { label: 'Downloads', key: 'Downloads', icon: Download },
  { label: 'Pictures', key: 'Pictures', icon: ImageIcon },
  { label: 'Music', key: 'Music', icon: Music },
  { label: 'Starred', key: 'Starred', icon: Star },
  { label: 'Trash', key: 'Trash', icon: Trash2 },
];

function iconFor(t: FileItem['type']) {
  const props = { size: 18, fill: 'currentColor', fillOpacity: 0.18, strokeWidth: 1.5 } as const;
  switch (t) {
    case 'folder': return <Folder {...props} className="text-blue-500" />;
    case 'image': return <ImageIcon {...props} className="text-pink-500" />;
    case 'audio': return <Music {...props} className="text-purple-500" />;
    case 'video': return <Film {...props} className="text-orange-500" />;
    case 'code': return <Code2 {...props} className="text-emerald-500" />;
    default: return <FileText {...props} className="text-zinc-500" />;
  }
}

export default function FilesApp() {
  const [current, setCurrent] = useState('Home');
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const items = (tree[current] ?? []).filter(i => i.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-full text-sm" style={{ background: 'hsl(var(--card))' }}>
      <aside className="w-48 shrink-0 px-2 py-3 flex flex-col gap-0.5"
        style={{ background: 'hsl(var(--sidebar-bg))', borderRight: '1px solid hsl(var(--border))' }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Places</div>
        {sidebar.map(s => {
          const Icon = s.icon;
          const active = current === s.key;
          return (
            <button key={s.key} onClick={() => { setCurrent(s.key); setSelected(null); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              style={{
                background: active ? 'hsl(var(--accent) / 0.12)' : 'transparent',
                color: active ? 'hsl(var(--accent))' : 'hsl(var(--sidebar-fg))',
                fontWeight: active ? 600 : 500,
              }}>
              <Icon size={15} fill={active ? 'currentColor' : 'none'} fillOpacity={0.2} />
              {s.label}
            </button>
          );
        })}
        <div className="text-[11px] font-semibold uppercase tracking-wider px-2 mt-3 mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Devices</div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md" style={{ color: 'hsl(var(--sidebar-fg))' }}>
          <HardDrive size={15} /> Macintosh HD
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-11 flex items-center gap-2 px-3 shrink-0" style={{ borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--toolbar-bg))' }}>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <Home size={13} /> <ChevronRight size={12} /> <span style={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}>{current}</span>
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search"
              className="pl-7 pr-2 py-1 rounded-md text-xs outline-none w-44"
              style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          </div>
        </div>
        <div className="flex-1 overflow-auto os-scrollbar">
          <table className="w-full text-xs">
            <thead style={{ color: 'hsl(var(--muted-foreground))' }}>
              <tr>
                <th className="text-left font-medium px-3 py-2">Name</th>
                <th className="text-left font-medium px-3 py-2 w-24">Size</th>
                <th className="text-left font-medium px-3 py-2 w-32">Modified</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => {
                const isSel = selected === i.name;
                return (
                  <tr key={i.name}
                    onClick={() => setSelected(i.name)}
                    onDoubleClick={() => { if (i.type === 'folder' && tree[i.name]) { setCurrent(i.name); setSelected(null); } }}
                    style={{ background: isSel ? 'hsl(var(--accent) / 0.12)' : 'transparent', cursor: 'default' }}
                    className="hover:bg-secondary/60">
                    <td className="px-3 py-1.5 flex items-center gap-2">{iconFor(i.type)} {i.name}</td>
                    <td className="px-3 py-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{i.size ?? '—'}</td>
                    <td className="px-3 py-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{i.modified}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="h-7 px-3 flex items-center text-[11px] shrink-0"
          style={{ borderTop: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', background: 'hsl(var(--toolbar-bg))' }}>
          {items.length} item{items.length === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
}
