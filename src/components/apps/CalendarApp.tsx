import { CalendarDays } from 'lucide-react';
import EmptyState from '../os/EmptyState';

export default function CalendarApp() {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'hsl(var(--card))' }}>
      <EmptyState
        icon={<CalendarDays size={20} fill="currentColor" fillOpacity={0.15} />}
        title="No events scheduled"
        description="Your calendar is clear. Create an event or connect an account to get started."
        secondaryAction={{ label: 'Add Account' }}
        action={{ label: 'New Event' }}
      />
    </div>
  );
}
