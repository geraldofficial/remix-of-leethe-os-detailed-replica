import { FileCode2 } from 'lucide-react';
import EmptyState from '../os/EmptyState';

export default function CodeApp() {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'hsl(var(--card))' }}>
      <EmptyState
        icon={<FileCode2 size={20} fill="currentColor" fillOpacity={0.15} />}
        title="No file is open"
        description="Open a file or project folder to start writing code."
        secondaryAction={{ label: 'Open Folder' }}
        action={{ label: 'New File' }}
      />
    </div>
  );
}
