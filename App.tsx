
import React, { useState, useMemo } from 'react';
import { MOCK_AGENDA, MOCK_TASKS, MOCK_ATTENDEES } from './constants';
import { AgendaEvent, Attendee } from './types';

type MainView = 'agenda' | 'dashboard' | 'team' | 'analytics' | 'settings';
type CalendarSubView = 'day' | 'week' | 'month' | 'list';

// --- Global UI Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1a2533] w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-primary/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        {children}
      </div>
    </div>
  );
};

// --- Calendar Logic Helpers ---

const getHours = () => Array.from({ length: 24 }, (_, i) => i);
const getWeekDays = () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- Sub-components ---

const EventEditor: React.FC<{ event?: AgendaEvent | null; onClose: () => void; onSave: (e: AgendaEvent) => void }> = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<AgendaEvent>>(event || {
    title: '',
    date: '2024-10-14',
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting',
    color: 'bg-blue-500',
    attendees: [],
    description: '',
    location: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  const addAttendee = (a: Attendee) => {
    if (!formData.attendees?.find(existing => existing.id === a.id)) {
      setFormData({ ...formData, attendees: [...(formData.attendees || []), a] });
    }
    setSearchQuery('');
  };

  const removeAttendee = (id: string) => {
    setFormData({ ...formData, attendees: formData.attendees?.filter(a => a.id !== id) });
  };

  const filteredParticipants = MOCK_ATTENDEES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[80vh] max-h-[800px]">
      <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
        <h2 className="text-2xl font-extrabold">{event ? 'Edit Event' : 'New Event'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <span className="material-icons-round">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
        {/* Title & Basic Info */}
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Event Title" 
            className="w-full text-3xl font-extrabold bg-transparent border-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-700"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl">
              <span className="material-icons-round text-primary text-sm">calendar_today</span>
              <input type="date" className="bg-transparent border-none text-sm font-bold focus:ring-0" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl">
              <span className="material-icons-round text-primary text-sm">schedule</span>
              <input type="time" className="bg-transparent border-none text-sm font-bold focus:ring-0" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
              <span className="text-slate-400 font-bold">→</span>
              <input type="time" className="bg-transparent border-none text-sm font-bold focus:ring-0" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Location & Link */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-primary/30 transition-all">
              <span className="material-icons-round text-slate-400 text-lg">place</span>
              <input type="text" placeholder="Add location" className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Video Link</label>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-primary/30 transition-all">
              <span className="material-icons-round text-slate-400 text-lg">videocam</span>
              <input type="text" placeholder="Add meeting link" className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
          <textarea 
            placeholder="What's this event about?" 
            rows={3} 
            className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl border-none p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 resize-none"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Participants */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Participants</label>
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent focus-within:border-primary/30 transition-all">
              <span className="material-icons-round text-slate-400 text-lg">group_add</span>
              <input 
                type="text" 
                placeholder="Search by name or email" 
                className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#243142] rounded-2xl shadow-xl border border-slate-200 dark:border-white/5 z-10 overflow-hidden">
                {filteredParticipants.map(p => (
                  <button key={p.id} onClick={() => addAttendee(p)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left">
                    <img src={p.avatar} className="w-8 h-8 rounded-full" alt={p.name} />
                    <div>
                      <div className="text-sm font-bold">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.attendees?.map(a => (
              <div key={a.id} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 group">
                <img src={a.avatar} className="w-5 h-5 rounded-full" alt="" />
                <span className="text-xs font-bold">{a.name}</span>
                <button onClick={() => removeAttendee(a.id)} className="hover:text-red-500 transition-colors">
                  <span className="material-icons-round text-sm">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Event Color</label>
          <div className="flex gap-4">
            {['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'].map(color => (
              <button 
                key={color} 
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-full transition-transform ${color} ${formData.color === color ? 'ring-4 ring-primary/20 scale-125' : 'hover:scale-110'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex gap-4">
        <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl transition-all">Cancel</button>
        <button 
          onClick={() => onSave(formData as AgendaEvent)}
          className="flex-[2] py-4 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          {event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </div>
  );
};

// --- View Renderers ---

const DayView: React.FC<{ date: string; events: AgendaEvent[]; onEventClick: (e: AgendaEvent) => void }> = ({ events, onEventClick }) => {
  const hours = getHours();
  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 border-r border-slate-200 dark:border-primary/10 bg-slate-50/50 dark:bg-transparent overflow-y-auto hidden sm:block pt-10">
        {hours.map(h => (
          <div key={h} className="h-24 text-right pr-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">
            {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto relative custom-scrollbar p-0 sm:p-0">
        <div className="absolute inset-0 pointer-events-none">
          {hours.map(h => (
            <div key={h} className="h-24 border-b border-slate-100 dark:border-primary/10/30" />
          ))}
        </div>
        <div className="relative min-h-[2304px]">
          {events.map(e => {
            const startH = parseInt(e.startTime.split(':')[0]);
            const startM = parseInt(e.startTime.split(':')[1]);
            const top = (startH * 96) + (startM / 60 * 96);
            const durationArr = e.duration.split(' ');
            const durationVal = parseFloat(durationArr[0]);
            const durationType = durationArr[1];
            const height = (durationType.includes('Hour') ? durationVal : durationVal / 60) * 96;
            
            return (
              <div 
                key={e.id}
                onClick={() => onEventClick(e)}
                className={`absolute left-4 right-8 rounded-[1.5rem] p-6 cursor-pointer shadow-xl hover:scale-[1.02] transition-all border-l-[6px] border-white/30 text-white ${e.color}`}
                style={{ top: `${top}px`, height: `${height}px`, zIndex: 10 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="text-lg font-extrabold leading-tight">{e.title}</h5>
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">{e.startTime} - {e.endTime}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold opacity-80">
                  {e.location && <span className="flex items-center gap-1"><span className="material-icons-round text-sm">place</span>{e.location}</span>}
                  <div className="flex -space-x-2">
                    {e.attendees.slice(0, 3).map(a => (
                      <img key={a.id} src={a.avatar} className="w-6 h-6 rounded-full border-2 border-white/20" alt="" />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const WeekView: React.FC<{ events: AgendaEvent[]; onEventClick: (e: AgendaEvent) => void }> = ({ events, onEventClick }) => {
  const weekDays = getWeekDays();
  const hours = getHours();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-primary/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex border-b border-slate-200 dark:border-primary/10 bg-slate-50/50 dark:bg-white/5">
        <div className="w-16 border-r border-slate-200 dark:border-primary/10" />
        {weekDays.map((day, i) => (
          <div key={day} className="flex-1 py-4 text-center border-r last:border-r-0 border-slate-200 dark:border-primary/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{day}</span>
            <span className={`text-xl font-extrabold ${i + 13 === 14 ? 'text-primary' : ''}`}>{13 + i}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="flex min-h-[1920px]">
          <div className="w-16 flex-shrink-0 border-r border-slate-200 dark:border-primary/10">
            {hours.map(h => (
              <div key={h} className="h-20 text-right pr-3 pt-2 text-[10px] font-bold text-slate-400 uppercase">
                {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
              </div>
            ))}
          </div>
          {weekDays.map((_, dayIdx) => {
            const currentFormattedDate = `2024-10-${13 + dayIdx}`;
            const dayEvents = events.filter(e => e.date === currentFormattedDate);
            return (
              <div key={dayIdx} className="flex-1 relative border-r last:border-r-0 border-slate-100 dark:border-primary/10/30">
                {dayEvents.map(e => {
                  const startH = parseInt(e.startTime.split(':')[0]);
                  const startM = parseInt(e.startTime.split(':')[1]);
                  const top = (startH * 80) + (startM / 60 * 80);
                  const durationArr = e.duration.split(' ');
                  const durationVal = parseFloat(durationArr[0]);
                  const durationType = durationArr[1];
                  const height = (durationType.includes('Hour') ? durationVal : durationVal / 60) * 80;

                  return (
                    <div 
                      key={e.id}
                      onClick={() => onEventClick(e)}
                      className={`absolute inset-x-1 rounded-xl p-2 cursor-pointer shadow-lg hover:brightness-110 transition-all text-white overflow-hidden border-l-2 border-white/30 ${e.color}`}
                      style={{ top: `${top}px`, height: `${height}px`, zIndex: 10 }}
                    >
                      <h6 className="text-[10px] font-extrabold leading-tight truncate">{e.title}</h6>
                      <p className="text-[8px] opacity-80 font-bold">{e.startTime}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MonthView: React.FC<{ events: AgendaEvent[]; onEventClick: (e: AgendaEvent) => void }> = ({ events, onEventClick }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = getWeekDays();
  const startPadding = Array.from({ length: 2 }); // October 2024 starts on Tuesday

  return (
    <div className="grid grid-cols-7 h-full bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-primary/10 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      {weekDays.map(day => (
        <div key={day} className="py-4 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-r last:border-r-0 border-slate-200 dark:border-primary/10 bg-slate-50/50 dark:bg-white/5">
          {day}
        </div>
      ))}
      {startPadding.map((_, i) => (
        <div key={`pad-${i}`} className="border-b border-r border-slate-100 dark:border-primary/10/30 bg-slate-50/30 dark:bg-transparent" />
      ))}
      {days.map(day => {
        const dateStr = `2024-10-${day < 10 ? '0' + day : day}`;
        const dayEvents = events.filter(e => e.date === dateStr);
        const isToday = day === 14;

        return (
          <div key={day} className={`min-h-[140px] p-3 border-b border-r last:border-r-0 border-slate-100 dark:border-primary/10/30 group transition-all hover:bg-primary/5 cursor-pointer ${isToday ? 'bg-primary/5' : ''}`}>
            <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
              {day}
            </span>
            <div className="mt-2 space-y-1">
              {dayEvents.slice(0, 3).map(e => (
                <div 
                  key={e.id} 
                  onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                  className={`text-[9px] font-bold py-1 px-2 rounded-lg text-white truncate border-l-2 border-white/20 ${e.color}`}
                >
                  {e.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-[9px] font-bold text-slate-400 px-2">+ {dayEvents.length - 3} more</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Sidebar & Layout Components ---

const Sidebar: React.FC<{ 
  activeView: MainView; 
  setActiveView: (v: MainView) => void;
  isDark: boolean;
  toggleTheme: () => void;
}> = ({ activeView, setActiveView, isDark, toggleTheme }) => (
  <aside className="w-20 border-r border-slate-200 dark:border-primary/10 flex flex-col items-center py-8 gap-10 bg-white dark:bg-[#101922] transition-colors duration-300 z-30">
    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 cursor-pointer active:scale-90 transition-transform" onClick={() => setActiveView('agenda')}>
      <span className="material-icons-round text-2xl">auto_awesome_motion</span>
    </div>
    <nav className="flex flex-col gap-6">
      {[
        { id: 'agenda', icon: 'view_agenda', label: 'Planner' },
        { id: 'dashboard', icon: 'grid_view', label: 'Stats' },
        { id: 'team', icon: 'groups', label: 'Team' },
        { id: 'analytics', icon: 'query_stats', label: 'Insights' }
      ].map(item => (
        <button 
          key={item.id}
          onClick={() => setActiveView(item.id as MainView)}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all group relative ${
            activeView === item.id ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-primary/5'
          }`}
        >
          <span className="material-icons-round">{item.icon}</span>
          <span className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
    <div className="mt-auto flex flex-col gap-6">
      <button onClick={toggleTheme} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary rounded-2xl transition-all">
        <span className="material-icons-round">{isDark ? 'light_mode' : 'dark_mode'}</span>
      </button>
      <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden hover:scale-110 transition-transform cursor-pointer">
        <img src="https://i.pravatar.cc/100?u=me" className="w-full h-full object-cover" alt="Avatar" />
      </div>
    </div>
  </aside>
);

const RightSidebar: React.FC = () => (
  <aside className="w-80 border-l border-slate-200 dark:border-primary/10 p-8 hidden xl:flex flex-col gap-10 bg-white dark:bg-[#101922] transition-colors duration-300">
    <div>
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Mini Calendar</h4>
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[9px] font-extrabold text-slate-300">{d}</span>)}
        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
          <span key={d} className={`text-xs font-bold py-2 rounded-xl transition-all cursor-pointer ${d === 14 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}>
            {d}
          </span>
        ))}
      </div>
    </div>
    
    <div>
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Pending Tasks</h4>
      <div className="space-y-4">
        {MOCK_TASKS.map(t => (
          <div key={t.id} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all">
            <div className={`w-3 h-3 rounded-full ${t.priorityColor} group-hover:scale-125 transition-transform`} />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t.title}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-auto p-8 bg-primary rounded-[2rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
      <h5 className="text-lg font-extrabold mb-1">Weekly Digest</h5>
      <p className="text-xs font-bold opacity-80 mb-6">You have 14 meetings and 4 high focus blocks this week.</p>
      <button className="w-full py-3 bg-white text-primary rounded-2xl font-extrabold text-xs shadow-lg active:scale-95 transition-all">OPEN REPORT</button>
    </div>
  </aside>
);

// --- Main App ---

export default function App() {
  const [activeMainView, setActiveMainView] = useState<MainView>('agenda');
  const [calendarSubView, setCalendarSubView] = useState<CalendarSubView>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [agenda, setAgenda] = useState<AgendaEvent[]>(MOCK_AGENDA);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return agenda;
    const lowerQuery = searchQuery.toLowerCase();
    return agenda.filter(e => 
      e.title.toLowerCase().includes(lowerQuery) || 
      e.description?.toLowerCase().includes(lowerQuery) ||
      e.location?.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, agenda]);

  const handleSaveEvent = (eventData: AgendaEvent) => {
    if (selectedEvent) {
      setAgenda(prev => prev.map(e => e.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : e));
    } else {
      setAgenda(prev => [...prev, { ...eventData, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setIsEditorOpen(false);
    setSelectedEvent(null);
  };

  const openNewEvent = () => {
    setSelectedEvent(null);
    setIsEditorOpen(true);
  };

  const openEditEvent = (e: AgendaEvent) => {
    setSelectedEvent(e);
    setIsEditorOpen(true);
  };

  const renderActiveView = () => {
    if (activeMainView !== 'agenda') {
      return (
        <div className="p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="material-icons-round text-8xl text-slate-200 dark:text-slate-800 mb-6">construction</span>
          <h2 className="text-3xl font-extrabold text-slate-400 uppercase tracking-[0.2em]">{activeMainView} view in development</h2>
        </div>
      );
    }

    switch (calendarSubView) {
      case 'day': return <DayView date="2024-10-14" events={filteredEvents.filter(e => e.date === '2024-10-14')} onEventClick={openEditEvent} />;
      case 'week': return <WeekView events={filteredEvents} onEventClick={openEditEvent} />;
      case 'month': return <MonthView events={filteredEvents} onEventClick={openEditEvent} />;
      case 'list': 
      default:
        return (
          <div className="p-12 space-y-12 max-w-5xl mx-auto">
            {['2024-10-14', '2024-10-15', '2024-10-16'].map(date => {
              const dayEvents = filteredEvents.filter(e => e.date === date);
              return (
                <div key={date} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <h3 className="text-4xl font-black mb-8 border-b border-slate-100 dark:border-white/5 pb-4">{date === '2024-10-14' ? 'Today' : date}</h3>
                  <div className="space-y-4">
                    {dayEvents.map(e => (
                      <div key={e.id} onClick={() => openEditEvent(e)} className="group flex items-center gap-8 p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-primary/10 rounded-[2rem] hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer">
                        <div className="w-24 text-center">
                          <span className="text-sm font-extrabold text-slate-400 block">{e.startTime}</span>
                          <span className="text-[10px] font-bold text-primary opacity-60 uppercase">{e.duration}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-extrabold mb-1 group-hover:text-primary transition-colors">{e.title}</h4>
                          <div className="flex gap-4 text-xs font-bold text-slate-400">
                            {e.location && <span className="flex items-center gap-1"><span className="material-icons-round text-sm">place</span>{e.location}</span>}
                            <span className="flex items-center gap-1"><span className="material-icons-round text-sm">groups</span>{e.attendees.length} Attendees</span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${e.color} flex items-center justify-center text-white shadow-lg`}>
                          <span className="material-icons-round">{e.type === 'workshop' ? 'construction' : 'groups'}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length === 0 && <p className="text-slate-400 font-bold italic p-8 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">Quiet day. No events scheduled.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''} transition-colors duration-300 font-display`}>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-white transition-colors duration-300">
        <Sidebar activeView={activeMainView} setActiveView={setActiveMainView} isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className="h-24 border-b border-slate-200 dark:border-primary/10 px-12 flex items-center justify-between bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-10">
              <h1 className="text-3xl font-black tracking-tighter capitalize">{activeMainView === 'agenda' ? 'October 2024' : activeMainView}</h1>
              {activeMainView === 'agenda' && (
                <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1.5 shadow-inner">
                  {['list', 'day', 'week', 'month'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setCalendarSubView(v as CalendarSubView)}
                      className={`px-5 py-2 text-xs font-black rounded-xl transition-all capitalize ${calendarSubView === v ? 'bg-white dark:bg-slate-800 shadow-xl text-primary scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative group">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">search</span>
                <input 
                  type="text" 
                  placeholder="Find events..."
                  className="bg-slate-100 dark:bg-white/5 border-none rounded-[1.25rem] pl-12 pr-6 py-3 text-sm font-bold w-64 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={openNewEvent}
                className="bg-primary text-white h-12 px-6 rounded-[1.25rem] font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="material-icons-round text-lg">add</span>
                NEW EVENT
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-12 pt-8">
            {renderActiveView()}
          </div>
        </main>

        <RightSidebar />

        <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)}>
          <EventEditor 
            event={selectedEvent} 
            onClose={() => setIsEditorOpen(false)} 
            onSave={handleSaveEvent} 
          />
        </Modal>
      </div>
    </div>
  );
}
