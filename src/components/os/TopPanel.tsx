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
    <div className="h-7 flex items-center justify-between px-4 text-xs font-medium select-none relative z-50"
      style={{ backgroundColor: 'rgba(10, 10, 10, 0.85)', color: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center gap-2">
        <button onClick={onApplicationsClick} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity px-1 py-0.5">
          <Search size={11} />
          <span>Applications</span>
        </button>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center text-xs opacity-90">
        {formatDate(time)}
      </div>
      <div className="flex items-center gap-3">
        <Volume2 size={13} className="opacity-80" />
        <div className="flex items-center gap-0.5 opacity-60">
          <ChevronLeft size={10} />
          <ChevronRight size={10} />
        </div>
        <Wifi size={13} className="opacity-80" />
        <Battery size={13} className="opacity-80" />
      </div>
    </div>
  );
}
