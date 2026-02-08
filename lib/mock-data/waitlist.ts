import { WaitlistEntry } from '../types/database';

/**
 * Mock waitlist entries
 * Requirements: 9.1, 9.2
 */
export const mockWaitlistEntries: WaitlistEntry[] = [
  {
    id: 'waitlist-1',
    session_id: '2',
    child_id: 'child-1',
    parent_id: 'user-1',
    status: 'waiting',
    offered_at: null,
    expires_at: null,
    created_at: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'waitlist-2',
    session_id: '2',
    child_id: 'child-3',
    parent_id: 'user-2',
    status: 'waiting',
    offered_at: null,
    expires_at: null,
    created_at: new Date('2024-02-12').toISOString(),
  },
  {
    id: 'waitlist-3',
    session_id: '5',
    child_id: 'child-2',
    parent_id: 'user-1',
    status: 'claimed',
    offered_at: new Date('2024-02-13').toISOString(),
    expires_at: null,
    created_at: new Date('2024-02-08').toISOString(),
  },
];
