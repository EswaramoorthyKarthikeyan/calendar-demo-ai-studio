
export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'accepted' | 'declined' | 'pending' | 'tentative';
}

export interface AgendaEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: string;
  location?: string;
  link?: string;
  attendees: Attendee[];
  priority?: 'low' | 'medium' | 'high';
  type: 'meeting' | 'workshop' | 'personal' | 'lunch';
  color: string; // tailwind color class
}

export interface DayGroup {
  date: number;
  dayName: string;
  monthYear: string;
  events: AgendaEvent[];
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  priorityColor: string;
}
