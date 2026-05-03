import { useState } from 'react';
import { Plus, Check, Trash2, Inbox, Calendar, Star } from 'lucide-react';

type Task = { id: string; title: string; done: boolean; list: string };

const initial: Task[] = [
  { id: '1', title: 'Polish window controls', done: true, list: 'inbox' },
  { id: '2', title: 'Auto-hide dock on hover', done: true, list: 'inbox' },
  { id: '3', title: 'Build real Settings app', done: false, list: 'inbox' },
  { id: '4', title: 'Add more wallpapers', done: false, list: 'today' },
  { id: '5', title: 'Read about elementary OS HIG', done: false, list: 'starred' },
];

const lists = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'today', label: 'Today', icon: Calendar },
  { key: 'starred', label: 'Starred', icon: Star },
];

export default function TasksApp() {
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [list, setList] = useState('inbox');
  const [newTitle, setNewTitle] = useState('');

  const filtered = tasks.filter(t => t.list === list);
  const remaining = filtered.filter(t => !t.done).length;

  const add = () => {
    if (!newTitle.trim()) return;
    setTasks(prev => [...prev, { id: Math.random().toString(36).slice(2), title: newTitle.trim(), done: false, list }]);
    setNewTitle('');
  };

  return (
    <div className="flex h-full text-sm" style={{ background: 'hsl(var(--card))' }}>
      <aside className="w-44 shrink-0 p-2"
        style={{ background: 'hsl(var(--sidebar-bg))', borderRight: '1px solid hsl(var(--border))' }}>
        {lists.map(l => {
          const Icon = l.icon;
          const active = list === l.key;
          const count = tasks.filter(t => t.list === l.key && !t.done).length;
          return (
            <button key={l.key} onClick={() => setList(l.key)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left mb-0.5"
              style={{
                background: active ? 'hsl(var(--accent) / 0.12)' : 'transparent',
                color: active ? 'hsl(var(--accent))' : 'hsl(var(--sidebar-fg))',
                fontWeight: active ? 600 : 500,
              }}>
              <Icon size={14} fill={active ? 'currentColor' : 'none'} fillOpacity={0.2} />
              <span className="flex-1">{l.label}</span>
              {count > 0 && <span className="text-[10px]">{count}</span>}
            </button>
          );
        })}
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold">{lists.find(l => l.key === list)?.label}</h2>
          <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{remaining} remaining</p>
        </div>
        <div className="px-5 pb-3 flex items-center gap-2">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Add a task" className="flex-1 px-3 py-1.5 rounded-md text-xs outline-none"
            style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <button onClick={add}
            className="px-2 py-1.5 rounded-md text-white text-xs font-medium flex items-center gap-1"
            style={{ background: 'hsl(var(--accent))' }}>
            <Plus size={13} /> Add
          </button>
        </div>
        <div className="flex-1 overflow-auto os-scrollbar px-3">
          {filtered.length === 0 && <div className="text-xs text-center py-8" style={{ color: 'hsl(var(--muted-foreground))' }}>No tasks here.</div>}
          {filtered.map(t => (
            <div key={t.id} className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-secondary/60">
              <button onClick={() => setTasks(p => p.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  border: '1.5px solid ' + (t.done ? 'hsl(var(--accent))' : 'hsl(var(--border))'),
                  background: t.done ? 'hsl(var(--accent))' : 'transparent',
                }}>
                {t.done && <Check size={10} color="#fff" strokeWidth={3} />}
              </button>
              <span className="flex-1 text-sm" style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))' }}>{t.title}</span>
              <button onClick={() => setTasks(p => p.filter(x => x.id !== t.id))}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
