import { FolderOpen } from 'lucide-react';
import EmptyState from '../os/EmptyState';

export default function FilesApp() {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'hsl(var(--card))' }}>
      <EmptyState
        icon={<FolderOpen size={20} fill="currentColor" fillOpacity={0.15} />}
        title="This folder is empty"
        description="Drop files here or create a new folder to get started."
        secondaryAction={{ label: 'New Folder' }}
        action={{ label: 'Import Files' }}
      />
    </div>
  );
}
