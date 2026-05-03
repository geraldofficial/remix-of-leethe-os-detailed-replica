import { useState } from 'react';
import { ChevronLeft, ChevronRight, Folder, FileText, Music, Image, Film, Download, Trash2, HardDrive, Globe, Search, RefreshCw, Maximize2, LayoutGrid, List, Columns, Home, Clock, FolderOpen } from 'lucide-react';

const sidebarBookmarks = [
  { name: 'Home', icon: <Home size={14} /> },
  { name: 'Recent', icon: <Clock size={14} /> },
  { name: 'Documents', icon: <FileText size={14} /> },
  { name: 'Music', icon: <Music size={14} /> },
  { name: 'Pictures', icon: <Image size={14} /> },
  { name: 'Videos', icon: <Film size={14} /> },
  { name: 'Downloads', icon: <Download size={14} />, highlight: true },
  { name: 'Projects', icon: <FolderOpen size={14} /> },
  { name: 'Trash', icon: <Trash2 size={14} /> },
];

const folders = [
  { name: 'Documents', icon: <FileText size={40} /> },
  { name: 'Downloads', icon: <Download size={40} /> },
  { name: 'Music', icon: <Music size={40} /> },
  { name: 'Pictures', icon: <Image size={40} /> },
  { name: 'Projects', icon: <FolderOpen size={40} /> },
  { name: 'Templates', icon: <FileText size={40} /> },
  { name: 'Videos', icon: <Film size={40} /> },
];

export default function FilesApp() {
  const [activeBookmark, setActiveBookmark] = useState('Home');

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Toolbar */}
      <div className="h-9 flex items-center px-2 gap-1 border-b shrink-0"
        style={{ backgroundColor: 'hsl(var(--toolbar-bg))', borderColor: 'hsl(var(--border))' }}>
        <button className="p-1 opacity-40"><ChevronLeft size={16} /></button>
        <button className="p-1 opacity-40"><ChevronRight size={16} /></button>
        <div className="flex gap-0.5 ml-2 border rounded overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
          <button className="p-1 bg-accent/10"><LayoutGrid size={14} /></button>
          <button className="p-1"><List size={14} className="opacity-40" /></button>
          <button className="p-1"><Columns size={14} className="opacity-40" /></button>
        </div>
        <div className="flex-1 mx-3">
          <div className="flex items-center border rounded px-2 py-1" style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}>
            <Search size={13} className="opacity-30 mr-1" />
            <span className="text-xs opacity-40">Search or Type Path</span>
          </div>
        </div>
        <RefreshCw size={14} className="opacity-40" />
        <Maximize2 size={14} className="opacity-40 ml-1" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-44 border-r overflow-y-auto os-scrollbar py-2 shrink-0"
          style={{ backgroundColor: 'hsl(var(--sidebar-bg))', borderColor: 'hsl(var(--border))' }}>
          <div className="px-3 py-1 text-xs font-semibold opacity-50 uppercase tracking-wide">Bookmarks</div>
          {sidebarBookmarks.map(b => (
            <button key={b.name}
              className={`w-full flex items-center gap-2 px-3 py-1 text-xs text-left hover:bg-secondary transition-colors ${activeBookmark === b.name ? 'font-semibold' : ''}`}
              style={{ color: b.highlight ? '#22c55e' : 'hsl(var(--sidebar-fg))' }}
              onClick={() => setActiveBookmark(b.name)}>
              {b.icon}
              <span>{b.name}</span>
            </button>
          ))}
          <div className="px-3 py-1 text-xs font-semibold opacity-50 uppercase tracking-wide mt-3">Storage</div>
          <button className="w-full flex items-center gap-2 px-3 py-1 text-xs">
            <HardDrive size={14} className="opacity-40" />
            <span>File System</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1 text-xs opacity-60">
            <HardDrive size={14} />
            <span className="truncate">CCCOMA_X64FRE_EN-...</span>
          </button>
          <div className="px-3 py-1 text-xs font-semibold opacity-50 uppercase tracking-wide mt-3">Network</div>
          <button className="w-full flex items-center gap-2 px-3 py-1 text-xs">
            <Globe size={14} className="opacity-40" />
            <span>Entire Network</span>
          </button>
          <div className="mt-4 px-3">
            <button className="flex items-center gap-1 text-xs opacity-50">
              <Globe size={12} /> Connect Server...
            </button>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="h-8 flex items-center border-b shrink-0"
            style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center">
              <button className="px-1 ml-1 opacity-40 text-sm">+</button>
              <div className="flex items-center px-3 text-xs border-r" style={{ borderColor: 'hsl(var(--border))' }}>
                <span className="mr-2">Downloads</span>
                <span className="opacity-40 cursor-pointer text-xs">✕</span>
              </div>
              <div className="flex items-center px-3 text-xs font-medium">
                <span>cassidyjames</span>
              </div>
            </div>
            <div className="flex-1" />
            <Clock size={13} className="opacity-40 mr-2" />
          </div>

          {/* Grid of folders */}
          <div className="flex-1 p-6 overflow-auto os-scrollbar" style={{ backgroundColor: 'hsl(var(--card))' }}>
            <div className="grid grid-cols-5 gap-6">
              {folders.map(f => (
                <div key={f.name} className="flex flex-col items-center gap-2 cursor-pointer hover:bg-secondary rounded-lg p-3 transition-colors">
                  <div className="w-16 h-16 flex items-center justify-center" style={{ color: '#c9b68a' }}>
                    {f.icon}
                  </div>
                  <span className="text-xs text-center">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
