import { Mail } from 'lucide-react';
import EmptyState from '../os/EmptyState';

export default function MailApp() {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'hsl(var(--card))' }}>
      <EmptyState
        icon={<Mail size={20} fill="currentColor" fillOpacity={0.15} />}
        title="Inbox zero"
        description="You haven't connected an email account yet. Add one to start receiving messages."
        secondaryAction={{ label: 'Compose' }}
        action={{ label: 'Add Account' }}
      />
    </div>
  );
}
