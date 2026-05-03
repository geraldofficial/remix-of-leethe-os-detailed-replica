import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const events: Record<string, { title: string; color: string }[]> = {
  '2026-05-04': [{ title: 'Standup', color: 'hsl(207 90% 54%)' }],
  '2026-05-07': [{ title: 'Design review', color: 'hsl(280 70% 55%)' }],
  '2026-05-12': [{ title: 'Lunch w/ Sam', color: 'hsl(150 60% 45%)' }],
  '2026-05-20': [{ title: 'Ship Leethe 1.0', color: 'hsl(20 90% 55%)' }],
};

export default function CalendarApp() {
  const [cursor, setCursor] = useState(new Date(2026, 4, 1));
  const [selected, setSelected] = useState<string | null>('2026-05-03');

  const monthName = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: { date: Date | null; key: string }[] = [];
    for (let i = 0; i < startDow; i++) cells.push({ date: null, key: `e${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      cells.push({ date, key: date.toISOString() });
    }
    while (cells.length % 7) cells.push({ date: null, key: `t${cells.length}` });
    return cells;
  }, [cursor]);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const todayStr = new Date(2026, 4, 3).toISOString().slice(0, 10);
  const selectedEvents = selected ? events[selected] ?? [] : [];

  return (
    <div className="flex h-full text-sm" style={{ background: 'hsl(var(--card))' }}>
      <aside className="w-56 shrink-0 p-4 flex flex-col gap-3"
        style={{ background: 'hsl(var(--sidebar-bg))', borderRight: '1px solid hsl(var(--border))' }}>
        <button className="px-3 py-2 rounded-md text-xs font-semibold text-white"
          style={{ background: 'hsl(var(--accent))' }}>+ New Event</button>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Calendars</div>
          {[
            { name: 'Personal', color: 'hsl(207 90% 54%)' },
            { name: 'Work', color: 'hsl(280 70% 55%)' },
            { name: 'Birthdays', color: 'hsl(20 90% 55%)' },
          ].map(c => (
            <label key={c.name} className="flex items-center gap-2 py-1 text-xs">
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />{c.name}
            </label>
          ))}
        </div>
        <div className="mt-auto">
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {selected ? new Date(selected).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'No date'}
          </div>
          {selectedEvents.length === 0 && <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>No events.</div>}
          {selectedEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-2 py-1 text-xs">
              <span style={{ width: 3, height: 14, borderRadius: 2, background: e.color }} />{e.title}
            </div>
          ))}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 flex items-center px-4 gap-2 shrink-0" style={{ borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--toolbar-bg))' }}>
          <button className="p-1 rounded hover:bg-secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 rounded hover:bg-secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            <ChevronRight size={16} />
          </button>
          <div className="font-semibold text-base ml-2">{monthName}</div>
          <div className="flex-1" />
          <button className="text-xs px-2.5 py-1 rounded-md" style={{ border: '1px solid hsl(var(--border))' }}
            onClick={() => setCursor(new Date(2026, 4, 1))}>Today</button>
        </div>
        <div className="grid grid-cols-7 text-[11px] font-medium uppercase tracking-wider px-2 pt-2"
          style={{ color: 'hsl(var(--muted-foreground))' }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="px-2 py-1">{d}</div>)}
        </div>
        <div className="flex-1 grid grid-cols-7 gap-px p-2" style={{ background: 'hsl(var(--border))' }}>
          {grid.map(c => {
            if (!c.date) return <div key={c.key} style={{ background: 'hsl(var(--card))' }} />;
            const k = fmt(c.date);
            const isToday = k === todayStr;
            const isSel = k === selected;
            const dayEvents = events[k] ?? [];
            return (
              <button key={c.key} onClick={() => setSelected(k)}
                className="text-left p-1.5 flex flex-col gap-1 transition-colors"
                style={{ background: isSel ? 'hsl(var(--accent) / 0.10)' : 'hsl(var(--card))' }}>
                <span className="text-xs font-medium inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ background: isToday ? 'hsl(var(--accent))' : 'transparent', color: isToday ? '#fff' : 'hsl(var(--foreground))' }}>
                  {c.date.getDate()}
                </span>
                {dayEvents.slice(0, 2).map((e, i) => (
                  <span key={i} className="text-[10px] truncate px-1 py-0.5 rounded" style={{ background: e.color, color: '#fff' }}>{e.title}</span>
                ))}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
