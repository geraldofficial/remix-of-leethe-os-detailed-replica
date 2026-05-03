import { useState } from 'react';

const photos = [
  { hue: 200, name: 'Beach' },
  { hue: 30, name: 'Sunset' },
  { hue: 130, name: 'Forest' },
  { hue: 280, name: 'Lavender' },
  { hue: 0, name: 'Roses' },
  { hue: 210, name: 'Mountain' },
  { hue: 50, name: 'Desert' },
  { hue: 170, name: 'Lagoon' },
  { hue: 320, name: 'Bloom' },
  { hue: 90, name: 'Field' },
  { hue: 260, name: 'Aurora' },
  { hue: 15, name: 'Canyon' },
];

function Tile({ hue, name, onClick }: { hue: number; name: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="aspect-square rounded-md overflow-hidden relative group"
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 35%))` }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
        <span className="text-xs text-white font-medium">{name}</span>
      </div>
    </button>
  );
}

export default function PhotosApp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full" style={{ background: 'hsl(var(--card))' }}>
      <div className="h-11 flex items-center px-4 shrink-0" style={{ borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--toolbar-bg))' }}>
        <h2 className="text-sm font-semibold">Library</h2>
        <span className="text-xs ml-3" style={{ color: 'hsl(var(--muted-foreground))' }}>{photos.length} items</span>
      </div>
      {open === null ? (
        <div className="flex-1 overflow-auto os-scrollbar p-3">
          <div className="grid grid-cols-4 gap-2">
            {photos.map((p, i) => <Tile key={i} {...p} onClick={() => setOpen(i)} />)}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col" style={{ background: '#000' }}>
          <div className="h-9 flex items-center px-3 gap-3 shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <button onClick={() => setOpen(null)} className="text-xs text-white hover:underline">← Back</button>
            <span className="text-xs text-white opacity-80">{photos[open].name}</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="rounded-lg" style={{
              width: '70%', aspectRatio: '4/3',
              background: `linear-gradient(135deg, hsl(${photos[open].hue} 70% 55%), hsl(${(photos[open].hue + 40) % 360} 70% 35%))`,
              boxShadow: '0 12px 60px rgba(0,0,0,0.5)',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
