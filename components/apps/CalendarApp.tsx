'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Clock, 
  MapPin,
  Calendar as CalendarIcon,
  Trash2
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  color: string;
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
];

export function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    color: COLORS[4],
  });

  useEffect(() => {
    // Load events from localStorage
    const saved = localStorage.getItem('leethe-calendar-events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leethe-calendar-events', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = formatDateKey(date);
    return events.filter(e => e.date === dateKey);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    const clickedMonth = isCurrentMonth ? month : (day > 15 ? month - 1 : month + 1);
    const date = new Date(year, clickedMonth, day);
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (selectedDate) {
      setNewEvent({
        ...newEvent,
        date: formatDateKey(selectedDate),
      });
    }
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    
    if (editingEvent) {
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...newEvent, id: editingEvent.id } as CalendarEvent
          : e
      ));
    } else {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title!,
        date: newEvent.date!,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        location: newEvent.location,
        description: newEvent.description,
        color: newEvent.color || COLORS[4],
      };
      setEvents([...events, event]);
    }
    
    setShowEventModal(false);
    setNewEvent({
      title: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      description: '',
      color: COLORS[4],
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      const date = new Date(year, month - 1, day);
      const dayEvents = getEventsForDate(date);
      
      days.push(
        <div
          key={`prev-${day}`}
          onClick={() => handleDateClick(day, false)}
          className="min-h-[80px] p-1 bg-zinc-800/50 text-zinc-500 cursor-pointer hover:bg-zinc-700/50"
        >
          <span className="text-sm">{day}</span>
          {dayEvents.slice(0, 2).map(event => (
            <div
              key={event.id}
              className="text-xs truncate px-1 rounded mt-0.5"
              style={{ backgroundColor: event.color + '40', color: event.color }}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth();
      const todayClass = isToday(date);
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day, true)}
          className={`min-h-[80px] p-1 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-500/20 ring-1 ring-blue-500' : 'hover:bg-zinc-700/50'
          } ${todayClass ? 'bg-zinc-700' : ''}`}
        >
          <span className={`text-sm inline-flex items-center justify-center w-6 h-6 rounded-full ${
            todayClass ? 'bg-blue-500 text-white' : ''
          }`}>
            {day}
          </span>
          <div className="space-y-0.5 mt-1">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }}
                className="text-xs truncate px-1 rounded cursor-pointer hover:opacity-80"
                style={{ backgroundColor: event.color + '40', color: event.color }}
              >
                {event.startTime && <span className="opacity-70">{event.startTime} </span>}
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-zinc-400 px-1">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dayEvents = getEventsForDate(date);
      
      days.push(
        <div
          key={`next-${day}`}
          onClick={() => handleDateClick(day, false)}
          className="min-h-[80px] p-1 bg-zinc-800/50 text-zinc-500 cursor-pointer hover:bg-zinc-700/50"
        >
          <span className="text-sm">{day}</span>
          {dayEvents.slice(0, 2).map(event => (
            <div
              key={event.id}
              className="text-xs truncate px-1 rounded mt-0.5"
              style={{ backgroundColor: event.color + '40', color: event.color }}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex h-full bg-zinc-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-800 border-r border-zinc-700 flex flex-col">
        <div className="p-4">
          <button
            onClick={handleAddEvent}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Event
          </button>
        </div>
        
        {/* Mini calendar */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{monthNames[month]} {year}</span>
            <div className="flex gap-1">
              <button onClick={goToPrevMonth} className="p-1 hover:bg-zinc-700 rounded">
                <ChevronLeft size={14} />
              </button>
              <button onClick={goToNextMonth} className="p-1 hover:bg-zinc-700 rounded">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-xs">
            {dayNames.map(d => (
              <div key={d} className="text-center text-zinc-500 py-1">{d[0]}</div>
            ))}
            {/* Mini calendar days - simplified */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`prev-mini-${i}`} className="text-center py-1 text-zinc-600">
                {lastDayOfPrevMonth - firstDayOfMonth + i + 1}
              </div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const hasEvents = getEventsForDate(date).length > 0;
              return (
                <div
                  key={`mini-${day}`}
                  onClick={() => setSelectedDate(date)}
                  className={`text-center py-1 cursor-pointer rounded ${
                    isToday(date) ? 'bg-blue-500 text-white' : 'hover:bg-zinc-700'
                  } ${hasEvents ? 'font-bold' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Selected date events */}
        {selectedDate && (
          <div className="flex-1 overflow-y-auto border-t border-zinc-700">
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              {selectedDateEvents.length === 0 ? (
                <p className="text-sm text-zinc-500">No events</p>
              ) : (
                <div className="space-y-2">
                  {selectedDateEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => handleEditEvent(event)}
                      className="p-2 rounded-lg cursor-pointer hover:bg-zinc-700"
                      style={{ borderLeft: `3px solid ${event.color}` }}
                    >
                      <div className="font-medium text-sm">{event.title}</div>
                      {event.startTime && (
                        <div className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                          <Clock size={12} />
                          {event.startTime} - {event.endTime}
                        </div>
                      )}
                      {event.location && (
                        <div className="text-xs text-zinc-400 flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main calendar */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={goToPrevMonth} className="p-2 hover:bg-zinc-700 rounded">
                <ChevronLeft size={20} />
              </button>
              <button onClick={goToNextMonth} className="p-2 hover:bg-zinc-700 rounded">
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 rounded"
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-sm rounded capitalize ${
                  view === v ? 'bg-zinc-600' : 'hover:bg-zinc-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex-1 overflow-auto">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-zinc-700">
            {dayNames.map(day => (
              <div key={day} className="py-2 text-center text-sm text-zinc-400 border-r border-zinc-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {renderCalendarDays().map((day, i) => (
              <div key={i} className="border-r border-b border-zinc-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-xl p-6 w-[400px] border border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="p-1 hover:bg-zinc-700 rounded">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-zinc-700 px-3 py-2 rounded-lg"
                  placeholder="Event title"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full bg-zinc-700 px-3 py-2 rounded-lg"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-zinc-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full bg-zinc-700 px-3 py-2 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-zinc-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full bg-zinc-700 px-3 py-2 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full bg-zinc-700 px-3 py-2 rounded-lg"
                  placeholder="Add location"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full bg-zinc-700 px-3 py-2 rounded-lg resize-none h-20"
                  placeholder="Add description"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-6 h-6 rounded-full ${
                        newEvent.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-800' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              {editingEvent ? (
                <button
                  onClick={() => {
                    handleDeleteEvent(editingEvent.id);
                    setShowEventModal(false);
                  }}
                  className="px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg"
                >
                  {editingEvent ? 'Save' : 'Add Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
