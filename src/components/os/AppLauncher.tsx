import { useState } from 'react';
import { Search, Calculator, Calendar, Camera, Code2, FileText, Bug, FolderOpen, Mail, MapPin, Activity, Columns2, Music, Image, Scissors, LayoutGrid, List } from 'lucide-react';

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

const apps = [
  { id: 'appcenter', name: 'AppCenter', icon: <LayoutGrid size={36} />, color: '#7c3aed' },
  { id: 'calculator', name: 'Calculator', icon: <Calculator size={36} />, color: '#6b7280' },
  { id: 'calendar', name: 'Calendar', icon: <Calendar size={36} />, color: '#6b7280' },
  { id: 'camera', name: 'Camera', icon: <Camera size={36} />, color: '#7c3aed' },
  { id: 'code', name: 'Code', icon: <Code2 size={36} />, color: '#d4a017' },
  { id: 'docviewer', name: 'Document Viewer', icon: <FileText size={36} />, color: '#ef4444' },
  { id: 'feedback', name: 'Feedback', icon: <Bug size={36} />, color: '#22c55e' },
  { id: 'files', name: 'Files', icon: <FolderOpen size={36} />, color: '#3b82f6' },
  { id: 'mail', name: 'Mail', icon: <Mail size={36} />, color: '#6b7280' },
  { id: 'maps', name: 'Maps', icon: <MapPin size={36} />, color: '#ef4444' },
  { id: 'monitor', name: 'Monitor', icon: <Activity size={36} />, color: '#1e293b' },
  { id: 'multitasking', name: 'Multitasking View', icon: <Columns2 size={36} />, color: '#1e293b' },
  { id: 'music', name: 'Music', icon: <Music size={36} />, color: '#f97316' },
  { id: 'photos', name: 'Photos', icon: <Image size={36} />, color: '#8b5cf6' },
  { id: 'screenshot', name: 'Screenshot', icon: <Scissors size={36} />, color: '#ef4444' },
];

export default function AppLauncher({ isOpen, onClose, onOpenApp }: AppLauncherProps) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  if (!isOpen) return null;

  const filtered = apps.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const perPage = 15;
  const pageApps = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute top-7 left-0 rounded-br-xl p-4 pb-6"
        style={{ backgroundColor: 'hsl(var(--launcher-bg))', width: 680, boxShadow: '2px 4px 24px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}>
        {/* View toggles + search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex border rounded overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
            <button className="p-1.5 bg-card"><LayoutGrid size={14} /></button>
            <button className="p-1.5 bg-secondary"><List size={14} /></button>
          </div>
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(0); }}
              className="w-full pl-7 pr-3 py-1.5 rounded border text-sm"
              style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
              placeholder=""
              autoFocus
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-4">
          {pageApps.map(app => (
            <button key={app.id}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => { onOpenApp(app.id); onClose(); }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ color: app.color, backgroundColor: `${app.color}15` }}>
                {app.icon}
              </div>
              <span className="text-xs text-center leading-tight" style={{ color: 'hsl(var(--foreground))' }}>{app.name}</span>
            </button>
          ))}
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: i === page ? 'hsl(var(--foreground))' : 'hsl(var(--border))' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
