import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, Globe, Calendar as CalendarIcon } from 'lucide-react';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const events: Record<string, { title: string; color: string }[]> = {
  '2024-5-26': [{ title: 'The Big Qu...', color: '#9ca3af' }],
  '2024-5-27': [{ title: 'Memorial ...', color: '#9ca3af' }],
  '2024-5-30': [{ title: 'Telephone ...', color: '#9ca3af' }],
  '2024-6-1': [{ title: 'First Day o...', color: '#86efac' }],
  '2024-6-5': [{ title: 'Cancel hell...', color: '#86efac' }],
  '2024-6-7': [{ title: 'All over Col...', color: '#86efac' }, { title: 'Royal Coda', color: '#86efac' }],
  '2024-6-14': [{ title: 'Flag Day', color: '#d1d5db' }],
  '2024-6-16': [{ title: "Father's Day", color: '#86efac' }],
  '2024-6-19': [{ title: 'Juneteenth', color: '#86efac' }],
  '2024-6-26': [{ title: 'Exam with ...', color: '#86efac' }],
  '2024-6-27': [{ title: 'Phone app...', color: '#86efac' }],
  '2024-6-29': [{ title: 'Sapphic Sa...', color: '#86efac' }],
  '2024-7-4': [{ title: 'Independe...', color: '#9ca3af' }],
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarApp() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(5); // June
  const [selectedDay, setSelectedDay] = useState(7);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const days: { day: number; currentMonth: boolean }[] = [];
  // Previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }
  // Next month
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false });
  }

  const selectedEvents = events[`${year}-${month + 1}-${selectedDay}`] || events[`${year}-${month}-${selectedDay}`] || [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex h-full text-sm">
      {/* Calendar grid */}
      <div className="flex-1 flex flex-col">
        {/* Month nav */}
        <div className="h-9 flex items-center px-3 border-b shrink-0"
          style={{ backgroundColor: 'hsl(var(--toolbar-bg))', borderColor: 'hsl(var(--border))' }}>
          <CalendarIcon size={16} className="opacity-40 mr-3" />
          <button onClick={() => setMonth(m => m > 0 ? m - 1 : 11)} className="p-0.5"><ChevronLeft size={14} /></button>
          <span className="px-2 text-xs font-medium">{months[month]}</span>
          <button onClick={() => setMonth(m => m < 11 ? m + 1 : 0)} className="p-0.5"><ChevronRight size={14} /></button>
          <button onClick={() => setYear(y => y - 1)} className="p-0.5 ml-2"><ChevronLeft size={14} /></button>
          <span className="px-2 text-xs font-medium">{year}</span>
          <button onClick={() => setYear(y => y + 1)} className="p-0.5"><ChevronRight size={14} /></button>
          <div className="flex-1" />
          <Settings size={14} className="opacity-40" />
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          {dayNames.map(d => (
            <div key={d} className="text-center py-1 text-xs font-medium opacity-50">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 flex-1">
          {days.map((d, i) => {
            const key = `${year}-${month + 1}-${d.day}`;
            const prevKey = `${year}-${month}-${d.day}`;
            const dayEvents = d.currentMonth ? (events[key] || []) : (events[prevKey] || []);
            const isSelected = d.currentMonth && d.day === selectedDay;
            const isToday = d.currentMonth && d.day === 7;

            return (
              <div key={i}
                className={`border-b border-r p-1 min-h-[60px] cursor-pointer hover:bg-secondary/50 transition-colors ${!d.currentMonth ? 'opacity-30' : ''}`}
                style={{ borderColor: 'hsl(var(--border))' }}
                onClick={() => d.currentMonth && setSelectedDay(d.day)}>
                <div className={`text-xs mb-0.5 ${isToday ? 'w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white font-medium mx-auto' : 'text-right pr-1'}`}>
                  {d.day}
                </div>
                {dayEvents.map((ev, j) => (
                  <div key={j} className="text-[10px] px-1 py-0.5 rounded mb-0.5 truncate"
                    style={{ backgroundColor: ev.color, color: 'hsl(var(--highlight-text))' }}>
                    {ev.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar detail */}
      <div className="w-56 border-l p-4 shrink-0 overflow-auto os-scrollbar"
        style={{ backgroundColor: 'hsl(var(--sidebar-bg))', borderColor: 'hsl(var(--border))' }}>
        <div className="text-lg font-light mb-0.5">{dayNames[new Date(year, month, selectedDay).getDay()] === 'Fri' ? 'Friday' : dayNames[new Date(year, month, selectedDay).getDay()]}</div>
        <div className="text-sm opacity-60 mb-4">{months[month].substring(0, 3)}  {selectedDay} {year}</div>

        <div className="space-y-4">
          <div className="border-l-4 pl-3 py-1" style={{ borderColor: 'hsl(var(--accent))' }}>
            <div className="text-xs font-semibold">All over Color (Maricela P - Confirmed)</div>
            <div className="text-[10px] opacity-60 mt-1">10:00 AM – 12:00 PM</div>
            <div className="text-[10px] opacity-50 mt-1">2739 Riverside Boulevard, Sacramento, California, 95818</div>
          </div>
          <div className="border-l-4 pl-3 py-1" style={{ borderColor: 'hsl(var(--foreground))' }}>
            <div className="text-xs font-semibold">Royal Coda</div>
            <div className="text-[10px] opacity-60 mt-1">5:00 PM – 9:00 PM</div>
            <div className="text-[10px] opacity-50 mt-1">Cesar Chavez Plaza<br/>910 I St, Sacramento, CA 95814, United States</div>
          </div>
        </div>
      </div>
    </div>
  );
}
