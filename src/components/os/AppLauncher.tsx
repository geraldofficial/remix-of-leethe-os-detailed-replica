import { useState } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import {
  AppCenterIcon, CalculatorIcon, CalendarIcon, CameraIcon, CodeIcon,
  DocumentViewerIcon, FeedbackIcon, FilesIcon, MailAppIcon, MapsIcon,
  MonitorIcon, MultitaskingIcon, MusicIcon, PhotosIcon, ScreenshotIcon
} from './AppIcons';

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

const apps = [
  { id: 'appcenter', name: 'AppCenter', icon: <AppCenterIcon size={56} /> },
  { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon size={56} /> },
  { id: 'calendar', name: 'Calendar', icon: <CalendarIcon size={56} /> },
  { id: 'camera', name: 'Camera', icon: <CameraIcon size={56} /> },
  { id: 'code', name: 'Code', icon: <CodeIcon size={56} /> },
  { id: 'docviewer', name: 'Document Viewer', icon: <DocumentViewerIcon size={56} /> },
  { id: 'feedback', name: 'Feedback', icon: <FeedbackIcon size={56} /> },
  { id: 'files', name: 'Files', icon: <FilesIcon size={56} /> },
  { id: 'mail', name: 'Mail', icon: <MailAppIcon size={56} /> },
  { id: 'maps', name: 'Maps', icon: <MapsIcon size={56} /> },
  { id: 'monitor', name: 'Monitor', icon: <MonitorIcon size={56} /> },
  { id: 'multitasking', name: 'Multitasking View', icon: <MultitaskingIcon size={56} /> },
  { id: 'music', name: 'Music', icon: <MusicIcon size={56} /> },
  { id: 'photos', name: 'Photos', icon: <PhotosIcon size={56} /> },
  { id: 'screenshot', name: 'Screenshot', icon: <ScreenshotIcon size={56} /> },
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
      <div className="absolute top-7 left-0 rounded-br-2xl p-5 pb-6"
        style={{
          backgroundColor: 'rgba(245, 245, 245, 0.97)',
          backdropFilter: 'blur(20px)',
          width: 680,
          boxShadow: '2px 4px 32px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.6) inset',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
        onClick={e => e.stopPropagation()}>
        {/* View toggles + search */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #d1d5db' }}>
            <button className="p-1.5" style={{ backgroundColor: '#e5e7eb' }}><LayoutGrid size={14} color="#374151" /></button>
            <button className="p-1.5" style={{ backgroundColor: '#f3f4f6' }}><List size={14} color="#9ca3af" /></button>
          </div>
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(0); }}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #d1d5db', backgroundColor: 'white' }}
              autoFocus
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-x-2 gap-y-4">
          {pageApps.map(app => (
            <button key={app.id}
              className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-black/5 transition-colors"
              onClick={() => { onOpenApp(app.id); onClose(); }}>
              {app.icon}
              <span className="text-xs text-center leading-tight" style={{ color: '#374151' }}>{app.name}</span>
            </button>
          ))}
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: i === page ? '#374151' : '#d1d5db' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
