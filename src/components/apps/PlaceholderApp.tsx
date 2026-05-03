import { Globe, ListTodo, Music, Film, Image as ImageIcon, Settings as SettingsIcon, Calculator, Camera, Map, Activity, FileText, MessageSquare, Store, ScanLine, LayoutGrid } from 'lucide-react';
import EmptyState from '../os/EmptyState';

const cfg: Record<string, { icon: React.ReactNode; title: string; description: string; primary?: string; secondary?: string }> = {
  browser: { icon: <Globe size={20} fill="currentColor" fillOpacity={0.15} />, title: 'New tab', description: 'Type a URL or search to get started.', primary: 'Go to Lovable' },
  tasks: { icon: <ListTodo size={20} />, title: 'No tasks yet', description: 'Create your first task to start tracking your work.', primary: 'New Task' },
  music: { icon: <Music size={20} fill="currentColor" fillOpacity={0.15} />, title: 'Your library is empty', description: 'Add music files or connect a streaming account.', primary: 'Add Music' },
  videos: { icon: <Film size={20} fill="currentColor" fillOpacity={0.15} />, title: 'No videos here', description: 'Drop video files into this window to begin watching.', primary: 'Open Video' },
  photos: { icon: <ImageIcon size={20} fill="currentColor" fillOpacity={0.15} />, title: 'No photos imported', description: 'Import photos from your device or storage.', primary: 'Import' },
  settings: { icon: <SettingsIcon size={20} fill="currentColor" fillOpacity={0.15} />, title: 'System Settings', description: 'Choose a category from the sidebar to configure your system.' },
  calculator: { icon: <Calculator size={20} fill="currentColor" fillOpacity={0.15} />, title: 'Calculator', description: 'A modern calculator is on the way.' },
  camera: { icon: <Camera size={20} fill="currentColor" fillOpacity={0.15} />, title: 'Camera unavailable', description: 'No camera device is connected to this system.' },
  maps: { icon: <Map size={20} fill="currentColor" fillOpacity={0.15} />, title: 'Maps', description: 'Search a place or address to view it on the map.', primary: 'Search' },
  monitor: { icon: <Activity size={20} fill="currentColor" fillOpacity={0.15} />, title: 'System Monitor', description: 'Resource graphs and process list will appear here.' },
  docviewer: { icon: <FileText size={20} fill="currentColor" fillOpacity={0.15} />, title: 'No document open', description: 'Open a PDF or document to view it here.', primary: 'Open Document' },
  feedback: { icon: <MessageSquare size={20} fill="currentColor" fillOpacity={0.15} />, title: 'Send Feedback', description: 'Tell us what could be better in Leethe OS.', primary: 'Compose' },
  appcenter: { icon: <Store size={20} fill="currentColor" fillOpacity={0.15} />, title: 'AppCenter', description: 'Discover and install new applications.', primary: 'Browse' },
  screenshot: { icon: <ScanLine size={20} fill="currentColor" fillOpacity={0.15} />, title: 'Screenshot', description: 'Capture your entire screen, a window, or a selection.', primary: 'Capture' },
  multitasking: { icon: <LayoutGrid size={20} fill="currentColor" fillOpacity={0.15} />, title: 'Multitasking View', description: 'A bird\'s-eye view of all open windows and workspaces.' },
};

export default function PlaceholderApp({ appId }: { appId: string }) {
  const c = cfg[appId] ?? { icon: <LayoutGrid size={20} />, title: 'Coming soon', description: 'This app is not yet available.' };
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'hsl(var(--card))' }}>
      <EmptyState
        icon={c.icon}
        title={c.title}
        description={c.description}
        action={c.primary ? { label: c.primary } : undefined}
        secondaryAction={c.secondary ? { label: c.secondary } : undefined}
      />
    </div>
  );
}
