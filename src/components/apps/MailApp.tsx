import { useState } from 'react';
import { Search, Filter, Mail as MailIcon, ChevronLeft, ChevronRight, Flag, Copy, Archive, Trash2, Settings, RefreshCw, Star, MoreVertical, Paperclip, Calendar, FolderOpen, Inbox, FileText, AlertTriangle, ChevronDown } from 'lucide-react';

const folders = [
  { name: 'Inbox', icon: <Inbox size={14} />, count: 0 },
  { name: 'Drafts', icon: <FileText size={14} />, count: 1 },
  { name: 'Trash', icon: <Trash2 size={14} />, count: 0 },
  { name: 'Spam', icon: <AlertTriangle size={14} />, count: 1 },
];

const emails = [
  { sender: 'Farmers Ins...', subject: 'Your Farmers Insur...', time: '3m ago', unread: true, bold: true, color: '#3b82f6' },
  { sender: 'Nike', subject: 'Your Shipment is Arri...', time: '4h ago', unread: false },
  { sender: "Domino's Pizza", subject: '🚨 Member Exclusiv...', time: 'Mon', unread: true, bold: true, color: '#3b82f6' },
  { sender: 'Nike', subject: 'We just received your ...', time: 'Mon', unread: false },
  { sender: 'Ajpinkartistry', subject: 'Your appointment wi...', time: 'Sep 11', unread: false, selected: true, color: '#22c55e' },
  { sender: 'Stitch Fix', subject: 'Thanks for schedulin...', time: 'Sep 8', unread: false },
  { sender: 'Stitch Fix', subject: "Success! Your Fix is ...", time: 'Sep 8', unread: false },
  { sender: 'Synergy Ski...', subject: 'New contract: #00...', time: 'Sep 8', unread: true, color: '#3b82f6' },
  { sender: 'Undead Voice', subject: 'Undead Voice is Hiri...', time: 'Sep 8', unread: false },
];

export default function MailApp() {
  const [selectedIdx, setSelectedIdx] = useState(4);
  const [activeFolder, setActiveFolder] = useState('Inbox');

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Toolbar */}
      <div className="h-9 flex items-center px-3 border-b shrink-0"
        style={{ backgroundColor: 'hsl(var(--toolbar-bg))', borderColor: 'hsl(var(--border))' }}>
        <MailIcon size={16} className="opacity-60 text-blue-500 mr-3" />
        <div className="flex items-center border rounded px-2 py-1 mr-2" style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}>
          <Search size={12} className="opacity-30 mr-1" />
          <span className="text-xs opacity-40">Search Mail</span>
        </div>
        <Filter size={14} className="opacity-40 mr-4" />
        <div className="flex gap-1 ml-auto">
          <Flag size={14} className="text-red-400" />
          <Copy size={14} className="opacity-40" />
          <ChevronLeft size={14} className="text-blue-400" />
          <ChevronRight size={14} className="text-blue-400" />
          <div className="w-px bg-border mx-1" />
          <Flag size={14} className="text-orange-400" />
          <MailIcon size={14} className="opacity-40" />
          <Archive size={14} className="opacity-40" />
          <Trash2 size={14} className="opacity-40" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Folder sidebar */}
        <div className="w-32 border-r py-2 shrink-0 overflow-y-auto os-scrollbar"
          style={{ backgroundColor: 'hsl(var(--sidebar-bg))', borderColor: 'hsl(var(--border))' }}>
          <div className="px-3 py-1 text-xs font-semibold">Personal</div>
          {folders.map(f => (
            <button key={f.name}
              className={`w-full flex items-center gap-2 px-3 py-1 text-xs text-left hover:bg-secondary ${activeFolder === f.name ? 'font-semibold' : ''}`}
              onClick={() => setActiveFolder(f.name)}>
              {f.icon}
              <span className="flex-1">{f.name}</span>
              {f.count > 0 && <span className="text-[10px] opacity-50">{f.count}</span>}
            </button>
          ))}
          <div className="px-3 py-1 text-xs flex items-center gap-1 mt-1">
            <ChevronRight size={10} /> <span>Notes</span>
          </div>
          <div className="px-3 py-1 text-xs flex items-center gap-1">
            <ChevronRight size={10} /> <span>[Gmail]</span>
          </div>
          <div className="border-t mt-4 pt-2 px-3 flex gap-2" style={{ borderColor: 'hsl(var(--border))' }}>
            <Settings size={13} className="opacity-40" />
            <RefreshCw size={13} className="opacity-40" />
          </div>
        </div>

        {/* Email list */}
        <div className="w-56 border-r overflow-y-auto os-scrollbar shrink-0"
          style={{ borderColor: 'hsl(var(--border))' }}>
          {emails.map((e, i) => (
            <div key={i}
              className={`px-3 py-2 border-b cursor-pointer transition-colors ${i === selectedIdx ? 'bg-accent/10' : 'hover:bg-secondary'}`}
              style={{ borderColor: 'hsl(var(--border))' }}
              onClick={() => setSelectedIdx(i)}>
              <div className="flex items-center gap-1">
                {e.unread && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                <span className={`text-xs truncate ${e.bold ? 'font-bold' : ''} flex-1`}
                  style={{ color: e.color || 'inherit' }}>{e.sender}</span>
                <span className="text-[10px] opacity-40 shrink-0">{e.time}</span>
              </div>
              <div className={`text-[11px] truncate mt-0.5 ${e.bold ? 'font-semibold' : 'opacity-60'}`}>{e.subject}</div>
            </div>
          ))}
        </div>

        {/* Email content */}
        <div className="flex-1 overflow-auto os-scrollbar p-4" style={{ backgroundColor: 'hsl(var(--card))' }}>
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
              style={{ backgroundColor: '#e8a0c0' }}>A</div>
            <div className="flex-1 text-xs">
              <div className="flex justify-between">
                <div>
                  <div><span className="opacity-50">From:</span> Ajpinkartistry &lt;noreply@messaging.squareup.com&gt;</div>
                  <div><span className="opacity-50">To:</span> Danielle Foré &lt;danirabbit89@gmail.com&gt;</div>
                  <div><span className="opacity-50">Subject:</span> Your appointment with Ajpinkartistry is coming up</div>
                </div>
                <div className="flex items-start gap-2 shrink-0">
                  <span className="text-[10px] opacity-40">Sep 11 2023 at 1:48 PM</span>
                  <Paperclip size={12} className="opacity-40" />
                  <Star size={12} className="opacity-40" />
                  <MoreVertical size={12} className="opacity-40" />
                </div>
              </div>
            </div>
          </div>

          {/* Calendar event bar */}
          <div className="flex items-center gap-2 px-3 py-2 rounded border mb-6"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--secondary))' }}>
            <span className="text-blue-500">ℹ</span>
            <Calendar size={14} className="opacity-40" />
            <span className="text-xs flex-1">This message contains a Calendar Event.</span>
            <button className="text-xs px-3 py-1 rounded border" style={{ borderColor: 'hsl(var(--border))' }}>Open in Calendar</button>
          </div>

          {/* Email body */}
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Please confirm your upcoming appointment.</h2>
            <p className="text-sm opacity-70 mb-6">Confirm below to let us know that you're coming and ensure your time is held.</p>
            <div className="border rounded-lg p-6 text-sm" style={{ borderColor: 'hsl(var(--border))' }}>
              <div className="font-bold">Wednesday, September 13, 2023</div>
              <div className="font-bold">2:00 PM - 4:00 PM PDT</div>
              <div className="mt-3 opacity-60">2 hour session</div>
              <div className="mt-1 opacity-60">Aliyha Perry</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
