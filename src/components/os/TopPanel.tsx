import { Search, Volume2, Wifi, Battery, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TopPanelProps {
  onApplicationsClick: () => void;
}

export default function TopPanel({ onApplicationsClick }: TopPanelProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatDate = (d: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}  ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  return (
    <div className="h-7 flex items-center justify-between px-3 text-xs select-none"
      style={{ backgroundColor: 'hsl(var(--panel-bg))', color: 'hsl(var(--panel-fg))' }}>
      <div className="flex items-center gap-2">
        <button onClick={onApplicationsClick} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Search size={12} />
          <span className="font-medium">Applications</span>
        </button>
      </div>
      <div className="flex items-center gap-1 text-xs opacity-90">
        {formatDate(time)}
      </div>
      <div className="flex items-center gap-3">
        <Volume2 size={13} className="opacity-80" />
        <ChevronLeft size={10} className="opacity-60" />
        <ChevronRight size={10} className="opacity-60" />
        <Wifi size={13} className="opacity-80" />
        <Battery size={13} className="opacity-80" />
      </div>
    </div>
  );
}
