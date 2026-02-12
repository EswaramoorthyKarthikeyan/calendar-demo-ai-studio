
import { AgendaEvent, Task, Attendee } from './types';

export const MOCK_ATTENDEES: Attendee[] = [
  { id: 'u1', name: 'Sarah Jenkins', email: 'sarah@chronos.ai', avatar: 'https://i.pravatar.cc/150?u=sarah', status: 'accepted' },
  { id: 'u2', name: 'Marcus Chen', email: 'marcus@chronos.ai', avatar: 'https://i.pravatar.cc/150?u=marcus', status: 'accepted' },
  { id: 'u3', name: 'Elena Rodriguez', email: 'elena@chronos.ai', avatar: 'https://i.pravatar.cc/150?u=elena', status: 'pending' },
  { id: 'u4', name: 'David Kim', email: 'david@chronos.ai', avatar: 'https://i.pravatar.cc/150?u=david', status: 'declined' },
];

export const MOCK_AGENDA: AgendaEvent[] = [
  {
    id: '1',
    title: 'Product Strategy Sync',
    description: 'Alignment on the product roadmap and Q4 objectives.',
    date: '2024-10-14',
    startTime: '09:00',
    endTime: '10:30',
    duration: '1.5 Hours',
    location: 'Meeting Room Alpha',
    attendees: [MOCK_ATTENDEES[0], MOCK_ATTENDEES[1]],
    type: 'meeting',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Design Review: V2 Prototype',
    description: 'Feedback session for the latest mobile dashboard mockups.',
    date: '2024-10-14',
    startTime: '11:30',
    endTime: '12:30',
    duration: '1 Hour',
    link: 'meet.google.com/ux-review',
    attendees: [MOCK_ATTENDEES[2]],
    type: 'meeting',
    color: 'bg-purple-500'
  },
  {
    id: '3',
    title: 'Client Kickoff',
    description: 'Initial meeting with enterprise partners.',
    date: '2024-10-15',
    startTime: '10:00',
    endTime: '11:00',
    duration: '1 Hour',
    location: 'Main Ballroom',
    attendees: MOCK_ATTENDEES,
    type: 'meeting',
    color: 'bg-emerald-500',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Team Workshop',
    description: 'Quarterly team building and strategy session.',
    date: '2024-10-16',
    startTime: '14:00',
    endTime: '16:00',
    duration: '2 Hours',
    location: 'Offsite Hub',
    attendees: MOCK_ATTENDEES.slice(0, 3),
    type: 'workshop',
    color: 'bg-amber-500'
  }
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Finalize Q4 Deck', status: 'pending', priorityColor: 'bg-blue-500' },
  { id: 't2', title: 'Send invoices', status: 'pending', priorityColor: 'bg-slate-700' },
  { id: 't3', title: 'Review hire candidates', status: 'pending', priorityColor: 'bg-amber-400' }
];
