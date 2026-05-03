import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Music as MusicIcon } from 'lucide-react';

type Track = { title: string; artist: string; album: string; duration: string; hue: number };

const tracks: Track[] = [
  { title: 'Midnight Drive', artist: 'The Lanterns', album: 'Headlights', duration: '3:42', hue: 220 },
  { title: 'Soft Light', artist: 'Aurora Belle', album: 'Sunrise EP', duration: '2:58', hue: 30 },
  { title: 'Ocean Floor', artist: 'Marina Reef', album: 'Deep Blue', duration: '4:11', hue: 190 },
  { title: 'Paper Planes', artist: 'Foldwork', album: 'Origami', duration: '3:05', hue: 340 },
  { title: 'Pixel Garden', artist: 'Lo-fi Bytes', album: 'Boot.wav', duration: '2:24', hue: 130 },
  { title: 'Glass Walls', artist: 'Northern Halls', album: 'Reflect', duration: '3:51', hue: 280 },
  { title: 'Neon Coast', artist: 'Cassette Coast', album: 'After Dark', duration: '4:02', hue: 320 },
];

export default function MusicApp() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const t = tracks[active];

  return (
    <div className="flex h-full text-sm" style={{ background: 'hsl(var(--card))' }}>
      <aside className="w-44 shrink-0 p-3" style={{ background: 'hsl(var(--sidebar-bg))', borderRight: '1px solid hsl(var(--border))' }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Library</div>
        {['Songs', 'Albums', 'Artists', 'Playlists'].map((l, i) => (
          <button key={l} className="w-full text-left px-2 py-1.5 rounded-md text-xs mb-0.5"
            style={{ background: i === 0 ? 'hsl(var(--accent) / 0.12)' : 'transparent', color: i === 0 ? 'hsl(var(--accent))' : 'hsl(var(--sidebar-fg))', fontWeight: i === 0 ? 600 : 500 }}>
            {l}
          </button>
        ))}
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto os-scrollbar">
          <table className="w-full text-xs">
            <thead style={{ color: 'hsl(var(--muted-foreground))', borderBottom: '1px solid hsl(var(--border))' }}>
              <tr>
                <th className="text-left font-medium px-3 py-2 w-8">#</th>
                <th className="text-left font-medium px-3 py-2">Title</th>
                <th className="text-left font-medium px-3 py-2">Album</th>
                <th className="text-left font-medium px-3 py-2 w-16">Time</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((tr, i) => {
                const sel = i === active;
                return (
                  <tr key={i} onClick={() => { setActive(i); setPlaying(true); }}
                    style={{ background: sel ? 'hsl(var(--accent) / 0.10)' : 'transparent', cursor: 'default' }}
                    className="hover:bg-secondary/60">
                    <td className="px-3 py-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{i + 1}</td>
                    <td className="px-3 py-1.5">
                      <div className="font-medium" style={{ color: sel ? 'hsl(var(--accent))' : 'hsl(var(--foreground))' }}>{tr.title}</div>
                      <div className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{tr.artist}</div>
                    </td>
                    <td className="px-3 py-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{tr.album}</td>
                    <td className="px-3 py-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{tr.duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="h-20 flex items-center px-4 gap-4 shrink-0" style={{ borderTop: '1px solid hsl(var(--border))', background: 'hsl(var(--toolbar-bg))' }}>
          <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, hsl(${t.hue} 70% 55%), hsl(${(t.hue + 40) % 360} 70% 35%))` }}>
            <MusicIcon size={20} color="#fff" fill="#fff" fillOpacity={0.3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{t.title}</div>
            <div className="text-[11px] truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{t.artist} — {t.album}</div>
            <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
              <div style={{ width: '38%', height: '100%', background: 'hsl(var(--accent))' }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-secondary"><Shuffle size={14} /></button>
            <button className="p-1.5 rounded hover:bg-secondary" onClick={() => setActive(a => Math.max(0, a - 1))}><SkipBack size={14} fill="currentColor" /></button>
            <button onClick={() => setPlaying(p => !p)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ background: 'hsl(var(--accent))' }}>
              {playing ? <Pause size={16} fill="#fff" /> : <Play size={16} fill="#fff" />}
            </button>
            <button className="p-1.5 rounded hover:bg-secondary" onClick={() => setActive(a => Math.min(tracks.length - 1, a + 1))}><SkipForward size={14} fill="currentColor" /></button>
            <button className="p-1.5 rounded hover:bg-secondary"><Repeat size={14} /></button>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2 size={13} className="opacity-70" />
            <input type="range" defaultValue={70} className="w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
